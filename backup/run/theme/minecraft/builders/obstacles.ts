
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

// Jump: Variety of Minecraft Blocks
export const createJumpObstacle = () => {
    const group = new THREE.Group();
    
    // 8 blocks to cover the lane width
    const positions = [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5];
    // Select one random index to be the "Prime" Block (Flashing one)
    const primeIndex = Math.floor(Math.random() * positions.length);
    
    // Helper to add random "ore" specks to a face
    const addSpecks = (parent: THREE.Group, color: number, count: number = 4) => {
        for(let i=0; i<count; i++) {
            const size = 0.1 + Math.random() * 0.05;
            const x = (Math.random() - 0.5) * 0.7;
            const y = 0.45 + (Math.random() - 0.5) * 0.7;
            const z = 0.46; // Stick out slightly from front face
            createBox(size, size, 0.02, color, x, y, z, parent);
            // Also on top
            createBox(size, 0.02, size, color, x, 0.91, (Math.random() - 0.5) * 0.7, parent);
        }
    };

    const createBlockByType = (type: string) => {
        const block = new THREE.Group();
        
        switch(type) {
            case 'diamond_ore':
                createBox(0.9, 0.9, 0.9, 0x757575, 0, 0.45, 0, block); // Stone Base
                addSpecks(block, 0x00FFFF, 5); // Diamond Blue
                break;
            case 'emerald_ore':
                createBox(0.9, 0.9, 0.9, 0x757575, 0, 0.45, 0, block);
                addSpecks(block, 0x00FF00, 5); // Green
                break;
            case 'redstone_ore':
                createBox(0.9, 0.9, 0.9, 0x757575, 0, 0.45, 0, block);
                addSpecks(block, 0xFF0000, 6); // Red
                break;
            case 'coal_ore':
                createBox(0.9, 0.9, 0.9, 0x757575, 0, 0.45, 0, block);
                addSpecks(block, 0x111111, 6); // Black
                break;
            case 'gold_ore':
                createBox(0.9, 0.9, 0.9, 0x757575, 0, 0.45, 0, block);
                addSpecks(block, 0xFFD700, 5); // Gold
                break;
            case 'lapis_ore':
                createBox(0.9, 0.9, 0.9, 0x757575, 0, 0.45, 0, block);
                addSpecks(block, 0x0000AA, 6); // Deep Blue
                break;
            case 'pumpkin':
                createBox(0.9, 0.9, 0.9, 0xFF8800, 0, 0.45, 0, block); // Orange
                // Face
                createBox(0.2, 0.15, 0.05, 0x221100, -0.2, 0.55, 0.46, block); // Eye
                createBox(0.2, 0.15, 0.05, 0x221100, 0.2, 0.55, 0.46, block); // Eye
                createBox(0.5, 0.1, 0.05, 0x221100, 0, 0.3, 0.46, block); // Mouth
                createBox(0.1, 0.2, 0.1, 0x006400, 0, 0.95, 0, block); // Stem
                break;
            case 'ice':
                const iceMat = new THREE.MeshStandardMaterial({ 
                    color: 0xA5C6FF, 
                    transparent: true, 
                    opacity: 0.6, 
                    roughness: 0.1 
                });
                const ice = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), iceMat);
                ice.position.set(0, 0.45, 0);
                ice.castShadow = true;
                block.add(ice);
                // Inner core to make it look nicer
                const core = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({color: 0xFFFFFF, transparent: true, opacity: 0.3}));
                core.position.set(0, 0.45, 0);
                block.add(core);
                break;
            case 'magma':
                createBox(0.9, 0.9, 0.9, 0x550000, 0, 0.45, 0, block); // Dark Red Base
                // Emissive cracks
                for(let k=0; k<6; k++) {
                    const sx = (Math.random()-0.5)*0.8;
                    const sy = 0.45 + (Math.random()-0.5)*0.8;
                    const s = createBox(0.15, 0.15, 0.05, 0xFF4500, sx, sy, 0.46, block);
                    if (s.material instanceof THREE.MeshStandardMaterial) {
                        s.material.emissive = new THREE.Color(0xFF4500);
                        s.material.emissiveIntensity = 1.0;
                    }
                }
                break;
            case 'grass':
                createBox(0.9, 0.6, 0.9, 0x5C4033, 0, 0.3, 0, block); // Dirt Bottom
                createBox(0.9, 0.3, 0.9, 0x4CAF50, 0, 0.75, 0, block); // Green Top
                break;
            case 'cobble':
                createBox(0.9, 0.9, 0.9, 0x555555, 0, 0.45, 0, block);
                addSpecks(block, 0x333333, 8); // Darker grey stones
                break;
            case 'tnt':
            default:
                createBox(0.9, 0.9, 0.9, 0xDB2E2E, 0, 0.45, 0, block); // Red
                createBox(0.92, 0.28, 0.92, 0xFFFFFF, 0, 0.45, 0, block); // Band
                // Simple TNT Text
                createBox(0.1, 0.15, 0.05, 0x000000, -0.15, 0.45, 0.47, block);
                createBox(0.1, 0.15, 0.05, 0x000000, 0.0, 0.45, 0.47, block);
                createBox(0.1, 0.15, 0.05, 0x000000, 0.15, 0.45, 0.47, block);
                createBox(0.4, 0.05, 0.4, 0x888888, 0, 0.925, 0, block); // Cap
                break;
        }
        return block;
    };

    const blockTypes = [
        'diamond_ore', 'emerald_ore', 'redstone_ore', 'coal_ore', 
        'gold_ore', 'lapis_ore', 'pumpkin', 'ice', 'magma', 
        'grass', 'cobble'
    ];

    positions.forEach((x, idx) => {
        let type;
        // Logic: ONLY the "Prime" block is TNT. Others are random stones/ores.
        if (idx === primeIndex) {
            type = 'tnt';
        } else {
            type = blockTypes[Math.floor(Math.random() * blockTypes.length)];
        }

        const block = createBlockByType(type);
        
        // Assign name for animator (Generic 'JumpBlock' plus specific tag for Prime)
        // Animator will flash 'JumpBlock_Prime'
        block.name = (idx === primeIndex) ? 'JumpBlock_Prime' : 'JumpBlock'; 
        
        block.position.set(x, 0, 0);
        group.add(block);
    });

    castShadows(group); 
    return group;
};

// Crouch: Floating Ghasts (5 side by side)
export const createCrouchObstacle = (heightScale) => {
    const group = new THREE.Group();
    // 5 Ghasts spanning width
    [-5, -2.5, 0, 2.5, 5].forEach(x => {
        const ghast = new THREE.Group();
        ghast.name = 'Ghast';
        
        const white = 0xF0F0F0;
        const grey = 0xAAAAAA;
        const red = 0xFF0000; // Eyes/Mouth
        const black = 0x111111;

        // Body: 1.2 cube (slightly larger than standard block)
        createBox(1.2, 1.2, 1.2, white, 0, 0, 0, ghast);

        // Face (Front is +Z)
        const faceZ = 0.61;
        // Eyes (Red, angry/attacking)
        createBox(0.35, 0.12, 0.05, red, -0.3, 0.2, faceZ, ghast); // Left
        createBox(0.35, 0.12, 0.05, red, 0.3, 0.2, faceZ, ghast);  // Right
        
        // Mouth (Open O shape for shooting)
        createBox(0.25, 0.25, 0.05, black, 0, -0.2, faceZ, ghast);
        
        // Tears (Grey streaks under eyes)
        createBox(0.05, 0.4, 0.02, grey, -0.3, -0.2, faceZ, ghast);
        createBox(0.05, 0.4, 0.02, grey, 0.3, -0.2, faceZ, ghast);

        // Tentacles (9 hanging down from bottom)
        const tentacleGroup = new THREE.Group();
        tentacleGroup.name = 'Tentacles';
        tentacleGroup.position.set(0, -0.6, 0);
        ghast.add(tentacleGroup);

        const positions = [
            [-0.4, -0.4], [0, -0.4], [0.4, -0.4],
            [-0.4, 0],    [0, 0],    [0.4, 0],
            [-0.4, 0.4],  [0, 0.4],  [0.4, 0.4]
        ];

        positions.forEach(([tx, tz]) => {
            const len = 0.6 + Math.random() * 0.4; // Random length
            createBox(0.15, len, 0.15, white, tx, -len/2, tz, tentacleGroup);
        });

        // Increase scale by 15% (1.25)
        ghast.scale.set(1.25, 1.25, 1.25);

        // Position: High enough to walk under tentacles ONLY if crouching
        ghast.position.set(x, 3.45, 0); 
        
        group.add(ghast);
    });
    castShadows(group); return group;
};

// Big Jump: Detailed Chests and Functional Blocks
export const createBigJumpObstacle = () => {
    const group = new THREE.Group();
    const blocksGroup = new THREE.Group(); 
    blocksGroup.name = 'ChestWall'; // Reuse name for animator compatibility

    const createBigBlock = (type: string, x: number, y: number, z: number, s: number) => {
        const b = new THREE.Group();
        b.position.set(x, y, z);
        b.scale.set(s, s, s);

        if (type === 'chest') {
            const chestColor = 0x9B6B3D; // Distinct chest orange-brown
            const darkLine = 0x3E2723;
            const latch = 0xCCCCCC;

            // Main Body (Scaled up to 1.0 from 0.88 to match other blocks)
            createBox(1.0, 1.0, 1.0, chestColor, 0, 0.5, 0, b);
            
            // Lid Separation Line (Scaled up)
            createBox(1.02, 0.05, 1.02, darkLine, 0, 0.7, 0, b); 
            
            // Silver Latch
            createBox(0.12, 0.3, 0.05, latch, 0, 0.6, 0.51, b);
            
            // Borders / Edges (Scaled up)
            createBox(0.06, 1.0, 0.06, darkLine, -0.5, 0.5, 0.5, b); // FL
            createBox(0.06, 1.0, 0.06, darkLine, 0.5, 0.5, 0.5, b); // FR
            createBox(0.06, 1.0, 0.06, darkLine, -0.5, 0.5, -0.5, b); // BL
            createBox(0.06, 1.0, 0.06, darkLine, 0.5, 0.5, -0.5, b); // BR
            
            // Wood Grain Pixels
            createBox(0.12, 0.12, 0.02, 0x6B4728, -0.2, 0.3, 0.51, b);
            createBox(0.12, 0.12, 0.02, 0x6B4728, 0.3, 0.7, 0.51, b);
            createBox(0.12, 0.12, 0.02, 0x6B4728, -0.25, 0.8, 0.51, b);
        }
        else if (type === 'crafting_table') {
            // Base
            createBox(1, 1, 1, 0x785334, 0, 0.5, 0, b);
            // Top Grid (Lighter wood color)
            createBox(0.9, 0.05, 0.9, 0xA0754D, 0, 1.0, 0, b);
            
            // Tools Silhouettes on side (Hammer/Saw shapes)
            createBox(0.3, 0.3, 0.05, 0x3E2723, 0, 0.5, 0.51, b); // Hammer head
            createBox(0.1, 0.4, 0.05, 0x5D4037, 0, 0.3, 0.51, b); // Handle
            
            createBox(0.2, 0.1, 0.05, 0x333333, -0.3, 0.7, 0.51, b); // Saw blade
            createBox(0.1, 0.3, 0.05, 0x3E2723, -0.3, 0.5, 0.51, b); // Saw handle
            
            // Corner reinforcements
            createBox(0.2, 1.0, 0.2, 0x3E2723, -0.4, 0.5, 0.4, b);
            createBox(0.2, 1.0, 0.2, 0x3E2723, 0.4, 0.5, 0.4, b);
        }
        else if (type === 'furnace') {
            // Cobble Texture Base
            createBox(1, 1, 1, 0x777777, 0, 0.5, 0, b);
            
            // Front Face (Black opening)
            createBox(0.7, 0.1, 0.05, 0x222222, 0, 0.8, 0.51, b); // Top slit
            createBox(0.6, 0.4, 0.05, 0x111111, 0, 0.4, 0.51, b); // Oven mouth
            
            // Fire inside (Emissive)
            const fire = createBox(0.4, 0.2, 0.05, 0xFF4500, 0, 0.35, 0.52, b); 
            if (fire.material instanceof THREE.MeshStandardMaterial) {
                fire.material.emissive = new THREE.Color(0xFF4500);
                fire.material.emissiveIntensity = 1.0;
            }
            
            // Stones on corners for texture
            createBox(0.15, 0.15, 0.05, 0x555555, -0.35, 0.1, 0.51, b);
            createBox(0.15, 0.15, 0.05, 0x555555, 0.35, 0.85, 0.51, b);
            createBox(0.15, 0.15, 0.05, 0x555555, 0.35, 0.1, 0.51, b);
            createBox(0.15, 0.15, 0.05, 0x555555, -0.35, 0.85, 0.51, b);
        }
        else if (type === 'bookshelf') {
            // Wood Body
            createBox(1, 1, 1, 0x6B4F2B, 0, 0.5, 0, b);
            // Front Face - Shelves
            createBox(0.9, 0.05, 0.05, 0x4B3621, 0, 0.25, 0.5, b);
            createBox(0.9, 0.05, 0.05, 0x4B3621, 0, 0.5, 0.5, b);
            createBox(0.9, 0.05, 0.05, 0x4B3621, 0, 0.75, 0.5, b);
            
            // Random Books
            const bookColors = [0xAA0000, 0x0000AA, 0x00AA00, 0xDDAA00, 0x442200];
            const shelfY = [0.125, 0.375, 0.625, 0.875];
            shelfY.forEach(sy => {
                const bookCount = 3 + Math.floor(Math.random() * 3);
                for(let i=0; i<bookCount; i++) {
                    const bx = (Math.random() - 0.5) * 0.8;
                    const c = bookColors[Math.floor(Math.random() * bookColors.length)];
                    createBox(0.1 + Math.random()*0.05, 0.15, 0.06, c, bx, sy, 0.5, b);
                }
            });
        }
        else if (type === 'tnt_block') {
             createBox(1, 1, 1, 0xDB2E2E, 0, 0.5, 0, b); // Red
             createBox(1.02, 0.3, 1.02, 0xFFFFFF, 0, 0.5, 0, b); // Band
             
             // 'TNT' Text simulation
             // T
             createBox(0.05, 0.2, 0.05, 0x000000, -0.2, 0.5, 0.52, b); 
             createBox(0.15, 0.05, 0.05, 0x000000, -0.2, 0.6, 0.52, b); 
             // N
             createBox(0.05, 0.2, 0.05, 0x000000, -0.05, 0.5, 0.52, b); 
             createBox(0.05, 0.2, 0.05, 0x000000, 0.05, 0.5, 0.52, b); 
             createBox(0.1, 0.05, 0.05, 0x000000, 0, 0.55, 0.52, b).rotation.z = -0.5;
             // T
             createBox(0.05, 0.2, 0.05, 0x000000, 0.2, 0.5, 0.52, b); 
             createBox(0.15, 0.05, 0.05, 0x000000, 0.2, 0.6, 0.52, b); 
             
             // Fuse
             createBox(0.2, 0.1, 0.2, 0x888888, 0, 1.05, 0, b);
        }
        
        blocksGroup.add(b);
    };

    // Include Chest twice to increase frequency
    const types = ['chest', 'chest', 'crafting_table', 'furnace', 'bookshelf', 'tnt_block'];
    
    // Scale reduced to 2.2 (matching the smallest chest visual size)
    const scale = 2.2; 
    // Spacing increased to 2.8 to add gaps
    const spacing = 2.8; 

    // Create 3 random big blocks side-by-side
    createBigBlock(types[Math.floor(Math.random()*types.length)], -spacing, 0, 0, scale);
    createBigBlock(types[Math.floor(Math.random()*types.length)], 0, 0, 0, scale);
    createBigBlock(types[Math.floor(Math.random()*types.length)], spacing, 0, 0, scale);

    group.add(blocksGroup);
    castShadows(group); 
    return group;
};
