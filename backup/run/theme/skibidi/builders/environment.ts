
import * as THREE from 'three';
import { createDetailedTexture } from '../../../utils/gameUtils';
import { createBox, castShadows } from '../utils';
import { LevelConfig, TextureMap } from '../../../gameTypes';
import { COLORS } from '../constants';

export const createPlayerMesh = () => new THREE.Group(); 

export const createSkis = () => ({ left: new THREE.Group(), right: new THREE.Group() });

export const createWallBlockade = (width: number, height: number, texture?: THREE.Texture) => {
    const group = new THREE.Group();
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 1), 
        new THREE.MeshStandardMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x884444, 
            roughness: 0.8 
        })
    );
    wall.castShadow = true; wall.receiveShadow = true; 
    wall.position.y = height / 2; 
    group.add(wall);
    return group;
};

export const createMirrorWall = (width: number, height: number, texture?: THREE.Texture) => {
    const group = new THREE.Group();
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.5, height + 0.5, 0.5), 
        new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.2, metalness: 0.8 })
    );
    frame.position.y = height / 2; frame.castShadow = true; frame.receiveShadow = true; 
    group.add(frame);
    
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height), 
        new THREE.MeshBasicMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x000000,
            transparent: true,
            opacity: 0.9
        })
    );
    plane.position.set(0, height / 2, 0.26); 
    group.add(plane);
    return group;
};

export const decorateChunk = (group: THREE.Group, levelConfig: LevelConfig, roadWidth: number, chunkDepth: number, textures: TextureMap) => {
    const edgeX = roadWidth / 2;
    const type = levelConfig.fence.type;
    
    // Create base ground buffers (sidewalks)
    const createBuffers = (color: number, yOff: number = -0.5) => {
        const bw = 3.2;
        const geo = new THREE.BoxGeometry(bw, 1, chunkDepth);
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
        const l = new THREE.Mesh(geo, mat); l.position.set(-edgeX - bw/2, yOff, 0); l.receiveShadow = true; group.add(l);
        const r = new THREE.Mesh(geo, mat); r.position.set(edgeX + bw/2, yOff, 0); r.receiveShadow = true; group.add(r);
    };

    if (type === 'cctv_post') { 
        // Tutorial: Low concrete barrier with yellow stripes
        createBuffers(COLORS.floorTutorial, -0.6); // Concrete sidewalk
        
        const barrierWidth = 0.8;
        const barrierHeight = 0.8; // Low height
        const barrierX = edgeX + barrierWidth/2;
        
        // Continuous low barrier
        const barrierGeo = new THREE.BoxGeometry(barrierWidth, barrierHeight, chunkDepth);
        const barrierMat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC });
        const lBar = new THREE.Mesh(barrierGeo, barrierMat); lBar.position.set(-barrierX, barrierHeight/2, 0); group.add(lBar);
        const rBar = new THREE.Mesh(barrierGeo, barrierMat); rBar.position.set(barrierX, barrierHeight/2, 0); group.add(rBar);
        
        // Safety Stripes on top
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=2) {
            createBox(barrierWidth+0.1, 0.1, 1.0, COLORS.bufferTutorial, -barrierX, barrierHeight, z, group);
            createBox(barrierWidth+0.1, 0.1, 1.0, COLORS.bufferTutorial, barrierX, barrierHeight, z, group);
        }

        // Occasional CCTV Pole
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=20) {
            const pole = new THREE.Group();
            createBox(0.2, 4, 0.2, 0x444444, 0, 2, 0, pole);
            createBox(0.5, 0.3, 0.3, 0x222222, 0.3, 3.8, 0, pole); // Cam
            createBox(0.1, 0.1, 0.1, 0xFF0000, 0.6, 3.8, 0, pole); // Lens
            pole.position.set(-barrierX, 0, z); group.add(pole);
        }
    }
    else if (type === 'industrial_pipes') { 
        // L1: Blue-Silver Pipes (Steel Plate Feel)
        createBuffers(0x556677, -0.6); // Dark Blue-Grey ground
        
        const pipeX = edgeX + 1.0;
        const pipeRadius = 0.4;
        const pipeY = 0.5; // Very low
        
        const pipeColor = 0xA0B0C0; // Blue-ish Silver
        const jointColor = 0x607080; // Darker Steel

        // Long horizontal pipes
        createBox(0.6, 0.6, chunkDepth, pipeColor, -pipeX, pipeY, 0, group);
        createBox(0.6, 0.6, chunkDepth, pipeColor, pipeX, pipeY, 0, group);
        
        // Vertical supports and joints
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=5) {
            createBox(0.8, 0.8, 0.8, jointColor, -pipeX, pipeY, z, group); // Joint
            createBox(0.8, 0.8, 0.8, jointColor, pipeX, pipeY, z, group);
            
            // Support leg
            createBox(0.3, pipeY, 0.3, 0x334455, -pipeX, pipeY/2, z, group);
            createBox(0.3, pipeY, 0.3, 0x334455, pipeX, pipeY/2, z, group);
            
            // Occasional vertical vent
            if (Math.random() > 0.7) {
                createBox(0.4, 2.0, 0.4, pipeColor, -pipeX, 1.0 + pipeY, z, group);
                // Steam particle would be nice here
            }
        }
    }
    else if (type === 'street_lamps') { 
        // L2: Broken Curb with Weeds
        createBuffers(0x2E3B2E, -0.5); // Overgrown grass
        
        const curbX = edgeX + 0.5;
        const curbH = 0.4;
        
        // Broken curb segments
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=1.5) {
            if (Math.random() > 0.2) {
                createBox(0.5, curbH, 1.4, 0x555555, -curbX, curbH/2, z, group); // Curb L
                createBox(0.5, curbH, 1.4, 0x555555, curbX, curbH/2, z, group); // Curb R
            }
        }
        
        // Debris / Street Lamp Stumps
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=12) {
            const isBroken = Math.random() > 0.5;
            const h = isBroken ? 1.5 : 5.0;
            const lamp = new THREE.Group();
            createBox(0.25, h, 0.25, 0x222222, 0, h/2, 0, lamp);
            
            if (!isBroken) {
                createBox(1.0, 0.2, 0.4, 0x222222, 0.4, h, 0, lamp);
                const bulb = createBox(0.3, 0.15, 0.3, 0xFFFF00, 0.8, h-0.1, 0, lamp);
                (bulb.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0xFFFF00);
            } else {
                // Sparks?
            }
            lamp.position.set(-curbX - 0.5, 0, z); 
            group.add(lamp);
            
            // Tires / Rubble on right
            if(Math.random() > 0.5) {
                createBox(0.8, 0.3, 0.8, 0x111111, curbX + 0.5, 0.15, z + 2, group);
            }
        }
    }
    else if (type === 'holograms') { 
        // L3: Low Neon Tech Rail
        createBuffers(0x000000, -0.5); // Black void
        
        const railX = edgeX + 0.5;
        const railH = 0.8;
        
        // Glowing Rail
        const railGeo = new THREE.BoxGeometry(0.2, 0.2, chunkDepth);
        const railMat = new THREE.MeshStandardMaterial({ 
            color: 0x00FFFF, emissive: 0x00FFFF, emissiveIntensity: 1.5 
        });
        const rL = new THREE.Mesh(railGeo, railMat); rL.position.set(-railX, railH, 0); group.add(rL);
        const rR = new THREE.Mesh(railGeo, railMat); rR.position.set(railX, railH, 0); group.add(rR);
        
        // Base units
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=3) {
            const post = new THREE.Group();
            createBox(0.5, railH, 0.5, 0x111111, 0, railH/2, 0, post);
            createBox(0.3, 0.1, 0.3, 0x8A2BE2, 0, railH/2, 0.26, post); // Light
            post.position.set(-railX, 0, z); group.add(post);
            
            const postR = post.clone();
            postR.position.set(railX, 0, z); group.add(postR);
        }
        
        // Hologram Emitters (Low)
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=15) {
            const holo = new THREE.Group();
            createBox(1.0, 0.5, 1.0, 0x222222, 0, 0.25, 0, holo);
            const beam = new THREE.Mesh(new THREE.ConeGeometry(0.4, 3, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.2, side: THREE.DoubleSide }));
            beam.position.y = 1.5;
            holo.add(beam);
            holo.position.set(-railX - 1.5, 0, z); group.add(holo);
        }
    }
    else if (type === 'debris_rebar') { 
        // L4: Low Rubble Mounds
        createBuffers(0x221111, -0.5); // Burnt ground
        
        const moundX = edgeX + 1.0;
        
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=4) {
            // Random concrete slab piles
            const pile = new THREE.Group();
            const pileH = 0.5 + Math.random() * 0.8; // Low height
            
            createBox(1.2, 0.4, 1.2, 0x333333, 0, 0.2, 0, pile).rotation.y = Math.random();
            createBox(1.0, 0.4, 1.0, 0x444444, 0.2, 0.5, 0.1, pile).rotation.x = 0.2;
            
            // Rebar sticking out
            createBox(0.05, 1.5, 0.05, 0x552222, 0, 0.8, 0, pile).rotation.z = (Math.random()-0.5);
            createBox(0.05, 1.2, 0.05, 0x552222, 0.3, 0.6, 0.2, pile).rotation.z = (Math.random()-0.5);

            pile.position.set(-moundX, 0, z); 
            group.add(pile);
            
            const pileR = pile.clone();
            pileR.rotation.y = Math.PI;
            pileR.position.set(moundX, 0, z + 2); // Offset z
            group.add(pileR);
        }
    }
};

export const generateTextures = () => {
    const textures: Record<string, THREE.Texture> = {};
    
    // Tutorial: Clean Concrete Tiles
    textures['skibidi_floor_tut'] = createDetailedTexture('minecraft_tile', '#CCCCCC'); 
    
    // Level 1: Steel Grating
    textures['skibidi_floor_l1'] = createDetailedTexture('minecraft_bedrock', '#90A0B0'); 
    
    // Level 2: High Contrast Dark Marble (Black base, White veins)
    textures['skibidi_floor_l2'] = createDetailedTexture('skibidi_marble', '#050505'); 
    
    // Level 3: Brighter Tech Grid
    textures['skibidi_floor_l3'] = createDetailedTexture('minecraft_tile', '#5566AA'); 
    
    // Level 4: Brighter Burnt Ground
    textures['skibidi_floor_l4'] = createDetailedTexture('minecraft_sand', '#996666'); 
    
    return textures;
};
