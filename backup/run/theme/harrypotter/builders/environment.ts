
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { LevelConfig, TextureMap } from '../../../gameTypes';
import { COLORS } from '../constants';
import { createDetailedTexture } from '../../../utils/gameUtils';

export const createPlayerMesh = () => new THREE.Group();
export const createSkis = () => ({ left: new THREE.Group(), right: new THREE.Group() });

export const createWallBlockade = (width: number, height: number, texture?: THREE.Texture) => {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 1), 
        new THREE.MeshStandardMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x555555, 
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
    const frameColor = 0x111111; // Black
    
    // Slim Frame Dimensions
    const thickness = 0.3;
    const depth = 0.3;

    // Top Frame
    const frameTop = new THREE.Mesh(
        new THREE.BoxGeometry(width + thickness*2, thickness, depth),
        new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.5, metalness: 0.5 })
    );
    frameTop.position.y = height + thickness/2;
    group.add(frameTop);

    // Left Frame
    const frameL = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, height + thickness, depth),
        new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.5, metalness: 0.5 })
    );
    frameL.position.set(-width/2 - thickness/2, height/2, 0);
    group.add(frameL);

    // Right Frame
    const frameR = new THREE.Mesh(
        new THREE.BoxGeometry(thickness, height + thickness, depth),
        new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.5, metalness: 0.5 })
    );
    frameR.position.set(width/2 + thickness/2, height/2, 0);
    group.add(frameR);
    
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height), 
        new THREE.MeshBasicMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x111111,
            transparent: true,
            opacity: 0.8
        })
    );
    plane.position.set(0, height / 2, 0.26); 
    group.add(plane);
    return group;
};

// ---------------------------------------------------------------------------
// DECORATION LOGIC (HIGH FIDELITY)
// ---------------------------------------------------------------------------

const createStreetLamp = (x: number, z: number, group: THREE.Group) => {
    const lamp = new THREE.Group();
    lamp.position.set(x, 0, z);
    
    createBox(0.6, 0.2, 0.6, COLORS.lampIron, 0, 0.1, 0, lamp);
    createBox(0.4, 0.4, 0.4, COLORS.lampIron, 0, 0.4, 0, lamp);
    createBox(0.15, 3.5, 0.15, COLORS.lampIron, 0, 2.1, 0, lamp);
    createBox(0.8, 0.1, 0.1, COLORS.lampIron, 0, 3.0, 0, lamp);
    
    const lanternY = 3.8;
    createBox(0.4, 0.6, 0.4, COLORS.lampIron, 0, lanternY, 0, lamp);
    const glass = createBox(0.3, 0.5, 0.3, COLORS.lampGlass, 0, lanternY, 0, lamp);
    if (glass.material instanceof THREE.MeshStandardMaterial) {
        glass.material.emissive = new THREE.Color(COLORS.lampGlass);
        glass.material.emissiveIntensity = 0.8;
        glass.material.transparent = true;
        glass.material.opacity = 0.9;
    }
    createBox(0.5, 0.1, 0.5, COLORS.lampIron, 0, lanternY + 0.35, 0, lamp);
    createBox(0.1, 0.2, 0.1, COLORS.lampIron, 0, lanternY + 0.5, 0, lamp); 

    group.add(lamp);
};

const createBench = (x: number, z: number, rotY: number, group: THREE.Group) => {
    const bench = new THREE.Group();
    bench.position.set(x, 0, z);
    bench.rotation.y = rotY;
    
    // Scale up by ~15% more (1.15 * 1.15 approx 1.33)
    bench.scale.set(1.33, 1.33, 1.33);

    const legColor = COLORS.benchIron;
    const createLegFrame = (lx: number) => {
        createBox(0.1, 0.4, 0.6, legColor, lx, 0.2, 0, bench); 
        createBox(0.1, 0.4, 0.1, legColor, lx, 0.6, -0.25, bench); 
    };
    createLegFrame(-0.8);
    createLegFrame(0.8);

    const woodColor = COLORS.benchWood;
    const slatW = 1.8; const slatH = 0.05; const slatD = 0.1;
    for(let i=0; i<3; i++) { createBox(slatW, slatH, slatD, woodColor, 0, 0.45, -0.1 + i*0.12, bench); }
    for(let i=0; i<2; i++) { createBox(slatW, slatH, slatD, woodColor, 0, 0.7 + i*0.12, -0.25, bench).rotation.x = -0.2; }

    group.add(bench);
};

export const decorateChunk = (group: THREE.Group, levelConfig: LevelConfig, roadWidth: number, chunkDepth: number, textures: TextureMap) => {
    const edgeX = roadWidth / 2;
    const type = levelConfig.fence.type;
    
    // --- FOUNDATION BLOCK ---
    const foundationHeight = 6.0;
    
    let sideColor = 0x888888;
    if (type === 'london_decor') sideColor = COLORS.l0Side; 
    else if (type === 'euro_stone') sideColor = 0x999999; 
    else if (type === 'wood_fence_grass') sideColor = COLORS.l2Side; // Dark Soil
    else if (type === 'neon_glass') sideColor = COLORS.l3Side; 
    else if (type === 'marble_fence') sideColor = COLORS.l1Side; 
    else if (type === 'ruined_fence') sideColor = COLORS.l4Side; 

    const foundationGeo = new THREE.BoxGeometry(roadWidth, foundationHeight, chunkDepth);
    const foundationMat = new THREE.MeshStandardMaterial({ color: sideColor, roughness: 1.0 });
    const foundation = new THREE.Mesh(foundationGeo, foundationMat);
    foundation.position.set(0, -foundationHeight/2 - 0.05, 0);
    foundation.receiveShadow = true;
    group.add(foundation);

    // --- LEVEL SPECIFIC DECORATION ---

    // 0. LEVEL 0: LONDON STREET
    if (type === 'london_decor') {
        const curbW = 0.5; const curbH = 0.2;
        createBox(curbW, curbH, chunkDepth, 0x999999, -edgeX + curbW/2, curbH/2, 0, group);
        createBox(curbW, curbH, chunkDepth, 0x999999, edgeX - curbW/2, curbH/2, 0, group);

        const decorX = edgeX - 0.8; 
        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 10.0) {
            createStreetLamp(-decorX, z, group);
            createStreetLamp(decorX, z, group);
            const benchZ = z + 5.0;
            if (benchZ < chunkDepth/2) {
                createBench(-decorX, benchZ, Math.PI/2, group);
                createBench(decorX, benchZ, -Math.PI/2, group);
            }
        }
    }

    // 1. LEVEL 1: EUROPEAN STONE RAILING
    else if (type === 'euro_stone') {
        const pillarW = 0.6;
        const railHeight = 1.1;
        const stoneColor = COLORS.stoneRail;
        const pillarColor = COLORS.stonePillar;
        const decorX = edgeX - 0.4; 

        const segmentLen = 4.0; 

        for(let z = -chunkDepth/2; z < chunkDepth/2; z += segmentLen) {
            const createPillar = (x: number) => {
                const pGroup = new THREE.Group();
                pGroup.position.set(x, 0, z);
                createBox(pillarW, 0.3, pillarW, pillarColor, 0, 0.15, 0, pGroup);
                createBox(pillarW * 0.7, railHeight - 0.3, pillarW * 0.7, pillarColor, 0, railHeight/2, 0, pGroup);
                createBox(pillarW + 0.1, 0.15, pillarW + 0.1, pillarColor, 0, railHeight, 0, pGroup);
                const sphere = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25), new THREE.MeshStandardMaterial({ color: pillarColor }));
                sphere.position.set(0, railHeight + 0.3, 0);
                pGroup.add(sphere);
                group.add(pGroup);
            };
            
            createPillar(-decorX);
            createPillar(decorX);

            if (z + segmentLen < chunkDepth/2) {
                const midZ = z + segmentLen / 2;
                const railLen = segmentLen - (pillarW * 0.7);
                const createBalustrade = (x: number) => {
                    const rGroup = new THREE.Group();
                    rGroup.position.set(x, 0, midZ);
                    createBox(0.4, 0.2, railLen, stoneColor, 0, 0.1, 0, rGroup);
                    createBox(0.3, 0.15, railLen, stoneColor, 0, railHeight - 0.1, 0, rGroup);
                    const count = 4;
                    const step = railLen / (count + 1);
                    for(let i=1; i<=count; i++) {
                        const bz = -railLen/2 + i*step;
                        createBox(0.15, 0.6, 0.15, stoneColor, 0, 0.5, bz, rGroup);
                        createBox(0.2, 0.2, 0.2, stoneColor, 0, 0.3, bz, rGroup); 
                    }
                    group.add(rGroup);
                };
                createBalustrade(-decorX);
                createBalustrade(decorX);
            }
        }
    }
    
    // 2. LEVEL 2: DARK GOTHIC FENCE (OPTIMIZED: Reduced density to fix lag)
    else if (type === 'wood_fence_grass') {
        const bankW = 2.0;
        
        // Optimized Banks: 2 large segments per chunk instead of 10 small ones
        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 10.0) {
            const zPos = z + 5.0; // Center of the 10.0 segment
            
            const lBank = new THREE.Group();
            lBank.position.set(-edgeX + 0.5, 0, zPos);
            createBox(bankW, 0.2, 10.0, COLORS.l2GrassTop, 0, 0.1, 0, lBank); 
            createBox(bankW, 0.8, 10.0, COLORS.l2GrassSide, 0, -0.4, 0, lBank);
            lBank.position.x += (Math.random() - 0.5) * 0.1;
            group.add(lBank);

            const rBank = new THREE.Group();
            rBank.position.set(edgeX - 0.5, 0, zPos);
            createBox(bankW, 0.2, 10.0, COLORS.l2GrassTop, 0, 0.1, 0, rBank);
            createBox(bankW, 0.8, 10.0, COLORS.l2GrassSide, 0, -0.4, 0, rBank);
            rBank.position.x += (Math.random() - 0.5) * 0.1;
            group.add(rBank);
        }

        // Optimized Fence: 10m Spacing (reduced from 3.0m)
        const fenceColor = 0x111111;
        const fenceH = 1.8;
        const postW = 0.3;
        const spikeColor = 0x222222;
        const decorX = edgeX - 0.5;

        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 10.0) {
            const createFenceSection = (x: number) => {
                const sect = new THREE.Group();
                sect.position.set(x, 0, z);
                
                // Main Post
                createBox(postW, fenceH, postW, fenceColor, 0, fenceH/2 + 0.2, 0, sect);
                // Post Cap (Spike)
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 4), new THREE.MeshStandardMaterial({ color: spikeColor }));
                spike.position.set(0, fenceH + 0.45, 0);
                sect.add(spike);

                // Horizontal Rails (Connecting to next post)
                if (z + 10.0 <= chunkDepth/2 + 0.1) {
                    const railLen = 10.0;
                    const midZ = railLen / 2;
                    
                    // Top Rail
                    const tr = createBox(0.15, 0.15, railLen, fenceColor, 0, fenceH - 0.4, midZ, sect);
                    tr.rotation.x = (Math.random() - 0.5) * 0.05; 
                    
                    // Bottom Rail
                    const br = createBox(0.15, 0.15, railLen, fenceColor, 0, 0.6, midZ, sect);
                    br.rotation.x = (Math.random() - 0.5) * 0.05;

                    // Vertical Pickets (Sparse: 4 per 10m section)
                    const picketCount = 4;
                    const pStep = railLen / (picketCount + 1);
                    for(let p=1; p<=picketCount; p++) {
                        const pH = 1.2 + Math.random() * 0.4;
                        const pz = midZ - (railLen/2) + p*pStep;
                        createBox(0.1, pH, 0.1, fenceColor, 0, 0.4 + pH/2, pz, sect);
                        
                        const pSpike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 4), new THREE.MeshStandardMaterial({ color: spikeColor }));
                        pSpike.position.set(0, 0.4 + pH + 0.15, pz);
                        sect.add(pSpike);
                    }
                }
                group.add(sect);
            };

            createFenceSection(-decorX);
            createFenceSection(decorX);
        }
    }

    // 3. LEVEL 3: OBSIDIAN/NEON (Dark Floor + Glass Fence) - REMOVED TILES
    else if (type === 'neon_glass') {
        const fenceH = 1.5;
        
        // Futuristic Fences
        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 4.0) {
            createBox(0.4, fenceH, 0.4, 0x333333, -edgeX + 0.2, fenceH/2, z, group);
            createBox(0.4, fenceH, 0.4, 0x333333, edgeX - 0.2, fenceH/2, z, group);
            
            createBox(0.42, 0.1, 0.42, COLORS.l3Neon, -edgeX + 0.2, fenceH, z, group);
            createBox(0.42, 0.1, 0.42, COLORS.l3Neon, edgeX - 0.2, fenceH, z, group);

            if (z + 4.0 < chunkDepth/2) {
                const midZ = z + 2.0;
                const glassMat = new THREE.MeshStandardMaterial({ 
                    color: COLORS.l3Fence, 
                    transparent: true, 
                    opacity: 0.4, 
                    roughness: 0.1 
                });
                const panelL = new THREE.Mesh(new THREE.BoxGeometry(0.1, fenceH - 0.4, 3.8), glassMat);
                panelL.position.set(-edgeX + 0.2, fenceH/2, midZ);
                group.add(panelL);

                const panelR = new THREE.Mesh(new THREE.BoxGeometry(0.1, fenceH - 0.4, 3.8), glassMat);
                panelR.position.set(edgeX - 0.2, fenceH/2, midZ);
                group.add(panelR);
            }
        }
    }

    // 4. LEVEL 4: CRACKED RUINS
    else if (type === 'ruined_fence') {
        const fenceColor = COLORS.l4Fence;
        
        for(let i=0; i<5; i++) {
            const s = 0.3 + Math.random() * 0.5;
            createBox(s, s, s, 0x555555, (Math.random()-0.5)*(roadWidth-1), s/2, (Math.random()-0.5)*chunkDepth, group).rotation.set(Math.random(), Math.random(), Math.random());
        }

        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 3.0) {
            const hL = 0.5 + Math.random() * 1.0;
            const hR = 0.5 + Math.random() * 1.0;
            createBox(0.3, hL, 0.3, fenceColor, -edgeX + 0.2, hL/2, z, group).rotation.z = (Math.random()-0.5)*0.2;
            createBox(0.3, hR, 0.3, fenceColor, edgeX - 0.2, hR/2, z, group).rotation.z = (Math.random()-0.5)*0.2;
            
            if (Math.random() > 0.3 && z + 3.0 < chunkDepth/2) {
                const midZ = z + 1.5;
                const rL = createBox(0.15, 0.15, 3.2, fenceColor, -edgeX + 0.2, 0.8, midZ, group);
                rL.rotation.x = (Math.random() - 0.5) * 0.2;
                rL.rotation.y = (Math.random() - 0.5) * 0.2;
                const rR = createBox(0.15, 0.15, 3.2, fenceColor, edgeX - 0.2, 0.8, midZ, group);
                rR.rotation.x = (Math.random() - 0.5) * 0.2;
            }
        }
    }
};

export const generateTextures = () => {
    const textures: Record<string, THREE.Texture> = {};
    
    // Level 0: Gray Checkerboard (Custom Canvas)
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#999999'; ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#777777';
        const s = 64;
        for(let y=0; y<size; y+=s) {
            for(let x=0; x<size; x+=s) {
                if ((x/s + y/s) % 2 === 0) ctx.fillRect(x, y, s, s);
            }
        }
    }
    const checkerTex = new THREE.CanvasTexture(canvas);
    checkerTex.colorSpace = THREE.SRGBColorSpace;
    checkerTex.magFilter = THREE.NearestFilter;
    checkerTex.wrapS = THREE.RepeatWrapping;
    checkerTex.wrapT = THREE.RepeatWrapping;
    checkerTex.repeat.set(2, 4);
    textures['hp_checker_gray'] = checkerTex;

    // Level 1: Carpet
    textures['hp_carpet_red'] = createDetailedTexture('pokemon_carpet', '#F5F5F5');

    // Level 2: Dirt
    textures['hp_dirt'] = createDetailedTexture('pokemon_grass', '#2A332A');

    // Level 3: Obsidian
    textures['hp_obsidian_neon'] = createDetailedTexture('minecraft_bedrock', '#000000');

    // Level 4: Cracked
    textures['hp_cracked'] = createDetailedTexture('pokemon_cobble', '#444444');

    return textures;
};
