
import * as THREE from 'three';
import { createDetailedTexture } from '../../../utils/gameUtils';
import { createBox, castShadows } from '../utils';
import { LevelConfig, TextureMap } from '../../../gameTypes';

export const createPlayerMesh = () => new THREE.Group();

export const createSkis = () => ({ left: new THREE.Group(), right: new THREE.Group() });

export const createWallBlockade = (width: number, height: number, texture?: THREE.Texture) => {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 1), 
        new THREE.MeshStandardMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x888888, 
            roughness: 0.8 
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
        new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5 })
    );
    frame.position.y = height / 2; frame.castShadow = true; frame.receiveShadow = true; 
    group.add(frame);
    
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height), 
        new THREE.MeshBasicMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x222222,
            transparent: true,
            opacity: 0.7
        })
    );
    plane.position.set(0, height / 2, 0.26); 
    group.add(plane);
    return group;
};

export const decorateChunk = (group: THREE.Group, levelConfig: LevelConfig, roadWidth: number, chunkDepth: number, textures: TextureMap) => {
    const edgeX = roadWidth / 2;
    const bufferWidth = 8.0;
    const bufferCenterX = edgeX + bufferWidth / 2;
    const type = levelConfig.fence.type;
    
    const createGroundBuffers = (color: number, textureKey?: string, height: number = 1.0, yOffset: number = -0.5) => {
        const leftGeo = new THREE.BoxGeometry(bufferWidth, height, chunkDepth);
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 1.0 });
        const leftMesh = new THREE.Mesh(leftGeo, mat);
        leftMesh.position.set(-bufferCenterX, yOffset, 0);
        leftMesh.receiveShadow = true;
        group.add(leftMesh);
        const rightMesh = leftMesh.clone();
        rightMesh.position.set(bufferCenterX, yOffset, 0);
        group.add(rightMesh);
    };

    if (type === 'pallet_fence') {
        createGroundBuffers(0x4CAF50);
        const curbW = 0.6;
        createBox(curbW, 0.3, chunkDepth, 0xCCCCCC, -edgeX - curbW/2, 0.15, 0, group);
        createBox(curbW, 0.3, chunkDepth, 0xCCCCCC, edgeX + curbW/2, 0.15, 0, group);
        const fenceOffset = edgeX + 1.2; 
        const postSpacing = 3.0;
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=postSpacing) {
            createBox(0.25, 1.2, 0.25, 0xFFFFFF, -fenceOffset, 0.6, z, group);
            createBox(0.25, 1.2, 0.25, 0xFFFFFF, fenceOffset, 0.6, z, group);
            const capGeo = new THREE.ConeGeometry(0.2, 0.15, 4); 
            const capMat = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
            const lCap = new THREE.Mesh(capGeo, capMat); lCap.position.set(-fenceOffset, 1.25, z); lCap.rotation.y=Math.PI/4; group.add(lCap);
            const rCap = new THREE.Mesh(capGeo, capMat); rCap.position.set(fenceOffset, 1.25, z); rCap.rotation.y=Math.PI/4; group.add(rCap);
            if (z + postSpacing < chunkDepth/2) {
                const midZ = z + postSpacing/2;
                createBox(0.1, 0.15, postSpacing, 0xEEEEEE, -fenceOffset, 0.9, midZ, group);
                createBox(0.1, 0.15, postSpacing, 0xEEEEEE, fenceOffset, 0.9, midZ, group);
                createBox(0.1, 0.15, postSpacing, 0xEEEEEE, -fenceOffset, 0.4, midZ, group);
                createBox(0.1, 0.15, postSpacing, 0xEEEEEE, fenceOffset, 0.4, midZ, group);
            }
        }
    }
    else if (type === 'viridian_tree') {
        createGroundBuffers(0x3E2723);
        const treeOffset = bufferCenterX - 1.5;
        const rockColor = 0x795548;
        const rockDetailColor = 0x5D4037;
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=2.5) {
            if (Math.random() > 0.3) {
                const rSize = 0.4 + Math.random() * 0.6;
                const rGroup = new THREE.Group();
                createBox(rSize, rSize*0.8, rSize, rockColor, 0, rSize/2, 0, rGroup);
                createBox(rSize*0.7, rSize*0.5, rSize*0.7, rockDetailColor, 0, rSize, 0, rGroup);
                rGroup.position.set(-edgeX - 0.5, 0, z + Math.random());
                rGroup.rotation.y = Math.random() * Math.PI;
                group.add(rGroup);
            }
            if (Math.random() > 0.3) {
                const rSize = 0.4 + Math.random() * 0.6;
                const rGroup = new THREE.Group();
                createBox(rSize, rSize*0.8, rSize, rockColor, 0, rSize/2, 0, rGroup);
                createBox(rSize*0.7, rSize*0.5, rSize*0.7, rockDetailColor, 0, rSize, 0, rGroup);
                rGroup.position.set(edgeX + 0.5, 0, z + Math.random());
                rGroup.rotation.y = Math.random() * Math.PI;
                group.add(rGroup);
            }
        }
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=6) {
            const treeType = Math.floor(Math.random() * 3);
            const scale = 0.8 + Math.random() * 0.4;
            const tree = new THREE.Group();
            if (treeType === 0) {
                createBox(1.0, 3.0, 1.0, 0x5D4037, 0, 1.5, 0, tree);
                createBox(3.5, 2.5, 3.5, 0x2E7D32, 0, 3.5, 0, tree);
                createBox(2.5, 1.5, 2.5, 0x2E7D32, 0, 4.5, 0, tree);
            } else if (treeType === 1) {
                createBox(0.8, 4.0, 0.8, 0x4E342E, 0, 2.0, 0, tree);
                const coneGeo = new THREE.ConeGeometry(2.0, 4.0, 8);
                const coneMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20 });
                const leaves = new THREE.Mesh(coneGeo, coneMat); leaves.position.y = 4.0; tree.add(leaves);
            } else {
                createBox(1.2, 2.0, 1.2, 0x5D4037, 0, 1.0, 0, tree);
                createBox(4.0, 3.0, 4.0, 0x388E3C, 0, 2.5, 0, tree);
            }
            tree.scale.set(scale, scale, scale);
            tree.position.set(-treeOffset + (Math.random()-0.5), 0, z);
            tree.rotation.y = Math.random() * Math.PI;
            group.add(tree);
            const treeR = tree.clone();
            treeR.position.set(treeOffset + (Math.random()-0.5), 0, z);
            treeR.rotation.y = Math.random() * Math.PI;
            group.add(treeR);
        }
    }
    else if (type === 'moon_rock') {
        createGroundBuffers(0x222222);
        const railColor = 0x888888;
        createBox(0.3, 0.8, chunkDepth, railColor, -edgeX, 0.4, 0, group);
        createBox(0.3, 0.8, chunkDepth, railColor, edgeX, 0.4, 0, group);
        const rockOffset = bufferCenterX - 1.0;
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=10) { 
            const rockFormation = new THREE.Group();
            createBox(2.5, 1.5, 2.5, 0x546E7A, 0, 0.75, 0, rockFormation); 
            createBox(1.8, 1.2, 1.8, 0x607D8B, 0.8, 0.6, 0.5, rockFormation).rotation.y = 0.5;
            createBox(1.5, 1.0, 1.5, 0x455A64, -0.8, 0.5, -0.5, rockFormation).rotation.y = -0.5;
            const stoneGeo = new THREE.DodecahedronGeometry(0.6, 0);
            const stoneMat = new THREE.MeshStandardMaterial({ color: 0xFFF8E1, emissive: 0xFFF8E1, emissiveIntensity: 0.5, roughness: 0.4 });
            const stone = new THREE.Mesh(stoneGeo, stoneMat); stone.position.set(0, 2.0, 0); rockFormation.add(stone);
            const crystalMat = new THREE.MeshStandardMaterial({ color: 0x00E5FF, emissive: 0x00E5FF, emissiveIntensity: 0.8, transparent: true, opacity: 0.8 });
            const cryGeo = new THREE.ConeGeometry(0.2, 0.8, 3);
            const c1 = new THREE.Mesh(cryGeo, crystalMat); c1.position.set(0.8, 1.5, 0); c1.rotation.z = -0.5; rockFormation.add(c1);
            const c2 = new THREE.Mesh(cryGeo, crystalMat); c2.position.set(-0.8, 1.5, 0); c2.rotation.z = 0.5; rockFormation.add(c2);
            rockFormation.position.set(-rockOffset, 0, z); group.add(rockFormation);
            const rockR = rockFormation.clone(); rockR.rotation.y = Math.PI; rockR.position.set(rockOffset, 0, z); group.add(rockR);
        }
    }
    else if (type === 'euro_stone_fence') {
        createGroundBuffers(0x2E1A36); 
        const fenceX = edgeX + 0.5;
        const stoneColor = 0x888888; 
        const pillarColor = 0xAAAAAA; 
        const railColor = 0x666666; 
        
        createBox(0.6, 0.3, chunkDepth, stoneColor, -fenceX, 0.15, 0, group);
        createBox(0.6, 0.3, chunkDepth, stoneColor, fenceX, 0.15, 0, group);

        const pillarSpacing = 4.0;
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=pillarSpacing) {
            const createPillar = (x: number) => {
                const pGroup = new THREE.Group();
                createBox(0.8, 0.4, 0.8, stoneColor, x, 0.2, z, pGroup);
                createBox(0.6, 1.2, 0.6, pillarColor, x, 1.0, z, pGroup);
                createBox(0.9, 0.15, 0.9, stoneColor, x, 1.675, z, pGroup);
                const orb = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25), new THREE.MeshStandardMaterial({color: 0x4B0082, emissive: 0x220044}));
                orb.position.set(x, 2.0, z);
                pGroup.add(orb);
                group.add(pGroup);
            };
            createPillar(-fenceX);
            createPillar(fenceX);

            if (z + pillarSpacing < chunkDepth/2) {
                const midZ = z + pillarSpacing/2;
                const railLen = pillarSpacing - 0.6;
                createBox(0.3, 0.8, railLen, stoneColor, -fenceX, 0.55, midZ, group);
                createBox(0.3, 0.8, railLen, stoneColor, fenceX, 0.55, midZ, group);
                createBox(0.4, 0.15, railLen, railColor, -fenceX, 1.0, midZ, group);
                createBox(0.4, 0.15, railLen, railColor, fenceX, 1.0, midZ, group);
                
                const balusterCount = 3;
                const balSpacing = railLen / (balusterCount + 1);
                for(let b=1; b<=balusterCount; b++) {
                    const bz = z + (b * balSpacing);
                    createBox(0.1, 0.6, 0.1, 0x333333, -fenceX, 0.6, bz, group);
                    createBox(0.1, 0.6, 0.1, 0x333333, fenceX, 0.6, bz, group);
                }
            }
        }
    }
    else if (type === 'league_statue') {
            createGroundBuffers(0xF5F5F5, undefined, 1.0, -0.5);
            createBox(0.5, 0.2, chunkDepth, 0xFFD700, -edgeX - 0.25, 0.1, 0, group);
            createBox(0.5, 0.2, chunkDepth, 0xFFD700, edgeX + 0.25, 0.1, 0, group);
            const railX = edgeX + 0.8; const railHeight = 1.8; const segmentLen = 2.0; const goldColor = 0xFFD700; const ironColor = 0x222222;
            for(let z=-chunkDepth/2; z<chunkDepth/2; z+=segmentLen) {
                for(let subZ=0; subZ<segmentLen; subZ+=1.0) {
                    createBox(0.12, railHeight, 0.12, ironColor, -railX, railHeight/2, z + subZ, group);
                    createBox(0.12, railHeight, 0.12, ironColor, railX, railHeight/2, z + subZ, group);
                    createBox(0.15, 0.2, 0.15, goldColor, -railX, railHeight, z + subZ, group);
                    createBox(0.15, 0.2, 0.15, goldColor, railX, railHeight, z + subZ, group);
                }
                createBox(0.25, 0.15, segmentLen, ironColor, -railX, railHeight - 0.2, z + segmentLen/2, group);
                createBox(0.25, 0.15, segmentLen, ironColor, railX, railHeight - 0.2, z + segmentLen/2, group);
                if (Math.abs(z % 12) < 1.0) {
                    const pillarGroup = new THREE.Group();
                    createBox(1.5, 2.0, 1.5, 0xFFFFFF, 0, 1.0, 0, pillarGroup);
                    createBox(1.7, 0.2, 1.7, 0xEEEEEE, 0, 0.1, 0, pillarGroup); 
                    createBox(1.7, 0.2, 1.7, 0xEEEEEE, 0, 1.9, 0, pillarGroup); 
                    const statue = new THREE.Group();
                    createBox(0.8, 0.8, 0.8, goldColor, 0, 0.4, 0, statue); 
                    createBox(1.0, 0.1, 1.0, 0xB8860B, 0, 0.4, 0, statue);
                    const lWing = createBox(0.1, 0.8, 0.6, goldColor, -0.6, 0.6, 0, statue); lWing.rotation.z = 0.5;
                    const rWing = createBox(0.1, 0.8, 0.6, goldColor, 0.6, 0.6, 0, statue); rWing.rotation.z = -0.5;
                    statue.position.set(0, 2.2, 0); pillarGroup.add(statue);
                    pillarGroup.position.set(-railX - 0.5, 0, z); group.add(pillarGroup);
                    const pillarR = pillarGroup.clone(); pillarR.position.set(railX + 0.5, 0, z); group.add(pillarR);
                }
            }
    }
};

export const generateTextures = () => {
    const textures: Record<string, THREE.Texture> = {};
    textures['pokemon_earth'] = createDetailedTexture('pokemon_grass', '#D7CCC8'); 
    textures['pokemon_cobble'] = createDetailedTexture('pokemon_cobble', '#8D6E63'); 
    textures['pokemon_cave'] = createDetailedTexture('pokemon_cave', '#37474F'); 
    textures['pokemon_bridge'] = createDetailedTexture('pokemon_water', '#00E676');
    textures['pokemon_purple_stone'] = createDetailedTexture('pokemon_purple_marble', '#7B1FA2'); 
    textures['pokemon_ancient'] = createDetailedTexture('pokemon_carpet', '#F5F5F5'); 
    return textures;
};
