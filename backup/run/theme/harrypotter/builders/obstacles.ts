
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

// Jump: Mandrake Pots (Row of pots) - HIGH FIDELITY UPDATE
export const createJumpObstacle = () => {
    const group = new THREE.Group();
    const potColor = COLORS.mandrakePot;
    const plantColor = COLORS.mandrakeGreen;
    const rootColor = 0xD2B48C; // Woody Tan
    const rootDark = 0xAA8866; // Darker spots
    
    // Create 6 pots across the width
    const positions = [-5, -3, -1, 1, 3, 5];
    
    positions.forEach((x, i) => {
        const potGroup = new THREE.Group();
        potGroup.name = `Mandrake_${i}`; // For animation
        potGroup.position.set(x, 0, 0);
        
        // --- 1. DETAILED POT ---
        // Narrow Base
        createBox(0.9, 0.2, 0.9, potColor, 0, 0.1, 0, potGroup);
        // Main Body (Tapering Out)
        createBox(1.1, 0.6, 1.1, potColor, 0, 0.5, 0, potGroup);
        // Thick Rim
        createBox(1.3, 0.25, 1.3, potColor, 0, 0.925, 0, potGroup);
        // Dirt Surface
        createBox(1.0, 0.05, 1.0, 0x3E2723, 0, 0.85, 0, potGroup);
        // Paper Label on front
        createBox(0.5, 0.25, 0.02, 0xF0E68C, 0, 0.5, 0.56, potGroup);

        // --- 2. MANDRAKE ROOT ---
        const plant = new THREE.Group();
        plant.name = 'Plant';
        // Lowered from 0.9 to 0.6 to sit deeper in pot
        plant.position.set(0, 0.6, 0); 
        
        // Body (Twisted Root)
        createBox(0.5, 0.7, 0.45, rootColor, 0, 0.35, 0, plant);
        // Warts/Knots details
        createBox(0.15, 0.15, 0.1, rootDark, 0.2, 0.2, 0.2, plant);
        createBox(0.15, 0.15, 0.1, rootDark, -0.15, 0.4, -0.2, plant);
        createBox(0.1, 0.1, 0.15, rootDark, 0, 0.1, 0.2, plant);

        // Arms (Flailing Upwards)
        const armL = createBox(0.15, 0.45, 0.15, rootColor, -0.35, 0.45, 0, plant);
        armL.rotation.z = 0.6; // Angled out
        const armR = createBox(0.15, 0.45, 0.15, rootColor, 0.35, 0.45, 0, plant);
        armR.rotation.z = -0.6;

        // Head (Ugly Face)
        const headY = 0.9;
        createBox(0.65, 0.6, 0.6, rootColor, 0, headY, 0, plant);
        
        // Face Features
        const faceZ = 0.31;
        // Hollow Eyes
        createBox(0.16, 0.14, 0.05, 0x111111, -0.18, headY + 0.05, faceZ, plant);
        createBox(0.16, 0.14, 0.05, 0x111111, 0.18, headY + 0.05, faceZ, plant);
        // Screaming Mouth (Wide Oval)
        createBox(0.25, 0.35, 0.05, 0x111111, 0, headY - 0.18, faceZ, plant);
        
        // --- 3. SPROUT (New Detail) ---
        const sprout = new THREE.Group();
        sprout.position.set(0, headY + 0.3, 0); // On top of head
        
        // Main Stem
        createBox(0.12, 0.3, 0.12, plantColor, 0, 0.15, 0, sprout);
        
        // Leaf 1 (Left)
        const l1 = createBox(0.5, 0.05, 0.3, plantColor, 0.3, 0.3, 0, sprout);
        l1.rotation.z = 0.4; l1.rotation.x = 0.2;
        // Leaf 2 (Right)
        const l2 = createBox(0.5, 0.05, 0.3, plantColor, -0.3, 0.3, 0, sprout);
        l2.rotation.z = -0.4; l2.rotation.x = -0.2;
        // Leaf 3 (Back/Up)
        const l3 = createBox(0.3, 0.05, 0.5, plantColor, 0, 0.35, -0.3, sprout);
        l3.rotation.x = -0.5;
        // Leaf 4 (Front/Small)
        const l4 = createBox(0.2, 0.05, 0.3, plantColor, 0, 0.25, 0.2, sprout);
        l4.rotation.x = 0.6;

        plant.add(sprout);
        potGroup.add(plant);
        group.add(potGroup);
    });

    castShadows(group);
    return group;
};

// Crouch: Mail Delivery Owls (Post Owls) - HIGH FIDELITY UPDATE
export const createCrouchObstacle = (heightScale: number) => {
    const group = new THREE.Group();
    group.name = 'OwlSwarm';
    
    // Positions: High enough to force crouch (y > 2.0)
    // Staggered formation
    const positions = [
        [-4.0, 2.8], [-1.5, 3.2], [1.5, 2.9], [4.0, 3.3],
        [-2.8, 3.8], [0, 4.0], [2.8, 3.7]
    ];

    const createOwl = (x: number, y: number, index: number) => {
        const owlGroup = new THREE.Group();
        owlGroup.name = `Owl_${index}`;
        owlGroup.position.set(x, y, 0);

        // --- VARIANT SELECTION ---
        // 0: Snowy (White), 1: Barn/Tawny (Brown), 2: Great Grey/Black (Dark)
        const type = Math.floor(Math.random() * 3);
        
        let cBody, cChest, cFace, cBeak, cEye;
        
        if (type === 0) { // Snowy (Hedwig)
            cBody = 0xFDFDFD; cChest = 0xFFFFFF; cFace = 0xFFFFFF;
            cBeak = 0x333333; cEye = 0xFFA500; // Amber eyes
        } else if (type === 1) { // Brown (Standard Post Owl)
            cBody = 0x8B4513; cChest = 0xD2B48C; cFace = 0xDEB887;
            cBeak = 0x222222; cEye = 0xFFFF00; // Yellow eyes
        } else { // Black (Rare/Dark)
            cBody = 0x222222; cChest = 0x444444; cFace = 0x333333;
            cBeak = 0x111111; cEye = 0xFF4500; // Orange-Red eyes
        }

        // --- 1. BODY ---
        const body = new THREE.Group();
        owlGroup.add(body);
        
        // Torso (Plump oval approximation)
        createBox(0.7, 0.9, 0.6, cBody, 0, 0, 0, body);
        // Chest/Belly (Lighter patch)
        createBox(0.5, 0.7, 0.1, cChest, 0, -0.05, 0.26, body);
        
        // Specks/Texture (for Snowy and Brown)
        if (type !== 2) {
            const speckColor = type === 0 ? 0xCCCCCC : 0x5D4037;
            createBox(0.1, 0.1, 0.05, speckColor, -0.2, 0.2, 0.3, body);
            createBox(0.1, 0.1, 0.05, speckColor, 0.15, -0.2, 0.3, body);
            createBox(0.1, 0.1, 0.05, speckColor, -0.1, -0.1, 0.3, body);
        }

        // --- 2. HEAD ---
        const head = new THREE.Group();
        head.position.set(0, 0.6, 0.1);
        body.add(head);
        
        // Main Head Shape
        createBox(0.65, 0.55, 0.6, cBody, 0, 0, 0, head);
        
        // Face Disk (The flat part of owl face)
        createBox(0.6, 0.4, 0.1, cFace, 0, -0.05, 0.26, head);
        
        // Eyes (Large)
        createBox(0.18, 0.18, 0.05, cEye, -0.15, 0, 0.3, head);
        createBox(0.18, 0.18, 0.05, cEye, 0.15, 0, 0.3, head);
        // Pupils
        createBox(0.06, 0.06, 0.06, 0x000000, -0.15, 0, 0.32, head);
        createBox(0.06, 0.06, 0.06, 0x000000, 0.15, 0, 0.32, head);
        
        // Beak (Curved downwards)
        const beak = new THREE.Group();
        beak.position.set(0, -0.1, 0.3);
        head.add(beak);
        createBox(0.1, 0.1, 0.15, cBeak, 0, 0, 0, beak);
        createBox(0.08, 0.15, 0.08, cBeak, 0, -0.1, 0, beak).rotation.x = -0.5;

        // Ear Tufts (Horns) - Skip for Snowy (usually rounder) but add for others
        if (type !== 0) {
            const tuftL = createBox(0.15, 0.25, 0.1, cBody, -0.25, 0.3, 0, head);
            tuftL.rotation.z = 0.3;
            const tuftR = createBox(0.15, 0.25, 0.1, cBody, 0.25, 0.3, 0, head);
            tuftR.rotation.z = -0.3;
        }

        // --- 3. WINGS (Extended for flight) ---
        const createWing = (isLeft: boolean) => {
            const wGroup = new THREE.Group();
            const dir = isLeft ? 1 : -1; // Mirror x
            
            // Anchor at shoulder
            wGroup.position.set(isLeft ? 0.35 : -0.35, 0.2, 0); 
            
            // 3-Segment Wing for curve
            const color1 = cBody;
            const color2 = type === 0 ? 0xFFFFFF : (type === 1 ? 0x5D4037 : 0x111111); // Darker tip

            // Inner Wing
            createBox(0.6, 0.1, 0.5, color1, dir * 0.3, 0, 0, wGroup);
            
            // Mid Wing (Angled slightly)
            const mid = new THREE.Group();
            mid.position.set(dir * 0.6, 0, 0);
            mid.rotation.z = dir * -0.2; // Slight arch
            createBox(0.5, 0.08, 0.45, color1, dir * 0.25, 0, 0.05, mid);
            wGroup.add(mid);
            
            // Tip Wing (Feather fingers)
            const tip = new THREE.Group();
            tip.position.set(dir * 0.5, 0, 0);
            tip.rotation.z = dir * -0.1;
            createBox(0.5, 0.05, 0.4, color2, dir * 0.25, 0, 0.05, tip);
            // Feather details
            createBox(0.4, 0.02, 0.1, color2, dir * 0.3, 0, 0.25, tip);
            mid.add(tip);

            return wGroup;
        };

        const wL = createWing(true); wL.name = 'WingL'; body.add(wL);
        const wR = createWing(false); wR.name = 'WingR'; body.add(wR);

        // --- 4. TAIL ---
        const tail = new THREE.Group();
        tail.position.set(0, -0.3, -0.3);
        tail.rotation.x = 0.2;
        createBox(0.4, 0.05, 0.5, cBody, 0, 0, -0.25, tail);
        body.add(tail);

        // --- 5. TALONS & CARGO ---
        const feet = new THREE.Group();
        feet.position.set(0, -0.5, 0);
        body.add(feet);
        
        // Talons clutching
        createBox(0.1, 0.15, 0.1, 0x111111, -0.15, 0, 0, feet);
        createBox(0.1, 0.15, 0.1, 0x111111, 0.15, 0, 0, feet);

        // CARGO (Random: Letter or Parcel)
        const isLetter = Math.random() > 0.5;
        const cargo = new THREE.Group();
        cargo.position.set(0, -0.15, 0); 
        
        if (isLetter) {
            // Envelope
            const env = createBox(0.5, 0.05, 0.35, 0xFFFFFF, 0, 0, 0, cargo); // White Paper
            env.rotation.x = 0.2; // Angled
            // Red Wax Seal
            createBox(0.08, 0.06, 0.08, 0x880000, 0, 0.03, 0, cargo).rotation.x = 0.2;
        } else {
            // Brown Parcel
            createBox(0.4, 0.3, 0.4, 0x8B4513, 0, -0.1, 0, cargo);
            // String/Twine
            createBox(0.41, 0.31, 0.05, 0xD2B48C, 0, -0.1, 0, cargo); // Vertical loop
            createBox(0.05, 0.31, 0.41, 0xD2B48C, 0, -0.1, 0, cargo); // Horizontal loop
        }
        feet.add(cargo);

        // Final Scale & Orientation
        owlGroup.scale.set(1.3, 1.3, 1.3);
        owlGroup.rotation.y = 0; // Face player
        
        // Random tilt for flying variety
        owlGroup.rotation.z = (Math.random() - 0.5) * 0.2;

        group.add(owlGroup);
    };

    positions.forEach(([x, y], i) => {
        createOwl(x, y, i);
    });

    castShadows(group);
    return group;
};

// Big Jump: Animated Armor Phalanx (Floating Shields & Knights)
export const createBigJumpObstacle = () => {
    const group = new THREE.Group();
    group.name = 'ArmorPhalanx'; // Name for animator

    // 5 Knights across the road (Narrowed spacing by ~15%)
    // Original: [-6, -3, 0, 3, 6] -> Width 12
    // New: [-5.0, -2.5, 0, 2.5, 5.0] -> Width 10 (16.6% reduction)
    const positions = [-5.0, -2.5, 0, 2.5, 5.0];
    
    positions.forEach((x, i) => {
        const knight = new THREE.Group();
        knight.name = `Knight_${i}`;
        // Floating height (No legs)
        knight.position.set(x, 2.0, 0); 

        const metalLight = 0xE0E0E0;
        const metalDark = 0x808080;
        const joint = 0x333333;
        const accent = 0x8B0000; // Deep Red for Hogwarts/Gryffindor feel

        // --- 1. TORSO (Floating Breastplate) ---
        const torso = new THREE.Group();
        torso.name = 'Torso';
        knight.add(torso);
        
        // Chestplate (Tapered look using stacked boxes)
        createBox(1.0, 0.6, 0.5, metalLight, 0, 0.3, 0, torso); // Upper Chest
        createBox(0.8, 0.5, 0.4, metalDark, 0, -0.2, 0, torso); // Abdomen
        createBox(0.4, 0.1, 0.45, joint, 0, 0.65, 0, torso); // Neck base

        // --- 2. HEAD (Helmet) ---
        const head = new THREE.Group();
        head.position.set(0, 0.8, 0);
        torso.add(head);
        
        // Main Helmet
        createBox(0.5, 0.6, 0.55, metalLight, 0, 0.3, 0, head); 
        // Visor slit band
        createBox(0.55, 0.1, 0.6, metalDark, 0, 0.3, 0, head); 
        // Eye slit void
        createBox(0.4, 0.05, 0.05, 0x000000, 0, 0.3, 0.28, head); 
        // Crest/Plume on top
        createBox(0.1, 0.4, 0.6, accent, 0, 0.7, -0.1, head);

        // --- 3. SHOULDERS (Pauldrons) ---
        createBox(0.5, 0.4, 0.5, metalLight, -0.6, 0.4, 0, torso); // Left
        createBox(0.5, 0.4, 0.5, metalLight, 0.6, 0.4, 0, torso); // Right

        // --- 4. ARMS ---
        
        // Left Arm (Holding Shield)
        const lArm = new THREE.Group();
        lArm.position.set(-0.7, 0.2, 0);
        torso.add(lArm);
        createBox(0.3, 0.6, 0.3, metalDark, 0, -0.3, 0, lArm); // Upper Arm
        createBox(0.25, 0.6, 0.25, metalLight, 0.2, -0.8, 0.2, lArm); // Forearm (angled in)
        
        // SHIELD (Medieval Heater Shield with Flashy Pattern)
        const shield = new THREE.Group();
        shield.position.set(0.3, -1.0, 0.6); 
        shield.rotation.y = 0.2; // Angle towards front
        shield.rotation.z = -0.1; // Heavy weight tilt
        lArm.add(shield);

        const sRed = 0x8B0000;
        const sBlue = 0x000080;
        const sGold = 0xFFD700;
        const sSilver = 0xE0E0E0;
        
        // 1. Main Board (Quartered Pattern)
        // Top Left (Red)
        createBox(0.8, 1.0, 0.1, sRed, -0.4, 0.6, 0, shield);
        // Top Right (Blue)
        createBox(0.8, 1.0, 0.1, sBlue, 0.4, 0.6, 0, shield);
        // Bottom Left (Blue)
        createBox(0.7, 1.2, 0.1, sBlue, -0.35, -0.5, 0, shield);
        // Bottom Right (Red)
        createBox(0.7, 1.2, 0.1, sRed, 0.35, -0.5, 0, shield);
        // Bottom Tip (Gold)
        createBox(0.6, 0.4, 0.12, sGold, 0, -1.3, 0, shield);

        // 2. Thick Gold Rim with "Rivets"
        createBox(1.8, 0.2, 0.15, sGold, 0, 1.2, 0.02, shield); // Top
        createBox(0.2, 2.2, 0.15, sGold, -0.9, 0.2, 0.02, shield); // Left
        createBox(0.2, 2.2, 0.15, sGold, 0.9, 0.2, 0.02, shield); // Right
        
        // 3. Central Cross Divider
        createBox(0.2, 2.4, 0.12, sGold, 0, 0.2, 0.02, shield); // Vertical
        createBox(1.8, 0.2, 0.12, sGold, 0, 0.4, 0.02, shield); // Horizontal

        // 4. Heraldry Emblem (Sunburst/Diamond)
        const emblem = new THREE.Group();
        emblem.position.set(0, 0.4, 0.1);
        shield.add(emblem);
        
        // Diamond Base
        const d1 = createBox(0.8, 0.8, 0.1, sSilver, 0, 0, 0, emblem);
        d1.rotation.z = 0.785; // 45 deg
        const d2 = createBox(0.6, 0.6, 0.12, sGold, 0, 0, 0.05, emblem);
        d2.rotation.z = 0.785;

        // Center Gem
        const gem = createBox(0.3, 0.4, 0.15, 0x00FF00, 0, 0, 0.1, emblem);
        if (gem.material instanceof THREE.MeshStandardMaterial) {
            gem.material.emissive = new THREE.Color(0x00FF00);
            gem.material.emissiveIntensity = 0.5;
        }

        // Right Arm (Holding Weapon)
        const rArm = new THREE.Group();
        rArm.position.set(0.7, 0.2, 0);
        torso.add(rArm);
        createBox(0.3, 0.6, 0.3, metalDark, 0, -0.3, 0, rArm);
        createBox(0.25, 0.6, 0.25, metalLight, 0, -0.8, 0.2, rArm); // Forearm
        
        // SPEAR / LANCE
        const lance = new THREE.Group();
        lance.position.set(0, -1.1, 0.2);
        lance.rotation.x = -0.3; // Pointing slightly up/forward
        rArm.add(lance);
        createBox(0.1, 4.0, 0.1, 0x5D4037, 0, 1.0, 0, lance); // Shaft
        createBox(0.3, 0.8, 0.1, metalLight, 0, 3.2, 0, lance); // Tip blade base
        createBox(0.1, 1.0, 0.1, metalLight, 0, 3.6, 0, lance); // Sharp Tip

        group.add(knight);
    });

    castShadows(group);
    return group;
};

export const createPassThroughWall = (width: number, height: number, texture: THREE.Texture, videoTexture?: THREE.Texture) => {
    const group = new THREE.Group();
    // Use a magical frame or mist effect
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, opacity: 1.0 });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.y = height / 2;
    group.add(wall);
    
    if (videoTexture) {
        const overlayMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, opacity: 0.5 });
        const overlay = new THREE.Mesh(geometry, overlayMaterial);
        overlay.position.y = height / 2; overlay.position.z = 0.05;
        group.add(overlay);
    }
    return group;
};
