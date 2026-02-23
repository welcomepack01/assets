
import { LevelConfig, BossConfig } from '../../gameTypes';

export const COLORS = {
    // Environment
    arendelleRoad: 0xA08C75, 
    arendelleFence: 0x4A6741, 
    
    snowWhite: 0xFFFFFF,
    snowShadow: 0xDDEEFF,
    forestGreen: 0x2F4F4F,
    forestWood: 0x5D4037,
    
    // Level 2: Sky Blue Ice
    iceClear: 0x87CEEB, 
    iceDark: 0x0077BE,  
    iceGlow: 0xE0FFFF,
    
    // Level 3: Warm Grey Castle (Updated from Neon Green)
    castleFloor: 0x110033, 
    castleWall: 0x220044,
    goldAccent: 0xADA098, // Warm Grey (Requested)
    neonPink: 0xFF00FF,   
    
    fjordIce: 0xE1F5FE, // Bright White-Blue
    fjordDark: 0x81D4FA,
    
    // Characters
    olafWhite: 0xFFFAFA,
    carrotOrange: 0xFF6600,
    stickBrown: 0x4E342E,
    
    wolfGrey: 0x757575,
    wolfDark: 0x212121,
    eyeYellow: 0xFFEB3B,
    
    guardRed: 0x800000,
    guardSilver: 0xC0C0C0,
    
    marshmallowBody: 0xE1F5FE,
    marshmallowSpike: 0x81D4FA,
    
    hansWhite: 0xF5F5F5,
    hansBlue: 0x1A237E,
    hansGold: 0xFFC107,
    
    dukeBlack: 0x111111,
    dukeSkin: 0xFFCCBC,
    
    // Magic/Effects
    magicBlue: 0x00BFFF,
    magicPurple: 0x9C27B0,
    windWhite: 0xEEFFFF,
};

export const LEVELS: Record<number, LevelConfig> = {
    0: { 
        id: 'tutorial', 
        name: 'ARENDELLE SQUARE', 
        skyColor: 0x87CEEB, 
        road: { width: 12.5, textureKey: 'frozen_brown_cobble', color: 0xFFFFFF, roughness: 0.8 }, 
        fence: { type: 'arendelle_fence', color: COLORS.arendelleFence }, 
        ambientLightColor: 0xFFFFFF, 
        dirLightColor: 0xFFF0E0 
    },
    1: { 
        id: 'level1', 
        name: 'SNOWY FOREST', 
        skyColor: 0xDDEEFF, 
        road: { width: 12.5, textureKey: 'frozen_snow', color: 0xFFFFFF, roughness: 1.0 }, 
        fence: { type: 'snow_trees', color: COLORS.forestGreen }, 
        // Enhanced Blue Tint for Quality
        ambientLightColor: 0xE6F2FF, 
        dirLightColor: 0xF0F8FF 
    },
    2: { 
        id: 'level2', 
        name: 'NORTH MOUNTAIN', 
        skyColor: 0x87CEEB, 
        road: { width: 14, textureKey: 'frozen_ice', color: 0xFFFFFF, roughness: 0.1 }, 
        fence: { type: 'ice_spires', color: COLORS.iceClear }, 
        // Stronger Blue Magic Glow
        ambientLightColor: 0xB0E0FF, 
        dirLightColor: 0xFFFFFF 
    },
    3: { 
        id: 'level3', 
        name: 'NEON CASTLE', 
        skyColor: 0x1A0033, 
        road: { width: 14, textureKey: 'frozen_castle_tile', color: 0xFFFFFF, roughness: 0.2 }, 
        fence: { type: 'castle_columns', color: COLORS.goldAccent }, 
        ambientLightColor: 0xAA00FF, 
        dirLightColor: 0x00FF00 
    },
    4: { 
        id: 'level4', 
        name: 'FROZEN FJORD', 
        skyColor: 0x87CEEB, 
        road: { width: 14, textureKey: 'frozen_cracked_ice', color: 0xFFFFFF, roughness: 0.6 }, 
        fence: { type: 'ice_debris', color: COLORS.iceDark }, 
        ambientLightColor: 0xDDEEFF, 
        dirLightColor: 0xFFA500 
    }
};

export const BOSSES: Record<string, BossConfig> = {
    'boss1': { name: 'Alpha Wolf', scale: 2.2, yOffset: 0, hover: false }, 
    'boss2': { name: 'Marshmallow', scale: 3.5, yOffset: 0, hover: false }, 
    'boss3': { name: 'Duke of Weselton', scale: 2.0, yOffset: 0, hover: false }, 
    'boss4': { name: 'Prince Hans', scale: 2.5, yOffset: 0, hover: false }, 
};
