
import { LevelConfig, BossConfig } from '../../gameTypes';

export const COLORS = {
    // Level 0: ZPD Port / Harbor
    floorConcrete: 0x8899AA,
    safetyYellow: 0xFFD700,
    ropeTan: 0xC2B280,
    bollardIron: 0x2F4F4F,

    // Level 1: Downtown Streets
    asphaltDark: 0x1A1A1A,   // Much Darker Asphalt
    laneOrange: 0xFF6600,    // Bright Orange Lanes
    railRed: 0xD32F2F,       // Darker Red
    railWhite: 0xEEEEEE,

    // Level 2: Zootennial Gala (Pastel Pink/Bronze Theme)
    galaPink: 0xFFC1E3,      // Pastel Pink (Bright)
    galaDeepPink: 0xF06292,  // Deeper Pastel Pink
    galaBronze: 0xCD7F32,    // Bronze Point Color
    galaDarkBronze: 0x8D6E63,// Darker Bronze/Brown
    
    // Level 3: Honeymoon Lodge (Snowy)
    stoneGrey: 0x778899,
    lodgeNavy: 0x34495E,     // Navy Blue for Level 3 Railing (Not too dark)
    iceBlue: 0xAADDFF,
    snowWhite: 0xFFFFFF,
    
    // Level 4: Lynxley Manor
    manorBlue: 0x000033, 
    manorGold: 0xB8860B,
    velvetRed: 0x800020,

    // Characters
    bennyMint: 0x98FF98,
    dukeBrown: 0x8B4513,
    dukeShirt: 0xFF8C00,
    lynxGrey: 0x808080,
    lynxSuit: 0x111111,
    
    // Bosses
    vanWhite: 0xFFFFFF,
    snakeBlue: 0x4169E1,
    snakeScale: 0x000080,
    robertFur: 0xAAAAAA,
    miltonFur: 0xEEEEEE,
    miltonEye: 0xFFA500,
    
    // Objects
    musicBoxWood: 0x8B4513,
    donutPink: 0xFF69B4,
    plowYellow: 0xFFD700,
    syringeClear: 0xCCFFFF,
    droneBlack: 0x222222,
    droneLight: 0xFF0000,
};

export const LEVELS: Record<number, LevelConfig> = {
    0: { 
        id: 'tutorial', 
        name: 'ZPD HARBOR', 
        skyColor: 0x87CEEB, 
        road: { width: 11.9, textureKey: 'dock_concrete', color: 0xFFFFFF, roughness: 0.9 }, 
        fence: { type: 'tutorial_racing_rail', color: COLORS.bollardIron }, 
        ambientLightColor: 0xFFFFFF, 
        dirLightColor: 0xFFFFEE 
    },
    1: { 
        id: 'level1', 
        name: 'DOWNTOWN CHASE', 
        skyColor: 0xFFCC99, 
        road: { width: 11.9, textureKey: 'city_asphalt', color: 0xFFFFFF, roughness: 0.6 }, 
        fence: { type: 'city_guardrail', color: COLORS.railRed }, 
        ambientLightColor: 0xFFEEDD, 
        dirLightColor: 0xFF8844 
    },
    2: { 
        id: 'level2', 
        name: 'ZOOTENNIAL GALA', 
        skyColor: 0xF8BBD0, // Pastel Pink Sky
        road: { width: 13.6, textureKey: 'gala_marble', color: 0xFFFFFF, roughness: 0.2 }, 
        fence: { type: 'gala_pillars', color: COLORS.galaBronze }, 
        ambientLightColor: 0xFFEEFF, // Very bright pinkish ambient
        dirLightColor: 0xFFCCBC  // Peach Sunlight
    },
    3: { 
        id: 'level3', 
        name: 'HONEYMOON LODGE', 
        skyColor: 0x0D47A1, // Deep Blue
        road: { width: 11.9, textureKey: 'snowy_stone', color: 0xFFFFFF, roughness: 0.8 }, 
        fence: { type: 'stone_crest_fence', color: COLORS.lodgeNavy }, 
        ambientLightColor: 0x5C6BC0, // Indigo
        dirLightColor: 0xAABBFF 
    },
    4: { 
        id: 'level4', 
        name: 'LYNXLEY MANOR', 
        skyColor: 0x000011, 
        road: { width: 11.9, textureKey: 'manor_floor', color: 0xFFFFFF, roughness: 0.05 }, 
        fence: { type: 'ceremony_rail', color: COLORS.manorGold }, 
        ambientLightColor: 0x444488, 
        dirLightColor: 0x8888FF 
    }
};

export const BOSSES: Record<string, BossConfig> = {
    'boss1': { name: 'Snootly\'s Van', scale: 0.315, yOffset: 0, hover: false }, 
    'boss2': { name: 'Gary the Snake', scale: 3.0, yOffset: 0, hover: false }, 
    'boss3': { name: 'Robert Ringsley', scale: 2.2, yOffset: 0, hover: true }, 
    'boss4': { name: 'Milton Ringsley', scale: 4.0, yOffset: 0, hover: false }, 
};
