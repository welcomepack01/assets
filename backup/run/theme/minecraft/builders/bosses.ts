
import * as THREE from 'three';
import { createBox, castShadows, createPixelFace } from '../utils';
import { COLORS } from '../constants';

export const createBossMesh = (type: string) => {
    const group = new THREE.Group();
    
    if (type === 'boss1') { // SLOT 1: Now using WARDEN Design (Previously Boss 2)
        const warden = new THREE.Group(); warden.name='Warden';
        const bodyColor = COLORS.wardenBody;
        // Updated to use the new GREEN constant from COLORS
        const teal = COLORS.wardenTeal; 
        const ribs = COLORS.wardenRibs;
        
        // Body (Massive Torso)
        createBox(1.8, 1.5, 1.0, bodyColor, 0, 1.5, 0, warden);
        // Chest Cavity (Ribs)
        createBox(1.2, 1.0, 0.2, ribs, 0, 1.6, 0.45, warden);
        // Soul Heart (Emissive)
        const heartGeo = new THREE.BoxGeometry(0.6, 0.6, 0.1);
        const heartMat = new THREE.MeshStandardMaterial({ 
            color: teal, emissive: teal, emissiveIntensity: 1.0 
        });
        const heart = new THREE.Mesh(heartGeo, heartMat);
        heart.name = 'Heart';
        heart.position.set(0, 1.6, 0.55);
        warden.add(heart);
        
        // Head
        const head = new THREE.Group(); head.name = 'Head'; head.position.set(0, 2.25, 0); warden.add(head);
        
        // Main Skull Block
        createBox(1.2, 1.1, 1.0, bodyColor, 0, 0.55, 0, head); 
        
        // Top Teal part (Scalp/Horns base)
        createBox(1.3, 0.4, 1.1, teal, 0, 1.0, 0, head); 
        // Large Ears/Horns
        createBox(0.35, 0.9, 0.8, teal, -0.7, 0.8, 0, head); 
        createBox(0.35, 0.9, 0.8, teal, 0.7, 0.8, 0, head); 

        // --- FACE DETAILS ---
        const faceZ = 0.51;
        
        // Red Glowing Eyes
        const eyeColor = 0xFF0000;
        const lEye = createBox(0.25, 0.15, 0.05, eyeColor, -0.35, 0.7, faceZ, head);
        (lEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeColor);
        (lEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
        
        const rEye = createBox(0.25, 0.15, 0.05, eyeColor, 0.35, 0.7, faceZ, head);
        (rEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeColor);
        (rEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;

        // Big Open Mouth (Black Void)
        createBox(0.8, 0.5, 0.1, 0x000000, 0, 0.3, faceZ, head);
        
        // Teeth (Jagged)
        const toothColor = 0xDDDDDD;
        // Top Teeth
        createBox(0.1, 0.12, 0.05, toothColor, -0.3, 0.5, faceZ+0.02, head);
        createBox(0.1, 0.12, 0.05, toothColor, -0.1, 0.5, faceZ+0.02, head);
        createBox(0.1, 0.12, 0.05, toothColor, 0.1, 0.5, faceZ+0.02, head);
        createBox(0.1, 0.12, 0.05, toothColor, 0.3, 0.5, faceZ+0.02, head);
        // Bottom Teeth
        createBox(0.1, 0.12, 0.05, toothColor, -0.3, 0.1, faceZ+0.02, head);
        createBox(0.1, 0.12, 0.05, toothColor, -0.1, 0.1, faceZ+0.02, head);
        createBox(0.1, 0.12, 0.05, toothColor, 0.1, 0.1, faceZ+0.02, head);
        createBox(0.1, 0.12, 0.05, toothColor, 0.3, 0.1, faceZ+0.02, head);
        
        // Arms (Long and heavy)
        const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-1.1, 2.0, 0); warden.add(lArm);
        createBox(0.5, 2.0, 0.5, bodyColor, 0, -0.8, 0, lArm);
        createBox(0.55, 0.5, 0.55, teal, 0, -1.8, 0, lArm); // Hand
        
        const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(1.1, 2.0, 0); warden.add(rArm);
        createBox(0.5, 2.0, 0.5, bodyColor, 0, -0.8, 0, rArm);
        createBox(0.55, 0.5, 0.55, teal, 0, -1.8, 0, rArm); // Hand
        
        // Legs (Stubby)
        const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.5, 0.75, 0); warden.add(lLeg);
        createBox(0.5, 0.75, 0.5, bodyColor, 0, -0.375, 0, lLeg);
        createBox(0.55, 0.2, 0.55, teal, 0, -0.7, 0, lLeg); // Feet
        
        const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.5, 0.75, 0); warden.add(rLeg);
        createBox(0.5, 0.75, 0.5, bodyColor, 0, -0.375, 0, rLeg);
        createBox(0.55, 0.2, 0.55, teal, 0, -0.7, 0, rLeg); // Feet

        group.add(warden);
        
    } else if (type === 'boss2') { // SLOT 2: Now using NECROMANCER Design (Previously Boss 1)
        const necromancer = new THREE.Group(); necromancer.name='Necromancer';
        const robeColor = 0xDDDDDD; // Light Grey/White
        const hoodColor = 0xCCCCCC;
        const darkFace = 0x111111;
        const redEye = 0xFF0000;
        
        // Main Robe Body
        createBox(0.9, 1.6, 0.5, robeColor, 0, 0.8, 0, necromancer);
        createBox(0.2, 1.6, 0.52, 0xBBBBBB, 0, 0.8, 0, necromancer);

        // Head (Hooded)
        const headGroup = new THREE.Group(); 
        headGroup.position.set(0, 1.6, 0); 
        necromancer.add(headGroup);
        createBox(0.8, 0.8, 0.7, hoodColor, 0, 0.4, 0, headGroup);
        createBox(0.6, 0.6, 0.1, darkFace, 0, 0.4, 0.31, headGroup);
        
        // Glowing Red Eyes
        const eyeGeo = new THREE.BoxGeometry(0.15, 0.08, 0.05);
        const eyeMat = new THREE.MeshStandardMaterial({ color: redEye, emissive: redEye, emissiveIntensity: 2.0 });
        const lEye = new THREE.Mesh(eyeGeo, eyeMat); lEye.position.set(-0.15, 0.4, 0.36); headGroup.add(lEye);
        const rEye = new THREE.Mesh(eyeGeo, eyeMat); rEye.position.set(0.15, 0.4, 0.36); headGroup.add(rEye);

        // Arms
        const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.65, 1.3, 0); necromancer.add(lArm);
        createBox(0.4, 0.8, 0.4, robeColor, 0, -0.3, 0, lArm); 
        createBox(0.2, 0.2, 0.2, 0x888888, 0, -0.8, 0, lArm); 

        const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.65, 1.3, 0); necromancer.add(rArm);
        createBox(0.4, 0.8, 0.4, robeColor, 0, -0.3, 0, rArm); 
        createBox(0.2, 0.2, 0.2, 0x888888, 0, -0.8, 0, rArm); 

        // Staff
        const staff = new THREE.Group();
        staff.position.set(0, -0.6, 0.2); 
        staff.rotation.x = 0.2;
        rArm.add(staff);
        createBox(0.08, 2.2, 0.08, COLORS.wood, 0, 0.5, 0, staff);
        createBox(0.12, 0.3, 0.12, 0x6A0DAD, 0, -0.6, 0, staff);
        createBox(0.3, 0.1, 0.3, 0x666666, 0, 1.5, 0, staff);
        createBox(0.1, 0.3, 0.1, 0x666666, -0.15, 1.6, 0, staff);
        createBox(0.1, 0.3, 0.1, 0x666666, 0.15, 1.6, 0, staff);
        
        // Crystal
        const crystalGeo = new THREE.DodecahedronGeometry(0.25);
        const crystalMat = new THREE.MeshStandardMaterial({ 
            color: 0x00FFFF, emissive: 0x00FFFF, emissiveIntensity: 1.0, transparent: true, opacity: 0.9
        });
        const crystal = new THREE.Mesh(crystalGeo, crystalMat);
        crystal.position.set(0, 1.7, 0);
        staff.add(crystal);
        const light = new THREE.PointLight(0x00FFFF, 1, 3);
        light.position.set(0, 1.7, 0);
        staff.add(light);

        // --- MAGIC AURA (CHANGED TO BLUE) ---
        const auraGroup = new THREE.Group();
        auraGroup.name = 'MagicAura';
        const auraColor = 0x0088FF; // Blue
        const particleGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const particleMat = new THREE.MeshBasicMaterial({ color: auraColor, transparent: true, opacity: 0.6 });
        for (let i = 0; i < 8; i++) {
            const p = new THREE.Mesh(particleGeo, particleMat);
            const angle = (i / 8) * Math.PI * 2;
            const radius = 1.2;
            p.position.set(Math.cos(angle) * radius, 1.0 + Math.random(), Math.sin(angle) * radius);
            auraGroup.add(p);
        }
        const auraLight = new THREE.PointLight(auraColor, 2, 5);
        auraLight.position.set(0, 1.0, 0);
        auraGroup.add(auraLight);
        necromancer.add(auraGroup);

        group.add(necromancer);
        
    } else if (type === 'boss3') { // WITHER
        const wither = new THREE.Group(); wither.name='Wither';
        const black = COLORS.witherBlack;
        const white = 0xFFFFFF;

        // Shoulder Bar (Top T-shape)
        createBox(2.2, 0.4, 0.5, black, 0, 2.0, 0, wither);
        // Spine
        createBox(0.5, 2.0, 0.5, black, 0, 1.0, 0, wither);
        // Ribs
        createBox(1.2, 0.15, 0.55, black, 0, 1.6, 0, wither);
        createBox(1.0, 0.15, 0.55, black, 0, 1.3, 0, wither);
        createBox(0.8, 0.15, 0.55, black, 0, 1.0, 0, wither);
        // Tail
        const tail = new THREE.Group(); tail.position.set(0, 0, 0); wither.add(tail);
        createBox(0.3, 0.5, 0.3, black, 0, 0.25, 0, tail); 

        // Helper to create Wither Face
        const createWitherFace = (parent: THREE.Object3D, width: number) => {
            const zFace = width / 2 + 0.01;
            const eyeW = width * 0.28; const eyeH = width * 0.12; const eyeY = 0; const eyeX = width * 0.25;
            createBox(eyeW, eyeH, 0.02, white, -eyeX, eyeY, zFace, parent); // Left Eye
            createBox(eyeW, eyeH, 0.02, white, eyeX, eyeY, zFace, parent); // Right Eye
            const mouthW = width * 0.8; const mouthH = width * 0.12; const mouthY = -width * 0.25;
            createBox(mouthW, mouthH, 0.02, white, 0, mouthY, zFace, parent); // Mouth
        };

        // Heads
        const mainHead = new THREE.Group(); mainHead.name='MainHead'; 
        mainHead.position.set(0, 2.6, 0.1); wither.add(mainHead);
        createBox(0.85, 0.85, 0.85, black, 0, 0, 0, mainHead); createWitherFace(mainHead, 0.85);

        const lHead = new THREE.Group(); lHead.name='LHead'; 
        lHead.position.set(-1.0, 2.4, 0.1); wither.add(lHead);
        createBox(0.65, 0.65, 0.65, black, 0, 0, 0, lHead); createWitherFace(lHead, 0.65);

        const rHead = new THREE.Group(); rHead.name='RHead'; 
        rHead.position.set(1.0, 2.4, 0.1); wither.add(rHead);
        createBox(0.65, 0.65, 0.65, black, 0, 0, 0, rHead); createWitherFace(rHead, 0.65);

        // --- STRONG PURPLE MAGIC (Wither Storm) ---
        const stormGroup = new THREE.Group();
        stormGroup.name = 'WitherStorm';
        const pGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
        for (let i = 0; i < 40; i++) {
            const isDark = Math.random() > 0.5;
            const pColor = isDark ? 0x110011 : 0x800080; 
            const pMat = new THREE.MeshBasicMaterial({ color: pColor, transparent: true, opacity: isDark ? 0.8 : 0.6 });
            const p = new THREE.Mesh(pGeo, pMat);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 1.5 + Math.random() * 1.5; 
            p.position.set(r * Math.sin(phi) * Math.cos(theta), 1.5 + r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
            p.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
            stormGroup.add(p);
        }
        const stormLight = new THREE.PointLight(0x9900FF, 3, 10);
        stormLight.position.set(0, 2.0, 0);
        stormGroup.add(stormLight);
        wither.add(stormGroup);

        wither.scale.set(1.2, 1.2, 1.2);
        group.add(wither);
        
    } else if (type === 'boss4') { // ENDER DRAGON
        const dragon = new THREE.Group(); dragon.name='EnderDragon';
        const black = 0x151515; // Darker black
        const darkGrey = 0x222222;
        // CHANGED: Dark Blue-Grey for better visibility
        const wingMembrane = 0x303841; 
        
        // Body (Heavier)
        createBox(1.8, 1.2, 3.0, black, 0, 0, 0, dragon);
        // Chest bump
        createBox(1.4, 0.8, 1.5, darkGrey, 0, -0.5, 0.5, dragon);
        
        // Neck (Segmented for animation potential)
        const neck = new THREE.Group(); neck.name='Neck'; neck.position.set(0, 0.5, 1.5); dragon.add(neck);
        createBox(0.7, 0.7, 2.0, black, 0, 0.5, 0.8, neck);
        // Spines on neck
        createBox(0.1, 0.3, 1.8, 0x444444, 0, 1.0, 0.8, neck);

        // Head
        const head = new THREE.Group(); head.name='Head'; head.position.set(0, 0.8, 2.0); neck.add(head);
        createBox(1.0, 0.8, 1.4, black, 0, 0, 0, head);
        // Snout
        const snout = new THREE.Group(); snout.name='Snout'; snout.position.set(0, -0.1, 0.8); head.add(snout);
        createBox(0.8, 0.5, 0.8, black, 0, 0, 0, snout);
        // Jaw
        const jaw = new THREE.Group(); jaw.name='Jaw'; jaw.position.set(0, -0.4, 0.4); snout.add(jaw);
        createBox(0.7, 0.2, 0.7, darkGrey, 0, 0, 0, jaw);
        
        // Eyes (Purple Glowing)
        const eyeColor = 0xD400FF;
        const lEye = createBox(0.2, 0.15, 0.05, eyeColor, -0.51, 0.1, 0.2, head); 
        (lEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeColor);
        const rEye = createBox(0.2, 0.15, 0.05, eyeColor, 0.51, 0.1, 0.2, head);
        (rEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeColor);
        
        // Horns
        createBox(0.15, 0.6, 0.15, 0x555555, -0.3, 0.5, -0.5, head).rotation.x = -0.5;
        createBox(0.15, 0.6, 0.15, 0x555555, 0.3, 0.5, -0.5, head).rotation.x = -0.5;

        // Wings (Detailed and Angled) - SCALED UP 50% (x1.5)
        const scaleFactor = 1.5;
        
        const lWing = new THREE.Group(); lWing.name='L_Wing'; lWing.position.set(-0.8, 0.5, 0); dragon.add(lWing);
        // Main Bone (Width 4.0 -> 6.0)
        createBox(4.0 * scaleFactor, 0.2 * scaleFactor, 0.8 * scaleFactor, black, -2.0 * scaleFactor, 0, 0.2, lWing);
        // Wing Fingers/Ribs
        createBox(0.1 * scaleFactor, 0.1 * scaleFactor, 3.0 * scaleFactor, black, -1.0 * scaleFactor, 0, -1.5 * scaleFactor, lWing);
        createBox(0.1 * scaleFactor, 0.1 * scaleFactor, 2.5 * scaleFactor, black, -2.5 * scaleFactor, 0, -1.2 * scaleFactor, lWing);
        createBox(0.1 * scaleFactor, 0.1 * scaleFactor, 2.0 * scaleFactor, black, -3.8 * scaleFactor, 0, -1.0 * scaleFactor, lWing);
        // Membrane
        createBox(3.8 * scaleFactor, 0.05, 2.5 * scaleFactor, wingMembrane, -2.0 * scaleFactor, 0, -1.0 * scaleFactor, lWing);

        const rWing = new THREE.Group(); rWing.name='R_Wing'; rWing.position.set(0.8, 0.5, 0); dragon.add(rWing);
        // Main Bone
        createBox(4.0 * scaleFactor, 0.2 * scaleFactor, 0.8 * scaleFactor, black, 2.0 * scaleFactor, 0, 0.2, rWing);
        // Wing Fingers/Ribs
        createBox(0.1 * scaleFactor, 0.1 * scaleFactor, 3.0 * scaleFactor, black, 1.0 * scaleFactor, 0, -1.5 * scaleFactor, rWing);
        createBox(0.1 * scaleFactor, 0.1 * scaleFactor, 2.5 * scaleFactor, black, 2.5 * scaleFactor, 0, -1.2 * scaleFactor, rWing);
        createBox(0.1 * scaleFactor, 0.1 * scaleFactor, 2.0 * scaleFactor, black, 3.8 * scaleFactor, 0, -1.0 * scaleFactor, rWing);
        // Membrane
        createBox(3.8 * scaleFactor, 0.05, 2.5 * scaleFactor, wingMembrane, 2.0 * scaleFactor, 0, -1.0 * scaleFactor, rWing);
        
        // Tail
        const tail = new THREE.Group(); tail.name='Tail'; tail.position.set(0, 0.2, -1.5); dragon.add(tail);
        createBox(0.6, 0.6, 2.5, black, 0, 0, -1.2, tail);
        // Spines
        createBox(0.1, 0.25, 2.0, 0x444444, 0, 0.4, -1.2, tail);
        
        // Legs (Thick)
        const legW = 0.5; const legH = 1.2;
        const fl = new THREE.Group(); fl.name='FL'; fl.position.set(-0.8, -0.2, 1.0); dragon.add(fl);
        createBox(legW, legH, legW, black, 0, -0.6, 0, fl);
        const fr = new THREE.Group(); fr.name='FR'; fr.position.set(0.8, -0.2, 1.0); dragon.add(fr);
        createBox(legW, legH, legW, black, 0, -0.6, 0, fr);
        const bl = new THREE.Group(); bl.name='BL'; bl.position.set(-0.8, -0.2, -1.0); dragon.add(bl);
        createBox(legW, legH, legW, black, 0, -0.6, 0, bl);
        const br = new THREE.Group(); br.name='BR'; br.position.set(0.8, -0.2, -1.0); dragon.add(br);
        createBox(legW, legH, legW, black, 0, -0.6, 0, br);

        group.add(dragon);
    }
    
    castShadows(group); return group;
};
