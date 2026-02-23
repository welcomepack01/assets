
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

export const createBossMesh = (type: string) => {
    const group = new THREE.Group();
    
    // --- HELPER: FACE BUILDER ---
    const createFace = (headGroup: THREE.Group, skinColor: number, eyeColor: number = 0x000000, isAngry: boolean = false, hasNose: boolean = true) => {
        const eyeWhite = 0xFFFFFF;
        const zFace = 0.26; 
        
        // Left Eye
        createBox(0.12, 0.1, 0.02, eyeWhite, -0.15, 0.05, zFace, headGroup);
        createBox(0.05, 0.05, 0.03, eyeColor, -0.15 + (isAngry?0.02:0), 0.05, zFace, headGroup);
        
        // Right Eye
        createBox(0.12, 0.1, 0.02, eyeWhite, 0.15, 0.05, zFace, headGroup);
        createBox(0.05, 0.05, 0.03, eyeColor, 0.15 - (isAngry?0.02:0), 0.05, zFace, headGroup);

        // Eyebrows
        if (isAngry) {
            createBox(0.15, 0.03, 0.03, 0x000000, -0.15, 0.12, zFace, headGroup).rotation.z = -0.2;
            createBox(0.15, 0.03, 0.03, 0x000000, 0.15, 0.12, zFace, headGroup).rotation.z = 0.2;
        }

        // Nose
        if (hasNose) {
            createBox(0.04, 0.04, 0.02, skinColor - 0x111111, 0, -0.05, zFace, headGroup); 
        }

        // Mouth
        createBox(0.1, 0.02, 0.02, 0x000000, 0, -0.15, zFace, headGroup);
    };

    if (type === 'boss1') { 
        // --- VEGETA (Rigged for A-POSE CHARGE) ---
        const vegeta = new THREE.Group(); vegeta.name = 'Vegeta';
        const blue = COLORS.vegetaBlue; 
        const armorWhite = COLORS.vegetaArmor;
        const padColor = COLORS.vegetaPad || 0xD4AF37;
        const skin = COLORS.skin;
        const hairC = 0x111111; 
        const tailBrown = 0x5D4037;

        const legH = 0.7; const hipY = legH;
        const createLeg = (isLeft: boolean) => {
            const leg = new THREE.Group(); const xOffset = isLeft ? -0.2 : 0.2; leg.position.set(xOffset, hipY, 0); 
            createBox(0.22, legH, 0.22, blue, 0, -legH/2 + 0.15, 0, leg);
            const b = new THREE.Group(); b.position.set(0, -legH + 0.15, 0.1);
            createBox(0.26, 0.3, 0.4, armorWhite, 0, 0, 0, b); createBox(0.28, 0.1, 0.42, armorWhite, 0, -0.1, 0.05, b); 
            createBox(0.28, 0.02, 0.1, padColor, 0, -0.05, 0.22, b); createBox(0.28, 0.02, 0.1, padColor, 0, 0.0, 0.22, b); createBox(0.28, 0.02, 0.1, padColor, 0, 0.05, 0.22, b); 
            leg.add(b); return leg;
        };
        const lLeg = createLeg(true); lLeg.name = 'L_Leg'; vegeta.add(lLeg);
        const rLeg = createLeg(false); rLeg.name = 'R_Leg'; vegeta.add(rLeg);

        const torso = new THREE.Group(); torso.name = 'Torso'; torso.position.set(0, hipY, 0); vegeta.add(torso);
        createBox(0.6, 0.8, 0.35, blue, 0, 0.4, 0, torso);
        createBox(0.65, 0.5, 0.4, armorWhite, 0, 0.55, 0, torso); createBox(0.5, 0.1, 0.38, armorWhite, 0, 0.85, 0, torso);
        const absY = 0.2; createBox(0.55, 0.3, 0.42, padColor, 0, absY, 0, torso);
        createBox(0.56, 0.02, 0.43, 0xB8860B, 0, absY + 0.1, 0, torso); createBox(0.56, 0.02, 0.43, 0xB8860B, 0, absY, 0, torso); createBox(0.56, 0.02, 0.43, 0xB8860B, 0, absY - 0.1, 0, torso);
        const skirtY = -0.05; 
        createBox(0.25, 0.3, 0.05, armorWhite, 0, skirtY, 0.2, torso).rotation.x = -0.2; createBox(0.27, 0.05, 0.06, padColor, 0, skirtY - 0.15, 0.22, torso).rotation.x = -0.2;
        const sideFlapL = createBox(0.05, 0.3, 0.3, armorWhite, -0.32, skirtY, 0, torso); sideFlapL.rotation.z = 0.2; createBox(0.06, 0.05, 0.32, padColor, -0.34, skirtY - 0.15, 0, torso).rotation.z = 0.2;
        const sideFlapR = createBox(0.05, 0.3, 0.3, armorWhite, 0.32, skirtY, 0, torso); sideFlapR.rotation.z = -0.2; createBox(0.06, 0.05, 0.32, padColor, 0.34, skirtY - 0.15, 0, torso).rotation.z = -0.2;
        const tailGroup = new THREE.Group(); tailGroup.position.set(0, -0.05, -0.2); torso.add(tailGroup);
        createBox(0.7, 0.15, 0.15, tailBrown, 0, 0, 0, tailGroup); createBox(0.15, 0.15, 0.5, tailBrown, 0.35, 0, 0.2, tailGroup); createBox(0.15, 0.15, 0.5, tailBrown, -0.35, 0, 0.2, tailGroup); createBox(0.1, 0.1, 0.1, tailBrown, 0.2, -0.1, 0.4, tailGroup);
        const padL = new THREE.Group(); padL.position.set(-0.35, 0.75, 0); torso.add(padL); createBox(0.7, 0.12, 0.5, armorWhite, -0.4, 0, 0, padL).rotation.z = -0.2; createBox(0.15, 0.13, 0.51, padColor, -0.75, -0.08, 0, padL).rotation.z = -0.2;
        const padR = new THREE.Group(); padR.position.set(0.35, 0.75, 0); torso.add(padR); createBox(0.7, 0.12, 0.5, armorWhite, 0.4, 0, 0, padR).rotation.z = 0.2; createBox(0.15, 0.13, 0.51, padColor, 0.75, -0.08, 0, padR).rotation.z = 0.2;

        const createArm = (isLeft: boolean) => {
            const arm = new THREE.Group(); 
            const sign = isLeft ? -1 : 1; 
            arm.position.set(sign * 0.48, 0.72, 0); 
            createBox(0.22, 0.28, 0.22, blue, 0, -0.14, 0, arm);
            createBox(0.26, 0.08, 0.26, armorWhite, 0, -0.32, 0, arm);
            createBox(0.24, 0.35, 0.24, armorWhite, 0, -0.535, 0, arm);
            createBox(0.22, 0.18, 0.22, armorWhite, 0, -0.8, 0, arm);
            return arm;
        };
        const lArm = createArm(true); lArm.name = 'L_Arm'; torso.add(lArm); 
        const rArm = createArm(false); rArm.name = 'R_Arm'; torso.add(rArm);

        const head = new THREE.Group(); head.name='Head'; head.position.set(0, 1.15, 0); torso.add(head);
        createBox(0.5, 0.6, 0.5, skin, 0, 0, 0, head); createFace(head, skin, 0x000000, true);
        createBox(0.1, 0.1, 0.52, hairC, 0, 0.28, 0, head); createBox(0.2, 0.1, 0.52, hairC, -0.2, 0.35, 0, head).rotation.z = -0.5; createBox(0.2, 0.1, 0.52, hairC, 0.2, 0.35, 0, head).rotation.z = 0.5;
        const hairGroup = new THREE.Group(); hairGroup.position.set(0, 0.3, -0.1); head.add(hairGroup); createBox(0.6, 0.3, 0.6, hairC, 0, 0, 0, hairGroup);
        const createSpike = (w, h, x, y, z, rz, rx) => { const s = createBox(w, h, w, hairC, x, y, z, hairGroup); s.rotation.z = rz; s.rotation.x = rx; };
        createSpike(0.25, 0.8, 0, 0.6, 0, 0, -0.1); createSpike(0.2, 0.6, -0.25, 0.4, 0, 0.3, 0); createSpike(0.2, 0.6, 0.25, 0.4, 0, -0.3, 0); createSpike(0.2, 0.5, -0.4, 0.2, 0.1, 0.6, 0); createSpike(0.2, 0.5, 0.4, 0.2, 0.1, -0.6, 0); createSpike(0.3, 0.5, 0, 0.2, -0.2, 0, -0.4);
        const scouterGroup = new THREE.Group(); scouterGroup.position.set(-0.26, 0.05, 0); head.add(scouterGroup);
        createBox(0.1, 0.15, 0.1, 0xFFFFFF, 0, 0, 0, scouterGroup); createBox(0.05, 0.05, 0.3, 0xAAAAAA, -0.05, 0, 0.15, scouterGroup);
        const lensMat = new THREE.MeshStandardMaterial({ color: 0xFF0033, transparent: true, opacity: 0.6, emissive: 0xFF0000, emissiveIntensity: 0.4, side: THREE.DoubleSide });
        const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.2), lensMat); lens.position.set(0.1, 0, 0.3); scouterGroup.add(lens);

        const auraGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const auraMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, transparent: true, opacity: 0.2, emissive: 0xFFD700, emissiveIntensity: 0.3, side: THREE.BackSide });
        const aura = new THREE.Mesh(auraGeo, auraMat); aura.name = 'KiAura'; aura.position.set(0, 1.0, 0); aura.scale.set(1.0, 1.3, 1.0); vegeta.add(aura);

        vegeta.scale.set(1.5, 1.5, 1.5); group.add(vegeta);
        
    } else if (type === 'boss2') { 
        // --- FRIEZA ---
        const frieza = new THREE.Group(); frieza.name = 'Frieza';
        const fWhite = 0xFFFFFF; const fPurple = 0x6A0DAD; const fSkin = 0xF0F0F0; const fRed = 0xFF0000;
        const hipY = 0.8;
        const createLeg = (x: number) => {
            const leg = new THREE.Group(); leg.position.set(x, hipY, 0);
            createBox(0.18, 0.55, 0.2, fPurple, 0, -0.8, 0.05, leg); createBox(0.05, 0.5, 0.02, fWhite, 0, -0.8, 0.15, leg);
            createBox(0.2, 0.15, 0.22, fWhite, 0, -0.45, 0, leg); createBox(0.22, 0.65, 0.24, fWhite, 0, -0.1, 0, leg);
            const f = new THREE.Group(); f.position.set(0, -1.15, 0.1);
            createBox(0.22, 0.12, 0.4, fWhite, 0, 0, 0, f); createBox(0.06, 0.08, 0.15, fWhite, -0.07, -0.02, 0.25, f); createBox(0.06, 0.08, 0.15, fWhite, 0.07, -0.02, 0.25, f); createBox(0.06, 0.08, 0.15, fWhite, 0, -0.02, 0.27, f); createBox(0.02, 0.06, 0.05, 0x000000, -0.07, -0.03, 0.33, f); createBox(0.02, 0.06, 0.05, 0x000000, 0.07, -0.03, 0.33, f); createBox(0.02, 0.06, 0.05, 0x000000, 0, -0.03, 0.35, f);
            leg.add(f); return leg;
        };
        const lLeg = createLeg(-0.25); lLeg.name = 'L_Leg'; frieza.add(lLeg); const rLeg = createLeg(0.25); rLeg.name = 'R_Leg'; frieza.add(rLeg);
        const torso = new THREE.Group(); torso.name='Torso'; torso.position.set(0, hipY + 0.5, 0); frieza.add(torso);
        createBox(0.55, 0.25, 0.35, fWhite, 0, -0.6, 0, torso); createBox(0.45, 0.3, 0.3, fSkin, 0, -0.3, 0, torso); createBox(0.46, 0.02, 0.31, 0xCCCCCC, 0, -0.3, 0, torso);
        createBox(0.65, 0.4, 0.4, fSkin, 0, 0.05, 0, torso); createBox(0.4, 0.3, 0.05, fPurple, 0, 0.05, 0.21, torso); createBox(0.1, 0.1, 0.06, 0xAA88EE, -0.1, 0.1, 0.21, torso); createBox(0.3, 0.1, 0.3, fPurple, 0, 0.3, 0, torso);
        const shoulderL = new THREE.Group(); shoulderL.position.set(-0.45, 0.15, 0); torso.add(shoulderL); createBox(0.35, 0.25, 0.35, fPurple, 0, 0, 0, shoulderL); createBox(0.25, 0.35, 0.25, fPurple, 0, 0, 0, shoulderL);
        const shoulderR = new THREE.Group(); shoulderR.position.set(0.45, 0.15, 0); torso.add(shoulderR); createBox(0.35, 0.25, 0.35, fPurple, 0, 0, 0, shoulderR); createBox(0.25, 0.35, 0.25, fPurple, 0, 0, 0, shoulderR);
        const createArm = (isLeft: boolean) => {
            const arm = new THREE.Group(); const sign = isLeft ? -1 : 1; arm.position.set(sign * 0.6, 0, 0);
            createBox(0.2, 0.4, 0.2, fWhite, 0, -0.2, 0, arm); createBox(0.18, 0.4, 0.18, fWhite, 0, -0.6, 0.1, arm); createBox(0.15, 0.15, 0.15, fWhite, 0, -0.9, 0.1, arm); createBox(0.04, 0.1, 0.04, 0x000000, 0, -1.0, 0.1, arm);
            return arm;
        };
        const lArm = createArm(true); lArm.name = 'L_Arm'; torso.add(lArm); const rArm = createArm(false); rArm.name = 'R_Arm'; torso.add(rArm);
        const tail = new THREE.Group(); tail.name='Tail'; tail.position.set(0, -0.65, -0.2); torso.add(tail);
        createBox(0.2, 0.2, 0.6, fWhite, 0, 0, -0.3, tail); createBox(0.18, 0.18, 0.6, fWhite, 0, 0.1, -0.8, tail).rotation.x = 0.2; createBox(0.16, 0.16, 0.6, fWhite, 0, 0.3, -1.3, tail).rotation.x = 0.4; createBox(0.14, 0.14, 0.4, fPurple, 0, 0.6, -1.7, tail).rotation.x = 0.6;
        const head = new THREE.Group(); head.name='Head'; head.position.set(0, 0.4, 0); torso.add(head);
        createBox(0.35, 0.25, 0.35, fWhite, 0, -0.2, 0, head); createBox(0.45, 0.3, 0.4, fWhite, 0, 0.05, 0, head); createBox(0.42, 0.12, 0.42, fPurple, 0, 0.3, 0, head); createBox(0.32, 0.22, 0.32, fPurple, 0, 0.35, 0, head); createBox(0.1, 0.1, 0.02, 0xAA88EE, 0.08, 0.4, 0.16, head);
        const faceZ = 0.21; const eyeMat = new THREE.MeshBasicMaterial({ color: fRed });
        const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.02), eyeMat); eyeL.position.set(-0.12, 0.05, faceZ); eyeL.rotation.z = -0.2; head.add(eyeL);
        const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.02), eyeMat); eyeR.position.set(0.12, 0.05, faceZ); eyeR.rotation.z = 0.2; head.add(eyeR);
        createBox(0.02, 0.15, 0.02, 0xAA55FF, -0.12, -0.05, faceZ, head); createBox(0.02, 0.15, 0.02, 0xAA55FF, 0.12, -0.05, faceZ, head); createBox(0.1, 0.02, 0.02, 0x000000, 0, -0.15, faceZ, head);
        createBox(0.05, 0.15, 0.1, fWhite, -0.25, 0, 0, head); createBox(0.02, 0.1, 0.05, 0x000000, -0.28, 0, 0, head); createBox(0.05, 0.15, 0.1, fWhite, 0.25, 0, 0, head); createBox(0.02, 0.1, 0.05, 0x000000, 0.28, 0, 0, head);
        const magicGroup = new THREE.Group(); magicGroup.name = 'PurpleMagic'; const rockGeo = new THREE.DodecahedronGeometry(0.2, 0); const rockMat = new THREE.MeshStandardMaterial({ color: 0x8A2BE2, emissive: 0x4B0082 });
        for(let i=0; i<6; i++) { const rock = new THREE.Mesh(rockGeo, rockMat); const angle = (i/6) * Math.PI * 2; rock.position.set(Math.cos(angle)*1.5, Math.random()*2 - 1, Math.sin(angle)*1.5); rock.scale.setScalar(0.5 + Math.random()); magicGroup.add(rock); } frieza.add(magicGroup);
        frieza.scale.set(1.5, 1.5, 1.5); group.add(frieza);
        
    } else if (type === 'boss3') { 
        // --- PERFECT CELL (REVISED 2: LOWERED WINGS & WHITE TEAR LINES) ---
        const cell = new THREE.Group(); cell.name = 'Cell';
        
        // Colors
        const cGreen = 0x55AA33; 
        const cDarkGreen = 0x004400; // Spots
        const cBlack = 0x151515; 
        const cWhite = 0xF0F0F0; 
        const cPurple = 0x770077; 
        const cYellow = 0xFFCC00; 
        const cSilver = 0x999999; 
        const cBlue = 0x0055AA;   
        const cRedEye = 0xFF0000;
        const cSpot = 0x004400;   

        const hipY = 1.4;

        // Helper for spots
        const addCellSpots = (target: THREE.Group, w: number, h: number, d: number, count: number) => {
            for(let i=0; i<count; i++) {
                const s = 0.03;
                createBox(s, s, 0.01, cSpot, (Math.random()-0.5)*w, (Math.random()-0.5)*h, d/2 + 0.005, target);
            }
        };

        // 1. LEGS
        const createLeg = (isLeft: boolean) => {
            const leg = new THREE.Group();
            const x = isLeft ? -0.25 : 0.25;
            leg.position.set(x, hipY, 0);

            // Foot (Yellow)
            const foot = new THREE.Group();
            foot.position.set(0, -1.3, 0.1);
            createBox(0.25, 0.15, 0.4, cYellow, 0, 0, 0, foot); // Base
            createBox(0.2, 0.1, 0.2, cYellow, 0, 0.05, 0.15, foot); // Toe area
            leg.add(foot);

            // Shin (Silver/Grey with vertical detail)
            const shinY = -0.8;
            createBox(0.22, 0.7, 0.22, cSilver, 0, shinY, 0, leg);
            createBox(0.05, 0.6, 0.23, 0xFFFFFF, 0, shinY, 0, leg); // Shin guard ridge

            // Knee (Blue)
            createBox(0.2, 0.15, 0.2, cBlue, 0, -0.4, 0, leg);

            // Thigh (Green with spots)
            const thigh = new THREE.Group();
            thigh.position.set(0, -0.15, 0);
            createBox(0.24, 0.45, 0.24, cGreen, 0, 0, 0, thigh);
            addCellSpots(thigh, 0.24, 0.45, 0.24, 6);
            leg.add(thigh);

            return leg;
        };
        const lLeg = createLeg(true); lLeg.name='L_Leg'; cell.add(lLeg);
        const rLeg = createLeg(false); rLeg.name='R_Leg'; cell.add(rLeg);

        // 2. TORSO
        const torso = new THREE.Group();
        torso.name = 'Torso';
        torso.position.set(0, hipY, 0);
        cell.add(torso);

        // Pelvis (Black)
        createBox(0.35, 0.25, 0.3, cBlack, 0, 0.1, 0, torso);

        // Waist Belt (Blue)
        createBox(0.4, 0.1, 0.32, cBlue, 0, 0.3, 0, torso);

        // Abdomen (Green)
        createBox(0.38, 0.3, 0.28, cGreen, 0, 0.5, 0, torso);

        // Chest (Black Armor)
        const chestY = 0.85;
        createBox(0.6, 0.4, 0.4, cBlack, 0, chestY, 0, torso);
        // Purple Core (Circle approximation)
        createBox(0.15, 0.15, 0.05, cPurple, 0, chestY, 0.21, torso);
        
        // Neck Connection (Black/Green blend)
        createBox(0.25, 0.2, 0.25, cBlack, 0, chestY + 0.25, 0, torso);

        // Shoulder Pads (Black, extending out)
        const createShoulder = (isLeft: boolean) => {
            const s = new THREE.Group();
            const x = isLeft ? -0.45 : 0.45;
            s.position.set(x, chestY + 0.1, 0);
            createBox(0.35, 0.2, 0.35, cBlack, 0, 0, 0, s);
            createBox(0.3, 0.15, 0.3, cBlack, isLeft?-0.1:0.1, -0.15, 0, s); // Curve down
            torso.add(s);
        };
        createShoulder(true);
        createShoulder(false);

        // 3. ARMS
        const createArm = (isLeft: boolean) => {
            const arm = new THREE.Group();
            const x = isLeft ? -0.55 : 0.55;
            arm.position.set(x, chestY, 0);

            // Bicep (Green)
            const bicep = new THREE.Group();
            createBox(0.18, 0.3, 0.18, cGreen, 0, -0.2, 0, bicep);
            addCellSpots(bicep, 0.18, 0.3, 0.18, 3);
            arm.add(bicep);

            // Elbow (Green joint)
            createBox(0.16, 0.1, 0.16, cGreen, 0, -0.4, 0, arm);

            // Forearm (Green)
            const forearm = new THREE.Group();
            forearm.position.set(0, -0.65, 0);
            createBox(0.18, 0.35, 0.18, cGreen, 0, 0, 0, forearm);
            addCellSpots(forearm, 0.18, 0.35, 0.18, 4);
            arm.add(forearm);

            // Hand (White)
            createBox(0.15, 0.15, 0.15, cWhite, 0, -0.9, 0, arm);

            return arm;
        };
        const lArm = createArm(true); lArm.name = 'L_Arm'; torso.add(lArm);
        const rArm = createArm(false); rArm.name = 'R_Arm'; torso.add(rArm);

        // 4. HEAD (RE-DESIGNED LOWER FOREHEAD)
        const head = new THREE.Group();
        head.name = 'Head';
        // Connect directly to neck top
        head.position.set(0, chestY + 0.45, 0); 
        torso.add(head);

        // Face Base (White)
        createBox(0.35, 0.4, 0.35, cWhite, 0, 0.1, 0.05, head);
        
        // Yellow Jawline (U-Shape strap) - Fits under chin
        createBox(0.37, 0.12, 0.37, cYellow, 0, -0.15, 0.06, head); // Chin
        createBox(0.08, 0.35, 0.25, cYellow, -0.19, 0.05, 0.05, head); // L Ear
        createBox(0.08, 0.35, 0.25, cYellow, 0.19, 0.05, 0.05, head); // R Ear

        // Purple Side Patches
        createBox(0.1, 0.2, 0.15, cPurple, -0.21, 0.1, 0.1, head);
        createBox(0.1, 0.2, 0.15, cPurple, 0.21, 0.1, 0.1, head);

        // Eyes (Red + Black Outline)
        const eyeZ = 0.23;
        const eyeY = 0.15; // Lowered eye position
        createBox(0.1, 0.05, 0.02, cRedEye, -0.09, eyeY, eyeZ, head).rotation.z = -0.15;
        createBox(0.1, 0.05, 0.02, cRedEye, 0.09, eyeY, eyeZ, head).rotation.z = 0.15;
        
        // Tear lines (CHANGED FROM PURPLE TO WHITE AS REQUESTED)
        createBox(0.02, 0.15, 0.02, cWhite, -0.09, eyeY - 0.12, eyeZ, head);
        createBox(0.02, 0.15, 0.02, cWhite, 0.09, eyeY - 0.12, eyeZ, head);

        // Crown / Horns (LOWERED significantly to reduce forehead)
        const crownY = 0.28; // Sit right above eyes
        createBox(0.45, 0.1, 0.4, cGreen, 0, crownY, 0, head); // Forehead base
        
        const hornH = 0.7;
        const lHorn = new THREE.Group();
        lHorn.position.set(-0.15, crownY, 0);
        lHorn.rotation.z = 0.3; 
        createBox(0.15, hornH, 0.15, cGreen, 0, hornH/2, 0, lHorn);
        addCellSpots(lHorn, 0.15, hornH, 0.15, 3);
        head.add(lHorn);

        const rHorn = new THREE.Group();
        rHorn.position.set(0.15, crownY, 0);
        rHorn.rotation.z = -0.3;
        createBox(0.15, hornH, 0.15, cGreen, 0, hornH/2, 0, rHorn);
        addCellSpots(rHorn, 0.15, hornH, 0.15, 3);
        head.add(rHorn);

        // Black Dome (Between horns)
        createBox(0.2, 0.15, 0.2, cBlack, 0, crownY + 0.1, 0, head);
        createBox(0.05, 0.05, 0.02, 0xFFFFFF, 0.05, crownY + 0.15, 0.11, head); // Shine

        // 5. WINGS (SPREAD OUT & LOWERED TO SHOULDERS)
        const wings = new THREE.Group();
        wings.name = 'Wings';
        // Lowered from chestY + 0.2 to chestY (0.85) to align with shoulders
        wings.position.set(0, chestY, -0.25);
        torso.add(wings);
        
        const createSpreadWing = (isLeft: boolean) => {
            const w = new THREE.Group();
            const xDir = isLeft ? -1 : 1;
            
            // Move anchor point further out
            w.position.set(xDir * 0.2, 0, 0);
            
            // Open Wings Outwards (Spread)
            // Rotate Y to open back like elytra
            w.rotation.y = xDir * 0.6; // Open angle
            w.rotation.z = xDir * 0.1; // Slight tilt up

            const shell = new THREE.Group();
            // Offset the geometry so it pivots from the connection point
            shell.position.set(xDir * 0.35, -0.3, 0); 
            
            // Main Black Shell
            createBox(0.6, 1.4, 0.08, cBlack, 0, 0, 0, shell);
            addCellSpots(shell, 0.6, 1.4, 0.08, 5);
            
            w.add(shell);
            return w;
        };
        const wL = createSpreadWing(true); wL.name = 'Wing_L'; wings.add(wL);
        const wR = createSpreadWing(false); wR.name = 'Wing_R'; wings.add(wR);

        // Aura
        const auraGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const auraMat = new THREE.MeshStandardMaterial({ 
            color: 0x00FF00, 
            transparent: true, 
            opacity: 0.3, 
            emissive: 0x00FF00, 
            emissiveIntensity: 0.5, 
            side: THREE.BackSide 
        });
        const aura = new THREE.Mesh(auraGeo, auraMat); 
        aura.name = 'GreenAura'; 
        aura.position.set(0, 1.0, 0); 
        aura.scale.set(1.2, 1.5, 1.2); 
        cell.add(aura);

        // Scale
        cell.scale.set(1.7, 1.7, 1.7);
        group.add(cell);
        
    } else if (type === 'boss4') { 
        // --- MAJIN BUU ---
        const buu = new THREE.Group(); buu.name = 'Buu';
        const pink = 0xFF69B4; const white = 0xFFFFFF; const vestBlack = 0x1A1A1A; const gold = 0xFFD700; const capePurple = 0x800080; const beltBlack = 0x000000; const mLogoColor = 0x000000;
        const pantsY = 0.5; const hipY = 1.1;
        const createLeg = (isLeft: boolean) => {
            const leg = new THREE.Group(); const xOffset = isLeft ? -0.2 : 0.2; leg.position.set(xOffset, hipY, 0); 
            createBox(0.48, 0.6, 0.48, white, isLeft ? -0.2 : 0.2, -0.3, 0, leg); createBox(0.38, 0.15, 0.38, 0xEEEEEE, isLeft ? -0.2 : 0.2, -0.62, 0, leg);
            const b = new THREE.Group(); b.position.set(isLeft ? -0.2 : 0.2, -0.75, 0.1);
            createBox(0.35, 0.25, 0.5, gold, 0, 0, 0, b); createBox(0.37, 0.05, 0.52, 0xDAA520, 0, -0.12, 0, b); createBox(0.2, 0.26, 0.2, beltBlack, 0, 0, 0.2, b); createBox(0.32, 0.1, 0.32, gold, 0, 0.15, -0.05, b);
            leg.add(b); return leg;
        };
        const lLeg = createLeg(true); lLeg.name = 'L_Leg'; buu.add(lLeg); const rLeg = createLeg(false); rLeg.name = 'R_Leg'; buu.add(rLeg);
        const torso = new THREE.Group(); torso.name='Torso'; torso.position.set(0, hipY, 0); buu.add(torso);
        const beltGroup = new THREE.Group(); createBox(1.05, 0.15, 0.75, beltBlack, 0, 0, 0, beltGroup);
        const buckleGroup = new THREE.Group(); buckleGroup.position.set(0, 0, 0.38); beltGroup.add(buckleGroup); createBox(0.3, 0.25, 0.05, gold, 0, 0, 0, buckleGroup);
        const mZ = 0.03; createBox(0.04, 0.16, 0.02, mLogoColor, -0.08, 0, mZ, buckleGroup); createBox(0.04, 0.16, 0.02, mLogoColor, 0.08, 0, mZ, buckleGroup); createBox(0.04, 0.12, 0.02, mLogoColor, 0, 0.02, mZ, buckleGroup); createBox(0.09, 0.04, 0.02, mLogoColor, -0.04, 0.08, mZ, buckleGroup); createBox(0.09, 0.04, 0.02, mLogoColor, 0.04, 0.08, mZ, buckleGroup);
        torso.add(beltGroup);
        createBox(1.15, 0.9, 0.95, pink, 0, 0.5, 0.1, torso); createBox(1.0, 0.5, 0.8, pink, 0, 1.1, 0, torso);
        createBox(1.2, 0.8, 0.2, vestBlack, 0, 0.9, -0.4, torso); createBox(0.25, 0.7, 0.9, vestBlack, -0.55, 0.9, 0, torso); createBox(0.25, 0.7, 0.9, vestBlack, 0.55, 0.9, 0, torso); createBox(1.25, 0.12, 0.3, gold, 0, 1.35, -0.3, torso); 
        const lapelGeo = new THREE.BoxGeometry(0.3, 0.8, 0.1); const lapelMat = new THREE.MeshStandardMaterial({color: gold}); const lapelL = new THREE.Mesh(lapelGeo, lapelMat); lapelL.position.set(-0.35, 0.9, 0.5); lapelL.rotation.y = 0.2; torso.add(lapelL); const lapelR = new THREE.Mesh(lapelGeo, lapelMat); lapelR.position.set(0.35, 0.9, 0.5); lapelR.rotation.y = -0.2; torso.add(lapelR);
        const capeGroup = new THREE.Group(); capeGroup.name='Cape'; capeGroup.position.set(0, 1.4, -0.4); torso.add(capeGroup); createBox(0.3, 0.2, 0.2, capePurple, 0, 0, 0, capeGroup); createBox(1.4, 1.6, 0.1, capePurple, 0, -0.8, -0.15, capeGroup); createBox(0.4, 1.4, 0.1, capePurple, -0.6, -0.7, 0.05, capeGroup).rotation.y = 0.3; createBox(0.4, 1.4, 0.1, capePurple, 0.6, -0.7, 0.05, capeGroup).rotation.y = -0.3;
        const createArm = (isLeft: boolean) => {
            const arm = new THREE.Group(); const sign = isLeft ? -1 : 1; arm.position.set(sign * 0.7, 1.2, 0); 
            createBox(0.38, 0.5, 0.38, pink, 0, -0.2, 0, arm); createBox(0.42, 0.4, 0.42, gold, 0, -0.6, 0, arm); createBox(0.32, 0.3, 0.32, gold, 0, -0.9, 0, arm); createBox(0.15, 0.15, 0.1, gold, sign * 0.15, -0.8, 0.2, arm);
            return arm;
        };
        const lArm = createArm(true); lArm.name = 'L_Arm'; torso.add(lArm); const rArm = createArm(false); rArm.name = 'R_Arm'; torso.add(rArm);
        const head = new THREE.Group(); head.name='Head'; head.position.set(0, 1.4, 0.1); torso.add(head);
        createBox(0.7, 0.6, 0.6, pink, 0, 0, 0, head); createBox(0.85, 0.4, 0.5, pink, 0, -0.1, 0.1, head); createBox(0.6, 0.7, 0.5, pink, 0, 0.1, -0.1, head); 
        createBox(0.1, 0.1, 0.1, beltBlack, -0.45, 0.1, 0, head); createBox(0.1, 0.1, 0.1, beltBlack, 0.45, 0.1, 0, head);
        const faceZ = 0.35; createBox(0.14, 0.03, 0.02, beltBlack, -0.18, 0.1, faceZ, head); createBox(0.14, 0.03, 0.02, beltBlack, 0.18, 0.1, faceZ, head); createBox(0.02, 0.02, 0.02, beltBlack, -0.04, 0.0, faceZ + 0.02, head); createBox(0.02, 0.02, 0.02, beltBlack, 0.04, 0.0, faceZ + 0.02, head); createBox(0.3, 0.05, 0.02, beltBlack, 0, -0.15, faceZ, head); createBox(0.04, 0.05, 0.02, beltBlack, -0.18, -0.13, faceZ, head); createBox(0.04, 0.05, 0.02, beltBlack, 0.18, -0.13, faceZ, head);
        const tentacle = new THREE.Group(); tentacle.name='Tentacle'; tentacle.position.set(0, 0.4, 0); head.add(tentacle);
        createBox(0.2, 0.25, 0.2, pink, 0, 0.1, 0, tentacle); createBox(0.16, 0.5, 0.16, pink, 0, 0.4, 0, tentacle).rotation.x = -0.3; createBox(0.12, 0.4, 0.12, pink, 0, 0.8, -0.2, tentacle).rotation.x = -0.8;
        const sparkGroup = new THREE.Group(); sparkGroup.name = 'ElectroField'; const sparkMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF }); const sparkGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
        for(let i=0; i<8; i++) { const spark = new THREE.Mesh(sparkGeo, sparkMat); spark.position.set((Math.random()-0.5)*3, (Math.random()-0.5)*3, (Math.random()-0.5)*3); spark.rotation.set(Math.random(), Math.random(), Math.random()); sparkGroup.add(spark); } buu.add(sparkGroup);
        buu.scale.set(1.6, 1.6, 1.6); group.add(buu);
    }
    
    castShadows(group); return group;
};
