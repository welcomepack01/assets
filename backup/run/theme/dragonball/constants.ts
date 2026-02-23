
import { LevelConfig, BossConfig } from '../../gameTypes';

export const COLORS = {
    // Environment
    sand: 0xFFF8B1, 
    oceanBlue: 0x2196F3,
    forestGreen: 0x228B22,
    
    // Level 1: Budokai Arena
    arenaFloor: 0xE0E0E0, 
    arenaWall: 0xF5F5F5,  
    arenaRoof: 0x111111,  
    arenaBase: 0x555555, 
    
    // Level 1 Old (kept for ref if needed, but unused)
    warmGreyLight: 0x999988, 
    warmGreyDark: 0x555544,
    warmRock: 0x888877,

    // Namek Colors
    namekGround: 0x68C2D3, 
    namekGrass: 0x34A0A4,  
    namekWater: 0x4EC058,  
    namekTreeTrunk: 0xEFEBE0, 
    namekTreeLeaf: 0x2E8B57,  
    namekSky: 0x82E0AA, 

    // Level 3: Lava/Dark Ruins
    l3FloorBrown: 0x1A0500, 
    l3Lava: 0xFF4500, 
    l3RailDark: 0x2E1505, 
    l3Sky: 0x220000,

    // Level 4: Buu Realm
    l4PinkFloor: 0x8B008B, 
    l4RockPink: 0x800080,  
    l4RockBlack: 0x111111, 
    l4RockWhite: 0xEEEEEE, 
    l4RockPurple: 0x9400D3, 
    l4Sky: 0x800080,

    // Flying Objects
    flyerStone: 0x666666,
    flyerOrb: 0xFF0000,
    flyerCandy: 0xFF69B4,

    // Characters & Details
    gokuOrange: 0xFF8C00,
    gokuBlue: 0x0000CD,
    skin: 0xFFE0BD,
    
    // Vegeta
    vegetaArmor: 0xF0F0F0,
    vegetaBlue: 0x1034A6,
    vegetaHair: 0x111111,
    vegetaPad: 0xD4AF37, 
    
    // Frieza
    friezaWhite: 0xFFFFFF,
    friezaPurple: 0x9400D3,
    friezaSkin: 0xE6E6FA,
    
    // Cell
    cellGreen: 0x32CD32,
    cellLightGreen: 0x90EE90,
    cellBlack: 0x050505,
    cellPurple: 0x800080,
    cellYellow: 0xFFD700,
    
    // Buu
    buuPink: 0xFF69B4,
    buuPants: 0xF5F5F5,
    buuVest: 0x111111,
    buuGold: 0xFFD700,
    buuCape: 0x800080,
    
    // Objects
    radarGreen: 0x32CD32,
    radarGrey: 0x808080,
    kikohoYellow: 0xFFFF00,
    kienzanOrange: 0xFFA500,
    dragonBall: 0xFF8C00,
    capsuleWhite: 0xFFFFFF,
    capsuleBlue: 0x00BFFF,
    podWhite: 0xEEEEEE,
    podRed: 0xCC0000,
};

export const LEVELS: Record<number, LevelConfig> = {
    0: { 
        id: 'tutorial', 
        name: 'SANDY PATH', 
        skyColor: 0x87CEEB, 
        road: { width: 12, textureKey: 'db_sand_detail', color: 0xFFFFFF, roughness: 1.0 }, 
        fence: { type: 'sand_rail', color: COLORS.sand }, 
        ambientLightColor: 0xffffff, 
        dirLightColor: 0xffffff 
    },
    1: { 
        id: 'level1', 
        name: 'BUDOKAI ARENA', 
        skyColor: 0x87CEEB, 
        road: { width: 14, textureKey: 'db_arena_tile', color: 0xFFFFFF, roughness: 0.6 }, 
        fence: { type: 'budokai_wall', color: COLORS.arenaWall }, 
        ambientLightColor: 0xFFFFFF, 
        dirLightColor: 0xFFFFFF 
    },
    2: { 
        id: 'level2', 
        name: 'NAMEK WEST', 
        skyColor: COLORS.namekSky, 
        // Darker color to prevent washout, lower roughness
        road: { width: 14, textureKey: 'db_namek_ground', color: 0xAAAAAA, roughness: 0.3 }, 
        fence: { type: 'namek_biomes', color: COLORS.namekGrass }, 
        ambientLightColor: 0xDDEEFF, 
        dirLightColor: 0xEEFFFF 
    },
    3: { 
        id: 'level3', 
        name: 'DARK RUINS', 
        skyColor: COLORS.l3Sky, 
        road: { width: 14, textureKey: 'db_lava_stone', color: 0xFFFFFF, roughness: 0.6 }, 
        fence: { type: 'euro_rail_dark', color: COLORS.l3RailDark }, 
        ambientLightColor: 0x884444, 
        dirLightColor: 0xFF8800 
    },
    4: { 
        id: 'level4', 
        name: 'BUU REALM', 
        skyColor: 0x4B0082, 
        road: { width: 14, textureKey: 'db_pink', color: 0xFFFFFF, roughness: 0.5 }, 
        fence: { type: 'pink_rocks', color: COLORS.l4RockPink }, 
        ambientLightColor: 0x884488, 
        dirLightColor: 0xAA66AA 
    }
};

export const BOSSES: Record<string, BossConfig> = {
    'boss1': { name: 'Vegeta', scale: 2.3, yOffset: 0, hover: false }, 
    'boss2': { name: 'Frieza', scale: 2.2, yOffset: 1.0, hover: true }, 
    'boss3': { name: 'Perfect Cell', scale: 2.8, yOffset: 0.2, hover: false }, 
    'boss4': { name: 'Majin Buu', scale: 2.5, yOffset: -0.1, hover: false }, // Grounded
};
