
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { SceneBuilder } from '../utils/SceneBuilder';
import { ParticleSystem } from '../utils/ParticleSystem';
import { SoundManager } from '../utils/gameUtils';
import { useAssetLoader } from './useAssetLoader';
import { useThreeSetup } from './useThreeSetup';
// New Hooks
import { useGameLoop } from './pixelRunner/useGameLoop';
import { useCollision } from './pixelRunner/useCollision';

import { 
    EngineState, GameState, Obstacle, ObstacleData, MIRROR_CONFIG, GameConfig, PlayerState 
} from '../gameTypes';
import { 
    LANE_DISTANCE, BOSS_MAX_HP, BOSS_FIGHT_DISTANCE, 
    BOSS_SPAWN_TIME, CHUNK_SIZE, DRAW_DISTANCE, 
    GAME_CONFIG_KEY, DEFAULT_GAME_CONFIG, CHEER_TEXTS, WALL_MAX_HP
} from '../gameConstants';
import { ASSETS } from '../config/gameAssets';
import { CurrentTheme } from '../theme/gameTheme';
import { processAIAndGetGuide } from '../utils/aiLogic';
import { spawnObstacle, spawnBoss, TUTORIAL_SEQUENCE } from '../utils/spawnLogic';

export const usePixelRunnerEngine = (
    containerRef: React.RefObject<HTMLDivElement>,
    fullscreenRef?: React.RefObject<HTMLDivElement>
) => {
    // --- ASSET LOADER INTEGRATION ---
    const { 
        guideImages, setGuideImages,
        guideVideos, setGuideVideos,
        guideAudio, setGuideAudio,
        guideImagesRef, guideVideosRef,
        texturesRef, modelsRef, 
        adTexturesRef, wallTexturesRef, passThroughWallTexturesRef
    } = useAssetLoader();

    // --- THREE.JS SETUP INTEGRATION ---
    const {
        sceneRef, cameraRef, rendererRef,
        playerMeshRef, skiMeshesRef, transitionMeshRef,
        bgCycleIndicesRef, currentVideoElementRef,
        setSceneBackground
    } = useThreeSetup(containerRef, guideImagesRef, guideVideosRef);

    // UI State
    const [gameState, setGameState] = useState<GameState>({
        isRunning: false,
        score: 0,
        distance: 0,
        phaseText: '',
        currentPhase: 0, 
        bossHP: BOSS_MAX_HP,
        maxBossHP: BOSS_MAX_HP,
        bossMode: false,
        gameStatus: 'MENU',
        uiVisible: true,
        guideActionText: '',
        guideActionId: 0,
        guideActionType: '',
        bossGaugeValue: 0,
        isWallFightActive: false,
        wallMonsterHP: WALL_MAX_HP,
        isTutorial: true,
        showTutorialGuide: false, 
        tutorialProgress: '',
        stageLabel: 'TRAINING',
        stageColor: CurrentTheme.ui.stageColors.tutorial, 
        isMirrorModeActive: false,
        mirrorOverlayState: 'hidden',
        mirrorOverlayText: '',
        mirrorOverlayImage: undefined,
        cheerOverlay: { visible: false, text: '' }
    });

    const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);

    const engineRef = useRef<EngineState>({
        scene: null, camera: null, renderer: null,
        player: {
            mesh: null, lane: 0, xPos: -2.0, velocity: new THREE.Vector3(),
            isJumping: false, isCrouching: false, isPunching: false, isDoublePunching: false,
            isBlocked: false, canPunch: true, height: 1.8, speed: 0, hp: 1,
        },
        obstacles: [], particles: [], chunks: [], 
        textures: {}, models: {}, 
        adTextures: [], wallTextures: [], passThroughWallTextures: [],
        skiMeshes: [],
        world: { curveCurrent: 0, curveTarget: 0, hillCurrent: 0, hillTarget: 0, hillFreq: 0.05 },
        transitionMesh: null,
        currentVideoElement: null,
        startTime: 0, elapsedTime: 0, lastTime: 0, totalPausedTime: 0,
        nextSpawnZ: -140, 
        isAI: false, aiNextMoveTime: 0, 
        bossSpawned: false, 
        bossMode: false,
        isBossFightActive: false, isWallFightActive: false,
        distanceBonus: 0, scoreOffset: 0, shakeIntensity: 0, bossStartDist: 0,
        isCinematicSequence: false, hasTriggeredVictory: false, 
        mirrorSpawnCount: 0, actionWallsSpawned: 0,
        globalWallIndex: 0, 
        hasForcedMirror: false,
        isBossDeadTransition: false, bossDeathTime: 0, bossCheerTriggered: false,
        guideExpiry: 0, lastGuideText: '', lastGuideId: 0, lastGuideActionType: '',
        animationFrameId: 0, isGameRunning: false,
        isTutorial: true,
        tutorialStepIndex: 0,
        tutorialActionCount: 0,
        totalRunningDistance: 0, 
        tutorialEndTime: 0,
        isMirrorBlocked: false,
        isCheering: false,
        hasCheeredPhase1: false,
        hasTriggeredTutorialFade: false,
        hasTriggeredBossFade: false,
        isPhaseFadingIn: false,
        phaseFadeStartTime: 0,
        bgCycleIndices: { 'bg_tutorial': 0, 'bg_day': 0, 'bg_evening': 0, 'bg_night': 0, 'bg_dawn': 0 },
        gameConfig: DEFAULT_GAME_CONFIG,
        
        currentPhase: 0,
        phaseStartTime: 0,
        
        bossHP: BOSS_MAX_HP, 
        maxBossHP: BOSS_MAX_HP,

        preloadedBackground: null,
        preloadedVideo: null,

        cheerTimeoutId: undefined,
        cheerOnComplete: undefined,
        pendingTutorialTrigger: undefined,
        isSlowMotion: false
    });

    const lastStateUpdate = useRef(0);

    // Sync Three.js Refs to Engine State
    useEffect(() => {
        const engine = engineRef.current;
        engine.scene = sceneRef.current;
        engine.camera = cameraRef.current;
        engine.renderer = rendererRef.current;
        engine.player.mesh = playerMeshRef.current;
        engine.skiMeshes = skiMeshesRef.current;
        engine.transitionMesh = transitionMeshRef.current;
        // Textures & Models
        engine.textures = texturesRef.current;
        engine.models = modelsRef.current; 
        engine.adTextures = adTexturesRef.current;
        engine.wallTextures = wallTexturesRef.current;
        engine.passThroughWallTextures = passThroughWallTexturesRef.current; 
        
        if (currentVideoElementRef.current) engine.currentVideoElement = currentVideoElementRef.current;
        
    }, [sceneRef, cameraRef, rendererRef, playerMeshRef, skiMeshesRef, transitionMeshRef, texturesRef, modelsRef, adTexturesRef, wallTexturesRef, passThroughWallTexturesRef, currentVideoElementRef]);

    const updateReactState = useCallback((updates: Partial<GameState>) => {
        const now = performance.now();
        if (updates.isRunning !== undefined || 
            updates.gameStatus !== undefined || 
            updates.phaseText !== undefined || 
            updates.bossHP !== undefined ||
            updates.isWallFightActive !== undefined ||
            updates.wallMonsterHP !== undefined || 
            updates.isTutorial !== undefined ||
            updates.showTutorialGuide !== undefined ||
            updates.stageLabel !== undefined ||
            updates.isMirrorModeActive !== undefined || 
            updates.mirrorOverlayState !== undefined ||
            updates.mirrorOverlayText !== undefined ||
            updates.cheerOverlay !== undefined ||
            updates.guideActionText !== undefined ||
            updates.bossMode !== undefined || // Ensure bossMode updates pass through
            now - lastStateUpdate.current > 50) { 
            setGameState(prev => ({ ...prev, ...updates }));
            lastStateUpdate.current = now;
        }
    }, []);

    // Load Game Config
    useEffect(() => {
        try {
            const storedConfig = localStorage.getItem(GAME_CONFIG_KEY);
            if (storedConfig) {
                setGameConfig(prev => ({ ...prev, ...JSON.parse(storedConfig) }));
            }
        } catch(e) { console.error(e); }
    }, []);

    useEffect(() => {
        engineRef.current.gameConfig = gameConfig;
        localStorage.setItem(GAME_CONFIG_KEY, JSON.stringify(gameConfig));
    }, [gameConfig]);

    useEffect(() => {
        return () => {
            SoundManager.stopBGM();
        };
    }, []);

    const rebuildChunks = useCallback((startZ: number, endZ: number, phaseIndex: number) => {
        const engine = engineRef.current;
        engine.chunks.forEach(c => engine.scene?.remove(c.mesh)); 
        engine.chunks = [];
        
        for(let z = startZ; z >= endZ; z -= CHUNK_SIZE) {
            const chunkMesh = SceneBuilder.createChunk(z, engine.textures, engine.adTextures, engine.wallTextures, phaseIndex);
            engine.scene?.add(chunkMesh); 
            engine.chunks.push({ mesh: chunkMesh, zPos: z });
        }
    }, []);

    const changeLane = useCallback((dir: number) => {
        const { player } = engineRef.current;
        const engine = engineRef.current;
        if (engine.isCinematicSequence || engine.isMirrorBlocked || engine.isCheering) return;
        
        if (engine.actionWallsSpawned > 0 && !engine.bossSpawned) return;

        const target = player.lane + dir;
        if (target >= 0 && target <= 1) {
            player.lane = target;
            if (dir === -1) SoundManager.playLeft(); else SoundManager.playRight();
        }
    }, []);

    const triggerPunch = useCallback(() => {
        const { player } = engineRef.current;
        if (engineRef.current.isCinematicSequence || engineRef.current.isMirrorBlocked || engineRef.current.isCheering) return;
        if (player.isPunching || player.isDoublePunching || !player.canPunch) return;
        SoundManager.playPunch();
        player.isPunching = true;
        player.canPunch = false;
        setTimeout(() => { player.canPunch = true; player.isPunching = false; }, 200);
    }, []);

    const getCheerTexts = useCallback((category: keyof typeof CHEER_TEXTS): string[] => {
        const engine = engineRef.current;
        const custom = engine.gameConfig.cheerTexts?.[category];
        if (custom && custom.length > 0) {
            return custom[Math.floor(Math.random() * custom.length)];
        }
        const defaultTexts = CHEER_TEXTS[category];
        return defaultTexts[Math.floor(Math.random() * defaultTexts.length)];
    }, []);

    const triggerCheerSequence = useCallback((messages: string[], sequenceType: string, onComplete?: () => void) => {
        const engine = engineRef.current;
        if(engine.isCheering) return;

        engine.isCheering = true;
        engine.cheerOnComplete = onComplete;
        
        const pauseStartTime = performance.now();

        const playNext = (index: number) => {
            if (index >= messages.length) {
                engine.isCheering = false;
                engine.cheerOnComplete = undefined;
                
                const totalDuration = performance.now() - pauseStartTime;
                engine.totalPausedTime += totalDuration / 1000;
                updateReactState({ cheerOverlay: { visible: false, text: '' } });
                
                if(SoundManager.bgm) SoundManager.bgm.volume = 0.4;
                
                if (onComplete) onComplete();
                return;
            }
            const text = messages[index];
            
            let videoSrc: string | undefined = undefined;
            if (sequenceType === 'INTRO' && index >= 1) videoSrc = ASSETS.CHEER.INTRO;
            else if (sequenceType === 'TUTORIAL_END' && index < 2) videoSrc = ASSETS.CHEER.TUTORIAL_END;
            else if (sequenceType === 'PHASE_1_CLEAR' && index < 2) videoSrc = ASSETS.CHEER.RHYTHM_END_1;
            else if (sequenceType === 'PHASE_2_CLEAR' && index < 2) videoSrc = ASSETS.CHEER.RHYTHM_END_2;
            else if (sequenceType === 'PHASE_3_CLEAR' && index < 2) videoSrc = ASSETS.CHEER.RHYTHM_END_3;
            else if (sequenceType === 'VICTORY' && index >= 1) videoSrc = ASSETS.CHEER.RHYTHM_END_4; 
            else if (sequenceType === 'WALL_GUIDE') videoSrc = ASSETS.COMMON.WALL_GUIDE;

            // --- AUDIO TRIGGER LOGIC ---
            if (sequenceType === 'TUTORIAL_END' && index === 0) {
                SoundManager.playCustom('warning0'); 
            }
            else if (sequenceType === 'PHASE_1_CLEAR' && index === 0) SoundManager.playCustom('warning1');
            else if (sequenceType === 'PHASE_2_CLEAR' && index === 0) SoundManager.playCustom('warning2');
            else if (sequenceType === 'PHASE_3_CLEAR' && index === 0) SoundManager.playCustom('warning3');
            else if (sequenceType === 'VICTORY' && index === 0) SoundManager.playCustom('victory'); 
            else if (sequenceType !== 'WALL_GUIDE') SoundManager.playPowerUp();

            if (sequenceType !== 'INTRO' && sequenceType !== 'WALL_GUIDE') {
                SoundManager.fadeOutBGM(0.5);
            }

            let duration = (2000 + (text.length * 100)) * 0.75;
            if (sequenceType === 'WALL_GUIDE') {
                duration = 5000; 
            }

            updateReactState({ cheerOverlay: { visible: true, text: text, videoSrc } });
            
            engine.cheerTimeoutId = setTimeout(() => { playNext(index + 1); }, duration);
        };
        playNext(0);
    }, [updateReactState]);

    const triggerCountdown = useCallback(() => {
        const engine = engineRef.current;
        engine.isCheering = true;
        let count = 4; 
        
        const tick = () => {
            if (count > 0) {
                 let videoSrc: string | undefined;
                 if (count === 4) videoSrc = ASSETS.MINIGAME.MINI_1;
                 else if (count === 3) videoSrc = ASSETS.MINIGAME.MINI_2;
                 else if (count === 2) videoSrc = ASSETS.MINIGAME.MINI_3;
                 else if (count === 1) videoSrc = ASSETS.MINIGAME.MINI_4;

                 updateReactState({ cheerOverlay: { visible: true, text: count.toString(), videoSrc } });
                 SoundManager.playCountdown();
                 setTimeout(() => {
                     count--;
                     tick();
                 }, 800); 
            } else {
                 updateReactState({ cheerOverlay: { visible: true, text: "GO!", videoSrc: undefined } });
                 SoundManager.playActionSignal();
                 setTimeout(() => {
                     updateReactState({ cheerOverlay: { visible: false, text: '' } });
                     engine.isCheering = false;
                 }, 800);
            }
        };
        tick();
    }, [updateReactState]);

    const resetToWarmUp = useCallback(() => {
         const engine = engineRef.current;
        if (!engine.player.mesh) return;
        
        engine.startTime = performance.now(); engine.elapsedTime = 0; engine.totalPausedTime = 0;
        engine.player.lane = 0; engine.player.xPos = -2.0;
        engine.player.mesh.position.set(-2.0, 0.9, 0);
        engine.player.mesh.userData.origX = -2.0; engine.player.mesh.userData.origY = 0.9;
        
        engine.nextSpawnZ = -140; 
        
        engine.bossSpawned = false; engine.bossMode = false;
        engine.isBossFightActive = false; engine.isWallFightActive = false;
        engine.currentPhase = 0; engine.phaseStartTime = 0;
        
        engine.mirrorSpawnCount = 0; engine.player.isBlocked = false;
        engine.isCinematicSequence = false; engine.hasTriggeredVictory = false; engine.isBossDeadTransition = false;
        engine.isTutorial = false; 
        engine.tutorialEndTime = 0;
        engine.isMirrorBlocked = false;
        engine.isCheering = false;
        engine.hasCheeredPhase1 = false;
        engine.bossCheerTriggered = false;
        engine.hasTriggeredTutorialFade = false;
        engine.hasTriggeredBossFade = false;
        engine.hasForcedMirror = false; 
        
        engine.isPhaseFadingIn = false;
        engine.actionWallsSpawned = 0;
        engine.globalWallIndex = 0; 
        engine.pendingTutorialTrigger = undefined;
        engine.isSlowMotion = false;

        engine.obstacles.forEach(o => engine.scene?.remove(o.mesh)); engine.obstacles = [];
        ParticleSystem.clear(engine); 
        
        rebuildChunks(40, -DRAW_DISTANCE, 0); 
  
        SoundManager.setTheme('normal'); SoundManager.startBGM();
        if (engine.scene) { 
            const bgColor = CurrentTheme.colors.ground.tutorial;
            setSceneBackground('bg_tutorial', bgColor);
        }

        if (engine.transitionMesh) {
            (engine.transitionMesh.material as THREE.MeshBasicMaterial).color.setHex(0x000000);
            (engine.transitionMesh.material as THREE.MeshBasicMaterial).opacity = 1.0;
        }
        
        engine.lastGuideText = ''; engine.lastGuideId = -1; engine.guideExpiry = 0; engine.lastGuideActionType = '';

        updateReactState({ 
            bossMode: false, currentPhase: 0, isWallFightActive: false,
            bossHP: BOSS_MAX_HP, phaseText: "", bossGaugeValue: 0, isTutorial: false, showTutorialGuide: false, 
            stageLabel: 'TRAINING', stageColor: CurrentTheme.ui.stageColors.tutorial,
            guideActionText: '', guideActionType: '', isMirrorModeActive: false, mirrorOverlayState: 'hidden',
            cheerOverlay: { visible: false, text: '' },
            wallMonsterHP: WALL_MAX_HP 
        });
    }, [updateReactState, setSceneBackground, rebuildChunks]);

    const startPhase = useCallback((phaseIndex: number) => {
        const engine = engineRef.current;
        engine.currentPhase = phaseIndex;
        engine.phaseStartTime = engine.elapsedTime;
        engine.bossSpawned = false;
        engine.bossMode = false;
        engine.hasTriggeredBossFade = false;
        engine.actionWallsSpawned = 0; 
        engine.mirrorSpawnCount = 0; 
        
        engine.pendingTutorialTrigger = undefined;
        engine.isSlowMotion = false;
        
        // Random lane placement at start of level
        engine.player.lane = Math.random() < 0.5 ? 0 : 1; 
        
        const currentPZ = engine.player.mesh ? engine.player.mesh.position.z : 0;
        engine.nextSpawnZ = Math.min(engine.nextSpawnZ, currentPZ - 150); // Ensure spacing

        let bgKey = 'bg_day';
        let stageLabel = 'LEVEL 1';
        let stageColor = CurrentTheme.ui.stageColors.day;
        let bgmTheme: 'normal' | 'lava' | 'ice' | 'tutorial' | 'dawn' = 'normal';

        if (phaseIndex === 1) { 
            bgKey = 'bg_day';
            stageLabel = 'LEVEL 1';
            stageColor = CurrentTheme.ui.stageColors.day;
            bgmTheme = 'normal';
        } else if (phaseIndex === 2) { 
            bgKey = 'bg_evening';
            stageLabel = 'LEVEL 2';
            stageColor = CurrentTheme.ui.stageColors.evening;
            bgmTheme = 'lava'; 
        } else if (phaseIndex === 3) { 
            bgKey = 'bg_night';
            stageLabel = 'LEVEL 3';
            stageColor = CurrentTheme.ui.stageColors.night;
            bgmTheme = 'ice'; 
        } else if (phaseIndex === 4) { 
            bgKey = 'bg_dawn';
            stageLabel = 'FINAL LEVEL';
            stageColor = CurrentTheme.ui.stageColors.dawn;
            bgmTheme = 'dawn'; 
        }

        if (engine.transitionMesh) {
            (engine.transitionMesh.material as THREE.MeshBasicMaterial).color.setHex(0x000000);
            (engine.transitionMesh.material as THREE.MeshBasicMaterial).opacity = 1.0;
        }
        
        setSceneBackground(bgKey, 0x000000);
        SoundManager.setTheme(bgmTheme);
        SoundManager.startBGM();

        engine.isPhaseFadingIn = true;
        engine.phaseFadeStartTime = engine.elapsedTime;

        rebuildChunks(currentPZ + 40, currentPZ - DRAW_DISTANCE, phaseIndex);

        updateReactState({ 
            currentPhase: phaseIndex, 
            stageLabel, 
            stageColor, 
            bossMode: false, 
            bossGaugeValue: 0 
        });
    }, [setSceneBackground, updateReactState, rebuildChunks]);

    const executeBossDeath = useCallback(() => {
        const engine = engineRef.current;
        const boss = engine.obstacles.find(o => o.data.action === 'final_boss');
        if (boss) {
            ParticleSystem.createCelebration(engine, boss.mesh.position);
            ParticleSystem.createExplosion(engine, boss.mesh.position, engine.textures.giftBox, 40);
            SoundManager.playGlassBreak();
            SoundManager.playBossExplosion(); 
            engine.scene?.remove(boss.mesh);
            engine.obstacles = engine.obstacles.filter(o => o !== boss);
        }

        engine.isBossDeadTransition = true;
        engine.bossDeathTime = engine.elapsedTime;
        engine.bossCheerTriggered = false;
        engine.isBossFightActive = false;
        engine.player.isBlocked = false;
        engine.player.speed = 0.35; 
        
        engine.guideExpiry = 0;
        engine.lastGuideText = '';
        engine.lastGuideActionType = '';
        updateReactState({ guideActionText: '', guideActionType: '', bossHP: 0 });
    }, [updateReactState]);

    const handleMiniGameVictory = useCallback(() => {
        const engine = engineRef.current;
        setGameState(prev => ({ ...prev, gameStatus: 'PLAYING' }));
        engine.totalPausedTime += (performance.now() - engine.lastTime) / 1000;
        
        SoundManager.setBGMVolume(0.4); 
        
        const boss = engine.obstacles.find(o => o.data.action === 'final_boss');
        if (boss) {
            const halfHP = Math.ceil((engine.maxBossHP || 30) * 0.5);
            boss.data.hp = halfHP;
            boss.data.miniGameCompleted = true; 
            engine.bossHP = halfHP;
            updateReactState({ bossHP: halfHP });
            
            engine.isBossFightActive = true; 
        } else {
            executeBossDeath();
        }
    }, [updateReactState, executeBossDeath]);

    const triggerDoublePunch = useCallback(() => {
        const { player } = engineRef.current;
        const engine = engineRef.current;
        if (engine.isCinematicSequence || engine.isMirrorBlocked || engine.isCheering) return;
        if (player.isPunching || player.isDoublePunching || !player.canPunch) return;
  
        player.isDoublePunching = true;
        player.canPunch = false;
        
        if ((engine.isBossFightActive && engine.bossMode) || engine.isWallFightActive) {
            const target = engine.obstacles.find(o => o.data.action === 'final_boss' || o.data.action === 'wall_blockade');
            if (target && target.data.hp !== undefined) {
                target.data.hp--;
                SoundManager.playPunch();
                
                if (target.data.action === 'final_boss') {
                     const max = engine.maxBossHP || 100;
                     if (target.data.hp / max <= 0.5 && gameState.gameStatus !== 'MINI_GAME' && !target.data.miniGameCompleted) {
                         SoundManager.playCustom('final_blow');
                         updateReactState({
                             guideActionText: "",
                             guideActionType: "",
                             guideActionId: Date.now() 
                         });
                         setGameState(prev => ({ ...prev, gameStatus: 'MINI_GAME' }));
                         SoundManager.setBGMVolume(0.2);
                     }
                     updateReactState({ bossHP: target.data.hp });
                } else {
                     updateReactState({ wallMonsterHP: target.data.hp });
                }
                engine.shakeIntensity = 0.5;
  
                if (target.data.hp <= 0) {
                    if (target.data.action === 'final_boss') {
                        executeBossDeath();
                    } else {
                        ParticleSystem.createCelebration(engine, target.mesh.position);
                        engine.scene?.remove(target.mesh);
                        engine.obstacles = engine.obstacles.filter(o => o !== target);
                        SoundManager.playWallBreak(); 
                        engine.guideExpiry = 0;
                        engine.lastGuideText = '';
                        engine.lastGuideActionType = '';
                        updateReactState({ guideActionText: '', guideActionType: '' });
                        engine.isWallFightActive = false;
                        engine.player.isBlocked = false; 
                        updateReactState({ isWallFightActive: false });
                    }
                }
            }
        }
        SoundManager.playPunch();
        setTimeout(() => { SoundManager.playPunch(); }, 100);
        setTimeout(() => { player.canPunch = true; player.isDoublePunching = false; }, 250);
    }, [updateReactState, gameState.gameStatus, executeBossDeath]);

    const skipLevel = useCallback(() => {
        const engine = engineRef.current;
        if (!engine.isGameRunning) return;

        if (engine.isCheering) {
            if (engine.cheerTimeoutId) clearTimeout(engine.cheerTimeoutId);
            engine.isCheering = false;
            updateReactState({ cheerOverlay: { visible: false, text: '' } });
            if(SoundManager.bgm) SoundManager.bgm.volume = 0.4;
            if (engine.cheerOnComplete) {
                const callback = engine.cheerOnComplete;
                engine.cheerOnComplete = undefined;
                callback();
            }
            return;
        }

        if (engine.isTutorial) {
            engine.hasTriggeredTutorialFade = true;
            engine.obstacles.forEach(o => engine.scene?.remove(o.mesh));
            engine.obstacles = [];
            const texts = getCheerTexts('TUTORIAL_END');
            triggerCheerSequence(texts, 'TUTORIAL_END', () => {
                engine.isTutorial = false;
                engine.tutorialEndTime = engine.elapsedTime;
                updateReactState({ isTutorial: false });
                startPhase(1);
            });
            return;
        }

        if (engine.bossSpawned) {
            executeBossDeath();
            return;
        }

        if (!engine.isTutorial && !engine.bossSpawned) {
             engine.elapsedTime = engine.phaseStartTime + BOSS_SPAWN_TIME; 
             spawnBoss(engine, updateReactState);
             return;
        }

    }, [startPhase, updateReactState, getCheerTexts, triggerCheerSequence, resetToWarmUp, triggerCountdown, executeBossDeath, spawnBoss]);

    const applyWorldBending = useCallback(() => {
        const engine = engineRef.current;
        const { camera, player, obstacles, particles, chunks } = engine;
        if (!camera || !player.mesh) return;
        
        const playerZ = player.mesh.position.z;
        
        // DYNAMIC FADE DISTANCES BASED ON DRAW_DISTANCE CONSTANT
        // Use negative values because player moves towards -Z
        const fadeStartDist = -DRAW_DISTANCE; 
        // Fade range of 20m
        const fadeEndDist = -(DRAW_DISTANCE - 20); 
        
        const applyFade = (obj: THREE.Object3D, zPos: number) => {
            const dist = zPos - playerZ;
            let fadeFactor = 0;
            // dist is negative as object is ahead. 
            // If dist is -90, and fadeStartDist is -100: -90 > -100 (True).
            // fadeFactor = (-90 - (-100)) / (-80 - (-100)) = 10 / 20 = 0.5
            if (dist > fadeStartDist) { 
                fadeFactor = (dist - fadeStartDist) / (fadeEndDist - fadeStartDist); 
            }
            fadeFactor = Math.max(0, Math.min(1, fadeFactor));
            obj.traverse(child => {
                    if (child instanceof THREE.Mesh) {
                        const mat = child.material;
                        if (mat) {
                            const mats = Array.isArray(mat) ? mat : [mat];
                            mats.forEach(m => {
                                m.transparent = true;
                                if (m.userData.baseOpacity === undefined) { m.userData.baseOpacity = m.opacity < 0.01 ? 1.0 : m.opacity; }
                                if (child.userData.maxOpacity !== undefined) { m.userData.baseOpacity = child.userData.maxOpacity; }
                                m.opacity = m.userData.baseOpacity * fadeFactor;
                            });
                        }
                    }
            });
        };

        obstacles.forEach(obs => {
            const isBossOrWall = obs.data.hp !== undefined && (obs.data.action === 'final_boss' || obs.data.action === 'wall_blockade' || obs.data.action === 'mirror_wall');
            if (obs.id === 99999) {
                obs.mesh.position.x = 0;
                obs.mesh.position.y = (obs.mesh.userData.origY || 0);
            } else {
                obs.mesh.position.x = isBossOrWall ? 0 : (obs.mesh.userData.origX || 0);
                obs.mesh.position.y = (obs.mesh.userData.origY || 0);
                obs.mesh.rotation.y = (obs.mesh.userData.origRotY || 0);
            }
            applyFade(obs.mesh, obs.mesh.position.z);
        });
        
        particles.forEach(p => {
            if (!p.origPos) p.origPos = p.mesh.position.clone();
        });

        chunks.forEach(chunk => {
            chunk.mesh.position.z = chunk.zPos; 
            chunk.mesh.position.x = 0; 
            chunk.mesh.position.y = 0; 
            chunk.mesh.rotation.y = 0;
            chunk.mesh.rotation.x = 0;
            applyFade(chunk.mesh, chunk.zPos);
        });
    }, []);

    const updateChunks = useCallback(() => {
         const engine = engineRef.current;
        if (!engine.player.mesh || !engine.scene) return;
        const pz = engine.player.mesh.position.z;
        const removeZ = pz + 40; 
        for (let i = engine.chunks.length - 1; i >= 0; i--) {
            if (engine.chunks[i].zPos > removeZ) { engine.scene.remove(engine.chunks[i].mesh); engine.chunks.splice(i, 1); }
        }
        let minZ = pz;
        if (engine.chunks.length > 0) { minZ = engine.chunks.reduce((min, c) => Math.min(min, c.zPos), engine.chunks[0].zPos); }
        const targetZ = pz - DRAW_DISTANCE;
        while (minZ > targetZ) {
            minZ -= CHUNK_SIZE;
            const chunkMesh = SceneBuilder.createChunk(minZ, engine.textures, engine.adTextures, engine.wallTextures, engine.currentPhase);
            engine.scene.add(chunkMesh);
            engine.chunks.push({ mesh: chunkMesh, zPos: minZ });
        }
    }, []);

    const triggerMirrorSequence = useCallback((obstacle: Obstacle) => {
        const engine = engineRef.current;
        engine.isMirrorBlocked = true;
        engine.mirrorSpawnCount++; 

        const totalSteps = engine.currentPhase === 0 ? 1 : engine.currentPhase;
        const availableIndices = Array.from({ length: MIRROR_CONFIG.count }, (_, i) => i + 1);
        
        for (let i = availableIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
        }
        const actionDeck = availableIndices;

        const executeStep = (currentStep: number) => {
            const deckIndex = (currentStep - 1) % actionDeck.length;
            const actionIdx = actionDeck[deckIndex];
            
            const baseImages = guideImagesRef.current[MIRROR_CONFIG.bgId] || [];
            const baseImg = baseImages[0] || '';
            const actionKey = `action_${actionIdx.toString().padStart(2, '0')}`;
            const actionImages = guideImagesRef.current[actionKey] || [];
            const actionImg = actionImages[0] || '';

            updateReactState({ isMirrorModeActive: true, mirrorOverlayState: 'countdown', mirrorOverlayText: '3', mirrorOverlayImage: baseImg });
            SoundManager.playCountdown();

            setTimeout(() => { updateReactState({ mirrorOverlayText: '2' }); SoundManager.playCountdown(); }, 510);
            setTimeout(() => { updateReactState({ mirrorOverlayText: '1' }); SoundManager.playCountdown(); }, 1020);

            setTimeout(() => {
                updateReactState({ mirrorOverlayState: 'action', mirrorOverlayText: '', mirrorOverlayImage: actionImg });
                SoundManager.playActionSignal();
            }, 1530);

            setTimeout(() => {
                const msgs = ["EXCELLENT!", "PERFECT!", "GREAT!", "NICE!"];
                const msg = msgs[Math.floor(Math.random() * msgs.length)];
                updateReactState({ mirrorOverlayState: 'result', mirrorOverlayText: msg });
                
                // ENSURE DINGDONG SOUND PLAYS
                SoundManager.playCustom('dingdong');
            }, 3500);

            setTimeout(() => {
                if (currentStep < totalSteps) {
                    executeStep(currentStep + 1);
                } else {
                    SoundManager.playCustom('sfx_mirror_break'); 
                    ParticleSystem.createExplosion(engine, obstacle.mesh.position, engine.textures.mirror, 50);
                    if(engine.scene) engine.scene.remove(obstacle.mesh);
                    engine.obstacles = engine.obstacles.filter(o => o !== obstacle);
                    engine.isMirrorBlocked = false;
                    updateReactState({ isMirrorModeActive: false, mirrorOverlayState: 'hidden' });
                    SoundManager.playPowerUp();
                }
            }, 4500);
        };

        executeStep(1);

    }, [updateReactState, guideImagesRef]);

    const { checkCollisions } = useCollision(engineRef, { 
        triggerMirrorSequence, 
        updateReactState 
    });

    const gameUpdate = useCallback((time: number, delta: number) => {
        const engine = engineRef.current;
        if (!engine.isGameRunning) return;
  
        engine.elapsedTime = (time - engine.startTime - engine.totalPausedTime) / 1000;

        const boss = engine.obstacles.find(o => o.data.action === 'final_boss');
        if (boss && boss.data.miniGameCompleted && boss.data.hp !== undefined) {
            const drainAmount = (engine.maxBossHP || 100) * 0.05;
            boss.data.hp -= drainAmount;
            engine.bossHP = Math.max(0, boss.data.hp);
            updateReactState({ bossHP: engine.bossHP });
            
            engine.shakeIntensity = 0.2;
            if (Math.random() < 0.3) SoundManager.playPunch();

            if (boss.data.hp <= 0) {
                executeBossDeath();
                return; 
            }
        }

        if (engine.pendingTutorialTrigger && engine.elapsedTime >= engine.pendingTutorialTrigger.time) {
            if (engine.pendingTutorialTrigger.type === 'WALL_GUIDE') {
                engine.player.lane = 0.5;
                triggerCheerSequence([""], 'WALL_GUIDE', () => {});
            }
            engine.pendingTutorialTrigger = undefined;
        }

        if (engine.isTutorial && engine.tutorialStepIndex >= TUTORIAL_SEQUENCE.length && engine.obstacles.length === 0 && !engine.hasTriggeredTutorialFade) {
             engine.player.lane = 0.5; // CENTER PLAYER
             engine.hasTriggeredTutorialFade = true;
             const texts = getCheerTexts('TUTORIAL_END');
             triggerCheerSequence(texts, 'TUTORIAL_END', () => {
                 engine.isTutorial = false;
                 engine.tutorialEndTime = engine.elapsedTime;
                 updateReactState({ isTutorial: false });
                 startPhase(1);
             });
        }

        if (engine.isBossDeadTransition) {
             const transitionTime = engine.elapsedTime - engine.bossDeathTime;
             if (transitionTime > 2.0 && transitionTime <= 4.0) {
                 const fadeRatio = (transitionTime - 2.0) / 2.0;
                 if (engine.transitionMesh) {
                     (engine.transitionMesh.material as THREE.MeshBasicMaterial).color.setHex(0x000000);
                     (engine.transitionMesh.material as THREE.MeshBasicMaterial).opacity = fadeRatio;
                 }
             } else if (transitionTime > 4.0) {
                 if (engine.transitionMesh) (engine.transitionMesh.material as THREE.MeshBasicMaterial).opacity = 1.0;
                 if (!engine.bossCheerTriggered) {
                     engine.bossCheerTriggered = true;
                     const phase = engine.currentPhase;
                     let texts: string[] = [];
                     let sequenceType = '';
                     
                     if (phase === 1) { texts = getCheerTexts('PHASE_1_CLEAR'); sequenceType = 'PHASE_1_CLEAR'; }
                     else if (phase === 2) { texts = getCheerTexts('PHASE_2_CLEAR'); sequenceType = 'PHASE_2_CLEAR'; }
                     else if (phase === 3) { texts = getCheerTexts('PHASE_3_CLEAR'); sequenceType = 'PHASE_3_CLEAR'; }
                     else if (phase === 4) { texts = getCheerTexts('VICTORY'); sequenceType = 'VICTORY'; }

                     triggerCheerSequence(texts, sequenceType, () => {
                         engine.isBossDeadTransition = false;
                         engine.player.speed = 0; 
                         if (phase < 4) { 
                             startPhase(phase + 1);
                         } else {
                             engine.isTutorial = false;
                             engine.hasTriggeredTutorialFade = false;
                             engine.obstacles.forEach(o => engine.scene?.remove(o.mesh));
                             engine.obstacles = [];
                             ParticleSystem.clear(engine);
                             if (engine.player.mesh) {
                                engine.nextSpawnZ = engine.player.mesh.position.z - 150;
                             }
                             startPhase(1);
                         }
                         if (engine.transitionMesh) {
                            (engine.transitionMesh.material as THREE.MeshBasicMaterial).opacity = 0; 
                         }
                     });
                 }
             }
        } else if (engine.isPhaseFadingIn) {
            const fadeTime = engine.elapsedTime - engine.phaseFadeStartTime;
            const fadeDuration = 1.5; 
            const fadeRatio = 1.0 - Math.min(1.0, fadeTime / fadeDuration);
            if (engine.transitionMesh) {
                (engine.transitionMesh.material as THREE.MeshBasicMaterial).color.setHex(0x000000);
                (engine.transitionMesh.material as THREE.MeshBasicMaterial).opacity = fadeRatio;
            }
            if (fadeRatio <= 0) {
                engine.isPhaseFadingIn = false;
            }
        } else {
            if (engine.elapsedTime < 2.0 && engine.currentPhase === 0) {
                const fadeRatio = engine.elapsedTime / 2.0;
                if (engine.transitionMesh) {
                    (engine.transitionMesh.material as THREE.MeshBasicMaterial).color.setHex(0x000000);
                    (engine.transitionMesh.material as THREE.MeshBasicMaterial).opacity = 1.0 - fadeRatio;
                }
            } else if (!engine.isBossDeadTransition) {
                 if (engine.transitionMesh) (engine.transitionMesh.material as THREE.MeshBasicMaterial).opacity = 0.0;
            }
        }
  
        if (engine.player.isBlocked) {
            let blockingObstacleFound = false;
            for (const obs of engine.obstacles) {
               const dist = obs.mesh.position.z - engine.player.mesh!.position.z;
               if (['final_boss', 'wall_blockade'].includes(obs.data.action)) {
                   if (dist > -15 && dist < 5) {
                       blockingObstacleFound = true;
                       if (obs.data.action === 'wall_blockade') obs.mesh.position.z = engine.player.mesh!.position.z - 2.5;
                       break;
                   }
               }
            }
            if (!blockingObstacleFound) {
                engine.player.isBlocked = false; engine.isWallFightActive = false; engine.isBossFightActive = false;
                updateReactState({ isWallFightActive: false });
            }
        }
  
        const displayDistance = Math.floor(engine.totalRunningDistance);
        let targetSpeed = 0.33; 
        
        if (!engine.isTutorial) {
            if (engine.currentPhase === 1) targetSpeed = 0.35; 
            else if (engine.currentPhase === 2) targetSpeed = 0.39; 
            else if (engine.currentPhase === 3) targetSpeed = 0.42; 
            else if (engine.currentPhase === 4) targetSpeed = 0.45; 
            
            const pz = engine.player.mesh ? engine.player.mesh.position.z : 0;
            const hasObstaclesAhead = engine.obstacles.some(o => o.mesh.position.z < pz && o.mesh.position.z > pz - 40 && !['final_boss', 'wall_blockade', 'mirror_wall'].includes(o.data.action));
            
            if (engine.bossMode && !engine.player.isBlocked) {
                targetSpeed = hasObstaclesAhead ? 0.37 : 0.66; 
            }
            if (engine.isBossFightActive && !engine.isBossDeadTransition) {
                 targetSpeed = 0.66;
            }
        }
        if (engine.player.isBlocked || engine.isMirrorBlocked || engine.isCheering) targetSpeed = 0; 
        if (engine.isBossDeadTransition) targetSpeed = 0.66; 
        
        if (engine.isSlowMotion) {
            targetSpeed = targetSpeed * 0.25;
        }

        engine.player.speed = THREE.MathUtils.lerp(engine.player.speed, targetSpeed, 0.05);
  
        const { text: currentGuide, id: currentGuideId, actionType: currentActionType } = processAIAndGetGuide(
            engine,
            { changeLane, triggerPunch, triggerDoublePunch }
        );

        let guideTextToShow = ""; let guideIdToShow = 0; let guideTypeToShow = "";
        
        const isTransient = currentGuideId === 99990 || currentGuideId === 99999;
  
        if (currentGuide) {
            if (currentGuideId !== engine.lastGuideId) {
                SoundManager.playCustom(currentActionType);
                
                engine.lastGuideText = currentGuide; 
                engine.lastGuideId = currentGuideId; 
                engine.lastGuideActionType = currentActionType;
                
                // ADDED: Center player on Sprint start
                if (currentActionType === 'sprint') {
                    engine.player.lane = 0.5;
                    // Trigger boss gauge UI only when sprinting starts
                    updateReactState({ bossMode: true });
                }
                
                if (isTransient) {
                    engine.guideExpiry = engine.elapsedTime + 3.0; 
                } else {
                    engine.guideExpiry = engine.elapsedTime + 1.0; 
                }
            } else {
                if (!isTransient) {
                    engine.guideExpiry = engine.elapsedTime + 1.0; 
                }
            }
            
            if (engine.elapsedTime < engine.guideExpiry) {
                guideTextToShow = engine.lastGuideText; 
                guideIdToShow = engine.lastGuideId; 
                guideTypeToShow = engine.lastGuideActionType;
            }
        } else {
            if (engine.elapsedTime < engine.guideExpiry) {
                 guideTextToShow = engine.lastGuideText; 
                 guideIdToShow = engine.lastGuideId; 
                 guideTypeToShow = engine.lastGuideActionType;
            } else {
                 engine.lastGuideId = -1;
            }
        }
  
        let currentGaugeValue = 0;
        if (engine.isTutorial) {
             // CHANGED: Use time-based progression for smooth gauge (approx 45s for tutorial)
             const tutorialDuration = 45.0; 
             currentGaugeValue = Math.min(100, (engine.elapsedTime / tutorialDuration) * 100);
        } else {
            let requiredDuration = 55; 
            if (engine.currentPhase === 1) requiredDuration = 40;
            else if (engine.currentPhase === 2) requiredDuration = 50;
            else if (engine.currentPhase === 3) requiredDuration = 55;
            else if (engine.currentPhase === 4) requiredDuration = 60;

            if (!engine.bossSpawned) {
                const phaseTime = engine.elapsedTime - engine.phaseStartTime;
                currentGaugeValue = Math.min(100, (phaseTime / requiredDuration) * 100);
                if (phaseTime >= requiredDuration) {
                     spawnBoss(engine, updateReactState);
                     // REMOVED: Centering logic here. It's now handled by the Sprint guide.
                }
            } else {
                if (engine.bossStartDist > 0 && engine.player.mesh) {
                    const boss = engine.obstacles.find(o => o.data.action === 'final_boss');
                    if (boss) {
                        const currentDistToBoss = Math.abs(engine.player.mesh.position.z - boss.mesh.position.z);
                        const p = Math.max(0, Math.min(1, (engine.bossStartDist - currentDistToBoss) / (engine.bossStartDist - BOSS_FIGHT_DISTANCE)));
                        currentGaugeValue = 95 + (p * 5);
                    } else currentGaugeValue = 100;
                } else currentGaugeValue = 100;
            }
        }
  
        updateReactState({ 
            distance: displayDistance, score: Math.floor(engine.scoreOffset + engine.elapsedTime),
            guideActionText: guideTextToShow, guideActionId: guideIdToShow, guideActionType: guideTypeToShow,
            bossGaugeValue: currentGaugeValue,
        });
  
        if (engine.player.mesh) {
          const { player } = engine;
          if (!player.isBlocked && !engine.isMirrorBlocked && !engine.isCheering) {
              player.mesh.position.z -= player.speed;
              engine.totalRunningDistance += player.speed;
          }

          if (engine.actionWallsSpawned > 0) { 
              player.lane = 0.5; 
          }

          const targetX = (player.lane - 0.5) * LANE_DISTANCE;
          player.xPos += (targetX - player.xPos) * 10 * delta;
          player.mesh.userData.origX = player.xPos; player.mesh.position.x = player.xPos; 
          player.velocity.y -= 0.012; player.mesh.userData.origY += player.velocity.y;
          const groundLevel = 0.9;
          if (player.mesh.userData.origY <= groundLevel && !player.isJumping) { player.mesh.userData.origY = groundLevel; player.velocity.y = 0; }
          if (player.isJumping && player.mesh.userData.origY <= groundLevel) { player.isJumping = false; player.mesh.userData.origY = groundLevel; }
          player.mesh.position.y = player.mesh.userData.origY; 
          if (player.isCrouching) player.mesh.scale.y = 0.5; else player.mesh.scale.y = 1.0;
  
          if (engine.camera) {
              engine.shakeIntensity *= 0.9; if(engine.shakeIntensity < 0.01) engine.shakeIntensity = 0;
              const shakeX = (Math.random() - 0.5) * engine.shakeIntensity; const shakeY = (Math.random() - 0.5) * engine.shakeIntensity;
              const targetY = player.isCrouching ? 0.8 : (1.8 + player.mesh.userData.origY - groundLevel);
              const logicCamY = THREE.MathUtils.lerp(engine.camera.position.y, targetY, 0.2);
              
              const bobAmt = engine.currentPhase >= 2 ? 0.015 : 0.025; 
              const bob = engine.player.speed > 0.01 ? Math.sin(player.mesh.position.z * -0.58) * bobAmt : 0;
              engine.camera.position.z = player.mesh.position.z + 0.2; engine.camera.position.x = (player.xPos * 0.9) + shakeX; engine.camera.position.y = logicCamY + bob + shakeY;
          }
        }
        
        if (engine.scene && engine.player.mesh) {
            const light = engine.scene.getObjectByName('dirLight') as THREE.DirectionalLight;
            if (light) {
                const pPos = engine.player.mesh.position; 
                light.position.set(pPos.x + 20, pPos.y + 40, pPos.z + 20);
                light.target.position.set(pPos.x, pPos.y, pPos.z - 20); 
                light.target.updateMatrixWorld();
            }
        }
        updateChunks(); applyWorldBending();
        
        engine.chunks.forEach(chunk => {
            chunk.mesh.traverse(child => {
                if (child.name === 'bg_rock' || child.name === 'bg_plant') {
                    CurrentTheme.animators.animateBackgroundObject(child, engine.elapsedTime, delta);
                }
            });
        });

        if (Math.random() < 0.3) {
            ParticleSystem.createSnow(engine);
        }
        ParticleSystem.update(engine, delta);
        
        for(let i=0; i<engine.obstacles.length; i++) {
            const obs = engine.obstacles[i];
            if (obs.data.action === 'final_boss') {
                CurrentTheme.animators.animateBoss(obs, engine.elapsedTime, delta, engine.currentPhase);
            } else {
                CurrentTheme.animators.animateObstacle(obs, engine.elapsedTime, delta);
            }
        }

        checkCollisions(delta);
        
        // INCREASED SPAWN BUFFER: 60 -> 280
        if (engine.player.mesh && engine.player.mesh.position.z < engine.nextSpawnZ + 280) spawnObstacle(engine);
        engine.renderer?.render(engine.scene!, engine.camera!);
    }, [spawnObstacle, updateChunks, applyWorldBending, updateReactState, resetToWarmUp, triggerMirrorSequence, triggerCheerSequence, setSceneBackground, startPhase, getCheerTexts, spawnBoss, changeLane, triggerPunch, triggerDoublePunch, checkCollisions, executeBossDeath]);

    useGameLoop(gameState.isRunning && gameState.gameStatus === 'PLAYING', gameUpdate);

    const startGame = () => { 
        const engine = engineRef.current;
        if(engine.isGameRunning && gameState.gameStatus === 'PLAYING') return;
        
        engine.isAI = true; 
        engine.isGameRunning = true; engine.startTime = performance.now(); engine.lastTime = engine.startTime; engine.elapsedTime = 0;
        engine.nextSpawnZ = -140; 
        
        engine.distanceBonus = 0; engine.scoreOffset = 0; engine.bossSpawned = false; engine.bossMode = false;
        engine.isBossFightActive = false; engine.isWallFightActive = false; engine.shakeIntensity = 0;
        engine.bossStartDist = 0; engine.isCinematicSequence = false; engine.isBossDeadTransition = false;
        engine.player.lane = 0; engine.player.xPos = -2.0; engine.player.isBlocked = false; engine.player.speed = 0; engine.player.velocity.set(0,0,0);
        engine.isTutorial = true; engine.tutorialStepIndex = 0; engine.tutorialActionCount = 0;
        engine.totalRunningDistance = 0; engine.tutorialEndTime = 0;
        engine.isMirrorBlocked = false; engine.isCheering = false; engine.hasCheeredPhase1 = false; engine.totalPausedTime = 0;
        engine.hasTriggeredTutorialFade = false; engine.hasTriggeredBossFade = false; engine.hasForcedMirror = false; 
        engine.bgCycleIndices = { 'bg_tutorial': 0, 'bg_day': 0, 'bg_evening': 0, 'bg_night': 0, 'bg_dawn': 0 };
        engine.currentPhase = 0; engine.phaseStartTime = 0;
        
        engine.isPhaseFadingIn = false;
        engine.actionWallsSpawned = 0;
        engine.globalWallIndex = 0; 
        engine.pendingTutorialTrigger = undefined;
        engine.isSlowMotion = false;

        if(engine.player.mesh) { engine.player.mesh.position.set(-2.0, 0.9, 0); engine.player.mesh.userData = { origX: -2.0, origY: 0.9 }; }
        engine.obstacles.forEach(o => engine.scene?.remove(o.mesh)); engine.obstacles = [];
        ParticleSystem.clear(engine); 
        
        rebuildChunks(40, -DRAW_DISTANCE, 0);
        
        if (engine.scene) {
            const bgColor = CurrentTheme.colors.ground.tutorial;
            setSceneBackground('bg_tutorial', bgColor);
        }

        if (engine.transitionMesh) {
            (engine.transitionMesh.material as THREE.MeshBasicMaterial).color.setHex(0x000000);
            (engine.transitionMesh.material as THREE.MeshBasicMaterial).opacity = 1.0;
        }

        setGameState({
            isRunning: true, score: 0, distance: 0, phaseText: '', currentPhase: 0,
            bossHP: BOSS_MAX_HP, maxBossHP: BOSS_MAX_HP, bossMode: false, gameStatus: 'PLAYING', uiVisible: true, guideActionText: '', guideActionId: 0, guideActionType: '', bossGaugeValue: 0,
            isWallFightActive: false, wallMonsterHP: WALL_MAX_HP, isTutorial: true, showTutorialGuide: false, 
            tutorialProgress: '',
            stageLabel: 'TRAINING', stageColor: CurrentTheme.ui.stageColors.tutorial, 
            isMirrorModeActive: false, mirrorOverlayState: 'hidden', mirrorOverlayText: '', mirrorOverlayImage: undefined,
            cheerOverlay: { visible: false, text: '' }
        });
        SoundManager.setTheme('tutorial'); SoundManager.startBGM(); 
        
        const texts = getCheerTexts('INTRO');
        triggerCheerSequence(texts, 'INTRO', () => { triggerCountdown(); });
    };

    return { 
        gameState, setGameState, startGame, 
        guideImages, setGuideImages, 
        guideVideos, setGuideVideos, 
        guideAudio, setGuideAudio, 
        gameConfig, setGameConfig, 
        skipLevel, handleMiniGameVictory,
        modelsRef 
    };
};
