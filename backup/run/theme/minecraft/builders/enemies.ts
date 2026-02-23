
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

export const createDodgeObstacle = (variant: 'A' | 'B') => {
    const group = new THREE.Group();
    if (variant === 'A') { // Villager (Replaces Pig)
        const villager = new THREE.Group(); villager.name = 'Villager';
        
        // --- Villager Randomization ---
        const professions = [
            { name: 'Farmer', robe: 0x4B3621, detail: 0x8B4513, pants: 0x3E2723 }, // Brown
            { name: 'Librarian', robe: 0xFFFFFF, detail: 0xD32F2F, pants: 0xCCCCCC }, // White + Red
            { name: 'Priest', robe: 0x800080, detail: 0x4B0082, pants: 0x222222 }, // Purple
            { name: 'Smith', robe: 0x111111, detail: 0x555555, pants: 0x333333 }, // Black apron
            { name: 'Butcher', robe: 0xF5F5DC, detail: 0x8B4513, pants: 0x5D4037 }, // Apron
            { name: 'Nitwit', robe: 0x2E7D32, detail: 0x388E3C, pants: 0x1B5E20 }  // Green
        ];
        
        const profession = professions[Math.floor(Math.random() * professions.length)];
        
        const robeColor = profession.robe;
        const robeDetail = profession.detail;
        const skinColor = 0xB57B58; // Villager Skin
        const eyeColor = 0x378D37; // Emerald Green Eyes
        const pantsColor = profession.pants;
        
        // Legs (Groups pivoted at hips)
        const legH = 0.7;
        const legW = 0.25;
        
        // Left Leg Group
        const lLegGroup = new THREE.Group();
        lLegGroup.name = 'L_Leg';
        lLegGroup.position.set(-0.15, legH, 0); // Hips at y = legH
        villager.add(lLegGroup);
        // Mesh offset downwards relative to hip
        createBox(legW, legH, legW, pantsColor, 0, -legH/2, 0, lLegGroup);

        // Right Leg Group
        const rLegGroup = new THREE.Group();
        rLegGroup.name = 'R_Leg';
        rLegGroup.position.set(0.15, legH, 0); // Hips at y = legH
        villager.add(rLegGroup);
        // Mesh offset downwards relative to hip
        createBox(legW, legH, legW, pantsColor, 0, -legH/2, 0, rLegGroup);

        // Body (Robe)
        const bodyH = 0.9; 
        createBox(0.6, bodyH, 0.35, robeColor, 0, legH + bodyH/2, 0, villager);
        // Robe detail/trim
        createBox(0.62, 0.1, 0.37, robeDetail, 0, legH + 0.1, 0, villager);
        // Collar detail for some professions
        if (profession.name === 'Priest' || profession.name === 'Librarian') {
             createBox(0.62, 0.1, 0.37, robeDetail, 0, legH + bodyH - 0.1, 0, villager);
        }

        // Arms (Crossed "Unimpressed" Style)
        const armGroup = new THREE.Group();
        armGroup.position.set(0, legH + 0.5, 0.2); // Chest height, slightly forward
        villager.add(armGroup);
        // Middle part of crossed arms
        createBox(0.6, 0.25, 0.25, robeColor, 0, 0, 0, armGroup);
        // Left shoulder part hanging down to cross
        createBox(0.2, 0.5, 0.25, robeColor, -0.3, 0.125, 0, armGroup);
        // Right shoulder part
        createBox(0.2, 0.5, 0.25, robeColor, 0.3, 0.125, 0, armGroup);

        // Head
        const head = new THREE.Group(); 
        head.name = 'Head';
        head.position.set(0, legH + bodyH, 0); 
        villager.add(head);
        
        // Main Head Box (Tall Rectangular)
        createBox(0.5, 0.65, 0.5, skinColor, 0, 0.325, 0, head);
        
        // Nose (The signature feature)
        createBox(0.12, 0.25, 0.12, skinColor, 0, 0.15, 0.3, head);

        // Eyes (Green)
        const eyeY = 0.4;
        const eyeZ = 0.26;
        createBox(0.12, 0.06, 0.02, 0xFFFFFF, -0.14, eyeY, eyeZ, head); // L White
        createBox(0.04, 0.04, 0.03, eyeColor, -0.12, eyeY, eyeZ+0.01, head); // L Pupil
        createBox(0.12, 0.06, 0.02, 0xFFFFFF, 0.14, eyeY, eyeZ, head); // R White
        createBox(0.04, 0.04, 0.03, eyeColor, 0.12, eyeY, eyeZ+0.01, head); // R Pupil
        
        // Unibrow (Dark Brown)
        createBox(0.34, 0.04, 0.03, 0x4B3621, 0, eyeY + 0.05, eyeZ, head);
        
        // Hat decoration for Farmer
        if (profession.name === 'Farmer') {
            createBox(0.55, 0.05, 0.55, 0xD2B48C, 0, 0.65, 0, head); // Brim
            createBox(0.4, 0.15, 0.4, 0xD2B48C, 0, 0.7, 0, head); // Top
        }

        // Scale up
        villager.scale.set(1.5, 1.5, 1.5);
        
        // Face correct direction (Towards player)
        villager.rotation.y = Math.PI; 
        
        group.add(villager);

    } else { // Iron Golem (Replaces Cactus) - Updated for Walking Animation
        const golem = new THREE.Group(); golem.name = 'Golem';
        const ironWhite = 0xE6E6FA; // Iron block color
        const vineGreen = 0x2E7D32; // Vine color
        
        // Pivot/Hips Height
        const hipY = 0.8;

        // Pelvis/Waist
        createBox(0.6, 0.2, 0.4, ironWhite, 0, hipY + 0.1, 0, golem);
        
        // Torso (Massive chest)
        createBox(1.1, 0.7, 0.6, ironWhite, 0, hipY + 0.6, 0, golem);
        // Vines on chest
        createBox(0.2, 0.4, 0.05, vineGreen, -0.2, hipY + 0.6, 0.31, golem);
        createBox(0.1, 0.2, 0.05, vineGreen, 0.3, hipY + 0.4, 0.31, golem);

        // Head
        const head = new THREE.Group(); head.position.set(0, hipY + 1.05, 0.2);
        golem.add(head);
        createBox(0.4, 0.5, 0.4, ironWhite, 0, 0, 0, head);
        // Nose (The Villager nose)
        createBox(0.1, 0.2, 0.1, ironWhite, 0, -0.05, 0.25, head);
        // Eyes (Red)
        createBox(0.08, 0.05, 0.02, 0x880000, -0.1, 0.05, 0.21, head);
        createBox(0.08, 0.05, 0.02, 0x880000, 0.1, 0.05, 0.21, head);
        // Monobrow
        createBox(0.3, 0.03, 0.02, 0x333333, 0, 0.09, 0.21, head);

        // Arms (Long - Pivoting at Shoulders)
        const shoulderY = hipY + 0.8;
        const lArm = new THREE.Group(); lArm.name = 'L_Arm'; lArm.position.set(-0.75, shoulderY, 0);
        golem.add(lArm);
        createBox(0.35, 1.6, 0.35, ironWhite, 0, -0.6, 0, lArm); // Hangs low
        
        const rArm = new THREE.Group(); rArm.name = 'R_Arm'; rArm.position.set(0.75, shoulderY, 0);
        golem.add(rArm);
        createBox(0.35, 1.6, 0.35, ironWhite, 0, -0.6, 0, rArm);

        // Legs (Stumpy - Pivoting at Hips)
        const lLeg = new THREE.Group(); lLeg.name = 'L_Leg'; lLeg.position.set(-0.25, hipY, 0);
        golem.add(lLeg);
        createBox(0.3, 0.8, 0.3, ironWhite, 0, -0.4, 0, lLeg);

        const rLeg = new THREE.Group(); rLeg.name = 'R_Leg'; rLeg.position.set(0.25, hipY, 0);
        golem.add(rLeg);
        createBox(0.3, 0.8, 0.3, ironWhite, 0, -0.4, 0, rLeg);

        golem.scale.set(1.75, 1.75, 1.75);
        
        // Face correct direction (Towards Player, same as Villager)
        golem.rotation.y = Math.PI; 
        
        group.add(golem);
    }
    castShadows(group); return group;
};

export const createPunchObstacle = (variant: 'weak' | 'strong') => {
    const group = new THREE.Group();
    
    if (variant === 'weak') { 
        // Creeper
        const creeper = new THREE.Group(); creeper.name = 'Creeper';
        const green = COLORS.creeperGreen;
        const black = COLORS.creeperFace;

        // Legs
        const legH = 0.6; const legW = 0.4;
        const fl = new THREE.Group(); fl.name='FL'; fl.position.set(-0.4, legH, 0.4); creeper.add(fl);
        createBox(legW, legH, legW, green, 0, -legH/2, 0, fl);
        
        const fr = new THREE.Group(); fr.name='FR'; fr.position.set(0.4, legH, 0.4); creeper.add(fr);
        createBox(legW, legH, legW, green, 0, -legH/2, 0, fr);
        
        const bl = new THREE.Group(); bl.name='BL'; bl.position.set(-0.4, legH, -0.4); creeper.add(bl);
        createBox(legW, legH, legW, green, 0, -legH/2, 0, bl);
        
        const br = new THREE.Group(); br.name='BR'; br.position.set(0.4, legH, -0.4); creeper.add(br);
        createBox(legW, legH, legW, green, 0, -legH/2, 0, br);

        // Body
        const bodyH = 1.2;
        createBox(0.8, bodyH, 0.4, green, 0, legH + bodyH/2, 0, creeper);

        // Head
        const head = new THREE.Group(); head.position.set(0, legH + bodyH, 0); creeper.add(head);
        createBox(0.8, 0.8, 0.8, green, 0, 0.4, 0, head);
        
        // Face (Front is +Z)
        const faceZ = 0.41;
        // Eyes
        createBox(0.2, 0.2, 0.05, black, -0.2, 0.5, faceZ, head);
        createBox(0.2, 0.2, 0.05, black, 0.2, 0.5, faceZ, head);
        // Mouth
        createBox(0.2, 0.3, 0.05, black, 0, 0.2, faceZ, head);
        createBox(0.1, 0.15, 0.05, black, -0.15, 0.05, faceZ, head);
        createBox(0.1, 0.15, 0.05, black, 0.15, 0.05, faceZ, head);

        creeper.scale.set(1.5, 1.5, 1.5);
        creeper.rotation.y = Math.PI; // Face player
        group.add(creeper);

    } else { 
        // Enderman
        const enderman = new THREE.Group(); enderman.name = 'Enderman';
        const black = COLORS.endermanBlack;
        const purple = COLORS.endermanEye;
        
        // Legs (Long)
        const legH = 1.8;
        const lLeg = new THREE.Group(); lLeg.position.set(-0.2, legH, 0); enderman.add(lLeg);
        createBox(0.15, legH, 0.15, black, 0, -legH/2, 0, lLeg);

        const rLeg = new THREE.Group(); rLeg.position.set(0.2, legH, 0); enderman.add(rLeg);
        createBox(0.15, legH, 0.15, black, 0, -legH/2, 0, rLeg);

        // Body
        createBox(0.5, 1.0, 0.25, black, 0, legH + 0.5, 0, enderman);

        // Arms (Long)
        const armL = 2.0;
        const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.4, legH + 0.9, 0); enderman.add(lArm);
        createBox(0.12, armL, 0.12, black, 0, -armL/2 + 0.2, 0, lArm); // Angled slightly

        const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.4, legH + 0.9, 0); enderman.add(rArm);
        createBox(0.12, armL, 0.12, black, 0, -armL/2 + 0.2, 0, rArm);

        // Head
        const head = new THREE.Group(); head.position.set(0, legH + 1.0, 0); enderman.add(head);
        createBox(0.5, 0.5, 0.5, black, 0, 0.25, 0, head);
        
        // Eyes
        const eyeZ = 0.26;
        const eyeMat = new THREE.MeshStandardMaterial({ color: purple, emissive: purple, emissiveIntensity: 2.0 });
        const lEye = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.05), eyeMat); lEye.position.set(-0.2, 0.25, eyeZ); head.add(lEye);
        const rEye = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.05), eyeMat); rEye.position.set(0.2, 0.25, eyeZ); head.add(rEye);

        // Particles
        const partGroup = new THREE.Group(); partGroup.name='Particles';
        for(let i=0; i<5; i++) {
             const p = createBox(0.05, 0.05, 0.05, 0xCC00FA, (Math.random()-0.5), Math.random()*2, (Math.random()-0.5), partGroup);
             if (p.material instanceof THREE.MeshStandardMaterial) p.material.emissive = new THREE.Color(0xCC00FA);
        }
        enderman.add(partGroup);

        enderman.scale.set(1.2, 1.2, 1.2);
        enderman.rotation.y = Math.PI;
        group.add(enderman);
    }
    
    castShadows(group);
    return group;
};

export const createFlyingObstacle = () => {
    const group = new THREE.Group();
    // Phantom
    const phantom = new THREE.Group(); phantom.name = 'Phantom';
    const blue = COLORS.phantomBody;
    const bone = COLORS.phantomBone;
    const green = COLORS.phantomEye;

    // Body
    createBox(0.6, 0.2, 1.0, blue, 0, 0, 0, phantom);
    
    // Head
    const head = new THREE.Group(); head.position.set(0, 0, 0.5); phantom.add(head);
    createBox(0.5, 0.2, 0.4, blue, 0, 0, 0.2, head);
    // Eyes
    createBox(0.15, 0.05, 0.05, green, -0.15, 0, 0.41, head);
    createBox(0.15, 0.05, 0.05, green, 0.15, 0, 0.41, head);
    
    // Wings
    const lWing = new THREE.Group(); lWing.name='L_Wing'; 
    // Moved wings closer to body: (-0.3 -> -0.25)
    lWing.position.set(-0.25, 0, 0); 
    phantom.add(lWing);
    createBox(1.5, 0.05, 0.6, blue, -0.75, 0, 0, lWing);
    createBox(1.2, 0.02, 0.4, bone, -0.75, -0.02, 0.1, lWing); // Membrane detail

    const rWing = new THREE.Group(); rWing.name='R_Wing'; 
    // Moved wings closer to body: (0.3 -> 0.25)
    rWing.position.set(0.25, 0, 0); 
    phantom.add(rWing);
    createBox(1.5, 0.05, 0.6, blue, 0.75, 0, 0, rWing);
    createBox(1.2, 0.02, 0.4, bone, 0.75, -0.02, 0.1, rWing);

    // Tail
    const tail = new THREE.Group(); tail.position.set(0, 0, -0.5); phantom.add(tail);
    createBox(0.3, 0.1, 0.8, blue, 0, 0, -0.4, tail);

    phantom.position.y = 2.5; // Flying height
    phantom.rotation.y = Math.PI; 
    
    group.add(phantom);

    castShadows(group);
    return group;
};
