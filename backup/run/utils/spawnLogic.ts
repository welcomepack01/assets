
import * as THREE from 'three';
import { EngineState, GameState, ObstacleData } from '../gameTypes';
import { SceneBuilder } from './SceneBuilder';
import { SoundManager } from './gameUtils'; 
import { 
    LANE_DISTANCE, BOSS_MAX_HP, BOSS_FIGHT_DISTANCE, BOSS_SPAWN_TIME, DRAW_DISTANCE
} from '../gameConstants';
import { ASSETS } from '../config/gameAssets';

export const TUTORIAL_SEQUENCE = [
    { action: 'jump', total: 2, label: 'JUMP' },
    { action: 'crouch', total: 2, label: 'DUCK' },
    { action: 'dodge', total: 2, label: 'DODGE' },
    { action: 'punch', total: 2, label: 'JAB' },
    { action: 'double_punch', total: 2, label: 'ONE-TWO' },
    { action: 'wall', total: 1, label: 'BREAK WALL' },
    { action: 'big_jump', total: 1, label: 'HIGH JUMP' },
    { action: 'jump_attack', total: 1, label: 'JUMP ATTACK' },
    // MIRROR MODE REMOVED FROM TUTORIAL
    { action: 'run', total: 1, label: 'FINISH RUN' }
];

// Module-level counters for alternating variants
// (Reset on reload)
let jumpCounter = 0;
let bigJumpCounter = 0;
let crouchCounter = 0;

export const spawnObstacle = (engine: EngineState) => {
    // Stop spawning only if Boss has actually spawned or Cheering sequence is active
    if (engine.bossSpawned || engine.isCheering) return;

    const zPos = engine.nextSpawnZ;
    const { textures, isTutorial, tutorialStepIndex, tutorialActionCount, models, currentPhase } = engine;

    if (isTutorial) {
        const currentStep = TUTORIAL_SEQUENCE[tutorialStepIndex];
        if (!currentStep) return;

        let result: { mesh: THREE.Group, data: ObstacleData, origY: number } | null = null;
        switch (currentStep.action) {
            case 'jump': result = SceneBuilder.createJumpObstacle(zPos, textures, models, 0, 'A'); break;
            case 'crouch': result = SceneBuilder.createCrouchObstacle(zPos, textures, false, false, models, 0, 'A'); break;
            case 'dodge': 
                const dodgeLane = tutorialActionCount % 2; 
                result = dodgeLane === 0 ? SceneBuilder.createCat(zPos, textures, models) : SceneBuilder.createOctopus(zPos, textures, models);
                if (result && result.mesh) { result.mesh.position.x = (dodgeLane - 0.5) * LANE_DISTANCE; result.mesh.userData.origX = result.mesh.position.x; }
                break;
            case 'punch':
                const punchLane = tutorialActionCount % 2; 
                result = SceneBuilder.createRedMonster(zPos, textures, models);
                if (result && result.mesh) { result.mesh.position.x = (punchLane - 0.5) * LANE_DISTANCE; result.mesh.userData.origX = result.mesh.position.x; }
                break;
            case 'double_punch':
                const dpLane = (tutorialActionCount + 1) % 2; 
                result = SceneBuilder.createBlueMonster(zPos, textures, models);
                if (result && result.mesh) { result.mesh.position.x = (dpLane - 0.5) * LANE_DISTANCE; result.mesh.userData.origX = result.mesh.position.x; }
                break;
            case 'wall':
                result = SceneBuilder.createWallBlockade(zPos, textures, engine.wallTextures, engine.globalWallIndex);
                engine.globalWallIndex++; // Sequential Update
                break;
            case 'mirror_wall':
                // Pass current phase (0 for tutorial, which defaults to mini1)
                result = SceneBuilder.createMirrorWall(zPos, textures, engine.currentPhase);
                break;
            case 'big_jump':
                result = SceneBuilder.createBigJumpObstacle(zPos, textures, models, 0, 'A');
                if (result && result.mesh) { 
                    result.mesh.position.x = 0; 
                    result.mesh.userData.origX = 0; 
                }
                break;
            case 'jump_attack':
                result = SceneBuilder.createIronEagle(zPos, models);
                const jaLane = tutorialActionCount % 2; 
                if (result && result.mesh) {
                    result.mesh.position.x = (jaLane - 0.5) * LANE_DISTANCE;
                    result.mesh.userData.origX = result.mesh.position.x;
                }
                break;
            case 'run':
                const dummyGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
                const dummyMat = new THREE.MeshBasicMaterial({ visible: false });
                const dummyMesh = new THREE.Group();
                dummyMesh.add(new THREE.Mesh(dummyGeo, dummyMat));
                dummyMesh.position.set(0, 0, zPos);
                result = { mesh: dummyMesh, data: { type: 'static', action: 'run' }, origY: 0 };
                break;
        }

        if (result && result.mesh && engine.scene) {
            engine.scene.add(result.mesh);
            engine.obstacles.push({
                id: Math.random(),
                mesh: result.mesh,
                box: new THREE.Box3().setFromObject(result.mesh),
                data: result.data
            });

            engine.tutorialActionCount++;
            if (engine.tutorialActionCount >= currentStep.total) {
                engine.tutorialStepIndex++;
                engine.tutorialActionCount = 0;
            }
        }
        
        // Advance next spawn further for tutorial spacing
        const nextSpacing = 50;
        engine.nextSpawnZ -= nextSpacing;

    } else {
        // Standard spawning logic based on phases
        const rnd = Math.random();
        const phase = engine.currentPhase;
        let result: { mesh: THREE.Group, data: ObstacleData, origY: number } | null = null;

        let requiredDuration = 55; // Default fallback
        if (phase === 1) requiredDuration = 40;      // 40s
        else if (phase === 2) requiredDuration = 50; // 50s
        else if (phase === 3) requiredDuration = 55; // 55s
        else if (phase === 4) requiredDuration = 60; // 60s

        const phaseTime = engine.elapsedTime - engine.phaseStartTime;
        
        // --- MIRROR SPAWN LOGIC (MIDDLE OF LEVEL) ---
        const midPoint = requiredDuration / 2;
        
        const shouldSpawnMirror = engine.mirrorSpawnCount === 0 && phaseTime > midPoint;

        if (shouldSpawnMirror) {
             result = SceneBuilder.createMirrorWall(zPos, textures, phase);
             engine.mirrorSpawnCount++; 
        } else {
            // Helper to randomly spawn Red (Punch 1) or Blue (Punch 2) monster
            const createRandomPunchMonster = () => {
                return Math.random() < 0.5 
                    ? SceneBuilder.createRedMonster(zPos, textures, models)
                    : SceneBuilder.createBlueMonster(zPos, textures, models);
            };

            // Helper to randomly spawn Dodge 1, Dodge 2, or Dodge 3 (33% Chance Each)
            const createRandomDodgeObstacle = () => {
                const r = Math.random();
                if (r < 0.33) return SceneBuilder.createCat(zPos, textures, models); // Variant A
                else if (r < 0.66) return SceneBuilder.createOctopus(zPos, textures, models); // Variant B
                else return SceneBuilder.createDodgeVariantC(zPos, textures, models); // Variant C
            };
            
            // Helper to get alternating variant (A/B)
            const getJumpVariant = () => (jumpCounter++ % 2 === 0) ? 'A' : 'B';
            const getBigJumpVariant = () => (bigJumpCounter++ % 2 === 0) ? 'A' : 'B';
            const getCrouchVariant = () => (crouchCounter++ % 2 === 0) ? 'A' : 'B';

            // --- Standard Obstacle Spawning (If not mirror) ---
            if (phase === 1) { // Phase 1
                if (rnd < 0.05) {
                    result = SceneBuilder.createJumpObstacle(zPos, textures, models, phase, getJumpVariant());
                }
                else if (rnd < 0.10) {
                    if (phaseTime < requiredDuration - 5) {
                        result = SceneBuilder.createWallBlockade(zPos, textures, engine.wallTextures, engine.globalWallIndex);
                        engine.globalWallIndex++;
                    } else {
                        result = SceneBuilder.createCrouchObstacle(zPos, textures, false, false, models, phase, getCrouchVariant());
                    }
                }
                else if (rnd < 0.40) result = SceneBuilder.createJumpObstacle(zPos, textures, models, phase, getJumpVariant());
                else if (rnd < 0.70) result = SceneBuilder.createCrouchObstacle(zPos, textures, false, false, models, phase, getCrouchVariant());
                else if (rnd < 0.85) result = createRandomDodgeObstacle(); // MIXED DODGE
                else result = createRandomPunchMonster(); // MIXED PUNCH
            } else if (phase === 2) { // Phase 2
                if (rnd < 0.20) {
                    if (phaseTime < requiredDuration - 5) {
                        result = SceneBuilder.createWallBlockade(zPos, textures, engine.wallTextures, engine.globalWallIndex);
                        engine.globalWallIndex++;
                    } else {
                        result = SceneBuilder.createJumpObstacle(zPos, textures, models, phase, getJumpVariant());
                    }
                }
                else if (rnd < 0.35) result = SceneBuilder.createJumpObstacle(zPos, textures, models, phase, getJumpVariant());
                else if (rnd < 0.45) result = SceneBuilder.createCrouchObstacle(zPos, textures, false, false, models, phase, getCrouchVariant());
                else if (rnd < 0.60) result = SceneBuilder.createBigJumpObstacle(zPos, textures, models, phase, getBigJumpVariant()); 
                else if (rnd < 0.80) result = createRandomPunchMonster(); // MIXED PUNCH
                else result = createRandomDodgeObstacle(); // MIXED DODGE
            } else { // Phase 3 & 4
                if (rnd < 0.25) {
                    if (phaseTime < requiredDuration - 5) {
                        result = SceneBuilder.createWallBlockade(zPos, textures, engine.wallTextures, engine.globalWallIndex);
                        engine.globalWallIndex++;
                    } else {
                        result = createRandomPunchMonster(); // MIXED PUNCH
                    }
                }
                else if (rnd < 0.30) result = SceneBuilder.createJumpObstacle(zPos, textures, models, phase, getJumpVariant());
                else if (rnd < 0.35) result = SceneBuilder.createCrouchObstacle(zPos, textures, false, false, models, phase, getCrouchVariant());
                else if (rnd < 0.60) result = SceneBuilder.createIronEagle(zPos, models); 
                else if (rnd < 0.80) result = SceneBuilder.createBigJumpObstacle(zPos, textures, models, phase, getBigJumpVariant()); 
                else result = createRandomPunchMonster(); // MIXED PUNCH
            }
        }

        if (result && result.mesh && engine.scene) {
            engine.scene.add(result.mesh);
            engine.obstacles.push({
                id: Math.random(),
                mesh: result.mesh,
                box: new THREE.Box3().setFromObject(result.mesh),
                data: result.data
            });
        }
        // Continuous spawn
        engine.nextSpawnZ -= (30 + Math.random() * 20);
    }
};

export const spawnBoss = (engine: EngineState, updateReactState: (updates: Partial<GameState>) => void) => {
    if (engine.bossSpawned || !engine.player.mesh) return;

    engine.bossSpawned = true;
    engine.bossMode = true;
    
    const playerZ = engine.player.mesh.position.z;
    
    let spawnZ = playerZ - 140; 

    engine.nextSpawnZ = spawnZ - 50; 

    const phase = engine.currentPhase;
    let bossType: 'mech' | 'beast' | 'mutant' | 'demon' = 'mech';
    let hp = BOSS_MAX_HP;

    if (phase === 2) { bossType = 'beast'; hp = BOSS_MAX_HP + 14; }
    else if (phase === 3) { bossType = 'mutant'; hp = BOSS_MAX_HP + 28; }
    else if (phase === 4) { bossType = 'demon'; hp = BOSS_MAX_HP + 42; }

    const result = SceneBuilder.createBoss(spawnZ, engine.textures, hp, bossType, engine.models);
    
    if (result && result.mesh && engine.scene) {
        engine.scene.add(result.mesh);
        engine.obstacles.push({
            id: Math.random(), 
            mesh: result.mesh,
            box: result.box,
            data: result.data
        });
        
        engine.bossHP = hp;
        engine.maxBossHP = hp;
        engine.bossStartDist = Math.abs(engine.player.mesh!.position.z - spawnZ);
        
        updateReactState({ 
             bossHP: hp, 
             maxBossHP: hp, 
             bossGaugeValue: 100 
        });
    }
};
