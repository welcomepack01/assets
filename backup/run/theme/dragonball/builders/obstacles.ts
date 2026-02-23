
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

export const createJumpObstacle = () => {
    // --- SCATTERED ROCK DEBRIS (High Density + Edge Rocks) ---
    const group = new THREE.Group();
    group.name = 'RockDebrisGroup';

    const rockColors = [0x707070, 0x555555, 0x888888, 0x654321]; 
    const laneWidth = 7.0;

    // 1. Random Scattered Debris (Background/Fill)
    const count = 35;
    for(let i=0; i<count; i++) {
        const rock = new THREE.Group();
        rock.name = 'DebrisPiece'; 

        const scale = 0.25 + Math.random() * 0.45; 
        const color = rockColors[Math.floor(Math.random() * rockColors.length)];
        
        const geo = new THREE.DodecahedronGeometry(scale, 0);
        const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.9, flatShading: true });
        const mesh = new THREE.Mesh(geo, mat);
        
        mesh.scale.set(1.0 + Math.random()*0.5, 0.8 + Math.random()*0.5, 1.0 + Math.random()*0.5);
        mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        
        rock.add(mesh);

        const xPos = (Math.random() - 0.5) * laneWidth;
        const yPos = 0.2 + Math.random() * 0.5; 
        const zPos = (Math.random() - 0.5) * 2.0;

        rock.position.set(xPos, yPos, zPos);
        rock.userData = { 
            rotSpeedX: (Math.random() - 0.5) * 2.0, 
            rotSpeedY: (Math.random() - 0.5) * 2.0,
            floatOffset: Math.random() * Math.PI * 2
        };
        group.add(rock);
    }

    // 2. Explicit Edge Rocks (2 on Left, 2 on Right)
    const addEdgeRock = (x: number, z: number, scale: number) => {
        const rock = new THREE.Group();
        rock.name = 'DebrisPiece'; // Animate these too
        
        const geo = new THREE.DodecahedronGeometry(scale, 0);
        const mat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8, flatShading: true });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.set(Math.random(), Math.random(), Math.random());
        rock.add(mesh);
        
        rock.position.set(x, scale * 0.8, z);
        rock.userData = { rotSpeedX: 0.2, rotSpeedY: 0.1, floatOffset: Math.random() };
        group.add(rock);
    };

    // Left Side Rocks
    addEdgeRock(-3.0, 0.5, 0.7);
    addEdgeRock(-3.8, -0.5, 0.6);

    // Right Side Rocks
    addEdgeRock(3.0, 0.5, 0.7);
    addEdgeRock(3.8, -0.5, 0.6);

    castShadows(group); 
    return group;
};

export const createCrouchObstacle = (heightScale) => {
    // Stone Gate with Haetae Relief (Replaces Budokai Gate)
    const group = new THREE.Group();
    const gate = new THREE.Group(); gate.name = 'StoneGate';
    
    const cPillar = 0xEEEEEE; 
    const cBase = 0x888888;   
    const cRoof = 0xC4A484;   
    const cDetail = 0xAAAAAA; 
    
    const pillarH = 4.5;
    const gateWidth = 10.0;
    
    const createPillar = (x: number) => {
        const p = new THREE.Group();
        p.position.set(x, 0, 0);
        createBox(1.2, 0.8, 1.2, cBase, 0, 0.4, 0, p);
        createBox(0.8, pillarH, 0.8, cPillar, 0, 0.8 + pillarH/2, 0, p);
        createBox(1.0, 0.4, 1.0, cDetail, 0, 0.8 + pillarH, 0, p);
        return p;
    };
    gate.add(createPillar(-gateWidth/2));
    gate.add(createPillar(gateWidth/2));

    createBox(gateWidth + 1.5, 0.5, 0.6, cPillar, 0, 3.5, 0, gate);
    createBox(gateWidth + 2.5, 0.6, 0.8, cPillar, 0, 4.8, 0, gate);

    const roofY = 5.4;
    const roofW = gateWidth + 4.5;
    
    createBox(roofW, 0.7, 2.5, cRoof, 0, roofY, 0, gate);
    createBox(roofW - 0.5, 0.3, 0.4, cBase, 0, roofY + 0.5, 0, gate);
    
    const tipL = new THREE.Group(); tipL.position.set(-roofW/2 - 0.5, roofY + 0.2, 0);
    createBox(1.5, 0.3, 2.6, cRoof, 0, 0, 0, tipL).rotation.z = 0.4;
    gate.add(tipL);
    
    const tipR = new THREE.Group(); tipR.position.set(roofW/2 + 0.5, roofY + 0.2, 0);
    createBox(1.5, 0.3, 2.6, cRoof, 0, 0, 0, tipR).rotation.z = -0.4;
    gate.add(tipR);

    // Decorative Panel
    createBox(2.8, 2.2, 0.3, cDetail, 0, 4.2, 0, gate);

    // --- ULTRA HIGH QUALITY HAETAE FACE (Voxel) ---
    const createHaetae = () => {
        const h = new THREE.Group();
        const stone = 0xAAAAAA;
        const darkStone = 0x777777;
        const deepShadow = 0x444444;
        const toothColor = 0xF0F0F0;
        const eyeColor = 0xFFD700; 
        const goldAccent = 0xD4AF37;

        // Helper for symmetry
        const mirrorX = (fn: (dir: number) => void) => { fn(1); fn(-1); };

        // 1. Backing / Mane Base (Circular-ish)
        // Center
        createBox(1.8, 1.6, 0.2, darkStone, 0, 0, 0, h);
        
        // Mane Curls (Outer Ring) - represented by blocks
        const curlSize = 0.25;
        const positions = [
            [0, 0.9], [0.6, 0.8], [1.0, 0.4], [1.1, -0.2], [0.9, -0.7], // Right side positions
            [0.5, -1.0], [0, -1.1] // Bottom
        ];
        
        positions.forEach(([x, y]) => {
            if (x === 0) {
                // Center ones
                createBox(curlSize*1.2, curlSize*1.2, 0.25, stone, 0, y, 0.05, h);
            } else {
                mirrorX((dir) => {
                    createBox(curlSize, curlSize, 0.25, stone, x * dir, y, 0.05, h);
                    // Add detail 'swirl' inset
                    createBox(curlSize*0.6, curlSize*0.6, 0.05, deepShadow, x * dir, y, 0.18, h);
                });
            }
        });

        // 2. Face Main Mass
        createBox(1.2, 1.0, 0.3, stone, 0, 0.1, 0.2, h);

        // 3. Eyebrows (Thick, curled)
        mirrorX((dir) => {
            const bx = 0.35 * dir;
            const by = 0.45;
            createBox(0.35, 0.15, 0.1, darkStone, bx, by, 0.35, h).rotation.z = dir * 0.2;
            createBox(0.15, 0.15, 0.12, stone, bx + (dir*0.2), by+0.05, 0.35, h); // Curl end
        });

        // 4. Eyes (Fierce)
        mirrorX((dir) => {
            const ex = 0.3 * dir;
            const ey = 0.25;
            createBox(0.2, 0.12, 0.05, 0x000000, ex, ey, 0.35, h); // Socket
            createBox(0.12, 0.08, 0.06, eyeColor, ex, ey, 0.36, h); // Eye
            createBox(0.04, 0.04, 0.07, 0x000000, ex, ey, 0.37, h); // Pupil
        });

        // 5. Nose (Bulbous, Lion-like)
        createBox(0.4, 0.25, 0.25, stone, 0, 0.05, 0.4, h); // Bridge
        createBox(0.5, 0.2, 0.2, darkStone, 0, -0.1, 0.45, h); // Nostril flare base
        mirrorX((dir) => {
            createBox(0.15, 0.15, 0.05, 0x222222, 0.15*dir, -0.15, 0.55, h); // Nostril holes
        });

        // 6. Upper Jaw / Snout
        createBox(0.7, 0.2, 0.3, stone, 0, -0.25, 0.4, h);
        
        // 7. Mouth (Open)
        createBox(0.6, 0.3, 0.1, 0x220000, 0, -0.45, 0.38, h); // Mouth void

        // 8. Teeth (Fangs)
        mirrorX((dir) => {
            // Upper Fangs
            createBox(0.08, 0.18, 0.08, toothColor, 0.2*dir, -0.3, 0.45, h);
            // Lower Fangs
            createBox(0.08, 0.18, 0.08, toothColor, 0.2*dir, -0.55, 0.45, h);
            // Small teeth row
            createBox(0.1, 0.08, 0.05, toothColor, 0.08*dir, -0.28, 0.42, h);
        });

        // 9. Lower Jaw
        createBox(0.6, 0.2, 0.3, stone, 0, -0.65, 0.4, h);
        // Beard / Chin hair
        createBox(0.2, 0.3, 0.15, darkStone, 0, -0.85, 0.35, h);
        mirrorX((dir) => {
            createBox(0.15, 0.25, 0.15, darkStone, 0.15*dir, -0.8, 0.3, h).rotation.z = -dir*0.2;
        });

        // 10. Forehead Decoration (Horn/Bump)
        createBox(0.2, 0.3, 0.15, stone, 0, 0.6, 0.3, h);
        createBox(0.1, 0.1, 0.2, goldAccent, 0, 0.6, 0.38, h);

        // 11. The Bell (Hanging below)
        const bellY = -1.2;
        // Connector
        createBox(0.4, 0.1, 0.1, darkStone, 0, -0.95, 0.2, h); // Collar
        createBox(0.1, 0.2, 0.1, goldAccent, 0, -1.05, 0.2, h); // Ring
        
        // Bell Body
        createBox(0.5, 0.4, 0.4, stone, 0, bellY, 0.2, h); 
        createBox(0.6, 0.1, 0.5, stone, 0, bellY-0.1, 0.2, h); // Rim
        createBox(0.4, 0.2, 0.4, darkStone, 0, bellY, 0.21, h); // Detail band
        
        // Bell Pattern
        mirrorX((dir) => {
            createBox(0.1, 0.15, 0.42, goldAccent, 0.15*dir, bellY, 0.2, h);
        });

        return h;
    };

    const haetae = createHaetae();
    // Position on Front (+Z side), and tilt down slightly to face player
    haetae.position.set(0, 4.2, 0.3); 
    haetae.rotation.x = 0.2; 
    gate.add(haetae);

    group.add(gate);
    castShadows(group); return group;
};

export const createBigJumpObstacle = () => {
    // --- PRISTINE BUDOKAI WALL (High Detail) ---
    const group = new THREE.Group();
    group.name = 'DetailedWall';

    // Budokai Colors
    const baseColor = COLORS.arenaBase; // Dark Grey Base
    const wallColor = COLORS.arenaWall; // White Wall
    const roofColor = COLORS.arenaRoof; // Black/Dark Grey Roof
    const latticeColor = 0xDDDDDD; // Light Grey for patterns

    const wallWidth = 14.0;
    const wallDepth = 1.0;
    const totalHeight = 3.5; 

    // 1. Base Foundation (Sturdy)
    createBox(wallWidth + 0.5, 0.8, wallDepth + 0.2, baseColor, 0, 0.4, 0, group);

    // 2. Main Wall Body with Pillars
    const wallBodyH = 2.0;
    const wallBodyY = 0.8;
    
    // Main white slab
    createBox(wallWidth, wallBodyH, wallDepth, wallColor, 0, wallBodyY + wallBodyH/2, 0, group);

    // Vertical Pillars (Dividing the wall into sections)
    const pillarW = 0.8;
    const pillarDepth = wallDepth + 0.2;
    [-6, -2, 2, 6].forEach(x => {
        createBox(pillarW, wallBodyH, pillarDepth, baseColor, x, wallBodyY + wallBodyH/2, 0, group);
    });

    // 3. Lattice Pattern Windows (In between pillars)
    const windowY = wallBodyY + wallBodyH/2;
    [-4, 0, 4].forEach(x => {
        // Recessed frame
        createBox(2.5, 1.2, wallDepth + 0.05, 0xCCCCCC, x, windowY, 0, group);
        
        // Lattice Grid (Horizontal & Vertical bars)
        // Horizontals
        createBox(2.2, 0.1, wallDepth + 0.1, latticeColor, x, windowY + 0.3, 0, group);
        createBox(2.2, 0.1, wallDepth + 0.1, latticeColor, x, windowY - 0.3, 0, group);
        // Verticals
        createBox(0.1, 1.0, wallDepth + 0.1, latticeColor, x - 0.5, windowY, 0, group);
        createBox(0.1, 1.0, wallDepth + 0.1, latticeColor, x + 0.5, windowY, 0, group);
        createBox(0.1, 1.0, wallDepth + 0.1, latticeColor, x, windowY, 0, group);
    });

    // 4. Roof Structure (Curved Asian Style)
    const roofY = wallBodyY + wallBodyH;
    const roofH = 0.7;
    const roofOverhang = 0.5;
    
    // Main Roof Block
    createBox(wallWidth + 1.0, 0.2, wallDepth + 0.4, baseColor, 0, roofY + 0.1, 0, group);
    
    // Sloped Tiles (Approximated with scaled boxes)
    const tileW = wallWidth + 2.0;
    const tileD = wallDepth + 0.8;
    
    // Center Roof
    createBox(tileW, 0.4, tileD, roofColor, 0, roofY + 0.4, 0, group);
    // Ridge
    createBox(tileW, 0.15, 0.3, baseColor, 0, roofY + 0.65, 0, group);

    // Upturned Corners (Eaves)
    const eaveW = 1.2;
    const eaveH = 0.2;
    const eaveX = tileW/2 - 0.2;
    
    const eaveL = new THREE.Mesh(new THREE.BoxGeometry(eaveW, eaveH, tileD), new THREE.MeshStandardMaterial({ color: roofColor }));
    eaveL.position.set(-eaveX, roofY + 0.45, 0);
    eaveL.rotation.z = 0.3; // Tilt up
    group.add(eaveL);

    const eaveR = new THREE.Mesh(new THREE.BoxGeometry(eaveW, eaveH, tileD), new THREE.MeshStandardMaterial({ color: roofColor }));
    eaveR.position.set(eaveX, roofY + 0.45, 0);
    eaveR.rotation.z = -0.3; // Tilt up
    group.add(eaveR);

    // 5. Decorative Top Ornaments (Little spikes/spheres on roof ridge)
    for(let x=-6; x<=6; x+=2) {
        const ornament = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.15),
            new THREE.MeshStandardMaterial({ color: 0xD4AF37 }) // Gold accents
        );
        ornament.position.set(x, roofY + 0.8, 0);
        group.add(ornament);
    }

    castShadows(group); 
    return group;
};

// NEW: Pass-Through Wall (Image + Video Overlay)
export const createPassThroughWall = (width: number, height: number, texture: THREE.Texture, videoTexture?: THREE.Texture) => {
    const group = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.NormalBlending, opacity: 1.0 });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.y = height / 2;
    group.add(wall);
    if (videoTexture) {
        const overlayMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.5 });
        const overlay = new THREE.Mesh(geometry, overlayMaterial);
        overlay.position.y = height / 2; overlay.position.z = 0.05;
        group.add(overlay);
    }
    return group;
};
