
import { LevelConfig, BossConfig } from '../../gameTypes';

export const COLORS = {
    // Environment - BRIGHTENED
    floorTutorial: 0xCCCCCC, // Lighter Concrete
    bufferTutorial: 0xFFD700, 
    
    floorL1: 0x90A0B0, // Lighter Slate/Steel
    bufferL1: 0x5D4037, 
    
    // Updated Road Colors (Brighter)
    floorL2: 0xFFFFFF, // Pure White to let Dark Marble texture show contrast
    bufferL2: 0x2E3B2E, 
    
    floorL3: 0x5566AA, // Brighter Tech Blue (Was 0x222244)
    bufferL3: 0x6A0DAD, 
    
    floorL4: 0x996666, // Lighter Scorched Earth (Was 0x553333)
    bufferL4: 0xFF4500, 

    // Entities
    ceramicWhite: 0xFFFFFF,
    skin: 0xE0AC69,
    suitBlack: 0x111111,
    tieRed: 0xFF0000,
    speakerDark: 0x222222,
    
    // Specifics
    laserBlue: 0x00FFFF,
    laserRed: 0xFF0000,
    laserYellow: 0xFFFF00,
    parasiteRed: 0x880000,
    plungerBlack: 0x111111,
    
    gManSkin: 0xDDAA88,
    gManEye: 0xFFFF00,
    gManArmor: 0x444444,
    
    tvScreenGrey: 0x1a1a1a,
    tvStatic: 0xE0E0E0,
    tvCoreRed: 0xFF0000,
    tvBladePurple: 0x9900FF,
    
    // Boss 3 (Astro) - Neon Update
    astroHelmet: 0x222222,
    astroMetal: 0x333333,
    astroNeonPink: 0xFF00CC,
    astroNeonBlue: 0x00E5FF,
    
    // Boss 4 (Emperor) - Copper Update
    copper: 0xB87333,     // Main Copper
    darkCopper: 0x804020, // Darker Copper/Bronze
    lava: 0xFF4500,
};

export const LEVELS: Record<number, LevelConfig> = {
    0: { 
        id: 'tutorial', 
        name: 'TRAINING FACILITY', 
        skyColor: 0xDDDDDD, 
        road: { width: 14, textureKey: 'skibidi_floor_tut', color: COLORS.floorTutorial, roughness: 0.4 }, 
        fence: { type: 'cctv_post', color: 0x888888 }, 
        ambientLightColor: 0xFFFFFF, 
        dirLightColor: 0xFFFFFF 
    },
    1: { 
        id: 'level1', 
        name: 'INDUSTRIAL ZONE', 
        skyColor: 0x778899, 
        road: { width: 14, textureKey: 'skibidi_floor_l1', color: COLORS.floorL1, roughness: 0.6 }, 
        fence: { type: 'industrial_pipes', color: 0x555555 }, 
        ambientLightColor: 0xEEEEEE, 
        dirLightColor: 0xAABBDD 
    },
    2: { 
        id: 'level2', 
        name: 'OUTSKIRTS', 
        skyColor: 0x8B4513, 
        road: { width: 14, textureKey: 'skibidi_floor_l2', color: COLORS.floorL2, roughness: 0.8 }, 
        fence: { type: 'street_lamps', color: 0x333333 }, 
        ambientLightColor: 0xEEEEDD, 
        dirLightColor: 0xFFA500 
    },
    3: { 
        id: 'level3', 
        name: 'TECH HQ', 
        skyColor: 0x000033, 
        road: { width: 14, textureKey: 'skibidi_floor_l3', color: COLORS.floorL3, roughness: 0.3 }, 
        fence: { type: 'holograms', color: 0x00FFFF }, 
        ambientLightColor: 0x6644AA, 
        dirLightColor: 0x00FFFF 
    },
    4: { 
        id: 'level4', 
        name: 'RUINED CITY', 
        skyColor: 0x330000, 
        road: { width: 14, textureKey: 'skibidi_floor_l4', color: COLORS.floorL4, roughness: 0.8 }, 
        fence: { type: 'debris_rebar', color: 0x442222 }, 
        ambientLightColor: 0xAA6666, 
        dirLightColor: 0xFF4400 
    }
};

export const BOSSES: Record<string, BossConfig> = {
    'boss1': { name: 'G-Man 4.0', scale: 3.2, yOffset: 1.5, hover: true }, 
    'boss2': { name: 'Titan TV Man', scale: 3.5, yOffset: 1.2, hover: false },
    'boss3': { name: 'Astro Detainer', scale: 3.2, yOffset: 2.5, hover: true },
    'boss4': { name: 'Copper Emperor', scale: 3.6, yOffset: 1.0, hover: false }, 
};
