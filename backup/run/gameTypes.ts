
import * as THREE from 'three';

export interface GameConfig {
    cheerTexts?: Record<string, string[][]>;
}

export interface PlayerState {
    mesh: THREE.Group | THREE.Mesh | null;
    lane: number;
    xPos: number;
    velocity: THREE.Vector3;
    isJumping: boolean;
    isCrouching: boolean;
    isPunching: boolean;
    isDoublePunching: boolean;
    isBlocked: boolean;
    canPunch: boolean;
    height: number;
    speed: number;
    hp: number;
}

export interface ObstacleData {
    type?: string;
    action: string;
    hp?: number;
    isRotating?: boolean;
    isSpinning?: boolean;
    miniGameCompleted?: boolean;
    passed?: boolean; // NEW: Track if player has passed through this obstacle
}

export interface Obstacle {
    id: number;
    mesh: THREE.Group | THREE.Mesh;
    box: THREE.Box3;
    data: ObstacleData;
    reactedByAI?: boolean;
}

export interface Chunk {
    mesh: THREE.Group;
    zPos: number;
}

export interface Particle {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    life: number;
    type: string;
    color?: THREE.Color;
    origPos?: THREE.Vector3;
}

export interface TextureMap {
    [key: string]: THREE.Texture;
}

export interface EngineState {
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    player: PlayerState;
    obstacles: Obstacle[];
    particles: Particle[];
    chunks: Chunk[];
    textures: TextureMap;
    models: Record<string, THREE.Group>; // NEW: Store GLB models
    adTextures: THREE.Texture[];
    wallTextures: THREE.Texture[];
    passThroughWallTextures: THREE.Texture[]; 
    skiMeshes: (THREE.Group | THREE.Mesh)[];
    world: {
        curveCurrent: number;
        curveTarget: number;
        hillCurrent: number;
        hillTarget: number;
        hillFreq: number;
    };
    transitionMesh: THREE.Mesh | null;
    currentVideoElement: HTMLVideoElement | null;
    startTime: number;
    elapsedTime: number;
    lastTime: number;
    totalPausedTime: number;
    nextSpawnZ: number;
    isAI: boolean;
    aiNextMoveTime: number;
    bossSpawned: boolean;
    bossMode: boolean;
    isBossFightActive: boolean;
    isWallFightActive: boolean;
    distanceBonus: number;
    scoreOffset: number;
    shakeIntensity: number;
    bossStartDist: number;
    isCinematicSequence: boolean;
    hasTriggeredVictory: boolean;
    mirrorSpawnCount: number;
    actionWallsSpawned: number;
    globalWallIndex: number; // NEW: Track total walls across all phases for texture cycling 
    hasForcedMirror: boolean;
    isBossDeadTransition: boolean;
    bossDeathTime: number;
    bossCheerTriggered: boolean;
    guideExpiry: number;
    lastGuideText: string;
    lastGuideId: number;
    lastGuideActionType: string;
    animationFrameId: number;
    isGameRunning: boolean;
    isTutorial: boolean;
    tutorialStepIndex: number;
    tutorialActionCount: number;
    totalRunningDistance: number;
    tutorialEndTime: number;
    isMirrorBlocked: boolean;
    isCheering: boolean;
    hasCheeredPhase1: boolean;
    hasTriggeredTutorialFade: boolean;
    hasTriggeredBossFade: boolean;
    isPhaseFadingIn: boolean;
    phaseFadeStartTime: number;
    bgCycleIndices: Record<string, number>;
    gameConfig: GameConfig;
    
    currentPhase: number;
    phaseStartTime: number;
    
    bossHP?: number; 
    maxBossHP?: number;

    // Preloading fields
    preloadedBackground: THREE.Texture | null;
    preloadedVideo: HTMLVideoElement | null;

    // Skip Logic
    cheerTimeoutId?: any;
    cheerOnComplete?: () => void;

    // Delayed Tutorial Trigger
    pendingTutorialTrigger?: {
        time: number;
        type: 'WALL_GUIDE';
    };

    // Slow Motion Effect
    isSlowMotion?: boolean;
}

export interface GameState {
    isRunning: boolean;
    score: number;
    distance: number;
    phaseText: string;
    currentPhase: number;
    bossHP: number;
    maxBossHP: number;
    bossMode: boolean;
    // Added MINI_GAME status
    gameStatus: 'MENU' | 'PLAYING' | 'OBJECT_VIEWER' | 'ADMIN' | 'VICTORY' | 'MINI_GAME';
    uiVisible: boolean;
    guideActionText: string;
    guideActionId: number;
    guideActionType: string;
    bossGaugeValue: number;
    isWallFightActive: boolean;
    wallMonsterHP: number;
    isTutorial: boolean;
    showTutorialGuide: boolean;
    tutorialProgress: string;
    stageLabel: string;
    stageColor: string;
    isMirrorModeActive: boolean;
    mirrorOverlayState: 'hidden' | 'countdown' | 'action' | 'result' | 'black';
    mirrorOverlayText: string;
    mirrorOverlayImage?: string;
    cheerOverlay: {
        visible: boolean;
        text: string;
        videoSrc?: string;
    };
}

export interface LevelConfig {
    id: string;
    name: string;
    skyColor: number;
    road: {
        width: number;
        textureKey: string;
        color: number;
        roughness: number;
    };
    fence: {
        type: string;
        color: number;
    };
    ambientLightColor: number;
    dirLightColor: number;
}

export interface BossConfig {
    name: string;
    scale: number;
    yOffset: number;
    hover: boolean;
}

export interface ThemeAnimators {
    animateObstacle: (obstacle: Obstacle, elapsedTime: number, delta: number) => void;
    animateBoss: (boss: Obstacle, elapsedTime: number, delta: number, currentPhase: number) => void;
    animateBackgroundObject: (obj: THREE.Object3D, elapsedTime: number, delta: number) => void;
}

export interface ThemeBuilders {
    createPlayerMesh: () => THREE.Group | THREE.Mesh;
    createSkis: () => { left: THREE.Group | THREE.Mesh; right: THREE.Group | THREE.Mesh };
    
    // Updated: Generic Decorator now accepts textures
    decorateChunk: (group: THREE.Group, levelConfig: LevelConfig, roadWidth: number, chunkDepth: number, textures: TextureMap) => void;
    
    // BUILDERS NOW ACCEPT MODELS, PHASE, and OPTIONAL VARIANT
    createJumpObstacle: (models?: Record<string, THREE.Group>, phase?: number, variant?: string) => THREE.Group;
    createBigJumpObstacle: (models?: Record<string, THREE.Group>, phase?: number, variant?: string) => THREE.Group;
    createCrouchObstacle: (heightScale: number, models?: Record<string, THREE.Group>, phase?: number, variant?: string) => THREE.Group;
    
    // Updated to support 'C' variant
    createDodgeObstacle: (variant: 'A' | 'B' | 'C', models?: Record<string, THREE.Group>) => THREE.Group;
    createPunchObstacle: (variant: 'weak' | 'strong', models?: Record<string, THREE.Group>) => THREE.Group;
    createFlyingObstacle: (models?: Record<string, THREE.Group>) => THREE.Group;
    // Updated signature: accept textures
    createBossMesh: (type: string, models?: Record<string, THREE.Group>, textures?: TextureMap) => THREE.Group;
    
    createWallBlockade: (width: number, height: number, texture?: THREE.Texture) => THREE.Group;
    createMirrorWall: (width: number, height: number, texture?: THREE.Texture) => THREE.Group;
    createPassThroughWall?: (width: number, height: number, texture: THREE.Texture, videoTexture?: THREE.Texture) => THREE.Group; // Updated Signature
    generateTextures: () => TextureMap;
}

export interface GameTheme {
    id: string;
    css: {
        background: string;
        speedLineColor1: string;
        speedLineColor2: string;
    };
    colors: {
        sky: number;
        ambientLight: number;
        dirLight: number;
        fog: number;
        particles: {
            dust: number[];
            explosion: number[];
        };
        ground: {
            tutorial: number;
        };
    };
    levels: Record<number, LevelConfig>;
    bosses: Record<string, BossConfig>;
    ui: {
        stageColors: {
            tutorial: string;
            day: string;
            evening: string;
            night: string;
            dawn: string;
        };
    };
    builders: ThemeBuilders;
    animators: ThemeAnimators; 
}

export const ACTION_TYPES = ['jump', 'crouch', 'left', 'right', 'punch', 'double_punch', 'big_jump', 'jump_attack'];

export const BACKGROUND_TYPES = [
    { id: 'bg_tutorial', label: 'Tutorial (Jericho Town)' },
    { id: 'bg_day', label: 'Level 1 (Ophelia Hall)' },
    { id: 'bg_evening', label: 'Level 2 (Nevermore Quad)' },
    { id: 'bg_night', label: 'Level 3 (Nightshades)' },
    { id: 'bg_dawn', label: 'Level 4 (Crypt)' }
];

export const BGM_GROUPS = [
    { id: 'bg0', label: 'Tutorial', tracks: [{ id: 'bg0_1', label: 'Town Theme' }] },
    { id: 'bg1', label: 'Level 1', tracks: [{ id: 'bg1_1', label: 'Ophelia Theme' }] },
    { id: 'bg2', label: 'Level 2', tracks: [{ id: 'bg2_1', label: 'Quad Theme' }] },
    { id: 'bg3', label: 'Level 3', tracks: [{ id: 'bg3_1', label: 'Library Theme' }] },
    { id: 'bg4', label: 'Level 4', tracks: [{ id: 'bg4_1', label: 'Crypt Theme' }] }
];

export const ADS_CONFIG = { id: 'ads', label: 'Posters' };
export const WALL_CONFIG = { id: 'wall', label: 'Breakable Walls' };
export const MIRROR_CONFIG = { 
    bgId: 'mirror_bg', 
    bgLabel: 'Mirror Mode BG', 
    actionLabel: 'Mirror Mimic Actions', 
    count: 11, 
    actionPrefix: 'action_' 
};
