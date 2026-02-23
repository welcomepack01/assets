
import * as THREE from 'three';
import { createBox, castShadows, createToiletShape, createHead } from '../utils';
import { COLORS } from '../constants';

export const createDodgeObstacle = (variant: 'A' | 'B') => {
    const group = new THREE.Group();
    
    if (variant === 'A') { 
        // --- DODGE 1: CAMERAMAN (High Quality with Rifle) ---
        const cameraman = new THREE.Group(); 
        cameraman.name = 'Cameraman'; 

        const suitBlack = 0x111111;
        const shirtWhite = 0xFFFFFF;
        const tieRed = 0x880000; 
        const cameraGrey = 0xD4D4D4; 
        const cameraDark = 0x555555;
        const lensBlack = 0x000000;
        const lensGlass = 0x87CEEB; 
        
        // 1. Legs
        const legW = 0.24;
        const legH = 1.1;
        const hipY = 1.1;

        const lLeg = new THREE.Group(); lLeg.name = 'L_Leg'; lLeg.position.set(-0.22, hipY, 0); cameraman.add(lLeg);
        createBox(legW, legH, legW, suitBlack, 0, -legH/2, 0, lLeg);
        createBox(legW+0.02, 0.15, legW+0.05, suitBlack, 0, -legH + 0.075, 0.05, lLeg); 

        const rLeg = new THREE.Group(); rLeg.name = 'R_Leg'; rLeg.position.set(0.22, hipY, 0); cameraman.add(rLeg);
        createBox(legW, legH, legW, suitBlack, 0, -legH/2, 0, rLeg);
        createBox(legW+0.02, 0.15, legW+0.05, suitBlack, 0, -legH + 0.075, 0.05, rLeg); 

        // 2. Torso
        const torsoH = 0.9;
        const torso = new THREE.Group(); torso.position.set(0, hipY + torsoH/2, 0); cameraman.add(torso);
        createBox(0.6, torsoH, 0.3, shirtWhite, 0, 0, 0, torso); 
        createBox(0.2, torsoH, 0.32, suitBlack, -0.31, 0, 0, torso); 
        createBox(0.2, torsoH, 0.32, suitBlack, 0.31, 0, 0, torso); 
        createBox(0.82, torsoH, 0.1, suitBlack, 0, 0, -0.15, torso); 
        createBox(0.12, 0.7, 0.05, tieRed, 0, 0.05, 0.16, torso); 
        createBox(0.65, 0.1, 0.32, 0x000000, 0, -torsoH/2 + 0.05, 0, torso); 

        // 3. Arms
        const armL = 0.9;
        const armW = 0.22;
        
        const lArmGroup = new THREE.Group(); lArmGroup.name = 'L_Arm'; lArmGroup.position.set(-0.55, hipY + torsoH - 0.1, 0); cameraman.add(lArmGroup);
        createBox(armW, armL, armW, suitBlack, 0, -armL/2, 0, lArmGroup);
        createBox(0.2, 0.2, 0.2, 0x111111, 0, -armL, 0, lArmGroup); 

        const rArmGroup = new THREE.Group(); rArmGroup.name = 'R_Arm'; rArmGroup.position.set(0.55, hipY + torsoH - 0.1, 0); cameraman.add(rArmGroup);
        createBox(armW, armL, armW, suitBlack, 0, -armL/2, 0, rArmGroup);
        createBox(0.2, 0.2, 0.2, 0x111111, 0, -armL, 0, rArmGroup); 

        // --- WEAPON: Pulse Rifle ---
        const gun = new THREE.Group();
        gun.position.set(0, -armL, 0.4); 
        rArmGroup.add(gun);
        createBox(0.15, 0.2, 0.8, 0x333333, 0, 0, 0.2, gun); 
        createBox(0.08, 0.08, 0.6, 0x111111, 0, 0.05, 0.8, gun);
        createBox(0.12, 0.15, 0.4, 0x222222, 0, 0, -0.3, gun);
        createBox(0.1, 0.1, 0.3, 0x000000, 0, 0.15, 0.1, gun);
        createBox(0.1, 0.2, 0.15, 0x111111, 0, -0.2, 0.1, gun);

        // 4. Head (CCTV Camera)
        const headGroup = new THREE.Group(); headGroup.name = 'Head';
        headGroup.position.set(0, hipY + torsoH, 0); 
        cameraman.add(headGroup);

        // Neck
        createBox(0.2, 0.2, 0.2, 0x222222, 0, 0.1, 0, headGroup);

        // Camera Body
        const camW = 0.5; const camH = 0.4; const camD = 0.8;
        createBox(camW, camH, camD, cameraGrey, 0, 0.4, 0.1, headGroup); 
        createBox(0.35, 0.35, 0.1, lensBlack, 0, 0.4, 0.55, headGroup); 
        createBox(0.25, 0.25, 0.05, lensGlass, 0, 0.4, 0.6, headGroup);
        createBox(0.08, 0.08, 0.06, 0xFFFFFF, 0.05, 0.45, 0.6, headGroup);
        createBox(camW, camH-0.1, 0.1, cameraDark, 0, 0.4, -0.35, headGroup); 
        createBox(0.1, 0.2, 0.4, cameraDark, 0.3, 0.4, 0, headGroup);

        cameraman.scale.set(1.4, 1.4, 1.4); 
        cameraman.rotation.y = Math.PI; 

        group.add(cameraman);

    } else { 
        // --- DODGE 2: SPEAKERMAN ---
        const speakerman = new THREE.Group(); 
        speakerman.name = 'Speakerman';

        const suitBlack = 0x111111;
        const shirtWhite = 0xFFFFFF;
        const tieRed = 0x880000;
        const speakerGrey = 0x333333;
        const coneGrey = 0x555555;

        // Legs
        const legW = 0.24; const legH = 1.1; const hipY = 1.1;
        const lLeg = new THREE.Group(); lLeg.name = 'L_Leg'; lLeg.position.set(-0.22, hipY, 0); speakerman.add(lLeg);
        createBox(legW, legH, legW, suitBlack, 0, -legH/2, 0, lLeg);
        
        const rLeg = new THREE.Group(); rLeg.name = 'R_Leg'; rLeg.position.set(0.22, hipY, 0); speakerman.add(rLeg);
        createBox(legW, legH, legW, suitBlack, 0, -legH/2, 0, rLeg);

        // Torso
        const torsoH = 0.9;
        const torso = new THREE.Group(); torso.position.set(0, hipY + torsoH/2, 0); speakerman.add(torso);
        createBox(0.6, torsoH, 0.3, shirtWhite, 0, 0, 0, torso);
        createBox(0.2, torsoH, 0.32, suitBlack, -0.31, 0, 0, torso);
        createBox(0.2, torsoH, 0.32, suitBlack, 0.31, 0, 0, torso);
        createBox(0.82, torsoH, 0.1, suitBlack, 0, 0, -0.15, torso);
        createBox(0.12, 0.7, 0.05, tieRed, 0, 0.05, 0.16, torso);

        // Arms
        const armL = 0.9; const armW = 0.22;
        const lArmGroup = new THREE.Group(); lArmGroup.name = 'L_Arm'; lArmGroup.position.set(-0.55, hipY + torsoH - 0.1, 0); speakerman.add(lArmGroup);
        createBox(armW, armL, armW, suitBlack, 0, -armL/2, 0, lArmGroup);
        createBox(0.2, 0.2, 0.2, 0x111111, 0, -armL, 0, lArmGroup);

        const rArmGroup = new THREE.Group(); rArmGroup.name = 'R_Arm'; rArmGroup.position.set(0.55, hipY + torsoH - 0.1, 0); speakerman.add(rArmGroup);
        createBox(armW, armL, armW, suitBlack, 0, -armL/2, 0, rArmGroup);
        createBox(0.2, 0.2, 0.2, 0x111111, 0, -armL, 0, rArmGroup);

        // Head (Speaker)
        const headGroup = new THREE.Group(); headGroup.name = 'Head';
        headGroup.position.set(0, hipY + torsoH, 0); 
        speakerman.add(headGroup);
        
        // Neck
        createBox(0.25, 0.2, 0.25, suitBlack, 0, 0.1, 0, headGroup);

        // Main Box
        createBox(0.6, 0.5, 0.5, speakerGrey, 0, 0.45, 0, headGroup);
        
        // Main Cone
        const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.05, 0.1, 16), new THREE.MeshStandardMaterial({color: coneGrey}));
        cone.rotation.x = Math.PI/2;
        cone.position.set(0, 0.45, 0.26);
        headGroup.add(cone);
        
        // Top mini cone
        const miniConeGeo = new THREE.CylinderGeometry(0.08, 0.02, 0.05, 8);
        const miniConeMat = new THREE.MeshStandardMaterial({color: coneGrey});
        const topC = new THREE.Mesh(miniConeGeo, miniConeMat); topC.rotation.x = Math.PI/2; 
        topC.position.set(0, 0.62, 0.26); 
        headGroup.add(topC);
        
        speakerman.scale.set(1.4, 1.4, 1.4);
        group.add(speakerman);
    }
    
    castShadows(group); 
    return group;
};

export const createPunchObstacle = (variant: 'weak' | 'strong') => {
    const group = new THREE.Group();
    
    if (variant === 'weak') { 
        // --- PUNCH 1: LASER G-MAN TOILET (Attached Cannons) ---
        const gman = new THREE.Group(); gman.name = 'LaserGMan';
        
        // 1. Toilet Base (White Ceramic)
        createToiletShape(gman, 1.6);
        
        // 2. Neck (Connecting Head to Bowl)
        const neckColor = COLORS.skin;
        createBox(0.4, 0.6, 0.4, neckColor, 0, 1.0, 0.2, gman);

        // 3. Head
        const head = new THREE.Group();
        head.name = 'Head'; 
        head.position.set(0, 1.5, 0.3); 
        gman.add(head);

        // Base Head
        createBox(0.7, 0.8, 0.7, COLORS.skin, 0, 0, 0, head);

        // Brown Hair
        const hairColor = 0x5D4037; 
        createBox(0.75, 0.2, 0.75, hairColor, 0, 0.45, 0, head); // Top
        createBox(0.75, 0.5, 0.2, hairColor, 0, 0.2, -0.3, head); // Back
        createBox(0.1, 0.3, 0.6, hairColor, -0.35, 0.3, 0, head); // Side L
        createBox(0.1, 0.3, 0.6, hairColor, 0.35, 0.3, 0, head); // Side R

        // Glowing Yellow Eyes
        const eyeColor = 0xFFFF00;
        const lEye = createBox(0.18, 0.1, 0.02, eyeColor, -0.18, 0.1, 0.36, head);
        (lEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeColor);
        (lEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
        
        const rEye = createBox(0.18, 0.1, 0.02, eyeColor, 0.18, 0.1, 0.36, head);
        (rEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeColor);
        (rEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;

        // Black Pupils (Added)
        createBox(0.06, 0.06, 0.03, 0x000000, -0.18, 0.1, 0.375, head);
        createBox(0.06, 0.06, 0.03, 0x000000, 0.18, 0.1, 0.375, head);

        // Smiling Mouth
        createBox(0.5, 0.12, 0.02, 0xFFFFFF, 0, -0.2, 0.36, head);
        createBox(0.52, 0.04, 0.02, 0x3E2723, 0, -0.2, 0.365, head);

        // 4. Laser Cannons (ATTACHED TO TOILET)
        const createCannon = (side: number) => {
            const cannon = new THREE.Group();
            
            // ATTACHMENT: Connector Block (Attaches to side of toilet bowl)
            createBox(0.6, 0.25, 0.25, 0x333333, side * -0.3, 0, 0, cannon);

            // Arm extending out
            createBox(0.4, 0.15, 0.15, 0x111111, side * 0.2, 0, 0, cannon);
            
            // Cannon Body
            const barrel = new THREE.Group();
            barrel.position.set(side * 0.6, 0, 0.3); // Forward offset
            createBox(0.25, 0.35, 0.8, 0x222222, 0, 0, 0, barrel);
            createBox(0.27, 0.37, 0.1, 0x444444, 0, 0, -0.3, barrel);
            createBox(0.27, 0.37, 0.1, 0x444444, 0, 0, 0.1, barrel);
            
            // Glowing Tip
            const tip = createBox(0.15, 0.25, 0.1, COLORS.laserYellow, 0, 0, 0.45, barrel);
            (tip.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(COLORS.laserYellow);
            (tip.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
            
            cannon.add(barrel);
            return cannon;
        };

        const leftC = createCannon(-1); leftC.position.set(-0.6, 0.9, 0.2); gman.add(leftC);
        const rightC = createCannon(1); rightC.position.set(0.6, 0.9, 0.2); gman.add(rightC);

        group.add(gman);

    } else { 
        // --- PUNCH 2: DJ TOILET (Neck & Connected Speakers) ---
        const dj = new THREE.Group(); dj.name = 'DJToilet';
        
        // Toilet Base (Larger)
        createToiletShape(dj, 1.7);
        
        // Neck (Connecting Head to Bowl)
        createBox(0.4, 0.7, 0.4, COLORS.skin, 0, 1.1, 0.1, dj);

        // Head
        const head = createHead(dj, 1.6, 0.1, false, COLORS.skin);
        
        // 1. Sunglasses
        createBox(0.4, 0.12, 0.05, 0x000000, 0, 0.35, 0.28, head);
        
        // 2. Headphones (Pink)
        const pink = 0xFF69B4;
        createBox(0.15, 0.3, 0.15, pink, -0.3, 0.3, 0, head); // L Cup
        createBox(0.15, 0.3, 0.15, pink, 0.3, 0.3, 0, head); // R Cup
        createBox(0.7, 0.08, 0.1, pink, 0, 0.6, 0, head); // Band
        createBox(0.08, 0.25, 0.08, 0x111111, -0.3, 0.3, 0, head); // Inner L
        createBox(0.08, 0.25, 0.08, 0x111111, 0.3, 0.3, 0, head); // Inner R

        // 3. Front Console (DJ Deck)
        const deck = new THREE.Group(); deck.position.set(0, 0.8, 0.7); dj.add(deck);
        createBox(1.4, 0.4, 0.5, 0x111111, 0, 0, 0, deck); // Main Box
        createBox(0.3, 0.05, 0.3, 0x333333, -0.4, 0.21, 0, deck); // Turntable L
        createBox(0.3, 0.05, 0.3, 0x333333, 0.4, 0.21, 0, deck); // Turntable R
        createBox(1.2, 0.1, 0.1, 0x555555, 0, 0, 0.26, deck); // Front Bar

        // 4. Back Speaker Array
        const backWall = new THREE.Group(); backWall.position.set(0, 2.2, -0.5); dj.add(backWall);
        createBox(1.8, 1.2, 0.3, 0x222222, 0, 0, 0, backWall); // Wall
        // Speaker Grids
        for(let x=-0.6; x<=0.6; x+=0.6) {
            for(let y=-0.3; y<=0.3; y+=0.6) {
                createBox(0.4, 0.4, 0.1, 0x111111, x, y, 0.15, backWall);
                createBox(0.3, 0.3, 0.05, 0x444444, x, y, 0.2, backWall); // Cone
            }
        }

        // 5. Side Weapons/Speakers (CONNECTED TO TOILET)
        const sideW = new THREE.Group(); sideW.position.set(0, 1.2, 0); dj.add(sideW);
        
        // --- CONNECTORS (Black Blocks connecting to Toilet Body) ---
        createBox(0.8, 0.3, 0.3, 0x111111, -0.8, 0, 0.2, sideW); 
        createBox(0.8, 0.3, 0.3, 0x111111, 0.8, 0, 0.2, sideW);

        // Left Speaker Unit
        createBox(0.4, 0.6, 0.8, 0x333333, -1.3, 0, 0.2, sideW);
        createBox(0.3, 0.5, 0.1, 0x000000, -1.3, 0, 0.65, sideW); // Face
        
        // Right Speaker Unit
        createBox(0.4, 0.6, 0.8, 0x333333, 1.3, 0, 0.2, sideW);
        createBox(0.3, 0.5, 0.1, 0x000000, 1.3, 0, 0.65, sideW); // Face

        group.add(dj);
    }
    castShadows(group); return group;
};

export const createFlyingObstacle = () => {
    // Helicopter Toilet (As requested previously)
    const group = new THREE.Group();
    const heli = new THREE.Group(); heli.name = 'HeliToilet';
    
    // Toilet
    createToiletShape(heli, 1.3);
    
    // Head with sunglasses
    const head = createHead(heli, 1.2, 0.1, true, COLORS.skin);
    createBox(0.35, 0.12, 0.05, 0x111111, 0, 0.35, 0.26, head); // Shades
    
    // Rotor Mechanism
    const rotorMount = new THREE.Group(); 
    rotorMount.position.set(0, 0.65, 0); 
    head.add(rotorMount);
    
    createBox(0.2, 0.3, 0.2, 0x222222, 0, 0, 0, rotorMount); // Shaft
    
    const blades = new THREE.Group(); blades.name = 'Blades';
    blades.position.set(0, 0.15, 0);
    rotorMount.add(blades);
    
    // 6 Blades
    for(let i=0; i<6; i++) {
        const blade = new THREE.Mesh(
            new THREE.BoxGeometry(3.5, 0.05, 0.2), 
            new THREE.MeshStandardMaterial({color: 0x111111})
        );
        blade.rotation.y = (i / 6) * Math.PI * 2;
        blades.add(blade);
    }

    // Slightly tilted forward for flight
    heli.rotation.x = 0.2;
    
    // Fixed height set by Animator or Spawn, but relative here
    heli.position.y = 0; 
    
    group.add(heli);
    castShadows(group); return group;
};
