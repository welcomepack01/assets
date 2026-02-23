


import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

export const createDodgeObstacle = (variant: 'A' | 'B' | 'C', models?: Record<string, THREE.Group>): THREE.Group => {
    if (variant === 'A') {
        const group = new THREE.Group();
        const cap = new THREE.Group(); cap.position.y = 1.6; group.add(cap);
        createBox(1.2, 0.8, 1.2, COLORS.toadCapWhite, 0, 0, 0, cap);
        createBox(0.6, 0.05, 0.6, COLORS.toadCapRed, 0, 0.4, 0, cap);
        createBox(0.05, 0.4, 0.4, COLORS.toadCapRed, -0.6, 0, 0, cap);
        createBox(0.05, 0.4, 0.4, COLORS.toadCapRed, 0.6, 0, 0, cap);
        createBox(0.4, 0.4, 0.05, COLORS.toadCapRed, 0, 0, 0.6, cap);
        createBox(0.4, 0.4, 0.05, COLORS.toadCapRed, 0, 0, -0.6, cap);
        const head = new THREE.Group(); head.position.y = 1.0; group.add(head);
        createBox(0.8, 0.6, 0.7, COLORS.toadSkin, 0, 0, 0, head);
        createBox(0.1, 0.2, 0.05, COLORS.black, -0.2, 0.1, 0.35, head);
        createBox(0.1, 0.2, 0.05, COLORS.black, 0.2, 0.1, 0.35, head);
        const body = new THREE.Group(); body.position.y = 0.5; group.add(body);
        createBox(0.6, 0.5, 0.4, COLORS.toadVest, 0, 0, 0, body); 
        createBox(0.3, 0.5, 0.41, COLORS.toadSkin, 0, 0, 0, body); 
        createBox(0.62, 0.05, 0.42, COLORS.toadGold, 0, -0.2, 0, body);
        const lArm = new THREE.Group(); lArm.name = 'L_Arm'; lArm.position.set(-0.4, 0.8, 0); group.add(lArm);
        createBox(0.2, 0.4, 0.2, COLORS.toadSkin, 0, -0.2, 0, lArm);
        const rArm = new THREE.Group(); rArm.name = 'R_Arm'; rArm.position.set(0.4, 0.8, 0); group.add(rArm);
        createBox(0.2, 0.4, 0.2, COLORS.toadSkin, 0, -0.2, 0, rArm); 
        createBox(0.6, 0.2, 0.4, COLORS.toadCapWhite, 0, 0.45, 0, group);
        const lLeg = new THREE.Group(); lLeg.name = 'L_Leg'; lLeg.position.set(-0.2, 0.35, 0); group.add(lLeg);
        createBox(0.25, 0.15, 0.4, COLORS.toadShoe, 0, -0.15, 0.05, lLeg);
        const rLeg = new THREE.Group(); rLeg.name = 'R_Leg'; rLeg.position.set(0.2, 0.35, 0); group.add(rLeg);
        createBox(0.25, 0.15, 0.4, COLORS.toadShoe, 0, -0.15, 0.05, rLeg);
        group.scale.set(1.5, 1.5, 1.5);
        castShadows(group);
        return group;
    } else {
        const group = new THREE.Group();
        const head = new THREE.Group(); head.position.y = 1.35; group.add(head);
        createBox(0.6, 0.5, 0.6, COLORS.toadSkin, 0, 0, 0, head);
        // Removed white eye parts here
        createBox(0.08, 0.15, 0.06, COLORS.black, -0.15, 0.05, 0.32, head);
        createBox(0.08, 0.15, 0.06, COLORS.black, 0.15, 0.05, 0.32, head);
        createBox(0.62, 0.2, 0.62, COLORS.luigiGreen, 0, 0.35, 0, head);
        createBox(0.62, 0.1, 0.3, COLORS.luigiGreen, 0, 0.25, 0.25, head);
        createBox(0.4, 0.1, 0.1, COLORS.luigiBeard, 0, -0.1, 0.3, head);
        createBox(0.15, 0.15, 0.15, COLORS.toadSkin, 0, 0, 0.35, head);
        createBox(0.62, 0.3, 0.2, COLORS.brown, 0, 0, -0.25, head);
        const body = new THREE.Group(); body.position.y = 0.8; group.add(body);
        createBox(0.5, 0.4, 0.35, COLORS.luigiBlue, 0, -0.1, 0, body);
        createBox(0.45, 0.3, 0.3, COLORS.luigiGreen, 0, 0.2, 0, body);
        createBox(0.1, 0.1, 0.05, COLORS.gold, -0.15, 0.05, 0.18, body);
        createBox(0.1, 0.1, 0.05, COLORS.gold, 0.15, 0.05, 0.18, body);
        const lArm = new THREE.Group(); lArm.name = 'L_Arm'; lArm.position.set(-0.35, 1.0, 0); group.add(lArm);
        createBox(0.15, 0.4, 0.15, COLORS.luigiGreen, 0, -0.15, 0, lArm);
        createBox(0.15, 0.15, 0.15, COLORS.white, 0, -0.4, 0, lArm);
        const rArm = new THREE.Group(); rArm.name = 'R_Arm'; rArm.position.set(0.35, 1.0, 0); group.add(rArm);
        createBox(0.15, 0.4, 0.15, COLORS.luigiGreen, 0, -0.15, 0, rArm);
        createBox(0.15, 0.15, 0.15, COLORS.white, 0, -0.4, 0, rArm);
        const lLeg = new THREE.Group(); lLeg.name = 'L_Leg'; lLeg.position.set(-0.15, 0.5, 0); group.add(lLeg);
        createBox(0.2, 0.4, 0.2, COLORS.luigiBlue, 0, -0.2, 0, lLeg);
        createBox(0.22, 0.15, 0.25, COLORS.brown, 0, -0.45, 0.05, lLeg);
        const rLeg = new THREE.Group(); rLeg.name = 'R_Leg'; rLeg.position.set(0.15, 0.5, 0); group.add(rLeg);
        createBox(0.2, 0.4, 0.2, COLORS.luigiBlue, 0, -0.2, 0, rLeg);
        createBox(0.22, 0.15, 0.25, COLORS.brown, 0, -0.45, 0.05, rLeg);
        group.scale.set(1.875, 1.875, 1.875);
        castShadows(group);
        return group;
    }
};

export const createPunchObstacle = (variant: 'weak' | 'strong', models?: Record<string, THREE.Group>): THREE.Group => {
    const group = new THREE.Group();
    if (variant === 'weak') {
        // --- VILLAIN FLOWER (Piranha Plant Voxel) ---
        // Used for BLUE MONSTER logic (Biting Animation)
        const scale = 1.5; 
        group.scale.set(scale, scale, scale);
        
        const C = {
            red: 0xDC3200, // Piranha Red
            green: 0x43B047,
            white: 0xF0F0F0,
            black: 0x111111
        };

        // Main Stem
        const stem = new THREE.Group();
        stem.position.y = 0.5;
        group.add(stem);
        createBox(0.4, 1.2, 0.4, C.green, 0, 0, 0, stem);

        // Leaves (Animated as Fore legs)
        const lLeaf = new THREE.Group(); 
        lLeaf.name = 'L_Fore'; // Hijack animation
        lLeaf.position.set(-0.2, -0.2, 0); 
        stem.add(lLeaf);
        createBox(0.8, 0.1, 0.4, C.green, -0.4, 0, 0, lLeaf); // Leaf blade sticking out

        const rLeaf = new THREE.Group(); 
        rLeaf.name = 'R_Fore'; // Hijack animation
        rLeaf.position.set(0.2, -0.2, 0); 
        stem.add(rLeaf);
        createBox(0.8, 0.1, 0.4, C.green, 0.4, 0, 0, rLeaf);

        // Roots (Animated as Hind legs - barely visible or feet)
        const lRoot = new THREE.Group();
        lRoot.name = 'L_Hind';
        lRoot.position.set(-0.2, -0.6, 0);
        stem.add(lRoot);
        createBox(0.3, 0.3, 0.3, C.green, 0, -0.15, 0, lRoot); // Small foot

        const rRoot = new THREE.Group();
        rRoot.name = 'R_Hind';
        rRoot.position.set(0.2, -0.6, 0);
        stem.add(rRoot);
        createBox(0.3, 0.3, 0.3, C.green, 0, -0.15, 0, rRoot); // Small foot

        // Head Group
        const head = new THREE.Group();
        head.position.y = 0.8; // Top of stem
        stem.add(head);

        // --- ANIMATED JAWS ---
        // Pivot for jaws is approx back of head (z = -0.3)
        
        // UPPER JAW
        const jawTop = new THREE.Group();
        jawTop.name = 'JawTop';
        jawTop.position.set(0, 0, -0.3); // Pivot Point
        head.add(jawTop);
        
        // Top Head Shape (Relative to Pivot)
        // Original head was 1.2w x 1.0h x 1.2d. Half is 0.5h.
        createBox(1.2, 0.5, 1.2, C.red, 0, 0.25, 0.3, jawTop); 
        
        // Top Spots
        createBox(0.3, 0.1, 0.3, C.white, 0, 0.51, 0.3, jawTop); 
        createBox(0.1, 0.3, 0.3, C.white, -0.61, 0.25, 0.3, jawTop); 
        createBox(0.1, 0.3, 0.3, C.white, 0.61, 0.25, 0.3, jawTop); 
        createBox(0.3, 0.3, 0.1, C.white, 0, 0.25, -0.31, jawTop); 

        // Top Lip & Teeth
        createBox(1.0, 0.2, 0.2, C.white, 0, 0.1, 0.9, jawTop); 
        createBox(0.1, 0.15, 0.1, C.white, -0.2, -0.05, 0.95, jawTop);
        createBox(0.1, 0.15, 0.1, C.white, 0.2, -0.05, 0.95, jawTop);
        createBox(0.1, 0.15, 0.1, C.white, 0, -0.1, 0.95, jawTop);

        // LOWER JAW
        const jawBottom = new THREE.Group();
        jawBottom.name = 'JawBottom';
        jawBottom.position.set(0, 0, -0.3); // Pivot Point
        head.add(jawBottom);

        // Bottom Head Shape
        createBox(1.2, 0.5, 1.2, C.red, 0, -0.25, 0.3, jawBottom);
        
        // Bottom Lip & Teeth
        createBox(1.0, 0.2, 0.2, C.white, 0, -0.1, 0.9, jawBottom);
        // Black inner mouth on bottom
        createBox(0.8, 0.1, 0.1, C.black, 0, -0.05, 0.85, jawBottom); 

    } else {
        // --- KOOPA TROOPA ---
        // Used for RED MONSTER logic (Walking Animation)
        const scale = 1.3; group.scale.set(scale, scale, scale);
        const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.35, 0.25, 0); group.add(lLeg);
        createBox(0.35, 0.3, 0.5, COLORS.koopaGreen, 0, 0, 0.1, lLeg);
        createBox(0.25, 0.4, 0.25, COLORS.koopaYellow, 0, 0.35, 0, lLeg);
        const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.35, 0.25, 0); group.add(rLeg);
        createBox(0.35, 0.3, 0.5, COLORS.koopaGreen, 0, 0, 0.1, rLeg);
        createBox(0.25, 0.4, 0.25, COLORS.koopaYellow, 0, 0.35, 0, rLeg);
        const body = new THREE.Group(); body.position.y = 0.9; group.add(body);
        createBox(0.7, 0.9, 0.6, COLORS.koopaYellow, 0, 0, 0, body);
        
        // --- ADDED WHITE BELLY PATCH ---
        createBox(0.4, 0.5, 0.05, COLORS.white, 0, -0.1, 0.31, body);

        const shell = new THREE.Group(); shell.position.set(0, 0, -0.35); body.add(shell);
        createBox(0.9, 1.0, 0.5, COLORS.koopaGreen, 0, 0, 0, shell);
        createBox(1.0, 1.1, 0.1, COLORS.white, 0, 0, 0.25, shell);
        const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.45, 0.2, 0); body.add(lArm);
        createBox(0.25, 0.5, 0.25, COLORS.koopaYellow, 0, -0.1, 0.1, lArm);
        const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.45, 0.2, 0); body.add(rArm);
        createBox(0.25, 0.5, 0.25, COLORS.koopaYellow, 0, -0.1, 0.1, rArm);
        const head = new THREE.Group(); head.position.set(0, 0.7, 0.1); body.add(head);
        createBox(0.8, 0.7, 0.8, COLORS.koopaYellow, 0, 0, 0, head);
        createBox(0.9, 0.5, 0.5, COLORS.koopaYellow, 0, -0.1, 0.5, head);
        createBox(0.05, 0.1, 0.05, COLORS.black, -0.15, 0, 0.76, head);
        createBox(0.05, 0.1, 0.05, COLORS.black, 0.15, 0, 0.76, head);
        createBox(0.25, 0.4, 0.1, COLORS.white, -0.2, 0.2, 0.4, head);
        createBox(0.25, 0.4, 0.1, COLORS.white, 0.2, 0.2, 0.4, head);
        createBox(0.1, 0.2, 0.05, COLORS.black, -0.15, 0.2, 0.46, head);
        createBox(0.1, 0.2, 0.05, COLORS.black, 0.15, 0.2, 0.46, head);
    }
    castShadows(group);
    return group;
};

export const createFlyingObstacle = (models?: Record<string, THREE.Group>): THREE.Group => {
    // --- RED KOOPA PARATROOPA (Flying Turtle) ---
    // Create a ROOT group to hold the obstacle
    // This is critical so we can set position on ROOT and animate bobbing on INNER
    const root = new THREE.Group();

    // Create INNER group for bobbing animation
    const inner = new THREE.Group();
    inner.name = 'floatingSmooth'; // Engine looks for this name to apply bobbing
    root.add(inner);

    const scale = 1.3;
    inner.scale.set(scale, scale, scale);

    // Legs
    const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.35, 0.25, 0); inner.add(lLeg);
    createBox(0.35, 0.3, 0.5, COLORS.shellRed, 0, 0, 0.1, lLeg); // Red Shoes
    createBox(0.25, 0.4, 0.25, COLORS.koopaYellow, 0, 0.35, 0, lLeg); // Leg
    
    const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.35, 0.25, 0); inner.add(rLeg);
    createBox(0.35, 0.3, 0.5, COLORS.shellRed, 0, 0, 0.1, rLeg); // Red Shoes
    createBox(0.25, 0.4, 0.25, COLORS.koopaYellow, 0, 0.35, 0, rLeg); // Leg

    // Body
    const body = new THREE.Group(); body.position.y = 0.9; inner.add(body);
    createBox(0.7, 0.9, 0.6, COLORS.koopaYellow, 0, 0, 0, body);
    
    // Shell (Red)
    const shell = new THREE.Group(); shell.position.set(0, 0, -0.35); body.add(shell);
    createBox(0.9, 1.0, 0.5, COLORS.shellRed, 0, 0, 0, shell);
    createBox(1.0, 1.1, 0.1, COLORS.white, 0, 0, 0.25, shell);

    // Arms
    const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.45, 0.2, 0); body.add(lArm);
    createBox(0.25, 0.5, 0.25, COLORS.koopaYellow, 0, -0.1, 0.1, lArm);
    const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.45, 0.2, 0); body.add(rArm);
    createBox(0.25, 0.5, 0.25, COLORS.koopaYellow, 0, -0.1, 0.1, rArm);

    // Head
    const head = new THREE.Group(); head.position.set(0, 0.7, 0.1); body.add(head);
    createBox(0.8, 0.7, 0.8, COLORS.koopaYellow, 0, 0, 0, head);
    createBox(0.9, 0.5, 0.5, COLORS.koopaYellow, 0, -0.1, 0.5, head);
    // Nostrils
    createBox(0.05, 0.1, 0.05, COLORS.black, -0.15, 0, 0.76, head);
    createBox(0.05, 0.1, 0.05, COLORS.black, 0.15, 0, 0.76, head);
    // Eyes
    createBox(0.25, 0.4, 0.1, COLORS.white, -0.2, 0.2, 0.4, head);
    createBox(0.25, 0.4, 0.1, COLORS.white, 0.2, 0.2, 0.4, head);
    createBox(0.1, 0.2, 0.05, COLORS.black, -0.15, 0.2, 0.46, head);
    createBox(0.1, 0.2, 0.05, COLORS.black, 0.15, 0.2, 0.46, head);

    // Wings (Attached to Shell)
    const wingColor = 0xFFFFFF;
    // Left Wing
    const lWing = new THREE.Group(); lWing.name = 'L_Wing'; lWing.position.set(-0.5, 0.5, -0.3); body.add(lWing);
    createBox(0.6, 0.3, 0.1, wingColor, -0.3, 0, 0, lWing); // Base
    createBox(0.4, 0.2, 0.1, wingColor, -0.8, 0.1, 0, lWing); // Tip
    createBox(0.3, 0.2, 0.1, wingColor, -0.5, -0.25, 0, lWing); // Bottom

    // Right Wing
    const rWing = new THREE.Group(); rWing.name = 'R_Wing'; rWing.position.set(0.5, 0.5, -0.3); body.add(rWing);
    createBox(0.6, 0.3, 0.1, wingColor, 0.3, 0, 0, rWing); // Base
    createBox(0.4, 0.2, 0.1, wingColor, 0.8, 0.1, 0, rWing); // Tip
    createBox(0.3, 0.2, 0.1, wingColor, 0.5, -0.25, 0, rWing); // Bottom

    castShadows(root);
    return root;
};
