
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

export const createDodgeObstacle = (variant: 'A' | 'B') => {
    const group = new THREE.Group();
    
    // VARIANT A: RON & HERMIONE
    if (variant === 'A') { 
        const isRon = Math.random() < 0.5;

        if (isRon) {
            // --- RON WEASLEY ---
            const ron = new THREE.Group(); 
            ron.name = 'Ron';

            const cHair = 0xE67E22; // Ginger Orange
            const cSkin = COLORS.skin;
            const cSweater = 0x808080; // Grey Sweater
            const cPants = 0x333333; // Dark Pants
            const cScarfRed = COLORS.gryffindorRed;
            const cScarfGold = COLORS.gryffindorGold;
            const cShoe = 0x111111;

            // 1. LEGS
            const legH = 0.7;
            const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.2, legH, 0);
            createBox(0.24, legH, 0.24, cPants, 0, -legH/2, 0, lLeg);
            createBox(0.26, 0.15, 0.3, cShoe, 0, -legH + 0.075, 0.05, lLeg); // Shoe
            ron.add(lLeg);

            const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.2, legH, 0);
            createBox(0.24, legH, 0.24, cPants, 0, -legH/2, 0, rLeg);
            createBox(0.26, 0.15, 0.3, cShoe, 0, -legH + 0.075, 0.05, rLeg); // Shoe
            ron.add(rLeg);

            // 2. TORSO
            const torso = new THREE.Group(); torso.name = 'Torso'; torso.position.set(0, legH + 0.5, 0); ron.add(torso);
            createBox(0.65, 1.0, 0.35, cSweater, 0, 0, 0, torso);
            createBox(0.68, 0.1, 0.38, 0x666666, 0, -0.45, 0, torso); 
            createBox(0.1, 0.2, 0.05, 0xFFFFFF, 0, 0.4, 0.18, torso); 
            createBox(0.05, 0.15, 0.06, cScarfRed, 0, 0.38, 0.19, torso); 

            const scarfY = 0.55;
            createBox(0.7, 0.25, 0.4, cScarfRed, 0, scarfY, 0, torso); 
            createBox(0.1, 0.26, 0.41, cScarfGold, -0.2, scarfY, 0, torso);
            createBox(0.1, 0.26, 0.41, cScarfGold, 0.2, scarfY, 0, torso);
            createBox(0.2, 0.5, 0.1, cScarfRed, 0.15, 0.2, 0.22, torso); 
            createBox(0.21, 0.1, 0.11, cScarfGold, 0.15, 0.3, 0.22, torso);
            createBox(0.21, 0.1, 0.11, cScarfGold, 0.15, 0.1, 0.22, torso);

            // Arms
            const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.45, legH + 0.9, 0); ron.add(lArm);
            createBox(0.22, 0.7, 0.22, cSweater, 0, -0.2, 0, lArm);
            createBox(0.2, 0.2, 0.2, cSkin, 0, -0.65, 0, lArm); 

            const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.45, legH + 0.9, 0); ron.add(rArm);
            createBox(0.22, 0.7, 0.22, cSweater, 0, -0.2, 0, rArm);
            createBox(0.2, 0.2, 0.2, cSkin, 0, -0.65, 0, rArm); 

            // 3. HEAD
            const head = new THREE.Group(); head.name='Head'; head.position.set(0, legH + 1.25, 0); ron.add(head);
            createBox(0.5, 0.55, 0.5, cSkin, 0, 0, 0, head);
            const faceZ = 0.26;
            
            // --- SPLIT EYES: Inner Black, Outer White ---
            const eyeW = 0.1; const halfW = eyeW / 2;
            const eyeH = 0.1; const eyeD = 0.02;
            
            // Left Eye (-0.12 center) -> Outer -0.145 (White), Inner -0.095 (Black)
            createBox(halfW, eyeH, eyeD, 0xFFFFFF, -0.12 - (halfW/2), 0.05, faceZ, head); // Outer White
            createBox(halfW, eyeH, eyeD, 0x000000, -0.12 + (halfW/2), 0.05, faceZ, head); // Inner Black
            
            // Right Eye (0.12 center) -> Inner 0.095 (Black), Outer 0.145 (White)
            createBox(halfW, eyeH, eyeD, 0x000000, 0.12 - (halfW/2), 0.05, faceZ, head); // Inner Black
            createBox(halfW, eyeH, eyeD, 0xFFFFFF, 0.12 + (halfW/2), 0.05, faceZ, head); // Outer White

            const cFreckle = 0xC68E17;
            createBox(0.03, 0.03, 0.02, cFreckle, -0.15, -0.05, faceZ, head);
            createBox(0.03, 0.03, 0.02, cFreckle, -0.08, -0.08, faceZ, head);
            createBox(0.03, 0.03, 0.02, cFreckle, 0.15, -0.05, faceZ, head);
            createBox(0.03, 0.03, 0.02, cFreckle, 0.08, -0.08, faceZ, head);
            createBox(0.15, 0.03, 0.02, 0x8B5A2B, 0, -0.15, faceZ, head);

            createBox(0.55, 0.2, 0.55, cHair, 0, 0.35, 0, head); 
            createBox(0.55, 0.5, 0.2, cHair, 0, 0.1, -0.2, head); 
            createBox(0.1, 0.4, 0.5, cHair, -0.25, 0.1, 0, head); 
            createBox(0.1, 0.4, 0.5, cHair, 0.25, 0.1, 0, head); 
            createBox(0.55, 0.15, 0.2, cHair, 0, 0.25, 0.2, head); 

            ron.scale.set(1.5, 1.5, 1.5);
            // ROTATION FIX: Rotate 180 (Math.PI) to face player correctly in SceneBuilder context
            ron.rotation.y = Math.PI; 
            group.add(ron);

        } else {
            // --- HERMIONE GRANGER ---
            const hermione = new THREE.Group(); 
            hermione.name = 'Hermione';

            const cHair = 0x5D4037; 
            const cSkin = COLORS.skin;
            const cRobe = COLORS.robeBlack;
            const cSkirt = 0x666666; 
            const cSock = 0xAAAAAA;
            const cShoe = 0x111111;
            const cLining = 0x740001; 

            // 1. LEGS
            const legH = 0.65;
            const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.18, legH, 0);
            createBox(0.18, 0.4, 0.18, cSock, 0, -0.3, 0, lLeg); 
            createBox(0.2, 0.12, 0.24, cShoe, 0, -0.55, 0.05, lLeg); 
            hermione.add(lLeg);

            const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.18, legH, 0);
            createBox(0.18, 0.4, 0.18, cSock, 0, -0.3, 0, rLeg); 
            createBox(0.2, 0.12, 0.24, cShoe, 0, -0.55, 0.05, rLeg); 
            hermione.add(rLeg);

            // 2. TORSO
            const torso = new THREE.Group(); torso.name = 'Torso'; torso.position.set(0, legH + 0.5, 0); hermione.add(torso);
            createBox(0.5, 0.9, 0.3, 0x555555, 0, 0, 0, torso); 
            createBox(0.55, 0.35, 0.35, cSkirt, 0, -0.3, 0, torso); 
            createBox(0.2, 0.9, 0.35, cRobe, -0.25, 0, 0.05, torso); 
            createBox(0.2, 0.9, 0.35, cRobe, 0.25, 0, 0.05, torso); 
            createBox(0.7, 0.9, 0.1, cRobe, 0, 0, -0.15, torso); 
            createBox(0.1, 0.8, 0.02, cLining, -0.12, 0.05, 0.23, torso); 
            createBox(0.1, 0.8, 0.02, cLining, 0.12, 0.05, 0.23, torso); 
            createBox(0.15, 0.2, 0.05, 0xFFFFFF, 0, 0.3, 0.16, torso);
            createBox(0.06, 0.2, 0.06, COLORS.gryffindorRed, 0, 0.25, 0.17, torso);

            // Arms
            const armY = legH + 0.85;
            const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.4, armY, 0); hermione.add(lArm);
            createBox(0.22, 0.6, 0.22, cRobe, 0, -0.2, 0, lArm);
            createBox(0.15, 0.15, 0.15, cSkin, 0, -0.6, 0, lArm);

            const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.4, armY, 0); hermione.add(rArm);
            createBox(0.22, 0.6, 0.22, cRobe, 0, -0.2, 0, rArm);
            createBox(0.15, 0.15, 0.15, cSkin, 0, -0.6, 0, rArm);
            createBox(0.3, 0.4, 0.1, 0x5D4037, 0, -0.6, 0.15, rArm).rotation.x = -0.2; 

            // 3. HEAD
            const head = new THREE.Group(); head.name='Head'; head.position.set(0, legH + 1.2, 0); hermione.add(head);
            createBox(0.45, 0.5, 0.45, cSkin, 0, 0, 0, head);
            const faceZ = 0.23;
            
            // --- SPLIT EYES: Inner Black, Outer White ---
            const eyeW = 0.1; const halfW = eyeW / 2;
            const eyeH = 0.1; const eyeD = 0.02;

            // Left Eye (-0.12 center)
            createBox(halfW, eyeH, eyeD, 0xFFFFFF, -0.12 - (halfW/2), 0.05, faceZ, head); 
            createBox(halfW, eyeH, eyeD, 0x000000, -0.12 + (halfW/2), 0.05, faceZ, head); 
            
            // Right Eye (0.12 center)
            createBox(halfW, eyeH, eyeD, 0x000000, 0.12 - (halfW/2), 0.05, faceZ, head); 
            createBox(halfW, eyeH, eyeD, 0xFFFFFF, 0.12 + (halfW/2), 0.05, faceZ, head); 

            createBox(0.12, 0.03, 0.02, 0xCC8888, 0, -0.12, faceZ, head); 

            const hair = new THREE.Group(); hair.name='Hair'; head.add(hair);
            createBox(0.65, 0.25, 0.6, cHair, 0, 0.35, 0, hair);
            createBox(0.7, 0.8, 0.3, cHair, 0, -0.1, -0.25, hair);
            createBox(0.25, 0.7, 0.4, cHair, -0.35, 0, 0.1, hair);
            createBox(0.25, 0.7, 0.4, cHair, 0.35, 0, 0.1, hair);
            createBox(0.6, 0.15, 0.1, cHair, 0, 0.25, 0.23, hair);

            hermione.scale.set(1.5, 1.5, 1.5);
            // ROTATION FIX: Rotate 180 to face player
            hermione.rotation.y = Math.PI; 
            group.add(hermione);
        }

    } else { // VARIANT B: DOBBY
        const dobby = new THREE.Group(); dobby.name = 'Dobby';
        
        const cSkin = 0xE6C29C; 
        const cTunic = 0x5D4037; 
        const cEyeGreen = 0x4CAF50;
        const cEyeWhite = 0xFFFFFF;
        const cEyeBlack = 0x111111;
        const cMouth = 0x8B5A2B; 

        // 1. LEGS
        const legH = 0.35;
        const legSep = 0.18;
        
        const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-legSep, legH, 0); dobby.add(lLeg);
        createBox(0.14, 0.35, 0.14, cSkin, 0, -0.175, 0, lLeg);
        createBox(0.16, 0.08, 0.22, cSkin, 0, -0.35, 0.05, lLeg); 

        const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(legSep, legH, 0); dobby.add(rLeg);
        createBox(0.14, 0.35, 0.14, cSkin, 0, -0.175, 0, rLeg);
        createBox(0.16, 0.08, 0.22, cSkin, 0, -0.35, 0.05, rLeg); 

        // 2. TORSO
        const torsoH = 0.55;
        const torsoY = legH + 0.275;
        const torso = new THREE.Group(); torso.position.set(0, torsoY, 0); dobby.add(torso);
        createBox(0.46, torsoH, 0.3, cTunic, 0, 0, 0, torso);
        createBox(0.48, 0.1, 0.32, cTunic, 0, -torsoH/2 + 0.05, 0, torso);

        // Arms
        const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.32, 0.15, 0); torso.add(lArm);
        createBox(0.1, 0.4, 0.1, cSkin, 0, -0.2, 0, lArm);
        
        const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.32, 0.15, 0); torso.add(rArm);
        createBox(0.1, 0.4, 0.1, cSkin, 0, -0.2, 0, rArm);

        // 3. HEAD
        const head = new THREE.Group(); head.name='Head'; 
        head.position.set(0, legH + torsoH + 0.15, 0); 
        dobby.add(head);
        createBox(0.55, 0.5, 0.5, cSkin, 0, 0, 0, head);
        createBox(0.12, 0.12, 0.25, cSkin, 0, -0.05, 0.3, head);

        // Eyes
        const eyeY = 0.05;
        const eyeZ = 0.26;
        const eyeX = 0.16;
        createBox(0.18, 0.18, 0.02, cEyeWhite, -eyeX, eyeY, eyeZ, head);
        createBox(0.1, 0.1, 0.03, cEyeGreen, -eyeX, eyeY, eyeZ, head);
        createBox(0.04, 0.04, 0.04, cEyeBlack, -eyeX, eyeY, eyeZ, head);
        createBox(0.18, 0.18, 0.02, cEyeWhite, eyeX, eyeY, eyeZ, head);
        createBox(0.1, 0.1, 0.03, cEyeGreen, eyeX, eyeY, eyeZ, head);
        createBox(0.04, 0.04, 0.04, cEyeBlack, eyeX, eyeY, eyeZ, head);
        createBox(0.15, 0.03, 0.02, cMouth, 0, -0.2, 0.26, head);

        // Ears (Broad, bat-like)
        const earY = 0.1;
        const earZ = -0.05;
        
        const lEar = new THREE.Group(); 
        lEar.position.set(-0.28, earY, earZ);
        createBox(0.2, 0.3, 0.1, cSkin, -0.1, 0, 0, lEar); 
        createBox(0.3, 0.25, 0.08, cSkin, -0.3, 0.05, 0, lEar);
        createBox(0.2, 0.15, 0.08, cSkin, -0.5, 0.1, 0, lEar);
        lEar.rotation.z = 0.2; lEar.rotation.y = 0.25; 
        head.add(lEar);

        const rEar = new THREE.Group(); 
        rEar.position.set(0.28, earY, earZ);
        createBox(0.2, 0.3, 0.1, cSkin, 0.1, 0, 0, rEar); 
        createBox(0.3, 0.25, 0.08, cSkin, 0.3, 0.05, 0, rEar);
        createBox(0.2, 0.15, 0.08, cSkin, 0.5, 0.1, 0, rEar);
        rEar.rotation.z = -0.2; rEar.rotation.y = -0.25;
        head.add(rEar);

        dobby.scale.set(1.5, 1.5, 1.5);
        dobby.rotation.y = 0; // Face Front
        group.add(dobby);
    }
    castShadows(group); return group;
};

export const createPunchObstacle = (variant: 'weak' | 'strong') => {
    const group = new THREE.Group();
    
    if (variant === 'weak') { 
        // DEATH EATER
        const de = new THREE.Group(); de.name = 'DeathEater';
        const cBlack = COLORS.robeBlack; 
        const cMask = 0xE0E0E0; 
        const cMaskDark = 0x999999; 
        const cWand = 0x3E2723;

        // 1. LEGS 
        const legH = 0.7;
        const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.2, legH, 0); de.add(lLeg);
        createBox(0.25, legH, 0.25, cBlack, 0, -legH/2, 0, lLeg); 
        const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.2, legH, 0); de.add(rLeg);
        createBox(0.25, legH, 0.25, cBlack, 0, -legH/2, 0, rLeg); 

        // 2. BODY / ROBE
        const torsoH = 1.1;
        const torso = new THREE.Group(); torso.position.set(0, legH + torsoH/2, 0); de.add(torso);
        createBox(0.7, torsoH, 0.45, cBlack, 0, 0, 0, torso);
        createBox(0.75, 0.4, 0.5, cBlack, 0, -0.4, 0, torso); 

        // 3. HEAD
        const headH = 0.8;
        const head = new THREE.Group(); head.name='Head'; head.position.set(0, legH + torsoH + 0.1, 0); de.add(head);
        createBox(0.8, headH, 0.7, cBlack, 0, 0.1, -0.1, head); 
        
        // MASK
        const maskZ = 0.26;
        createBox(0.5, 0.55, 0.1, cMask, 0, 0.05, maskZ, head);
        const eyeSize = 0.12;
        createBox(eyeSize, eyeSize, 0.02, 0x000000, -0.12, 0.1, maskZ + 0.05, head);
        createBox(eyeSize, eyeSize, 0.02, 0x000000, 0.12, 0.1, maskZ + 0.05, head);
        createBox(0.08, 0.15, 0.02, cMaskDark, -0.18, -0.1, maskZ + 0.05, head);
        createBox(0.08, 0.15, 0.02, cMaskDark, 0.18, -0.1, maskZ + 0.05, head);
        createBox(0.05, 0.05, 0.02, 0x000000, 0, -0.05, maskZ + 0.05, head);
        createBox(0.2, 0.04, 0.02, 0x000000, 0, -0.18, maskZ + 0.05, head);

        // 4. ARMS
        const armY = legH + torsoH - 0.3;
        const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.5, armY, 0); de.add(lArm);
        createBox(0.25, 0.8, 0.25, cBlack, 0, -0.3, 0, lArm);
        createBox(0.15, 0.15, 0.15, cMask, 0, -0.75, 0, lArm); 

        const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.5, armY, 0); de.add(rArm);
        createBox(0.25, 0.8, 0.25, cBlack, 0, -0.3, 0, rArm);
        createBox(0.15, 0.15, 0.15, cMask, 0, -0.75, 0, rArm); 
        
        // Wand
        const wand = new THREE.Group(); 
        wand.position.set(0, -0.75, 0.15); 
        wand.rotation.x = Math.PI / 2; 
        
        createBox(0.04, 0.6, 0.04, cWand, 0, 0.3, 0, wand); 
        const glow = createBox(0.08, 0.08, 0.08, 0x00FF00, 0, 0.6, 0, wand);
        (glow.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x00FF00);
        rArm.add(wand);

        de.scale.set(1.5, 1.5, 1.5);
        de.rotation.y = 0; // Face Front
        group.add(de);

    } else { // DEMENTOR (High Fidelity Voxel)
        const dementor = new THREE.Group(); dementor.name = 'Dementor';
        const cBlack = 0x111111; 
        const cDarkGrey = 0x222222;
        const cBone = 0x999999;
        
        // 1. Main Body / Cloak Core (Floating)
        const bodyY = 1.4; // Lowered from 1.8
        const body = new THREE.Group();
        body.name = 'Cloak';
        body.position.set(0, bodyY, 0);
        dementor.add(body);

        createBox(0.7, 0.9, 0.5, cBlack, 0, 0, 0, body);
        const stripW = 0.2;
        const strips = [
            { x: -0.25, y: -0.8, h: 0.8 }, { x: 0, y: -0.9, h: 1.0 }, { x: 0.25, y: -0.7, h: 0.6 },
            { x: -0.35, y: -0.6, h: 0.5, z: 0.2 }, { x: 0.35, y: -0.6, h: 0.5, z: 0.2 }, { x: 0, y: -0.8, h: 0.9, z: -0.2 }
        ];
        strips.forEach(s => { createBox(stripW, s.h, 0.15, cBlack, s.x, s.y, s.z || 0, body); });

        // 2. Head (Hooded)
        const head = new THREE.Group();
        head.name = 'Head';
        head.position.set(0, 0.6, 0); 
        body.add(head);

        createBox(0.4, 0.5, 0.4, 0x000000, 0, 0, 0.1, head); 
        
        // GLOWING GREEN EYES (Improved Visibility)
        const eyeColor = 0x00FF00;
        const lEye = createBox(0.1, 0.1, 0.05, eyeColor, -0.1, 0.05, 0.38, head);
        (lEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeColor);
        (lEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 5.0; 
        
        const rEye = createBox(0.1, 0.1, 0.05, eyeColor, 0.1, 0.05, 0.38, head);
        (rEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeColor);
        (rEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 5.0; 

        createBox(0.7, 0.7, 0.6, cBlack, 0, 0.1, -0.1, head); 
        createBox(0.5, 0.5, 0.5, 0x000000, 0, 0, 0.15, head);
        createBox(0.75, 0.15, 0.65, cDarkGrey, 0, 0.45, 0, head); 
        createBox(0.15, 0.6, 0.1, cDarkGrey, -0.3, 0, 0.3, head); 
        createBox(0.15, 0.6, 0.1, cDarkGrey, 0.3, 0, 0.3, head); 
        createBox(0.15, 0.15, 0.05, 0x333333, 0, -0.15, 0.35, head);

        // 3. Arms (Skeletal reaching out)
        const createArm = (isLeft: boolean) => {
            const arm = new THREE.Group();
            const x = isLeft ? -0.45 : 0.45;
            arm.name = isLeft ? 'L_Arm' : 'R_Arm';
            arm.position.set(x, 0.3, 0); 
            createBox(0.3, 0.5, 0.3, cBlack, 0, 0, 0, arm);
            const boneGroup = new THREE.Group();
            boneGroup.position.set(0, -0.2, 0.1);
            boneGroup.rotation.x = 0.5; 
            arm.add(boneGroup);
            createBox(0.08, 0.6, 0.08, cBone, 0, 0.3, 0, boneGroup); 
            const hand = new THREE.Group();
            hand.position.set(0, 0.6, 0);
            boneGroup.add(hand);
            createBox(0.12, 0.15, 0.12, cBone, 0, 0, 0, hand); 
            createBox(0.03, 0.15, 0.03, cBone, -0.04, 0.15, 0, hand);
            createBox(0.03, 0.15, 0.03, cBone, 0, 0.15, 0, hand);
            createBox(0.03, 0.15, 0.03, cBone, 0.04, 0.15, 0, hand);
            return arm;
        };

        const lArm = createArm(true); body.add(lArm);
        const rArm = createArm(false); body.add(rArm);

        // SCALED UP BY 15% (1.5 -> 1.725)
        dementor.scale.set(1.725, 1.725, 1.725);
        dementor.rotation.y = 0;
        group.add(dementor);
    }
    castShadows(group); return group;
};

// --- JUMP ATTACK OBSTACLE: HIGH FIDELITY DEATH EATER ON BROOM ---
export const createFlyingObstacle = () => {
    const group = new THREE.Group();
    const riderGroup = new THREE.Group(); 
    riderGroup.name = 'BroomRider';
    
    // Positioned higher up to require jump attack
    riderGroup.position.y = 3.2; 

    // Colors
    const woodColor = 0x3E2723; // Dark Oak
    const bristleColor = 0x8B4513;
    const robeBlack = 0x151515;
    const maskSilver = 0xD0D0D0;
    const spellGreen = 0x00FF00;

    // 1. BROOMSTICK
    const broom = new THREE.Group();
    riderGroup.add(broom);
    
    // Handle (Sleek)
    createBox(0.08, 0.08, 3.5, woodColor, 0, 0, 0, broom);
    // Footrests (Gold)
    createBox(0.4, 0.05, 0.05, 0xD4AF37, 0, -0.1, 0.5, broom);
    
    // Bristles (Rough cone shape approximation)
    const tailStart = -1.5;
    createBox(0.3, 0.3, 0.8, bristleColor, 0, 0, tailStart, broom);
    createBox(0.4, 0.4, 0.6, bristleColor, 0, 0, tailStart - 0.5, broom);
    // Loose twigs
    createBox(0.1, 0.1, 0.5, bristleColor, 0.15, 0.15, tailStart - 0.8, broom).rotation.z = 0.2;
    createBox(0.1, 0.1, 0.5, bristleColor, -0.15, -0.15, tailStart - 0.8, broom).rotation.z = -0.2;

    // 2. DEATH EATER RIDER
    const rider = new THREE.Group();
    rider.position.set(0, 0.3, 0.2); 
    // Leaning forward aggressively
    rider.rotation.x = 0.4; 
    riderGroup.add(rider);

    // Legs (Straddling)
    const lLeg = new THREE.Group(); lLeg.position.set(-0.25, 0, 0);
    createBox(0.2, 0.6, 0.2, robeBlack, 0, 0, 0, lLeg); 
    lLeg.rotation.x = -1.2; // Bent back
    lLeg.rotation.z = 0.3;  // Splayed out
    rider.add(lLeg);

    const rLeg = new THREE.Group(); rLeg.position.set(0.25, 0, 0);
    createBox(0.2, 0.6, 0.2, robeBlack, 0, 0, 0, rLeg);
    rLeg.rotation.x = -1.2;
    rLeg.rotation.z = -0.3;
    rider.add(rLeg);

    // Torso
    const torso = new THREE.Group();
    torso.position.set(0, 0.4, -0.2);
    createBox(0.5, 0.7, 0.35, robeBlack, 0, 0, 0, torso);
    rider.add(torso);

    // Head (Masked)
    const head = new THREE.Group();
    head.name = 'Head'; // For LookAt animation if needed
    head.position.set(0, 0.85, 0);
    rider.add(head);
    
    // Hood
    createBox(0.45, 0.5, 0.45, robeBlack, 0, 0, -0.05, head);
    // Mask Face
    createBox(0.35, 0.4, 0.1, maskSilver, 0, 0, 0.18, head);
    // Eye Slits
    createBox(0.08, 0.02, 0.02, 0x000000, -0.1, 0.05, 0.23, head);
    createBox(0.08, 0.02, 0.02, 0x000000, 0.1, 0.05, 0.23, head);
    // Mouth Grate
    createBox(0.15, 0.1, 0.02, 0x333333, 0, -0.12, 0.23, head);

    // Arms
    // Left Arm (Holding Broom)
    const lArm = new THREE.Group(); lArm.position.set(-0.35, 0.6, 0);
    createBox(0.15, 0.5, 0.15, robeBlack, 0, -0.2, 0.2, lArm); // Reaching down
    lArm.rotation.x = -0.5;
    lArm.rotation.z = 0.2;
    rider.add(lArm);

    // Right Arm (Aiming Wand)
    const rArm = new THREE.Group(); 
    rArm.name = 'AimingArm';
    rArm.position.set(0.35, 0.6, 0);
    createBox(0.15, 0.5, 0.15, robeBlack, 0, -0.2, 0, rArm);
    rArm.rotation.x = -1.5; // Pointing straight forward
    rider.add(rArm);

    // Wand
    const wand = new THREE.Group();
    wand.position.set(0, -0.5, 0); // At hand
    createBox(0.03, 0.5, 0.03, 0x5D4037, 0, -0.25, 0, wand); // Stick
    
    // Spell Tip (Green Glow)
    const tip = createBox(0.08, 0.08, 0.08, spellGreen, 0, -0.5, 0, wand);
    (tip.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(spellGreen);
    (tip.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
    
    rArm.add(wand);

    // 3. CLOAK ANIMATION PARTS
    // 3 Segments trailing behind torso
    const cloak = new THREE.Group();
    cloak.name = 'CloakTail';
    cloak.position.set(0, 0.2, -0.4);
    rider.add(cloak);

    const seg1 = createBox(0.5, 0.1, 0.4, robeBlack, 0, 0, -0.2, cloak);
    seg1.name = 'Cloak_1';
    
    const seg2 = createBox(0.45, 0.1, 0.4, robeBlack, 0, 0, -0.6, cloak);
    seg2.name = 'Cloak_2';
    
    const seg3 = createBox(0.4, 0.1, 0.4, robeBlack, 0, 0, -1.0, cloak);
    seg3.name = 'Cloak_3';

    group.add(riderGroup);
    castShadows(group);
    return group;
};
