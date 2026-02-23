
import * as THREE from 'three';
import { createDetailedTexture } from '../../../utils/gameUtils';
import { createBox, castShadows } from '../utils';
import { LevelConfig, TextureMap } from '../../../gameTypes';
import { COLORS } from '../constants';

export const createPlayerMesh = () => new THREE.Group(); 

export const createSkis = () => ({ left: new THREE.Group(), right: new THREE.Group() });

export const createWallBlockade = (width: number, height: number, texture?: THREE.Texture) => {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 1), 
        new THREE.MeshStandardMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x888888, 
            roughness: 0.9 
        })
    );
    mesh.castShadow = true; mesh.receiveShadow = true; 
    mesh.position.y = height / 2; 
    group.add(mesh);
    return group;
};

export const createMirrorWall = (width: number, height: number, texture?: THREE.Texture) => {
    const group = new THREE.Group();
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.5, height + 0.5, 0.5), 
        new THREE.MeshStandardMaterial({ color: 0x120317, roughness: 0.2 })
    );
    frame.position.y = height / 2; frame.castShadow = true; frame.receiveShadow = true; 
    group.add(frame);
    
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height), 
        new THREE.MeshBasicMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x444444,
            transparent: true,
            opacity: 0.8
        })
    );
    plane.position.set(0, height / 2, 0.26); 
    group.add(plane);
    return group;
};

export const decorateChunk = (group: THREE.Group, levelConfig: LevelConfig, roadWidth: number, chunkDepth: number, textures: TextureMap) => {
    const edgeX = roadWidth / 2;
    const type = levelConfig.fence.type;
    
    // --- 1. TUTORIAL: Dirt Path with Darker Pixelated Grass Banks ---
    if (type === 'oak_fence') {
        const bankWidth = 2.5;
        const bankHeight = 0.5;
        
        // Use darker pixelated grass texture
        const grassTex = textures['minecraft_grass_dark']; 
        const grassMat = new THREE.MeshStandardMaterial({ 
            map: grassTex || null,
            color: grassTex ? 0xFFFFFF : COLORS.grassDark 
        });
        
        const blockMaterials = [
            grassMat, grassMat, grassMat, grassMat, grassMat, grassMat
        ];

        const bankL = new THREE.Mesh(new THREE.BoxGeometry(bankWidth, bankHeight, chunkDepth), blockMaterials);
        bankL.position.set(-edgeX - bankWidth/2, bankHeight/2 - 0.1, 0); 
        bankL.receiveShadow = true;
        group.add(bankL);

        const bankR = new THREE.Mesh(new THREE.BoxGeometry(bankWidth, bankHeight, chunkDepth), blockMaterials);
        bankR.position.set(edgeX + bankWidth/2, bankHeight/2 - 0.1, 0);
        bankR.receiveShadow = true;
        group.add(bankR);

        // Oak Fences on top of the banks
        const fenceH = 1.2;
        const fenceY = bankHeight + fenceH/2 - 0.1;
        const fenceX = edgeX + 0.5; 

        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 1.8) {
            createBox(0.25, fenceH, 0.25, COLORS.wood, -fenceX, fenceY, z, group);
            createBox(0.25, fenceH, 0.25, COLORS.wood, fenceX, fenceY, z, group);
            if (z + 1.8 < chunkDepth/2) {
                const midZ = z + 0.9;
                createBox(0.15, 0.15, 1.8, COLORS.wood, -fenceX, fenceY + 0.3, midZ, group);
                createBox(0.15, 0.15, 1.8, COLORS.wood, fenceX, fenceY + 0.3, midZ, group);
                createBox(0.15, 0.15, 1.8, COLORS.wood, -fenceX, fenceY - 0.3, midZ, group);
                createBox(0.15, 0.15, 1.8, COLORS.wood, fenceX, fenceY - 0.3, midZ, group);
            }
        }
    }
    // --- 2. LEVEL 1: European Style Stone Railing (BRIGHTENED) ---
    else if (type === 'stone_wall') {
        const railHeight = 1.0; 
        const pillarWidth = 0.6;
        const pillarSpacing = 4.0;
        
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x99AA99, roughness: 0.8 });
        const pillarColor = 0x778877;
        const capColor = 0x667766;
        
        const curbL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, chunkDepth), stoneMat);
        curbL.position.set(-edgeX - 0.25, 0.15, 0); group.add(curbL); castShadows(curbL);
        
        const curbR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, chunkDepth), stoneMat);
        curbR.position.set(edgeX + 0.25, 0.15, 0); group.add(curbR); castShadows(curbR);

        for(let z = -chunkDepth/2; z < chunkDepth/2; z += pillarSpacing) {
            createBox(pillarWidth, railHeight, pillarWidth, pillarColor, -edgeX - 0.25, railHeight/2, z, group);
            createBox(pillarWidth, railHeight, pillarWidth, pillarColor, edgeX + 0.25, railHeight/2, z, group);
            
            createBox(pillarWidth + 0.2, 0.15, pillarWidth + 0.2, capColor, -edgeX - 0.25, railHeight, z, group);
            createBox(pillarWidth + 0.2, 0.15, pillarWidth + 0.2, capColor, edgeX + 0.25, railHeight, z, group);

            if (z + pillarSpacing < chunkDepth/2) {
                const midZ = z + pillarSpacing/2;
                const railLen = pillarSpacing - 0.4;
                createBox(0.25, 0.2, railLen, stoneMat.color.getHex(), -edgeX - 0.25, railHeight - 0.1, midZ, group);
                createBox(0.25, 0.2, railLen, stoneMat.color.getHex(), edgeX + 0.25, railHeight - 0.1, midZ, group);
                
                const balusterCount = 2;
                const balStep = railLen / (balusterCount + 1);
                for(let b=1; b<=balusterCount; b++) {
                    const bz = z + b * balStep;
                    createBox(0.15, 0.6, 0.15, stoneMat.color.getHex(), -edgeX - 0.25, 0.45, bz, group);
                    createBox(0.15, 0.6, 0.15, stoneMat.color.getHex(), edgeX + 0.25, 0.45, bz, group);
                }
            }
        }
    }
    // --- 3. LEVEL 2: Ice Road with Snow Banks ---
    else if (type === 'ice_wall') {
        const bankWidth = 1.5; 
        const bankHeight = 0.6; 
        
        const snowMat = new THREE.MeshStandardMaterial({ color: COLORS.snow, roughness: 0.5 });
        
        const bL = new THREE.Mesh(new THREE.BoxGeometry(bankWidth, bankHeight, chunkDepth), snowMat);
        bL.position.set(-edgeX - bankWidth/2, bankHeight/2, 0);
        group.add(bL);

        const bR = new THREE.Mesh(new THREE.BoxGeometry(bankWidth, bankHeight, chunkDepth), snowMat);
        bR.position.set(edgeX + bankWidth/2, bankHeight/2, 0);
        group.add(bR);

        const guardH = 1.0; const guardW = 0.4; const guardX = edgeX + guardW/2;
        const iceMat = new THREE.MeshStandardMaterial({ color: 0x77AAFF, transparent: true, opacity: 0.6, roughness: 0.1 });

        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 2.0) {
            const pL = new THREE.Mesh(new THREE.BoxGeometry(guardW, guardH, 0.4), iceMat);
            pL.position.set(-guardX, bankHeight + guardH/2, z); group.add(pL);
            const pR = new THREE.Mesh(new THREE.BoxGeometry(guardW, guardH, 0.4), iceMat);
            pR.position.set(guardX, bankHeight + guardH/2, z); group.add(pR);
            
            if (z + 2.0 < chunkDepth/2) {
                const barGeo = new THREE.BoxGeometry(0.2, 0.2, 2.0);
                const bL = new THREE.Mesh(barGeo, iceMat); bL.position.set(-guardX, bankHeight + guardH - 0.2, z + 1.0); group.add(bL);
                const bR = new THREE.Mesh(barGeo, iceMat); bR.position.set(guardX, bankHeight + guardH - 0.2, z + 1.0); group.add(bR);
                const bL2 = new THREE.Mesh(barGeo, iceMat); bL2.position.set(-guardX, bankHeight + 0.3, z + 1.0); group.add(bL2);
                const bR2 = new THREE.Mesh(barGeo, iceMat); bR2.position.set(guardX, bankHeight + 0.3, z + 1.0); group.add(bR2);
            }
        }
    }
    // --- 4. LEVEL 3: Nether Fortress with Lava Streams ---
    else if (type === 'nether_fence') {
        const lavaWidth = 2.0; const lavaX = edgeX + lavaWidth/2 - 0.5; 
        const lavaGeo = new THREE.PlaneGeometry(lavaWidth, chunkDepth);
        const lavaTex = textures['minecraft_lava'];
        const lavaMat = new THREE.MeshBasicMaterial({ color: lavaTex ? 0xFFFFFF : COLORS.lava, map: lavaTex || null });
        
        const lavaL = new THREE.Mesh(lavaGeo, lavaMat); lavaL.rotation.x = -Math.PI/2; lavaL.position.set(-lavaX, 0.05, 0); group.add(lavaL);
        const lavaR = new THREE.Mesh(lavaGeo, lavaMat); lavaR.rotation.x = -Math.PI/2; lavaR.position.set(lavaX, 0.05, 0); group.add(lavaR);

        // Removed PointLight to improve performance (LAG FIX)
        // const light = new THREE.PointLight(COLORS.lava, 1.0, 15); light.position.set(0, 2, 0); group.add(light);

        // --- SIGNIFICANTLY REDUCED BANK HEIGHT (1.0 -> 0.2) ---
        const bankWidth = 4.0;
        const bankHeight = 0.2; // Much flatter
        const bankX = edgeX + lavaWidth + bankWidth/2 - 1.0; 
        
        const netherMat = new THREE.MeshStandardMaterial({ color: 0x2A1212 }); 
        
        const bankL = new THREE.Mesh(new THREE.BoxGeometry(bankWidth, bankHeight, chunkDepth), netherMat);
        bankL.position.set(-bankX, bankHeight/2, 0); group.add(bankL);

        const bankR = new THREE.Mesh(new THREE.BoxGeometry(bankWidth, bankHeight, chunkDepth), netherMat);
        bankR.position.set(bankX, bankHeight/2, 0); group.add(bankR);

        const fenceH = 0.525; const fenceX = edgeX + lavaWidth - 0.5; 
        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 1.5) {
            createBox(0.3, fenceH, 0.3, COLORS.netherBrick, -fenceX, bankHeight + fenceH/2, z, group);
            createBox(0.3, fenceH, 0.3, COLORS.netherBrick, fenceX, bankHeight + fenceH/2, z, group);
        }
    }
    // --- 5. LEVEL 4: The End (Floating Islands with Texture) ---
    else if (type === 'chorus_plant') {
        const islandCount = 2; 
        
        // Use the endstone texture for the islands
        const endTex = textures['minecraft_endstone'];
        const islandMat = new THREE.MeshStandardMaterial({ 
            map: endTex || null, 
            color: endTex ? 0xFFFFFF : COLORS.endStone 
        });

        for(let i=0; i<islandCount; i++) {
            const z = (Math.random() - 0.5) * chunkDepth;
            const isLeft = Math.random() > 0.5;
            const xOffset = isLeft ? -edgeX - 4 - Math.random()*2 : edgeX + 4 + Math.random()*2;
            const yOffset = Math.random() * 2;
            
            const islandSize = 3 + Math.random() * 3;
            const island = new THREE.Group();
            island.position.set(xOffset, yOffset, z);
            
            // Main Island Block - Using texture material
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(islandSize, islandSize/2, islandSize), islandMat);
            mesh.castShadow = true; mesh.receiveShadow = true;
            island.add(mesh);
            
            // Chorus Plant
            const plantH = 3 + Math.random() * 4;
            const plantColor = COLORS.chorusPlant;
            createBox(0.4, plantH, 0.4, plantColor, 0, plantH/2 + islandSize/4, 0, island);
            createBox(0.6, 0.6, 0.6, COLORS.chorusFlower, 0, plantH + islandSize/4, 0, island);
            
            if (plantH > 4) {
                createBox(0.4, 0.4, 1.5, plantColor, 0.5, plantH/2, 0, island);
                createBox(0.6, 0.6, 0.6, COLORS.chorusFlower, 1.2, plantH/2, 0, island);
            }

            group.add(island);
        }
    }
};

export const generateTextures = () => {
    const textures: Record<string, THREE.Texture> = {};
    // Level 0: CHANGED TO HIGH SATURATION LIME GREEN for path
    const grassTex = createDetailedTexture('minecraft_grass', '#32CD32'); 
    grassTex.wrapS = THREE.RepeatWrapping; grassTex.wrapT = THREE.RepeatWrapping; grassTex.repeat.set(2, 4);
    textures['minecraft_path'] = grassTex;

    // Level 0: Dark Buffer Grass (Pixelated)
    const bufferTex = createDetailedTexture('minecraft_grass', '#1B5E20'); 
    bufferTex.wrapS = THREE.RepeatWrapping; bufferTex.wrapT = THREE.RepeatWrapping; bufferTex.repeat.set(2, 4);
    textures['minecraft_grass_dark'] = bufferTex;

    // Level 1: Pixelated Mossy (Changed from Tile to Grass Generator for noisy pixel look)
    textures['minecraft_mossy'] = createDetailedTexture('minecraft_grass', '#4CAF50');
    
    // Level 2: Snow Tile
    textures['minecraft_ice'] = createDetailedTexture('minecraft_snow', '#FFFFFF');
    // Level 3: Bedrock
    textures['minecraft_bedrock'] = createDetailedTexture('minecraft_bedrock', '#000000');
    // Level 3: Lava
    const lavaTex = createDetailedTexture('minecraft_lava', '#FF4500');
    lavaTex.wrapS = THREE.RepeatWrapping; lavaTex.wrapT = THREE.RepeatWrapping; lavaTex.repeat.set(1, 4);
    textures['minecraft_lava'] = lavaTex;

    // Level 4: Pixelated End Stone (Brighter)
    textures['minecraft_endstone'] = createDetailedTexture('minecraft_sand', '#FFFFDD');
    return textures;
};
