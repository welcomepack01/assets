
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

export const createDodgeObstacle = (variant: 'A' | 'B') => {
    const group = new THREE.Group();
    if (variant === 'A') { 
        // Random between Bulma and Master Roshi
        if (Math.random() < 0.5) {
            // HIGH DETAIL BULMA
            const bulma = new THREE.Group(); bulma.name = 'Bulma';

            const cSkin = 0xFFE0BD;
            const cHair = 0x40E0D0; // Bulma Teal
            const cDress = 0xFF69B4; // Pink
            const cScarf = 0x9370DB; // Purple Scarf
            const cBelt = 0x8B4513;
            const cPouch = 0x00CED1;
            const cSock = 0xDA70D6; // Orchid/Purple socks
            const cShoeBlue = 0x1E90FF;
            const cShoeSole = 0xFFFFFF;
            const cBow = 0xFF0000;

            // --- 1. LEGS & SHOES ---
            const createLeg = (isLeft: boolean) => {
                const legGroup = new THREE.Group();
                const x = isLeft ? -0.18 : 0.18;
                legGroup.position.set(x, 0.65, 0); // Pivot at hip

                // Shoe
                const shoeGroup = new THREE.Group();
                shoeGroup.position.set(0, -0.65, 0);
                createBox(0.2, 0.1, 0.3, cShoeSole, 0, 0.05, 0.05, shoeGroup); // Sole
                createBox(0.2, 0.12, 0.3, cShoeBlue, 0, 0.15, 0.05, shoeGroup); // Shoe Body
                createBox(0.21, 0.05, 0.1, 0xFF0000, 0, 0.18, 0.15, shoeGroup); // Laces detail
                legGroup.add(shoeGroup);

                // Sock
                createBox(0.16, 0.15, 0.16, cSock, 0, -0.45, 0, legGroup);

                // Skin Leg
                createBox(0.15, 0.45, 0.15, cSkin, 0, -0.15, 0, legGroup);

                return legGroup;
            };

            const lLeg = createLeg(true); lLeg.name = 'L_Leg'; bulma.add(lLeg);
            const rLeg = createLeg(false); rLeg.name = 'R_Leg'; bulma.add(rLeg);

            // --- 2. TORSO (DRESS) ---
            const torso = new THREE.Group();
            torso.name = 'Torso';
            torso.position.set(0, 0.8, 0);
            bulma.add(torso);

            // Skirt (Flared)
            createBox(0.6, 0.35, 0.4, cDress, 0, -0.1, 0, torso);
            createBox(0.65, 0.15, 0.45, cDress, 0, -0.3, 0, torso); // Bottom flare

            // Belt area
            createBox(0.52, 0.1, 0.32, cBelt, 0, 0.15, 0, torso);
            // Pouch (Side)
            createBox(0.15, 0.15, 0.12, cPouch, 0.25, 0.1, 0.15, torso);

            // Upper Body
            createBox(0.48, 0.4, 0.28, cDress, 0, 0.4, 0, torso);
            
            // Scarf / Neck Area
            createBox(0.38, 0.05, 0.3, cScarf, 0, 0.62, 0.05, torso); 

            // --- 3. ARMS ---
            const createArm = (isLeft: boolean) => {
                const armGroup = new THREE.Group();
                const x = isLeft ? -0.32 : 0.32;
                armGroup.position.set(x, 0.42, 0); 

                // Puff Sleeve
                createBox(0.24, 0.24, 0.24, cDress, 0, 0, 0, armGroup);
                // Arm Skin
                createBox(0.12, 0.45, 0.12, cSkin, 0, -0.3, 0, armGroup);
                // Hand
                createBox(0.13, 0.13, 0.13, cSkin, 0, -0.55, 0, armGroup);

                return armGroup;
            };
            
            const lArm = createArm(true); lArm.name = 'L_Arm'; torso.add(lArm);
            const rArm = createArm(false); rArm.name = 'R_Arm'; torso.add(rArm);

            // --- 4. HEAD ---
            const head = new THREE.Group();
            head.name = 'Head';
            head.position.set(0, 1.55, 0);
            bulma.add(head);

            // Face
            createBox(0.46, 0.5, 0.44, cSkin, 0, 0, 0, head);
            
            // Eyes
            const eyeZ = 0.23;
            const eyeX = 0.11;
            createBox(0.14, 0.14, 0.02, 0xFFFFFF, -eyeX, 0, eyeZ, head);
            createBox(0.14, 0.14, 0.02, 0xFFFFFF, eyeX, 0, eyeZ, head);
            createBox(0.08, 0.1, 0.03, 0x00BFFF, -eyeX, 0, eyeZ, head);
            createBox(0.08, 0.1, 0.03, 0x00BFFF, eyeX, 0, eyeZ, head);
            createBox(0.04, 0.06, 0.04, 0x000000, -eyeX, 0, eyeZ, head);
            createBox(0.04, 0.06, 0.04, 0x000000, eyeX, 0, eyeZ, head);
            createBox(0.03, 0.03, 0.05, 0xFFFFFF, -eyeX + 0.02, 0.03, eyeZ, head);
            createBox(0.03, 0.03, 0.05, 0xFFFFFF, eyeX + 0.02, 0.03, eyeZ, head);
            createBox(0.08, 0.03, 0.02, 0xFFB6C1, -eyeX, -0.12, eyeZ, head);
            createBox(0.08, 0.03, 0.02, 0xFFB6C1, eyeX, -0.12, eyeZ, head);
            createBox(0.06, 0.02, 0.02, 0xD46A6A, 0, -0.18, eyeZ, head);

            // --- HAIR ---
            const hairGroup = new THREE.Group(); hairGroup.name = 'Hair'; head.add(hairGroup);
            createBox(0.54, 0.35, 0.5, cHair, 0, 0.25, -0.05, hairGroup);
            createBox(0.5, 0.5, 0.52, cHair, 0, 0, -0.1, hairGroup);
            createBox(0.14, 0.15, 0.05, cHair, 0, 0.25, 0.23, hairGroup);
            createBox(0.1, 0.1, 0.05, cHair, 0, 0.15, 0.23, hairGroup);
            createBox(0.12, 0.25, 0.05, cHair, -0.15, 0.2, 0.23, hairGroup);
            createBox(0.08, 0.3, 0.05, cHair, -0.22, 0.1, 0.23, hairGroup);
            createBox(0.12, 0.25, 0.05, cHair, 0.15, 0.2, 0.23, hairGroup);
            createBox(0.08, 0.3, 0.05, cHair, 0.22, 0.1, 0.23, hairGroup);

            const ponyPivot = new THREE.Group(); ponyPivot.name = 'Ponytail'; ponyPivot.position.set(0, 0.45, -0.2); hairGroup.add(ponyPivot);
            const bowGroup = new THREE.Group(); bowGroup.position.set(0, 0.1, 0.05); ponyPivot.add(bowGroup);
            createBox(0.15, 0.15, 0.1, cBow, 0, 0, 0, bowGroup); 
            const lLoop = createBox(0.25, 0.2, 0.08, cBow, -0.2, 0.05, 0, bowGroup); lLoop.rotation.z = 0.4;
            const rLoop = createBox(0.25, 0.2, 0.08, cBow, 0.2, 0.05, 0, bowGroup); rLoop.rotation.z = -0.4;
            createBox(0.3, 0.3, 0.3, cHair, 0, 0, 0, ponyPivot); 
            const tailMesh = createBox(0.25, 0.6, 0.25, cHair, 0, -0.35, 0.15, ponyPivot); tailMesh.rotation.x = 0.4; 

            bulma.scale.set(1.5, 1.5, 1.5);
            bulma.rotation.y = Math.PI; 
            group.add(bulma);

        } else {
            // HIGH DETAIL MASTER ROSHI
            // (Copy pasting previous Roshi code)
            const roshi = new THREE.Group(); roshi.name = 'MasterRoshi';

            const cSkin = 0xFFCC99; // Tan Skin
            const cShirt = 0xFFA500; // Orange Shirt
            const cShorts = 0x4169E1; // Blue/Purple Shorts
            const cShell = 0x800080; // Purple Shell
            const cShellRim = 0xFFFFFF; // White Rim
            const cBeard = 0xFFFFFF; // White Beard
            const cGlassFrame = 0xFF0000; // Red Frames
            const cGlassLens = 0x222222; // Dark Lenses
            const cShoe = 0x333333; // Dark Shoes/Sandals

            // --- 1. LEGS (Short & Skinny) ---
            const createLeg = (isLeft: boolean) => {
                const leg = new THREE.Group();
                const x = isLeft ? -0.2 : 0.2;
                leg.position.set(x, 0.6, 0); 

                // Shorts (Baggy)
                createBox(0.25, 0.35, 0.3, cShorts, 0, -0.15, 0, leg);
                createBox(0.12, 0.3, 0.12, cSkin, 0, -0.45, 0, leg);
                
                // Shoes
                const shoe = new THREE.Group();
                shoe.position.set(0, -0.6, 0.05);
                createBox(0.16, 0.1, 0.25, cShoe, 0, 0, 0, shoe);
                createBox(0.14, 0.05, 0.1, cShoe, 0, 0.02, 0.15, shoe); // Tip
                leg.add(shoe);
                return leg;
            };

            const lLeg = createLeg(true); lLeg.name = 'L_Leg'; roshi.add(lLeg);
            const rLeg = createLeg(false); rLeg.name = 'R_Leg'; roshi.add(rLeg);

            // --- 2. TORSO ---
            const torso = new THREE.Group(); torso.name = 'Torso'; torso.position.set(0, 0.6, 0); roshi.add(torso);
            createBox(0.55, 0.6, 0.35, cShirt, 0, 0.3, 0, torso);
            createBox(0.2, 0.2, 0.05, cSkin, 0, 0.5, 0.18, torso); 
            
            const shellGroup = new THREE.Group(); shellGroup.name = 'Shell'; shellGroup.position.set(0, 0.3, -0.25); torso.add(shellGroup);
            createBox(0.7, 0.8, 0.3, cShell, 0, 0, 0, shellGroup); createBox(0.5, 0.6, 0.4, cShell, 0, 0, 0, shellGroup); createBox(0.75, 0.85, 0.1, cShellRim, 0, 0, -0.1, shellGroup);
            createBox(0.05, 0.4, 0.42, 0x333333, -0.2, 0.1, 0.1, torso); createBox(0.05, 0.4, 0.42, 0x333333, 0.2, 0.1, 0.1, torso); 

            // --- 3. ARMS ---
            const createArm = (isLeft: boolean) => {
                const arm = new THREE.Group(); const x = isLeft ? -0.35 : 0.35; arm.position.set(x, 0.5, 0);
                createBox(0.22, 0.22, 0.22, cShirt, 0, 0, 0, arm); createBox(0.12, 0.45, 0.12, cSkin, 0, -0.3, 0, arm); createBox(0.14, 0.14, 0.14, cSkin, 0, -0.55, 0, arm);
                return arm;
            };
            const lArm = createArm(true); lArm.name = 'L_Arm'; torso.add(lArm);
            const rArm = createArm(false); rArm.name = 'R_Arm'; torso.add(rArm);
            const staff = new THREE.Group(); staff.name = 'Staff'; staff.position.set(0, -0.5, 0.1); 
            createBox(0.06, 1.8, 0.06, 0x8B4513, 0, 0.2, 0, staff); createBox(0.1, 0.1, 0.1, 0x8B4513, 0, 1.1, 0, staff); rArm.add(staff);

            // --- 4. HEAD ---
            const head = new THREE.Group(); head.name = 'Head'; head.position.set(0, 0.55, 0.15); torso.add(head);
            createBox(0.4, 0.45, 0.4, cSkin, 0, 0.2, 0, head);
            const glassZ = 0.21; const glassY = 0.25;
            createBox(0.42, 0.05, 0.05, cGlassFrame, 0, glassY+0.05, glassZ, head); createBox(0.16, 0.12, 0.05, cGlassLens, -0.1, glassY, glassZ, head); createBox(0.16, 0.12, 0.05, cGlassLens, 0.1, glassY, glassZ, head); createBox(0.04, 0.04, 0.05, cGlassFrame, 0, glassY, glassZ, head); 
            createBox(0.08, 0.15, 0.05, cSkin, -0.22, 0.2, 0, head); createBox(0.08, 0.15, 0.05, cSkin, 0.22, 0.2, 0, head);
            const beard = new THREE.Group(); beard.name = 'Beard'; beard.position.set(0, 0.1, 0.22); head.add(beard);
            createBox(0.35, 0.1, 0.05, cBeard, 0, 0.05, 0, beard); createBox(0.25, 0.35, 0.1, cBeard, 0, -0.15, 0, beard); createBox(0.15, 0.15, 0.08, cBeard, 0, -0.35, 0.02, beard);

            roshi.scale.set(1.4, 1.4, 1.4); 
            roshi.rotation.y = Math.PI;
            group.add(roshi);
        }

    } else { 
        // Random between Piccolo and Krillin
        if (Math.random() < 0.5) {
            // HIGH DETAIL PICCOLO
            const piccolo = new THREE.Group(); piccolo.name = 'Piccolo';
            
            const cGreen = 0x76D356; const cPurple = 0x552288; const cBlue = 0x00BFFF; const cRedPatch = 0xE06060; const cWhite = 0xFFFFFF; const cShoe = 0xAA5500;
            const legH = 0.7; const hipY = legH;
            const createLeg = (isLeft: boolean) => {
                const leg = new THREE.Group(); const x = isLeft ? -0.22 : 0.22; leg.position.set(x, hipY, 0);
                createBox(0.24, 0.5, 0.28, cPurple, 0, -0.25, 0, leg); createBox(0.22, 0.2, 0.26, cPurple, 0, -0.6, 0, leg); createBox(0.12, 0.15, 0.12, cGreen, 0, -0.75, 0, leg);
                const shoe = new THREE.Group(); shoe.position.set(0, -0.85, 0.05); createBox(0.2, 0.12, 0.35, cShoe, 0, 0, 0, shoe); createBox(0.18, 0.05, 0.1, cShoe, 0, 0.05, 0.1, shoe); createBox(0.21, 0.05, 0.36, 0x553311, 0, -0.05, 0, shoe); leg.add(shoe);
                return leg;
            };
            const lLeg = createLeg(true); lLeg.name='L_Leg'; piccolo.add(lLeg); const rLeg = createLeg(false); rLeg.name='R_Leg'; piccolo.add(rLeg);
            const torso = new THREE.Group(); torso.name = 'Torso'; torso.position.set(0, hipY, 0); piccolo.add(torso);
            createBox(0.65, 0.8, 0.4, cPurple, 0, 0.4, 0, torso); createBox(0.3, 0.3, 0.41, cGreen, 0, 0.55, 0, torso);
            createBox(0.12, 0.1, 0.42, cRedPatch, -0.08, 0.6, 0, torso); createBox(0.12, 0.1, 0.42, cRedPatch, 0.08, 0.6, 0, torso); createBox(0.68, 0.18, 0.42, cBlue, 0, 0.15, 0, torso);
            const capeGroup = new THREE.Group(); capeGroup.name = 'Cape'; capeGroup.position.set(0, 0.8, 0); torso.add(capeGroup); createBox(1.1, 0.15, 0.5, cWhite, 0, 0.05, 0, capeGroup); 
            const padL = createBox(0.3, 0.12, 0.52, cWhite, -0.6, 0, 0, capeGroup); padL.rotation.z = -0.3;
            const padR = createBox(0.3, 0.12, 0.52, cWhite, 0.6, 0, 0, capeGroup); padR.rotation.z = 0.3;
            const capeBack = createBox(0.8, 1.4, 0.1, cWhite, 0, -0.6, -0.25, capeGroup); capeBack.rotation.x = 0.15; 
            const createArm = (isLeft: boolean) => {
                const arm = new THREE.Group(); const x = isLeft ? -0.4 : 0.4; arm.position.set(x, 0.7, 0);
                createBox(0.26, 0.2, 0.26, cPurple, 0, -0.1, 0, arm); createBox(0.18, 0.25, 0.18, cGreen, 0, -0.3, 0, arm); createBox(0.19, 0.12, 0.19, cRedPatch, 0, -0.3, 0, arm);
                createBox(0.16, 0.3, 0.16, cGreen, 0, -0.6, 0, arm); createBox(0.17, 0.15, 0.17, cRedPatch, 0, -0.6, 0, arm); createBox(0.16, 0.16, 0.16, cGreen, 0, -0.85, 0, arm); createBox(0.17, 0.05, 0.05, cWhite, 0, -0.9, 0.05, arm); return arm;
            };
            const lArm = createArm(true); lArm.name = 'L_Arm'; torso.add(lArm); const rArm = createArm(false); rArm.name = 'R_Arm'; torso.add(rArm);
            const head = new THREE.Group(); head.name = 'Head'; head.position.set(0, 1.0, 0); torso.add(head);
            createBox(0.4, 0.5, 0.45, cGreen, 0, 0.25, 0, head); createBox(0.38, 0.15, 0.4, cGreen, 0, 0.05, 0.05, head);
            createBox(0.55, 0.3, 0.55, cWhite, 0, 0.5, 0, head); createBox(0.4, 0.15, 0.4, cPurple, 0, 0.65, 0, head); 
            const faceZ = 0.23; createBox(0.42, 0.08, 0.1, cGreen, 0, 0.4, 0.2, head);
            createBox(0.12, 0.06, 0.02, 0xFFFFFF, -0.1, 0.32, faceZ, head); createBox(0.04, 0.04, 0.03, 0x000000, -0.1, 0.32, faceZ+0.01, head);
            createBox(0.12, 0.06, 0.02, 0xFFFFFF, 0.1, 0.32, faceZ, head); createBox(0.04, 0.04, 0.03, 0x000000, 0.1, 0.32, faceZ+0.01, head);
            createBox(0.06, 0.12, 0.08, cGreen, 0, 0.25, faceZ, head); createBox(0.12, 0.03, 0.02, 0x335533, 0, 0.12, faceZ, head);
            const earGeo = new THREE.BoxGeometry(0.1, 0.25, 0.05); const earMat = new THREE.MeshStandardMaterial({ color: cGreen });
            const lEar = new THREE.Mesh(earGeo, earMat); lEar.position.set(-0.25, 0.3, 0); lEar.rotation.z = 0.3; lEar.rotation.y = -0.3; head.add(lEar);
            const rEar = new THREE.Mesh(earGeo, earMat); rEar.position.set(0.25, 0.3, 0); rEar.rotation.z = -0.3; rEar.rotation.y = 0.3; head.add(rEar);

            piccolo.scale.set(1.6, 1.6, 1.6);
            group.add(piccolo);

        } else {
            // HIGH DETAIL KRILLIN
            const krillin = new THREE.Group(); krillin.name = 'Krillin';
            
            const cSkin = 0xFFE0BD;
            const cGiOrange = 0xFF8C00;
            const cGiBlue = 0x0000CD;
            const cShoe = 0x111111;
            const cWhite = 0xFFFFFF;

            // Krillin is short, so his pivot height is lower
            const legH = 0.55;
            const hipY = legH;

            // --- 1. LEGS (Short) ---
            const createLeg = (isLeft: boolean) => {
                const leg = new THREE.Group();
                const x = isLeft ? -0.18 : 0.18;
                leg.position.set(x, hipY, 0); // Pivot

                // Pants (Baggy)
                createBox(0.22, 0.45, 0.24, cGiOrange, 0, -0.22, 0, leg);
                
                // Ankle Skin (Very short exposed area)
                createBox(0.1, 0.1, 0.1, cSkin, 0, -0.48, 0, leg);

                // Shoe (Black Kung Fu shoes)
                const shoe = new THREE.Group();
                shoe.position.set(0, -0.52, 0.05);
                createBox(0.16, 0.1, 0.26, cShoe, 0, 0, 0, shoe);
                createBox(0.14, 0.05, 0.1, cShoe, 0, 0.02, 0.1, shoe);
                leg.add(shoe);

                return leg;
            };

            const lLeg = createLeg(true); lLeg.name='L_Leg'; krillin.add(lLeg);
            const rLeg = createLeg(false); rLeg.name='R_Leg'; krillin.add(rLeg);

            // --- 2. TORSO ---
            const torso = new THREE.Group(); 
            torso.name = 'Torso';
            torso.position.set(0, hipY, 0);
            krillin.add(torso);

            // Gi Body
            createBox(0.55, 0.55, 0.35, cGiOrange, 0, 0.28, 0, torso);
            
            // Blue Undershirt / Neck V
            createBox(0.25, 0.2, 0.36, cGiBlue, 0, 0.45, 0, torso); 
            // Chest skin
            createBox(0.2, 0.15, 0.37, cSkin, 0, 0.5, 0, torso);

            // Sash (Blue Belt)
            createBox(0.58, 0.15, 0.38, cGiBlue, 0, 0.08, 0, torso);
            // Knot
            createBox(0.15, 0.12, 0.1, cGiBlue, -0.15, 0.08, 0.2, torso).rotation.z = 0.2;

            // Turtle Symbol (Back) - Simplified White Circle
            const symbolBack = new THREE.Group();
            symbolBack.position.set(0, 0.35, -0.18);
            createBox(0.25, 0.25, 0.02, cWhite, 0, 0, 0, symbolBack);
            torso.add(symbolBack);

            // --- 3. ARMS ---
            const createArm = (isLeft: boolean) => {
                const arm = new THREE.Group();
                const x = isLeft ? -0.32 : 0.32;
                arm.position.set(x, 0.45, 0);

                // Shoulder/Sleeve
                createBox(0.2, 0.2, 0.2, cGiOrange, 0, 0, 0, arm);
                
                // Arm Skin
                createBox(0.12, 0.35, 0.12, cSkin, 0, -0.2, 0, arm);
                
                // Wristband
                createBox(0.14, 0.12, 0.14, cGiBlue, 0, -0.35, 0, arm);

                // Hand
                createBox(0.13, 0.13, 0.13, cSkin, 0, -0.48, 0, arm);

                return arm;
            };
            const lArm = createArm(true); lArm.name = 'L_Arm'; torso.add(lArm);
            const rArm = createArm(false); rArm.name = 'R_Arm'; torso.add(rArm);

            // --- 4. HEAD (Bald) ---
            const head = new THREE.Group(); head.name = 'Head';
            // LOWERED POSITION: from 0.75 to 0.55 to remove gap
            head.position.set(0, 0.55, 0); 
            torso.add(head);

            // Main Head Shape (Rounder)
            createBox(0.42, 0.45, 0.42, cSkin, 0, 0.1, 0, head);
            createBox(0.38, 0.1, 0.38, cSkin, 0, 0.35, 0, head); // Top dome rounding

            // Ears
            createBox(0.08, 0.12, 0.05, cSkin, -0.22, 0.1, 0, head);
            createBox(0.08, 0.12, 0.05, cSkin, 0.22, 0.1, 0, head);

            // 6 Dots on Forehead (Incense burns)
            const dotColor = 0xD4A373; // Darker skin tone
            const dotSize = 0.03;
            const dotZ = 0.22; // Front face Z
            // Top Row
            createBox(dotSize, dotSize, 0.02, dotColor, -0.06, 0.28, dotZ, head);
            createBox(dotSize, dotSize, 0.02, dotColor, 0, 0.28, dotZ, head);
            createBox(dotSize, dotSize, 0.02, dotColor, 0.06, 0.28, dotZ, head);
            // Bottom Row
            createBox(dotSize, dotSize, 0.02, dotColor, -0.06, 0.22, dotZ, head);
            createBox(dotSize, dotSize, 0.02, dotColor, 0, 0.22, dotZ, head);
            createBox(dotSize, dotSize, 0.02, dotColor, 0.06, 0.22, dotZ, head);

            // Face Details
            const faceZ = 0.22;
            
            // Eyes (Large, Angry/Focused)
            // Sclera
            createBox(0.12, 0.12, 0.02, cWhite, -0.1, 0.1, faceZ, head);
            createBox(0.12, 0.12, 0.02, cWhite, 0.1, 0.1, faceZ, head);
            // Pupils (Small Black)
            createBox(0.03, 0.03, 0.03, 0x000000, -0.1, 0.1, faceZ+0.01, head);
            createBox(0.03, 0.03, 0.03, 0x000000, 0.1, 0.1, faceZ+0.01, head);
            
            // Eyebrows (Skin color/Muscle definition)
            createBox(0.14, 0.04, 0.03, cSkin, -0.1, 0.16, faceZ+0.01, head).rotation.z = 0.2;
            createBox(0.14, 0.04, 0.03, cSkin, 0.1, 0.16, faceZ+0.01, head).rotation.z = -0.2;

            // NO NOSE! (Krillin's trait)
            
            // Mouth (Small line)
            createBox(0.1, 0.02, 0.02, 0x8B4513, 0, -0.08, faceZ, head);

            krillin.scale.set(1.4, 1.4, 1.4); // Smaller than Piccolo
            group.add(krillin);
        }
    }
    castShadows(group); return group;
};

export const createPunchObstacle = (variant: 'weak' | 'strong') => {
    const group = new THREE.Group();
    const char = new THREE.Group();
    char.name = 'Ginyu';

    if (variant === 'weak') {
        const android = new THREE.Group(); android.name = 'Android20'; 
        const cSkin = 0xEECFA1; const cHair = 0xFFFFFF; const cPants = 0xE67E22; const cVest = 0x1A1A1A; const cUndershirt = 0x222222; const cOrange = 0xFF8C00; const cRed = 0xFF0000; const cBlack = 0x000000; const cGold = 0xFFD700;
        const legH = 0.7;
        const createLeg = (isLeft: boolean) => {
            const l = new THREE.Group(); const x = isLeft ? -0.22 : 0.22; l.position.set(x, legH, 0);
            createBox(0.3, 0.6, 0.3, cPants, 0, -0.3, 0, l); createBox(0.2, 0.1, 0.2, cOrange, 0, -0.65, 0, l);
            const shoe = new THREE.Group(); shoe.position.set(0, -0.7, 0.1);
            createBox(0.18, 0.12, 0.25, cBlack, 0, 0, 0, shoe); createBox(0.15, 0.08, 0.15, cBlack, 0, 0, 0.2, shoe); l.add(shoe); return l;
        };
        const lLeg = createLeg(true); lLeg.name='L_Leg'; android.add(lLeg); const rLeg = createLeg(false); rLeg.name='R_Leg'; android.add(rLeg);
        const torso = new THREE.Group(); torso.name='Torso'; torso.position.set(0, legH, 0); android.add(torso);
        createBox(0.7, 0.8, 0.4, cVest, 0, 0.4, 0, torso); createBox(0.72, 0.15, 0.42, cOrange, 0, 0.1, 0, torso); createBox(0.5, 0.1, 0.3, cUndershirt, 0, 0.75, 0, torso);
        const createArm = (isLeft: boolean) => {
            const a = new THREE.Group(); const x = isLeft ? -0.45 : 0.45; a.position.set(x, 0.7, 0);
            createBox(0.25, 0.25, 0.25, cOrange, 0, 0, 0, a); createBox(0.18, 0.5, 0.18, cOrange, 0, -0.3, 0, a); createBox(0.2, 0.1, 0.2, cVest, 0, -0.6, 0, a);
            const hand = new THREE.Group(); hand.position.set(0, -0.75, 0);
            createBox(0.16, 0.16, 0.16, cSkin, 0, 0, 0, hand); createBox(0.06, 0.06, 0.05, cRed, 0, 0, 0.08, hand); (hand.children[1] as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color: cRed, emissive: cRed, emissiveIntensity: 0.8 });
            a.add(hand); return a;
        };
        const lArm = createArm(true); lArm.name='L_Arm'; torso.add(lArm); const rArm = createArm(false); rArm.name='R_Arm'; torso.add(rArm);
        const head = new THREE.Group(); head.name='Head'; head.position.set(0, 0.9, 0); torso.add(head);
        createBox(0.4, 0.5, 0.45, cSkin, 0, 0.15, 0, head);
        const mustZ = 0.23; createBox(0.15, 0.1, 0.05, cHair, -0.15, 0.05, mustZ, head); createBox(0.15, 0.1, 0.05, cHair, 0.15, 0.05, mustZ, head); createBox(0.1, 0.08, 0.05, cHair, 0, 0.08, mustZ, head); 
        const eyeZ = 0.23; createBox(0.1, 0.04, 0.02, cBlack, -0.1, 0.2, eyeZ, head); createBox(0.1, 0.04, 0.02, cBlack, 0.1, 0.2, eyeZ, head); 
        createBox(0.02, 0.02, 0.03, 0xFFFFFF, -0.1, 0.2, eyeZ, head); createBox(0.02, 0.02, 0.03, 0xFFFFFF, 0.1, 0.2, eyeZ, head);
        createBox(0.1, 0.01, 0.02, 0x886644, -0.1, 0.15, eyeZ, head); createBox(0.1, 0.01, 0.02, 0x886644, 0.1, 0.15, eyeZ, head);
        const hatGroup = new THREE.Group(); hatGroup.position.set(0, 0.45, 0); head.add(hatGroup);
        createBox(0.55, 0.08, 0.55, cOrange, 0, 0, 0, hatGroup); createBox(0.45, 0.4, 0.45, cVest, 0, 0.2, 0, hatGroup); createBox(0.35, 0.2, 0.35, cVest, 0, 0.5, 0, hatGroup); 
        const logoZ = 0.23; const logoY = 0.2;
        createBox(0.2, 0.15, 0.02, cRed, -0.05, logoY, logoZ, hatGroup); createBox(0.02, 0.1, 0.02, cBlack, -0.1, logoY, logoZ+0.01, hatGroup);
        createBox(0.06, 0.02, 0.02, cBlack, -0.07, logoY+0.04, logoZ+0.01, hatGroup); createBox(0.02, 0.1, 0.02, cBlack, 0.0, logoY, logoZ+0.01, hatGroup); createBox(0.06, 0.02, 0.02, cBlack, 0.03, logoY+0.04, logoZ+0.01, hatGroup);
        const hairGroup = new THREE.Group(); hairGroup.name = 'Hair'; hairGroup.position.set(0, -0.2, -0.2); head.add(hairGroup);
        createBox(0.6, 1.2, 0.2, cHair, 0, -0.6, 0, hairGroup); createBox(0.2, 0.8, 0.2, cHair, -0.35, -0.4, 0.1, hairGroup); createBox(0.2, 0.8, 0.2, cHair, 0.35, -0.4, 0.1, hairGroup);
        android.scale.set(1.5, 1.5, 1.5); char.add(android);

    } else {
        const dabura = new THREE.Group(); dabura.name = 'Dabura'; 
        const cSkin = 0xD95555; const cBlue = 0x4169E1; const cWhite = 0xFFFFFF; const cGold = 0xFFD700; const cBlack = 0x111111;
        const legH = 0.7; const hipY = legH;
        const createLeg = (isLeft: boolean) => {
            const l = new THREE.Group(); const x = isLeft ? -0.22 : 0.22; l.position.set(x, hipY, 0);
            createBox(0.26, 0.5, 0.28, cWhite, 0, -0.25, 0, l);
            const b = new THREE.Group(); b.position.set(0, -0.6, 0);
            createBox(0.22, 0.3, 0.25, cWhite, 0, 0, 0, b); createBox(0.23, 0.1, 0.35, cWhite, 0, -0.1, 0.05, b); l.add(b); return l;
        };
        const lLeg = createLeg(true); lLeg.name='L_Leg'; dabura.add(lLeg);
        const rLeg = createLeg(false); rLeg.name='R_Leg'; dabura.add(rLeg);
        const torso = new THREE.Group(); torso.name='Torso'; torso.position.set(0, hipY, 0); dabura.add(torso);
        createBox(0.65, 0.8, 0.35, cBlue, 0, 0.4, 0, torso); createBox(0.3, 0.3, 0.02, 0xB22222, 0, 0.5, 0.18, torso);
        createBox(0.67, 0.12, 0.37, 0xDDDDDD, 0, 0.05, 0, torso); createBox(0.15, 0.15, 0.05, cGold, 0, 0.05, 0.2, torso); 
        createBox(0.02, 0.08, 0.02, 0x000000, -0.04, 0.05, 0.23, torso); createBox(0.02, 0.08, 0.02, 0x000000, 0.04, 0.05, 0.23, torso); createBox(0.02, 0.06, 0.02, 0x000000, 0, 0.03, 0.23, torso);
        const capeGroup = new THREE.Group(); capeGroup.name='Cape'; capeGroup.position.set(0, 0.8, -0.2); torso.add(capeGroup); createBox(0.8, 1.4, 0.1, cWhite, 0, -0.6, 0, capeGroup); 
        const lPad = new THREE.Group(); lPad.position.set(-0.45, 0.75, 0); torso.add(lPad); createBox(0.5, 0.15, 0.4, cWhite, 0, 0, 0, lPad); createBox(0.4, 0.1, 0.3, cWhite, 0, 0.1, 0, lPad); 
        const rPad = new THREE.Group(); rPad.position.set(0.45, 0.75, 0); torso.add(rPad); createBox(0.5, 0.15, 0.4, cWhite, 0, 0, 0, rPad); createBox(0.4, 0.1, 0.3, cWhite, 0, 0.1, 0, rPad);
        const createArm = (isLeft: boolean) => {
            const a = new THREE.Group(); const x = isLeft ? -0.55 : 0.55; a.position.set(x, 0.65, 0);
            createBox(0.2, 0.4, 0.2, cBlue, 0, -0.2, 0, a); createBox(0.18, 0.4, 0.18, cSkin, 0, -0.6, 0, a); createBox(0.16, 0.16, 0.16, cSkin, 0, -0.85, 0, a); return a;
        };
        const lArm = createArm(true); lArm.name='L_Arm'; torso.add(lArm); const rArm = createArm(false); rArm.name='R_Arm'; torso.add(rArm);
        const head = new THREE.Group(); head.name='Head'; head.position.set(0, 1.05, 0); torso.add(head);
        createBox(0.4, 0.5, 0.45, cSkin, 0, 0.1, 0, head);
        createBox(0.1, 0.25, 0.05, cSkin, -0.22, 0.1, 0, head).rotation.z = 0.2; createBox(0.1, 0.25, 0.05, cSkin, 0.22, 0.1, 0, head).rotation.z = -0.2;
        createBox(0.08, 0.25, 0.08, cBlack, -0.15, 0.4, 0.1, head).rotation.z = 0.2; createBox(0.08, 0.25, 0.08, cBlack, 0.15, 0.4, 0.1, head).rotation.z = -0.2;
        const faceZ = 0.23;
        createBox(0.12, 0.05, 0.02, 0xFFFFFF, -0.1, 0.15, faceZ, head); createBox(0.03, 0.03, 0.03, 0x000000, -0.1, 0.15, faceZ+0.01, head);
        createBox(0.12, 0.05, 0.02, 0xFFFFFF, 0.1, 0.15, faceZ, head); createBox(0.03, 0.03, 0.03, 0x000000, 0.1, 0.15, faceZ+0.01, head);
        createBox(0.02, 0.08, 0.02, 0x000000, -0.06, 0.28, faceZ, head); createBox(0.02, 0.08, 0.02, 0x000000, 0.06, 0.28, faceZ, head); 
        createBox(0.02, 0.06, 0.02, 0x000000, -0.02, 0.26, faceZ, head).rotation.z = -0.5; createBox(0.02, 0.06, 0.02, 0x000000, 0.02, 0.26, faceZ, head).rotation.z = 0.5; 
        createBox(0.1, 0.15, 0.05, cBlack, 0, -0.18, faceZ, head);
        dabura.scale.set(1.6, 1.6, 1.6); char.add(dabura);
    }

    group.add(char);
    castShadows(group);
    return group;
}

export const createFlyingObstacle = () => {
    
    const group = new THREE.Group();
    const babidi = new THREE.Group(); 
    babidi.name = 'Babidi'; 
    const cSkin = 0xE6A726; const cRobe = 0x0066CC; const cCape = 0xCC3333; const cWhite = 0xFFFFFF; const cBlack = 0x000000; const cHelmet = 0x5D7893; const cGem = 0xFF0000;
    
    const bodyGroup = new THREE.Group(); 
    bodyGroup.position.set(0, 0, 0); 
    babidi.add(bodyGroup);

    createBox(0.7, 0.6, 0.6, cRobe, 0, 0, 0, bodyGroup); 
    createBox(0.75, 0.4, 0.65, cRobe, 0, -0.4, 0, bodyGroup);
    createBox(0.5, 0.4, 0.1, cWhite, 0, -0.1, 0.31, bodyGroup);
    const mZ = 0.37; 
    createBox(0.03, 0.2, 0.02, cBlack, -0.15, -0.1, mZ, bodyGroup); 
    createBox(0.03, 0.2, 0.02, cBlack, 0.15, -0.1, mZ, bodyGroup); 
    createBox(0.03, 0.15, 0.02, cBlack, -0.07, -0.12, mZ, bodyGroup).rotation.z = -0.3; 
    createBox(0.03, 0.15, 0.02, cBlack, 0.07, -0.12, mZ, bodyGroup).rotation.z = 0.3;  
    
    const lArm = new THREE.Group(); lArm.name = 'L_Arm'; 
    lArm.position.set(-0.4, 0.2, 0); 
    bodyGroup.add(lArm);
    createBox(0.15, 0.4, 0.15, cSkin, 0, -0.1, 0, lArm); 
    createBox(0.15, 0.15, 0.15, cSkin, 0, -0.35, 0, lArm); 
    lArm.rotation.x = Math.PI; 

    const rArm = new THREE.Group(); rArm.name = 'R_Arm'; 
    rArm.position.set(0.4, 0.2, 0); 
    bodyGroup.add(rArm);
    createBox(0.15, 0.4, 0.15, cSkin, 0, -0.1, 0, rArm); 
    createBox(0.15, 0.15, 0.15, cSkin, 0, -0.35, 0, rArm);
    rArm.rotation.x = Math.PI;

    const lLeg = new THREE.Group(); lLeg.name='L_Leg'; 
    lLeg.position.set(-0.2, -0.6, 0); 
    bodyGroup.add(lLeg);
    createBox(0.15, 0.3, 0.15, cRobe, 0, -0.1, 0, lLeg); 
    createBox(0.16, 0.1, 0.2, 0x333333, 0, -0.3, 0.05, lLeg); 
    lLeg.rotation.x = 0.2; 

    const rLeg = new THREE.Group(); rLeg.name='R_Leg'; 
    rLeg.position.set(0.2, -0.6, 0); 
    bodyGroup.add(rLeg);
    createBox(0.15, 0.3, 0.15, cRobe, 0, -0.1, 0, rLeg); 
    createBox(0.16, 0.1, 0.2, 0x333333, 0, -0.3, 0.05, rLeg); 
    rLeg.rotation.x = 0.2;

    const head = new THREE.Group(); head.name='Head'; 
    head.position.set(0, 0.5, 0); 
    head.scale.set(0.75, 0.75, 0.75); // Reduced head size by 25%
    bodyGroup.add(head);
    
    createBox(0.8, 0.7, 0.7, cSkin, 0, 0, 0, head); 
    createBox(0.9, 0.3, 0.6, cSkin, 0, -0.2, 0.1, head);
    createBox(0.25, 0.25, 0.1, cWhite, -0.25, 0.1, 0.35, head); 
    createBox(0.05, 0.05, 0.05, 0xFF0000, -0.25, 0.1, 0.41, head); // Red eyes
    createBox(0.25, 0.25, 0.1, cWhite, 0.25, 0.1, 0.35, head); 
    createBox(0.05, 0.05, 0.05, 0xFF0000, 0.25, 0.1, 0.41, head); // Red eyes
    
    createBox(0.6, 0.02, 0.02, 0xCC8800, 0, 0.3, 0.36, head); 
    createBox(0.6, 0.02, 0.02, 0xCC8800, 0, -0.1, 0.41, head);
    createBox(0.4, 0.02, 0.02, 0x000000, -0.5, -0.2, 0.3, head).rotation.z = 0.2; 
    createBox(0.4, 0.02, 0.02, 0x000000, 0.5, -0.2, 0.3, head).rotation.z = -0.2;
    
    const helmet = new THREE.Group(); helmet.position.set(0, 0.35, 0); head.add(helmet);
    createBox(0.85, 0.4, 0.85, cHelmet, 0, 0.1, 0, helmet); 
    createBox(0.6, 0.3, 0.6, cHelmet, 0, 0.4, 0, helmet);
    createBox(0.1, 0.4, 0.1, cWhite, 0, 0.7, 0, helmet); 
    createBox(0.15, 0.15, 0.05, cGem, 0, 0.1, 0.43, helmet);
    
    head.rotation.x = -Math.PI / 2;
    head.position.set(0, 0.5, -0.2); 

    const cape = new THREE.Group(); cape.name='Cape'; 
    cape.position.set(0, 0.4, -0.35); 
    bodyGroup.add(cape);
    createBox(0.8, 1.0, 0.1, cCape, 0, -0.4, 0, cape); 
    createBox(0.9, 0.3, 0.3, 0xE69020, 0, 0.1, 0.1, cape); 
    cape.rotation.x = 0.2; 

    babidi.rotation.x = Math.PI / 2; 
    babidi.position.y = 2.5; 
    babidi.scale.set(1.5, 1.5, 1.5);
    
    group.add(babidi);
    castShadows(group);
    return group;
};
