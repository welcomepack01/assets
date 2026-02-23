
import { LevelConfig, BossConfig } from '../../gameTypes';

export const COLORS = {
    dirtPath: 0xD2B48C, // Lighter Tan/Brown for Tutorial
    dirtSide: 0x8B4513, // Darker dirt for block sides
    grassTop: 0x5DBB63, // Vibrant Minecraft Grass
    grassDark: 0x2E7D32, // Darker Grass for Buffers
    stoneBrick: 0x777777,
    mossyBrick: 0x557755, // Much Lighter Mossy Brick
    cobble: 0x808080,
    stone: 0x999999,
    diamond: 0x33EBCC,
    blueIce: 0x7492FF,
    packedIce: 0xADD8E6,
    snow: 0xFFFFFF,
    blackstone: 0x2A2A2A,
    netherBrick: 0x442222,
    lava: 0xFF4500,
    endStone: 0xFFFFDD, // Much Brighter End Stone (Pale Cream)
    chorusPlant: 0xA980BC,
    chorusFlower: 0xDDAADD,
    obsidian: 0x141019,
    wood: 0x8B5A2B,
    leaf: 0x228B22,
    cactus: 0x55AA55,
    
    // Entity Colors
    pigPink: 0xF2AAB9,
    pigSnout: 0xDB8993,
    creeperGreen: 0x5BC35B, // Brighter Creeper Green
    creeperFace: 0x0D0D0D, // Almost Black
    zombieGreen: 0x698B41, // Olive Green Skin
    zombieShirt: 0x48797C, // Cyan/Teal Shirt
    zombiePants: 0x38358C, // Indigo/Purple Pants
    phantomBody: 0x2D334C, // Dark Blue/Grey
    phantomBone: 0xB6B6B6, // Bone Color
    phantomEye: 0x89E37C, // Glowing Green
    steveSkin: 0xE0AC69,
    iron: 0xE6E6FA,
    witherBlack: 0x151515,
    dragonBlack: 0x111111,
    dragonWing: 0x222222,
    
    // Skeleton & Enderman
    skeletonBone: 0xE3DAC9,
    skeletonGrey: 0xB0B0B0,
    endermanBlack: 0x0A0A0A, // Really Dark Grey
    endermanEye: 0xCC00FA,   // Neon Purple
    
    // Warden Colors
    wardenBody: 0x081D26, // Very Dark Blue/Green
    wardenTeal: 0x104030, // Darker, lower saturation green (Deep Sensor Green)
    wardenRibs: 0x42565E, 
    wardenHeart: 0x1D4D54,
};

export const LEVELS: Record<number, LevelConfig> = {
    0: { 
        id: 'tutorial', 
        name: 'OVERWORLD', 
        skyColor: 0x87CEEB, 
        road: { width: 10, textureKey: 'minecraft_path', color: 0xFFFFFF, roughness: 1.0 }, 
        fence: { type: 'oak_fence', color: COLORS.wood }, 
        ambientLightColor: 0xFFFFFF, 
        dirLightColor: 0xFFFFFF 
    },
    1: { 
        id: 'level1', 
        name: 'MOSSY RUINS', 
        skyColor: 0x8FBC8F, 
        road: { width: 10, textureKey: 'minecraft_mossy', color: 0x4CAF50, roughness: 0.9 }, // Lighter Green Base
        fence: { type: 'stone_wall', color: COLORS.mossyBrick }, 
        ambientLightColor: 0xDDFFDD, 
        dirLightColor: 0xFFFFEE 
    },
    2: { 
        id: 'level2', 
        name: 'ICE SPIKES', 
        skyColor: 0xDDEEFF, 
        road: { width: 10, textureKey: 'minecraft_ice', color: 0xF0F8FF, roughness: 0.5 }, 
        fence: { type: 'ice_wall', color: COLORS.packedIce }, 
        ambientLightColor: 0xEEEEFF, 
        dirLightColor: 0xFFFFFF 
    },
    3: { 
        id: 'level3', 
        name: 'NETHER FORTRESS', 
        skyColor: 0x330000, 
        road: { width: 10, textureKey: 'minecraft_bedrock', color: 0x333333, roughness: 0.2 }, 
        fence: { type: 'nether_fence', color: COLORS.netherBrick }, 
        ambientLightColor: 0xFF8888, 
        dirLightColor: 0xFF4400 
    },
    4: { 
        id: 'level4', 
        name: 'THE END', 
        skyColor: 0x110022, 
        road: { width: 14, textureKey: 'minecraft_endstone', color: COLORS.endStone, roughness: 0.9 }, 
        fence: { type: 'chorus_plant', color: COLORS.chorusPlant }, 
        ambientLightColor: 0xAA88AA, 
        dirLightColor: 0xCCAAFF 
    }
};

export const BOSSES: Record<string, BossConfig> = {
    'boss1': { name: 'Necromancer', scale: 2.2, yOffset: 0, hover: false }, 
    'boss2': { name: 'Warden', scale: 2.8, yOffset: 0.5, hover: false }, 
    'boss3': { name: 'Wither', scale: 2.5, yOffset: -0.8, hover: true },
    'boss4': { name: 'Ender Dragon', scale: 2.3, yOffset: 2.5, hover: true },
};
