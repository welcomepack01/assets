
import { LevelConfig, BossConfig } from '../../gameTypes';

export const COLORS = {
    red: 0xE52521,      // Mario Red
    green: 0x43B047,    // Pipe Green
    blue: 0x009BEF,     // Sky Blue
    brown: 0x8B4513,    // Brick Brown
    
    // Character Specifics
    goombaHead: 0x8B4513, // SaddleBrown (Darker for voxel look)
    goombaTan: 0xFFE4B5,  // Moccasin (Face)
    goombaFeet: 0x111111, // Almost Black
    
    toadCapWhite: 0xF5F5F5,
    toadCapRed: 0xFF0000,
    toadSkin: 0xFFCC99,
    toadVest: 0x1E90FF,
    toadGold: 0xFFD700,
    toadShoe: 0x8B4513,
    
    luigiGreen: 0x00AA00,
    luigiBlue: 0x2233AA,
    luigiBeard: 0x222222,

    koopaYellow: 0xFFD700, // Golden Yellow
    koopaGreen: 0x32CD32,
    koopaRed: 0xFF4500,
    koopaWhite: 0xFFFFFF,
    
    // Boss Specifics
    boomBoomSkin: 0xFFA500, // Orange
    boomBoomBelly: 0xFFE4B5,
    boomBoomShell: 0xD2691E, // Chocolate
    
    kamekBlue: 0x1E90FF, // DodgerBlue
    kamekBeak: 0xFFD700,
    
    bowserSkin: 0xFFC107, // Amber/Orange - Matches reference
    bowserGreen: 0x008000, // Darker Green
    bowserHair: 0xFF4500, // OrangeRed
    bowserSpike: 0xFFFFE0, // LightYellow
    
    // Environment
    sky: 0x87CEEB,
    gold: 0xFFD700,
    white: 0xFFFFFF,
    black: 0x111111,
    grey: 0x808080,
    lava: 0xFF4500,
    
    shellGreen: 0x00AA00,
    shellRed: 0xD32F2F,

    // Legacy mappings for compatibility if needed
    dirtBrown: 0x8B6914,
    grassGreen: 0x43B047,
    questionBlockGold: 0xFFD700,
    warpPipeGreen: 0x43B047,
    brickBrown: 0x8B4513,
    piranhaRed: 0xE52521,
    sandGold: 0xD4A574,
    sandstoneOchre: 0xC4A35A,
    pokeyYellow: 0xFFD700,
    iceBlue: 0x87CEEB,
    snowmanWhite: 0xFFFFFF,
    castleFloor: 0x2D2D2D,
    lavaOrange: 0xFF4500,
    pillarGrey: 0x808080,
    bulletBillBlack: 0x111111,
    coinGold: 0xFFD700,
    skyBlue: 0x87CEEB,
};

export const LEVELS: Record<number, LevelConfig> = {
    0: { // Tutorial
        id: 'tutorial',
        name: 'TUTORIAL',
        skyColor: 0x87CEEB,
        road: { width: 14, textureKey: 'tutorial_dirt', color: 0xffffff, roughness: 1.0 },
        fence: { type: 'tutorial_nature', color: 0x64C832 }, // Bright Green Buffer
        ambientLightColor: 0xffffff,
        dirLightColor: 0xffffff
    },
    1: { // Mushroom Hills
        id: 'level1',
        name: 'MUSHROOM HILLS',
        skyColor: 0x87CEEB,
        // CHANGED: Use new asphalt texture
        road: { width: 14, textureKey: 'level1_asphalt', color: 0xffffff, roughness: 0.8 },
        fence: { type: 'mario_hills', color: 0x00B400 }, // Vivid Green Buffer
        ambientLightColor: 0xffffff,
        dirLightColor: 0xffffff
    },
    2: { // Level 2: Now SKY GARDEN (Was Level 3)
        id: 'level2',
        name: 'SKY GARDEN',
        skyColor: 0xB0E0E6,
        road: { width: 14, textureKey: 'mario_cloud_road', color: 0xffffff, roughness: 0.2 },
        fence: { type: 'sky_garden', color: 0xC8E6FF }, // Pale Blue Fog Buffer
        ambientLightColor: 0xffffff,
        dirLightColor: 0xFFFFFF
    },
    3: { // Level 3: Now UNDERGROUND CAVE (Was Level 2)
        id: 'level3',
        name: 'UNDERGROUND CAVE',
        skyColor: 0x000000,
        road: { width: 14, textureKey: 'mario_brick_blue', color: 0xffffff, roughness: 0.5 },
        fence: { type: 'underground_cave', color: 0x141E32 }, // Dark Blue Rock Buffer
        ambientLightColor: 0x444444,
        dirLightColor: 0xAAAAAA
    },
    4: { // Bowser Castle
        id: 'level4',
        name: 'BOWSER CASTLE',
        skyColor: 0x220000,
        road: { width: 18, textureKey: 'mario_castle_floor', color: 0xffffff, roughness: 0.4 },
        fence: { type: 'bowser_castle', color: 0xDC3200 }, // Red Lava Buffer
        ambientLightColor: 0x550000,
        dirLightColor: 0xFF0000
    }
};

export const BOSSES: Record<string, BossConfig> = {
    // Boss 1: Mini Bowser (Geometry bottom approx -0.85, Scale 1.25 -> Lift ~1.1)
    'boss1': { name: 'Mini Bowser', scale: 1.25, yOffset: 1.1, hover: false }, 
    
    // Boss 2: NOW KAMEK (Was Boom Boom) - Uses Kamek config
    'boss2': { name: 'Kamek', scale: 4.0, yOffset: 2.0, hover: false },
    
    // Boss 3: NOW BOOM BOOM (Was Kamek) - Uses Boom Boom config
    'boss3': { name: 'Boom Boom', scale: 4.5, yOffset: 1.3, hover: false }, 
    
    // Boss 4: Giant Bowser (Geometry bottom approx -0.85, Scale 3.75 -> Lift ~3.2)
    'boss4': { name: 'Bowser', scale: 3.75, yOffset: 3.2, hover: false },
};

export const CHEERS = {
    INTRO: [
        "HERE WE GO!",
        "LET'S-A GO!",
        "IT'S GAME TIME!"
    ],
    TUTORIAL_END: [
        "WATCH OUT!",
        "A BOSS IS COMING!",
        "GET READY TO FIGHT!"
    ],
    PHASE_1_CLEAR: [
        "NICE ONE!",
        "A BIGGER ONE COMES!",
        "STAY STRONG!"
    ],
    PHASE_2_CLEAR: [
        "INCREDIBLE!",
        "THE LEADER IS NEXT!",
        "DON'T BACK DOWN!"
    ],
    PHASE_3_CLEAR: [
        "OH NO... IT'S HIM!",
        "THE FINAL BATTLE!",
        "GIVE IT EVERYTHING!"
    ],
    VICTORY: [
        "YOU SAVED THE DAY!",
        "WAHOO! YOU DID IT!",
        "SUPER HERO!"
    ]
};
