
import { LevelConfig, BossConfig } from '../../gameTypes';

export const COLORS = {
    // Environment - Colors updated to match reference image
    // Level 1: White Marble
    l1Floor: 0xE8E8E8, 
    l1Side: 0xC0C0C0,
    l1Fence: 0x8B5A2B, // Wood

    // Level 2: Dirt & Grass
    l2Floor: 0x5D4037, // Dark Dirt
    l2Side: 0x221111,  // Darker foundation for Level 2
    l2GrassTop: 0x2E3B2E, // Darker Grass
    l2GrassSide: 0x1A1A1A,
    l2Fence: 0x111111, // CHANGED: Black Fence

    // Level 3: Obsidian/Neon
    l3Floor: 0x050505, // Pure Black Base
    l3Side: 0x000000,
    l3Neon: 0x00FFFF, // Cyan Glow
    l3Fence: 0x88CCFF, // Glassy

    // Level 4: Cracked Stone
    l4Floor: 0x808080, 
    l4Side: 0x555555,
    l4Cracks: 0x222222,
    l4Fence: 0x4A3728,

    // Level 0: London Street / Platform
    l0Floor: 0xAAAAAA,
    l0Side: 0x555555,
    lampIron: 0x1A1A1A,
    lampGlass: 0xFFE066,
    benchWood: 0x8B5A2B,
    benchIron: 0x222222,

    // New Level 1: European Carpet & Stone
    carpetRed: 0x8B0000,
    carpetGold: 0xFFD700,
    stoneRail: 0xDDDDDD,
    stonePillar: 0xBBBBBB,

    // Entities (Kept same)
    skin: 0xFFE0BD,
    paleSkin: 0xFFF0F0,
    robeBlack: 0x151515,
    robeGrey: 0x444444,
    
    gryffindorRed: 0x740001,
    gryffindorGold: 0xD3A625,
    
    spellRed: 0xFF0000,
    spellGreen: 0x00FF00,

    // Obstacles (Added)
    mandrakePot: 0x8B4513,
    mandrakeGreen: 0x228B22,
    keySilver: 0xC0C0C0,
    keyGold: 0xFFD700,
    willowBrown: 0x4E342E,
};

export const LEVELS: Record<number, LevelConfig> = {
    0: { 
        id: 'tutorial', 
        name: 'LONDON STREET', 
        skyColor: 0x87CEEB, 
        // Updated: Level 0 now uses Gray Checkerboard (was on L1)
        road: { width: 14, textureKey: 'hp_checker_gray', color: 0xFFFFFF, roughness: 0.8 }, 
        fence: { type: 'london_decor', color: COLORS.lampIron }, 
        ambientLightColor: 0xFFFFFF, 
        dirLightColor: 0xFFEebb 
    },
    1: { 
        id: 'level1', 
        name: 'STONE HALL', 
        skyColor: 0x87CEEB, 
        // Updated: Level 1 now uses Stone Floor + Carpet
        road: { width: 14, textureKey: 'hp_carpet_red', color: 0xFFFFFF, roughness: 0.6 }, 
        fence: { type: 'euro_stone', color: COLORS.stoneRail }, 
        ambientLightColor: 0xFFFFFF, 
        dirLightColor: 0xFFEebb 
    },
    2: { 
        id: 'level2', 
        name: 'DARK FOREST', 
        skyColor: 0x1A2B25, 
        // Updated: Level 2 now uses Dirt with Gravel (No Carpet)
        road: { width: 14, textureKey: 'hp_dirt', color: 0xFFFFFF, roughness: 1.0 }, 
        fence: { type: 'wood_fence_grass', color: COLORS.l2Fence }, 
        ambientLightColor: 0x99AA99, 
        dirLightColor: 0xFFDDAA 
    },
    3: { 
        id: 'level3', 
        name: 'MINISTRY HALL', 
        skyColor: 0x000022, 
        road: { width: 14, textureKey: 'hp_obsidian_neon', color: 0xFFFFFF, roughness: 0.2 }, 
        fence: { type: 'neon_glass', color: COLORS.l3Fence }, 
        ambientLightColor: 0x444455, 
        dirLightColor: 0x00FFFF 
    },
    4: { 
        id: 'level4', 
        name: 'CRACKED RUINS', 
        skyColor: 0x333333, 
        road: { width: 14, textureKey: 'hp_cracked', color: 0xFFFFFF, roughness: 0.9 }, 
        fence: { type: 'ruined_fence', color: COLORS.l4Fence }, 
        ambientLightColor: 0x888888, 
        dirLightColor: 0xFFAAAA 
    }
};

export const BOSSES: Record<string, BossConfig> = {
    'boss1': { name: 'Peter Pettigrew', scale: 2.2, yOffset: 0, hover: false }, 
    'boss2': { name: 'Bellatrix', scale: 2.3, yOffset: 0, hover: false }, 
    'boss3': { name: 'Barty Crouch Jr', scale: 2.4, yOffset: 0, hover: false }, 
    'boss4': { name: 'Lord Voldemort', scale: 3.5, yOffset: 0, hover: true }, 
};
