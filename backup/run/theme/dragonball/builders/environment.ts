
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
        new THREE.MeshStandardMaterial({ color: 0xFFA500, roughness: 0.5 }) 
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

// --- HELPER: Create Detailed Floating Object ---
const createFlyingObject = (type: 'rock' | 'orb' | 'candy' | 'dragonball', x: number, y: number, z: number, group: THREE.Group, scale: number = 1.0) => {
    const obj = new THREE.Group();
    obj.name = 'bg_floater'; 
    
    // Default Motion Data (Fast & Random)
    let rotSpeedX = (Math.random()-0.5) * 2;
    let rotSpeedY = (Math.random()-0.5) * 2;
    let floatSpeed = 1 + Math.random();

    if (type === 'rock') {
        const geo = new THREE.DodecahedronGeometry(0.8, 0);
        const mat = new THREE.MeshStandardMaterial({ color: COLORS.flyerStone, roughness: 0.9 });
        const main = new THREE.Mesh(geo, mat);
        main.castShadow = true; main.receiveShadow = true;
        obj.add(main);
        for(let i=0; i<3; i++) {
            const s = 0.2 + Math.random()*0.2;
            const sat = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mat);
            sat.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2);
            obj.add(sat);
        }
    } 
    else if (type === 'orb') {
        const coreGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x330000, emissiveIntensity: 0.5 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        obj.add(core);
        const spikeGeo = new THREE.ConeGeometry(0.1, 0.8, 8);
        const spikeMat = new THREE.MeshStandardMaterial({ color: 0xFF0000, emissive: 0xFF0000 });
        for(let i=0; i<6; i++) {
            const s = new THREE.Mesh(spikeGeo, spikeMat);
            s.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            obj.add(s);
        }
    }
    else if (type === 'candy') {
        const geo = new THREE.SphereGeometry(0.5, 16, 16);
        const mat = new THREE.MeshStandardMaterial({ color: COLORS.flyerCandy, roughness: 0.2, metalness: 0.3 });
        const candy = new THREE.Mesh(geo, mat);
        obj.add(candy);
        const ringGeo = new THREE.TorusGeometry(0.6, 0.05, 8, 20);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI/2;
        obj.add(ring);
    }
    else if (type === 'dragonball') {
        // Floating Dragon Ball
        const geo = new THREE.SphereGeometry(1.2, 24, 24);
        const mat = new THREE.MeshStandardMaterial({ 
            color: 0xFFA500, 
            emissive: 0xFF4400, 
            emissiveIntensity: 0.6,
            roughness: 0.1,
            metalness: 0.2,
            transparent: true,
            opacity: 0.5,
            depthWrite: false // Allows seeing stars inside
        });
        const ball = new THREE.Mesh(geo, mat);
        obj.add(ball);

        // Add Stars (Red Cylinders inside)
        const starMat = new THREE.MeshBasicMaterial({ color: 0xD00000 });
        const starCount = Math.floor(Math.random() * 7) + 1;
        
        for(let s=0; s<starCount; s++) {
            const star = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 5), starMat);
            // Distribute points on sphere surface approx uniformly, slightly inside surface
            const phi = Math.acos( -1 + ( 2 * s ) / starCount );
            const theta = Math.sqrt( starCount * Math.PI ) * phi;
            
            star.position.setFromSphericalCoords(0.9, phi, theta);
            star.lookAt(0,0,0);
            star.rotateX(Math.PI/2);
            obj.add(star);
        }

        // Slower, graceful motion for Dragon Balls
        rotSpeedX = (Math.random() - 0.5) * 0.5;
        rotSpeedY = (Math.random() - 0.5) * 0.5;
        floatSpeed = 0.5 + Math.random() * 0.5;
    }

    obj.scale.set(scale, scale, scale);
    obj.position.set(x, y, z);
    
    obj.userData = { 
        rotSpeedX: rotSpeedX, 
        rotSpeedY: rotSpeedY, 
        floatSpeed: floatSpeed, 
        floatOffset: Math.random() * 10 
    };
    group.add(obj);
};

export const decorateChunk = (group: THREE.Group, levelConfig: LevelConfig, roadWidth: number, chunkDepth: number, textures: TextureMap) => {
    const edgeX = roadWidth / 2;
    const type = levelConfig.fence.type;
    
    // --- 0. SAND RAILS (Tutorial) + HIGH QUALITY PALM TREES ---
    if (type === 'sand_rail') {
        // Increased Width by ~15% (2.0 -> 2.3)
        const bankW = 2.3; 
        const bankH = 0.5;
        const bankGeo = new THREE.BoxGeometry(bankW, bankH, chunkDepth);
        const bankMat = new THREE.MeshStandardMaterial({ color: COLORS.sand, roughness: 1.0 });
        
        const lBank = new THREE.Mesh(bankGeo, bankMat); 
        lBank.position.set(-edgeX - bankW/2, bankH/2 - 0.2, 0); 
        lBank.receiveShadow = true; 
        group.add(lBank);
        
        const rBank = new THREE.Mesh(bankGeo, bankMat); 
        rBank.position.set(edgeX + bankW/2, bankH/2 - 0.2, 0); 
        rBank.receiveShadow = true; 
        group.add(rBank);

        // --- HIGH QUALITY PALM TREE BUILDER ---
        const createDetailedPalmTree = (x: number, z: number, scale: number) => {
            const tree = new THREE.Group();
            
            // 1. Curved Trunk (Stacked Cylinders)
            const trunkColor = 0x8B4513;
            const trunkMat = new THREE.MeshStandardMaterial({ color: trunkColor, roughness: 0.9 });
            const segments = 5;
            const segHeight = 0.8 * scale;
            let currentY = 0;
            let currentX = 0;
            let currentZ = 0;
            // Random slight lean direction
            const leanX = (Math.random() - 0.5) * 0.2;
            const leanZ = (Math.random() - 0.5) * 0.2;

            for(let i=0; i<segments; i++) {
                const radiusBot = (0.35 - i*0.04) * scale;
                const radiusTop = (0.32 - i*0.04) * scale;
                const segGeo = new THREE.CylinderGeometry(radiusTop, radiusBot, segHeight, 7);
                const seg = new THREE.Mesh(segGeo, trunkMat);
                
                // Position relative to curve
                seg.position.set(currentX, currentY + segHeight/2, currentZ);
                
                // Rotate slightly to follow curve
                seg.rotation.z = -leanX * i * 0.5;
                seg.rotation.x = leanZ * i * 0.5;
                
                tree.add(seg);
                
                currentY += segHeight * 0.95; // Overlap slightly
                currentX += leanX * segHeight;
                currentZ += leanZ * segHeight;
            }

            // 2. Coconuts
            const cocoGroup = new THREE.Group();
            cocoGroup.position.set(currentX, currentY - 0.2*scale, currentZ);
            const cocoMat = new THREE.MeshStandardMaterial({ color: 0x4B3621 });
            for(let c=0; c<3; c++) {
                const coco = new THREE.Mesh(new THREE.DodecahedronGeometry(0.15*scale), cocoMat);
                const angle = (c / 3) * Math.PI * 2;
                coco.position.set(Math.cos(angle)*0.25*scale, 0, Math.sin(angle)*0.25*scale);
                cocoGroup.add(coco);
            }
            tree.add(cocoGroup);

            // 3. Fronds (Detailed Leaves)
            const top = new THREE.Group();
            top.position.set(currentX, currentY, currentZ);
            const leafColor = 0x228B22;
            const leafMat = new THREE.MeshStandardMaterial({ color: leafColor, side: THREE.DoubleSide });
            
            const frondCount = 7;
            for(let i=0; i<frondCount; i++) {
                const frond = new THREE.Group();
                const angle = (i / frondCount) * Math.PI * 2;
                frond.rotation.y = angle;
                
                // Main Leaf Part (Angled Up)
                const part1 = new THREE.Mesh(new THREE.PlaneGeometry(0.4*scale, 1.2*scale), leafMat);
                part1.position.set(0, 0.5*scale, 0.2*scale); // Offset out
                part1.rotation.x = -Math.PI / 4;
                part1.scale.set(1, 1, 1);
                
                // Drooping Tip
                const part2 = new THREE.Mesh(new THREE.PlaneGeometry(0.3*scale, 1.0*scale), leafMat);
                part2.position.set(0, 1.1*scale, 0.8*scale);
                part2.rotation.x = -Math.PI / 1.8; // Droop down more
                
                frond.add(part1);
                frond.add(part2);
                
                top.add(frond);
            }
            tree.add(top);

            // Updated Y position: 0.2 ensures it sinks slightly into the sand bank (top is ~0.3)
            tree.position.set(x, 0.2, z);
            tree.rotation.y = Math.random() * Math.PI * 2;
            
            castShadows(tree);
            group.add(tree);
        };

        // Place Palms
        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 12) {
            if (Math.random() > 0.4) {
                const s = 0.9 + Math.random() * 0.6; 
                createDetailedPalmTree(-edgeX - 1.2, z + Math.random()*5, s);
            }
            if (Math.random() > 0.4) {
                const s = 0.9 + Math.random() * 0.6;
                createDetailedPalmTree(edgeX + 1.2, z + Math.random()*5, s);
            }
        }
    }
    
    // --- 1. BUDOKAI WALL (Arena) ---
    else if (type === 'budokai_wall') {
        const bufferW = 10.0;
        const groundGeo = new THREE.PlaneGeometry(bufferW, chunkDepth);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.8 }); 
        const lGround = new THREE.Mesh(groundGeo, groundMat); lGround.rotation.x = -Math.PI/2; lGround.position.set(-edgeX - bufferW/2, -0.05, 0); group.add(lGround);
        const rGround = new THREE.Mesh(groundGeo, groundMat); rGround.rotation.x = -Math.PI/2; rGround.position.set(edgeX + bufferW/2, -0.05, 0); group.add(rGround);

        const wallDist = edgeX + 1.2;
        const baseH = 0.4;
        const wallH = 1.0;
        const wallThick = 0.6;
        
        const segmentLen = 4.0;
        for(let z = -chunkDepth/2; z < chunkDepth/2; z += segmentLen) {
            [-1, 1].forEach(side => {
                const x = side * wallDist;
                const segGroup = new THREE.Group();
                segGroup.position.set(x, 0, z + segmentLen/2);
                
                createBox(wallThick, baseH, segmentLen, COLORS.arenaBase, 0, baseH/2, 0, segGroup);
                createBox(wallThick - 0.1, 0.3, segmentLen - 0.6, COLORS.arenaWall, 0, baseH + 0.15, 0, segGroup);
                createBox(wallThick - 0.1, 0.3, segmentLen - 0.6, COLORS.arenaWall, 0, baseH + wallH - 0.15, 0, segGroup);
                
                const latticeY = baseH + 0.5;
                const latW = 0.15;
                createBox(wallThick - 0.2, 0.4, latW, COLORS.arenaWall, 0, latticeY, -1.0, segGroup);
                createBox(wallThick - 0.2, 0.4, latW, COLORS.arenaWall, 0, latticeY, 0, segGroup);
                createBox(wallThick - 0.2, 0.4, latW, COLORS.arenaWall, 0, latticeY, 1.0, segGroup);
                createBox(wallThick - 0.25, 0.1, segmentLen - 0.6, COLORS.arenaWall, 0, latticeY, 0, segGroup);

                const pillarW = wallThick + 0.1;
                createBox(pillarW, wallH + 0.2, 0.5, COLORS.arenaWall, 0, baseH + wallH/2, -segmentLen/2 + 0.25, segGroup); 

                const roofColor = COLORS.arenaRoof;
                const roofW = wallThick + 1.0;
                const roofGeo = new THREE.BoxGeometry(roofW, 0.2, segmentLen + 0.2);
                const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.4 });
                
                createBox(0.4, 0.2, segmentLen + 0.2, roofColor, 0, baseH + wallH + 0.4, 0, segGroup);
                
                const slopeL = new THREE.Mesh(roofGeo, roofMat);
                slopeL.position.set(side * -0.3, baseH + wallH + 0.2, 0);
                slopeL.rotation.z = side * 0.3; 
                segGroup.add(slopeL);

                createBox(roofW + 0.2, 0.1, 0.1, roofColor, 0, baseH + wallH + 0.1, -segmentLen/2, segGroup);
                group.add(segGroup);
            });
        }

        if (Math.random() > 0.6) createFlyingObject('rock', -edgeX - 3 - Math.random()*3, 3 + Math.random()*2, 0, group);
        if (Math.random() > 0.6) createFlyingObject('rock', edgeX + 3 + Math.random()*3, 3 + Math.random()*2, 0, group);
    }
    
    // --- 2. NAMEK BIOMES (Varied Color Blocks) ---
    else if (type === 'namek_biomes') {
        const railW = 4.0; 
        const railH = 0.8; // Low bank
        
        const blockColors = [
            0x888888, // Grey
            COLORS.namekGrass, // Original Green
            0xFFFFF0  // Ivory
        ];

        // Create segmented blocks instead of one long rail
        const blockSize = 2.0;
        for (let z = -chunkDepth/2; z < chunkDepth/2; z += blockSize) {
            const color = blockColors[Math.floor(Math.random() * blockColors.length)];
            const mat = new THREE.MeshStandardMaterial({ color: color });
            const geo = new THREE.BoxGeometry(railW, railH, blockSize);
            
            // Left Block
            const lBlock = new THREE.Mesh(geo, mat);
            lBlock.position.set(-edgeX - railW/2, railH/2 - 0.2, z + blockSize/2);
            lBlock.receiveShadow = true;
            group.add(lBlock);

            // Right Block
            const rBlock = new THREE.Mesh(geo, mat);
            rBlock.position.set(edgeX + railW/2, railH/2 - 0.2, z + blockSize/2);
            rBlock.receiveShadow = true;
            group.add(rBlock);
        }

        // 3. Ajisa Trees (Placed on the rails)
        const createAjisaTree = (x: number, z: number) => {
            const tree = new THREE.Group();
            const trunkH = 4.0 + Math.random() * 2.0;
            const trunkMat = new THREE.MeshStandardMaterial({ color: COLORS.namekTreeTrunk });
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, trunkH, 8), trunkMat);
            trunk.position.y = trunkH / 2; tree.add(trunk);
            for(let i=0; i<3; i++) {
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 4), trunkMat);
                spike.position.y = 1.0 + Math.random() * (trunkH - 2.0);
                spike.rotation.set(0, Math.random()*Math.PI, Math.random()*Math.PI);
                spike.position.x = Math.sin(spike.rotation.y) * 0.3;
                spike.position.z = Math.cos(spike.rotation.y) * 0.3;
                tree.add(spike);
            }
            const folMat = new THREE.MeshStandardMaterial({ color: COLORS.namekTreeLeaf, flatShading: true });
            const mainFol = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5, 1), folMat);
            mainFol.position.y = trunkH; tree.add(mainFol);
            const subCount = 2 + Math.floor(Math.random() * 3);
            for(let k=0; k<subCount; k++) {
                const sub = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5, 1), folMat);
                const s = 0.5 + Math.random() * 0.3; sub.scale.set(s,s,s);
                const a = Math.random() * Math.PI * 2;
                sub.position.set(Math.cos(a)*1.0, trunkH - 0.5 + Math.random(), Math.sin(a)*1.0);
                tree.add(sub);
            }
            tree.position.set(x, railH - 0.2, z); 
            castShadows(tree); 
            return tree;
        };

        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 12) {
            if (Math.random() > 0.4) group.add(createAjisaTree(-edgeX - 1.5 - Math.random() * 1.5, z + Math.random() * 5));
            if (Math.random() > 0.4) group.add(createAjisaTree(edgeX + 1.5 + Math.random() * 1.5, z + Math.random() * 5));
        }
    }

    // --- 3. LEVEL 3: DARK RUINS ---
    else if (type === 'euro_rail_dark') {
        const railX = edgeX + 0.4; const railColor = COLORS.l3RailDark; const pillarColor = 0x332222; 
        createBox(0.8, 0.4, chunkDepth, pillarColor, -railX, 0.2, 0, group);
        createBox(0.8, 0.4, chunkDepth, pillarColor, railX, 0.2, 0, group);
        const pillarSpacing = 3.0;
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=pillarSpacing) {
            const pH = 1.8;
            createBox(0.6, pH, 0.6, pillarColor, -railX, pH/2, z, group);
            createBox(0.6, pH, 0.6, pillarColor, railX, pH/2, z, group);
            createBox(0.8, 0.2, 0.8, railColor, -railX, pH, z, group);
            createBox(0.8, 0.2, 0.8, railColor, railX, pH, z, group);
            if (z + pillarSpacing < chunkDepth/2) {
                const midZ = z + pillarSpacing/2; const dist = pillarSpacing - 0.6;
                createBox(0.3, 0.2, dist, railColor, -railX, pH - 0.3, midZ, group);
                createBox(0.3, 0.2, dist, railColor, railX, pH - 0.3, midZ, group);
                createBox(0.3, 0.2, dist, railColor, -railX, 0.5, midZ, group);
                createBox(0.3, 0.2, dist, railColor, railX, 0.5, midZ, group);
                const bCount = 3; const bSpace = dist / (bCount + 1);
                for(let k=1; k<=bCount; k++) {
                    createBox(0.15, 1.0, 0.15, railColor, -railX, 1.0, z + k*bSpace, group);
                    createBox(0.15, 1.0, 0.15, railColor, railX, 1.0, z + k*bSpace, group);
                }
            }
        }
        if (Math.random() > 0.5) createFlyingObject('orb', -edgeX - 4, 4 + Math.random()*2, 0, group);
        if (Math.random() > 0.5) createFlyingObject('orb', edgeX + 4, 4 + Math.random()*2, 0, group);
    }

    // --- 4. LEVEL 4: PINK ROCKS (Black/White/Purple Rocks) ---
    else if (type === 'pink_rocks') {
        const bufferW = 7.0; 
        
        const groundGeo = new THREE.PlaneGeometry(bufferW, chunkDepth);
        const groundMat = new THREE.MeshStandardMaterial({ color: COLORS.l4PinkFloor, roughness: 0.6 });
        const lGround = new THREE.Mesh(groundGeo, groundMat); lGround.rotation.x = -Math.PI/2; lGround.position.set(-edgeX - bufferW/2 + 0.1, -0.05, 0); group.add(lGround);
        const rGround = new THREE.Mesh(groundGeo, groundMat); rGround.rotation.x = -Math.PI/2; rGround.position.set(edgeX + bufferW/2 - 0.1, -0.05, 0); group.add(rGround);
        
        const rockGeo = new THREE.DodecahedronGeometry(1, 0); 
        
        const blackMat = new THREE.MeshStandardMaterial({ color: COLORS.l4RockBlack, roughness: 0.6 });
        const whiteMat = new THREE.MeshStandardMaterial({ color: COLORS.l4RockWhite, roughness: 0.6 });
        const purpleMat = new THREE.MeshStandardMaterial({ color: COLORS.l4RockPurple, roughness: 0.6 });

        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 4) {
            const getMat = () => {
                const r = Math.random();
                if (r < 0.33) return blackMat;
                if (r < 0.66) return whiteMat;
                return purpleMat;
            };

            if (Math.random() > 0.2) {
                const s = 0.8 + Math.random() * 1.5; 
                const rock = new THREE.Mesh(rockGeo, getMat());
                rock.scale.set(s, s*0.6, s); rock.position.set(-edgeX - 1.5 - Math.random() * 3, s*0.2, z + Math.random()*2);
                rock.rotation.set(Math.random(), Math.random(), Math.random()); rock.castShadow = true; rock.receiveShadow = true; group.add(rock);
            }
            if (Math.random() > 0.2) {
                const s = 0.8 + Math.random() * 1.5; 
                const rock = new THREE.Mesh(rockGeo, getMat());
                rock.scale.set(s, s*0.6, s); rock.position.set(edgeX + 1.5 + Math.random() * 3, s*0.2, z + Math.random()*2);
                rock.rotation.set(Math.random(), Math.random(), Math.random()); rock.castShadow = true; rock.receiveShadow = true; group.add(rock);
            }
        }
        if (Math.random() > 0.5) createFlyingObject('candy', -edgeX - 4, 3 + Math.random()*3, 0, group);
        if (Math.random() > 0.5) createFlyingObject('candy', edgeX + 4, 3 + Math.random()*3, 0, group);
    }

    // --- GLOBAL DECORATION: FLYING DRAGON BALLS (ALL LEVELS) ---
    // Added at the end to ensure it runs for every chunk type
    
    // Scale Logic: Full size for Namek (Level 2), 70% for others
    const dbScale = (type === 'namek_biomes') ? 1.0 : 0.7;

    for(let z = -chunkDepth/2; z < chunkDepth/2; z += 15) {
        // Left Side
        if (Math.random() > 0.6) {
            const dist = 10 + Math.random() * 8; // Further out
            const height = 4 + Math.random() * 6; // High up
            createFlyingObject('dragonball', -edgeX - dist, height, z, group, dbScale);
        }
        // Right Side
        if (Math.random() > 0.6) {
            const dist = 10 + Math.random() * 8;
            const height = 4 + Math.random() * 6;
            createFlyingObject('dragonball', edgeX + dist, height, z, group, dbScale);
        }
    }
};

const createCheckerTexture = (c1: string, c2: string): THREE.Texture => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = c1; ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = c2;
        const tileSize = 64;
        for(let y=0; y<size; y+=tileSize) {
            for(let x=0; x<size; x+=tileSize) {
                if ((x/tileSize + y/tileSize) % 2 === 0) ctx.fillRect(x, y, tileSize, tileSize);
            }
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter;
    return tex;
};

const createPastelMarbleTexture = (): THREE.Texture => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#68C2D3'; 
        ctx.fillRect(0, 0, size, size);
        ctx.strokeStyle = '#82E0AA';
        ctx.lineWidth = 20;
        ctx.globalAlpha = 0.5;
        for(let i=0; i<10; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random()*size, Math.random()*size);
            ctx.bezierCurveTo(Math.random()*size, Math.random()*size, Math.random()*size, Math.random()*size, Math.random()*size, Math.random()*size);
            ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};

const createCustomNoiseTexture = (c1: string, c2: string, c3: string, scale: number): THREE.Texture => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = c1; ctx.fillRect(0, 0, size, size);
        for(let i=0; i<5000; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? c2 : c3;
            const s = Math.random() * 4 * scale;
            ctx.fillRect(Math.random()*size, Math.random()*size, s, s);
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter;
    return tex;
};

export const generateTextures = () => {
    const textures: Record<string, THREE.Texture> = {};
    textures['db_sand_detail'] = createDetailedTexture('minecraft_sand', '#FFF8B1');
    textures['db_arena_tile'] = createCheckerTexture('#E0E0E0', '#909090');
    textures['db_namek_ground'] = createPastelMarbleTexture();
    const lavaCanvas = document.createElement('canvas');
    lavaCanvas.width = 128; lavaCanvas.height = 128;
    const lCtx = lavaCanvas.getContext('2d');
    if (lCtx) {
        lCtx.fillStyle = '#1A0500'; lCtx.fillRect(0, 0, 128, 128);
        for(let i=0; i<400; i++) {
            lCtx.fillStyle = Math.random() > 0.5 ? '#2E1505' : '#0F0200'; lCtx.fillRect(Math.random()*128, Math.random()*128, 4, 4);
        }
        for(let i=0; i<60; i++) {
            const lx = Math.random() * 128; const ly = Math.random() * 128; const size = Math.random() * 8 + 4;
            lCtx.fillStyle = Math.random() > 0.3 ? '#FF4500' : '#FF8C00'; lCtx.fillRect(lx, ly, size, size);
            lCtx.fillStyle = '#FFA500'; lCtx.fillRect(lx + size/4, ly + size/4, size/2, size/2);
        }
    }
    const lavaTex = new THREE.CanvasTexture(lavaCanvas);
    lavaTex.magFilter = THREE.NearestFilter;
    textures['db_lava_stone'] = lavaTex;
    textures['db_pink'] = createCustomNoiseTexture('#8B008B', '#000000', '#9932CC', 1.5);
    return textures;
};
