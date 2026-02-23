
import * as THREE from 'three';
import { createBox, castShadows, createToiletShape, createHead } from '../utils';
import { COLORS } from '../constants';

export const createBossMesh = (type: string) => {
    const group = new THREE.Group();
    
    // --- BOSS 1: G-MAN 4.0 (High Quality Update) ---
    if (type === 'boss1') { 
        const boss = new THREE.Group(); boss.name = 'GMan4';
        const darkMetal = 0x222222;
        const toiletColor = 0x333333; // Dark Grey Toilet
        const skinColor = COLORS.gManSkin;

        // 1. Heavy Armored Base (Flight Unit)
        createBox(2.5, 1.2, 2.0, COLORS.gManArmor, 0, 0.6, 0, boss);
        createBox(2.7, 0.4, 2.2, darkMetal, 0, 0.2, 0, boss); // Bottom treads/skirt
        
        // 2. Dark Grey Toilet Bowl & Lid
        const bowlGroup = new THREE.Group();
        bowlGroup.position.set(0, 1.2, 0); // Sits on top of base
        boss.add(bowlGroup);

        // Main Bowl Body
        createBox(2.0, 1.0, 2.2, toiletColor, 0, 0.5, 0.2, bowlGroup);
        // Bowl Rim (Thicker top)
        createBox(2.2, 0.2, 2.4, 0x111111, 0, 1.0, 0.2, bowlGroup);
        
        // Toilet Lid (Open, behind head)
        const lidGroup = new THREE.Group();
        lidGroup.position.set(0, 1.2, -1.0);
        lidGroup.rotation.x = -0.3; // Angled back slightly
        bowlGroup.add(lidGroup);
        createBox(1.8, 2.2, 0.3, toiletColor, 0, 1.1, 0, lidGroup);
        createBox(1.6, 1.8, 0.1, 0x111111, 0, 1.1, 0.15, lidGroup); // Inner lid detail

        // 3. Neck (Connecting Head to Bowl)
        createBox(0.8, 0.8, 0.8, skinColor, 0, 1.0, 0.2, bowlGroup);

        // 4. Head (Custom High Quality Build)
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 1.4, 0.3); 
        bowlGroup.add(headGroup);
        
        const headScale = 3.2; 
        headGroup.scale.set(headScale, headScale, headScale);

        // Main Skull Shape
        createBox(0.5, 0.65, 0.55, skinColor, 0, 0.325, 0, headGroup);
        
        // --- GREY HAIR ---
        const hairColor = 0x444444; 
        createBox(0.52, 0.15, 0.57, hairColor, 0, 0.65, 0, headGroup); // Top
        createBox(0.52, 0.3, 0.1, hairColor, 0, 0.5, -0.25, headGroup); // Back
        createBox(0.1, 0.25, 0.4, hairColor, -0.22, 0.5, -0.05, headGroup); // Left
        createBox(0.1, 0.25, 0.4, hairColor, 0.22, 0.5, -0.05, headGroup); // Right

        // Ears
        createBox(0.1, 0.15, 0.1, skinColor, -0.28, 0.35, 0, headGroup);
        createBox(0.1, 0.15, 0.1, skinColor, 0.28, 0.35, 0, headGroup);
        
        // Nose
        createBox(0.1, 0.15, 0.1, skinColor, 0, 0.3, 0.3, headGroup);

        // --- Normal Sunglasses (Black Wayfarer Style) ---
        const glassesZ = 0.28;
        const lensColor = 0x000000;
        createBox(0.18, 0.1, 0.05, lensColor, -0.12, 0.45, glassesZ, headGroup);
        createBox(0.18, 0.1, 0.05, lensColor, 0.12, 0.45, glassesZ, headGroup);
        createBox(0.08, 0.02, 0.05, 0x111111, 0, 0.48, glassesZ, headGroup);
        createBox(0.02, 0.02, 0.3, 0x111111, -0.22, 0.48, 0.1, headGroup);
        createBox(0.02, 0.02, 0.3, 0x111111, 0.22, 0.48, 0.1, headGroup);

        // --- Evil Smile ---
        const mouthZ = 0.28;
        createBox(0.26, 0.08, 0.02, 0x220000, 0, 0.15, mouthZ, headGroup);
        createBox(0.24, 0.02, 0.03, 0xFFFFFF, 0, 0.18, mouthZ, headGroup); // Upper teeth
        createBox(0.24, 0.02, 0.03, 0xFFFFFF, 0, 0.12, mouthZ, headGroup); // Lower teeth
        createBox(0.04, 0.04, 0.02, 0x442222, -0.15, 0.17, mouthZ, headGroup);
        createBox(0.04, 0.04, 0.02, 0x442222, 0.15, 0.17, mouthZ, headGroup);

        // 5. Laser Cannons
        const laserPositions = [
            { x: -1.8, y: 1.8, z: 0.5 }, { x: -2.2, y: 1.2, z: 0.5 }, { x: -1.8, y: 0.6, z: 0.5 },
            { x: 1.8, y: 1.8, z: 0.5 },  { x: 2.2, y: 1.2, z: 0.5 },  { x: 1.8, y: 0.6, z: 0.5 }
        ];

        laserPositions.forEach((pos, idx) => {
            const cannon = new THREE.Group();
            cannon.name = `Laser_${idx}`;
            cannon.position.set(pos.x, pos.y + 0.5, pos.z); 
            createBox(0.4, 0.2, 0.4, 0x333333, -Math.sign(pos.x)*0.4, 0, -0.4, cannon);
            createBox(0.6, 0.6, 1.2, 0x111111, 0, 0, 0, cannon);
            const emit = createBox(0.4, 0.4, 0.1, COLORS.laserYellow, 0, 0, 0.6, cannon);
            (emit.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(COLORS.laserYellow);
            (emit.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
            createBox(0.7, 0.1, 1.0, 0x555555, 0, 0.35, -0.1, cannon);
            boss.add(cannon);
        });

        // 6. Fire Effects at Base
        const fireGroup = new THREE.Group();
        fireGroup.name = 'FireBase';
        fireGroup.position.set(0, 0, 0);
        for(let i=0; i<10; i++) {
            const f = createBox(0.5, 0.5, 0.5, COLORS.lava, (Math.random()-0.5)*3, -0.5 + Math.random()*0.5, (Math.random()-0.5)*2, fireGroup);
            (f.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(COLORS.lava);
        }
        boss.add(fireGroup);

        group.add(boss);
    } 
    
    // --- BOSS 2: TITAN TV MAN ---
    else if (type === 'boss2') { 
        const boss = new THREE.Group(); boss.name = 'TitanTV';
        const suitColor = 0x111111;
        const purpleGlow = COLORS.tvBladePurple;

        // 1. Legs
        const lLeg = new THREE.Group(); lLeg.position.set(-0.6, 1.2, 0); boss.add(lLeg);
        createBox(0.5, 1.2, 0.5, suitColor, 0, -0.6, 0, lLeg); 
        createBox(0.55, 1.0, 0.55, suitColor, 0, -1.7, 0, lLeg); 
        createBox(0.2, 0.4, 0.1, purpleGlow, 0, -1.5, 0.28, lLeg); 

        const rLeg = new THREE.Group(); rLeg.position.set(0.6, 1.2, 0); boss.add(rLeg);
        createBox(0.5, 1.2, 0.5, suitColor, 0, -0.6, 0, rLeg);
        createBox(0.55, 1.0, 0.55, suitColor, 0, -1.7, 0, rLeg);
        createBox(0.2, 0.4, 0.1, purpleGlow, 0, -1.5, 0.28, rLeg);

        // 2. Torso
        const torso = new THREE.Group(); torso.position.set(0, 2.0, 0); boss.add(torso);
        createBox(1.4, 1.6, 0.8, suitColor, 0, 0, 0, torso);
        const core = createBox(0.5, 0.5, 0.2, COLORS.tvCoreRed, 0, 0.2, 0.45, torso);
        (core.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(COLORS.tvCoreRed);
        (core.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
        
        // Backpack
        const backpack = new THREE.Group(); backpack.position.set(0, 0.5, -0.6); torso.add(backpack);
        createBox(1.0, 1.5, 0.5, 0x222222, 0, 0, 0, backpack);
        createBox(0.1, 1.5, 0.1, 0x555555, -0.6, 0.8, 0, backpack).rotation.z = 0.5;
        createBox(0.1, 1.5, 0.1, 0x555555, 0.6, 0.8, 0, backpack).rotation.z = -0.5;

        // 4. Arms
        const lArm = new THREE.Group(); lArm.name = 'L_Arm'; lArm.position.set(-1.1, 2.6, 0); boss.add(lArm);
        createBox(0.5, 0.5, 0.5, suitColor, 0, 0, 0, lArm); 
        createBox(0.4, 1.2, 0.4, suitColor, 0, -0.8, 0, lArm); 
        createBox(0.45, 1.0, 0.45, suitColor, 0, -2.0, 0, lArm); 

        const rArm = new THREE.Group(); rArm.name = 'R_Arm'; rArm.position.set(1.1, 2.6, 0); boss.add(rArm);
        createBox(0.5, 0.5, 0.5, suitColor, 0, 0, 0, rArm); 
        createBox(0.4, 1.2, 0.4, suitColor, 0, -0.8, 0, rArm); 
        createBox(0.45, 1.0, 0.45, suitColor, 0, -2.0, 0, rArm); 
        const bladeGroup = new THREE.Group(); bladeGroup.position.set(0, -2.5, 0.3); rArm.add(bladeGroup);
        const blade = createBox(0.2, 2.5, 0.8, purpleGlow, 0, -1.0, 0, bladeGroup); 
        blade.rotation.x = -0.2; 
        (blade.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(purpleGlow);
        (blade.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5;

        // 5. Heads
        const neck = new THREE.Group(); neck.position.set(0, 2.8, 0); boss.add(neck);
        const mainTV = new THREE.Group(); mainTV.name = 'MainTV'; mainTV.position.set(0, 0.6, 0); neck.add(mainTV);
        createBox(1.2, 0.9, 0.6, 0x222222, 0, 0, 0, mainTV); 
        createBox(1.0, 0.7, 0.1, COLORS.tvStatic, 0, 0, 0.31, mainTV); 
        createBox(0.8, 0.4, 0.11, 0x880000, 0, -0.05, 0.31, mainTV); 
        createBox(0.8, 0.1, 0.12, 0x000000, 0, 0.15, 0.31, mainTV); 
        createBox(0.8, 0.1, 0.12, 0x000000, 0, -0.25, 0.31, mainTV); 
        for(let i=-3; i<=3; i++) {
            createBox(0.05, 0.15, 0.13, 0xFFFFFF, i*0.12, 0.05, 0.31, mainTV); 
            createBox(0.05, 0.15, 0.13, 0xFFFFFF, i*0.12 + 0.06, -0.15, 0.31, mainTV); 
        }

        const lTV = new THREE.Group(); lTV.position.set(-0.8, 0, 0); neck.add(lTV);
        createBox(0.6, 0.5, 0.4, 0x222222, 0, 0, 0, lTV);
        createBox(0.5, 0.4, 0.1, 0x050505, 0, 0, 0.21, lTV).rotation.z = 0.2; 

        const rTV = new THREE.Group(); rTV.position.set(0.8, 0, 0); neck.add(rTV);
        createBox(0.6, 0.5, 0.4, 0x222222, 0, 0, 0, rTV);
        createBox(0.5, 0.4, 0.1, 0x050505, 0, 0, 0.21, rTV).rotation.z = -0.2;

        group.add(boss);

    } 
    
    // --- BOSS 3: ASTRO JUGGERNAUT (Arms Spread) - UPDATED NEON PINK/BLUE ---
    else if (type === 'boss3') { 
        const boss = new THREE.Group(); boss.name = 'Astro';
        const armorDark = 0x151515; 
        const armorGrey = 0x333333; 
        const armorLight = 0x555555; 
        
        // New Neon Colors
        const neonPink = COLORS.astroNeonPink;
        const neonBlue = COLORS.astroNeonBlue;
        
        // Helper to make mesh neon
        const setNeon = (mesh: THREE.Mesh, color: number) => {
            (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(color);
            (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.5;
        };

        const chassis = new THREE.Group(); chassis.name = 'Chassis'; chassis.position.set(0, 0.7, 0); boss.add(chassis);
        createBox(0.5, 0.6, 0.7, armorDark, 0, 0, 0, chassis);
        createBox(0.4, 0.5, 0.6, armorGrey, -0.4, 0, 0.1, chassis);
        createBox(0.4, 0.5, 0.6, armorGrey, 0.4, 0, 0.1, chassis);
        
        // Thrusters - Pink
        const tL = createBox(0.3, 0.3, 0.05, neonPink, -0.4, 0, 0.45, chassis); setNeon(tL, neonPink);
        const tR = createBox(0.3, 0.3, 0.05, neonPink, 0.4, 0, 0.45, chassis); setNeon(tR, neonPink);

        const torso = new THREE.Group(); torso.position.set(0, 1.0, 0); boss.add(torso);
        createBox(2.0, 1.8, 1.4, armorDark, 0, 0.9, 0, torso);
        createBox(0.8, 0.7, 0.2, armorGrey, -0.45, 1.3, 0.7, torso); 
        createBox(0.8, 0.7, 0.2, armorGrey, 0.45, 1.3, 0.7, torso);  
        createBox(1.4, 0.6, 0.2, armorGrey, 0, 0.6, 0.75, torso);    
        // Core - Pink
        const core = createBox(0.5, 0.5, 0.1, neonPink, 0, 1.3, 0.8, torso); setNeon(core, neonPink);
        createBox(1.2, 0.4, 1.0, armorGrey, 0, 1.9, 0, torso);

        const headGroup = new THREE.Group(); headGroup.name = 'Head'; headGroup.position.set(0, 2.3, 0.3); boss.add(headGroup);
        createBox(1.1, 1.2, 1.2, armorDark, 0, 0.6, 0, headGroup);
        
        // Visors/Eyes - Blue
        const visorL = createBox(0.25, 0.15, 0.1, neonBlue, -0.25, 0.7, 0.6, headGroup); setNeon(visorL, neonBlue);
        const visorR = createBox(0.25, 0.15, 0.1, neonBlue, 0.25, 0.7, 0.6, headGroup); setNeon(visorR, neonBlue);
        
        createBox(0.5, 0.5, 0.4, armorGrey, 0, 0.3, 0.65, headGroup);
        for(let i=-2; i<=2; i++) { createBox(0.04, 0.35, 0.05, 0x111111, i*0.08, 0.3, 0.85, headGroup); }
        
        const filterGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16);
        const filterMat = new THREE.MeshStandardMaterial({ color: armorLight, metalness: 0.6, roughness: 0.4 });
        const filterL = new THREE.Mesh(filterGeo, filterMat); filterL.rotation.z = Math.PI / 2; filterL.position.set(-0.55, 0.3, 0.6); headGroup.add(filterL);
        const filterR = new THREE.Mesh(filterGeo, filterMat); filterR.rotation.z = Math.PI / 2; filterR.position.set(0.55, 0.3, 0.6); headGroup.add(filterR);

        // Updated Heavy Arm Logic for Spread
        const createHeavyArm = (side: 'L' | 'R') => {
            const arm = new THREE.Group();
            arm.name = `${side}_Arm`;
            const xDir = side === 'L' ? -1 : 1;
            
            // Shoulder Pad (Attached to the arm group now so it moves with it)
            // Positioned at (0,0,0) relative to arm group which is at shoulder pivot
            createBox(1.2, 1.0, 1.2, armorDark, 0, 0, 0, arm);
            
            // Upper Arm (Hanging down from pivot)
            createBox(0.6, 1.0, 0.6, armorGrey, 0, -0.8, 0, arm);
            
            // Weapon (Forearm)
            const weapon = new THREE.Group(); 
            weapon.name = 'Weapon'; // NAMED FOR ANIMATION
            weapon.position.set(0, -1.7, 0.5); 
            arm.add(weapon);
            
            createBox(0.8, 0.8, 2.0, armorDark, 0, 0, 0, weapon);
            
            // Vents - Mix of Pink and Blue
            const vents = createBox(0.82, 0.2, 1.2, neonPink, 0, 0.3, 0, weapon); setNeon(vents, neonPink);
            
            createBox(0.15, 0.5, 0.8, armorLight, -0.3, 0, 1.1, weapon); createBox(0.15, 0.5, 0.8, armorLight, 0.3, 0, 1.1, weapon);
            createBox(0.5, 0.15, 0.8, armorLight, 0, -0.3, 1.1, weapon);
            
            // Weapon Inner Core - Blue
            const inner = createBox(0.4, 0.4, 0.1, neonBlue, 0, 0, 1.0, weapon); setNeon(inner, neonBlue);
            
            // Position the entire arm group at the shoulder socket
            arm.position.set(xDir * 1.6, 2.2, 0);
            
            // Spread arms slightly
            arm.rotation.z = xDir * 0.2; 
            
            return arm;
        };
        const lArm = createHeavyArm('L'); boss.add(lArm);
        const rArm = createHeavyArm('R'); boss.add(rArm);
        
        const pack = new THREE.Group(); pack.position.set(0, 1.8, -0.8); boss.add(pack);
        createBox(1.4, 1.6, 0.6, armorGrey, 0, 0, 0, pack);
        createBox(0.4, 0.4, 0.4, armorDark, -0.5, -0.6, 0.3, pack); createBox(0.4, 0.4, 0.4, armorDark, 0.5, -0.6, 0.3, pack);

        group.add(boss);

    } 
    
    // --- BOSS 4: GOLDEN EMPEROR (MECH SUIT REWORK) -> CHANGED TO COPPER ---
    else if (type === 'boss4') { 
        const boss = new THREE.Group(); boss.name = 'Emperor';
        
        // REPLACED GOLD WITH COPPER
        const copper = COLORS.copper;
        const darkCopper = COLORS.darkCopper;
        
        const mechGrey = 0x333333; // Frame parts
        const eyeRed = 0xFF0000; 

        // 1. Massive Boots & Legs
        const createLeg = (side: 'L' | 'R') => {
            const leg = new THREE.Group();
            const xDir = side === 'L' ? -1 : 1;
            
            // Boot Base
            createBox(1.0, 0.6, 1.4, darkCopper, 0, 0.3, 0.2, leg);
            createBox(0.8, 0.4, 1.2, copper, 0, 0.6, 0.2, leg);
            // Spike on boot toe
            const spike = createBox(0.2, 0.4, 0.2, copper, 0, 0.5, 1.0, leg);
            spike.rotation.x = 0.5;

            // Shin/Calf
            createBox(0.7, 1.2, 0.8, mechGrey, 0, 1.4, 0, leg);
            createBox(0.8, 1.0, 0.9, copper, 0, 1.4, 0, leg); // Armor plating
            
            // Knee Guard
            createBox(0.6, 0.6, 0.3, darkCopper, 0, 2.0, 0.5, leg);
            const kneeSpike = createBox(0.2, 0.4, 0.2, copper, 0, 2.0, 0.7, leg);
            kneeSpike.rotation.x = 0.6;

            // Thigh
            createBox(0.75, 1.0, 0.75, copper, 0, 2.6, 0, leg);
            createBox(0.6, 1.0, 0.6, mechGrey, 0, 2.6, -0.1, leg); // Inner mechanic

            // Hip Joint Cover
            createBox(0.9, 0.5, 0.9, darkCopper, 0, 3.2, 0, leg);

            leg.position.set(xDir * 1.0, 0, 0);
            return leg;
        };

        const lLeg = createLeg('L'); boss.add(lLeg);
        const rLeg = createLeg('R'); boss.add(rLeg);

        // 2. Torso (Massive Chest)
        const torso = new THREE.Group();
        torso.position.set(0, 3.5, 0);
        boss.add(torso);

        // Waist/Abdomen
        createBox(1.6, 1.0, 1.0, mechGrey, 0, 0, 0, torso);
        createBox(1.8, 0.8, 1.2, copper, 0, 0, 0, torso); // Waist Armor
        
        // Chest Block
        createBox(2.2, 1.5, 1.4, copper, 0, 1.2, 0.1, torso);
        // Ribbed Detail on Chest
        for(let i=0; i<3; i++) {
            createBox(1.4, 0.2, 1.5, darkCopper, 0, 0.8 + i*0.4, 0.15, torso);
        }
        // Central Core/Gem
        const core = createBox(0.5, 0.5, 0.2, 0xFF4400, 0, 1.4, 0.85, torso);
        (core.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0xFF4400);

        // High Collar
        createBox(1.6, 0.8, 0.3, darkCopper, 0, 2.2, -0.6, torso); // Back collar
        createBox(0.4, 0.6, 1.0, darkCopper, -0.8, 2.2, -0.2, torso); // Left collar side
        createBox(0.4, 0.6, 1.0, darkCopper, 0.8, 2.2, -0.2, torso); // Right collar side

        // 3. Head (Mech Emperor Face with Gas Mask)
        const head = new THREE.Group();
        head.name = 'Head';
        head.position.set(0, 2.2, 0); // Relative to torso base
        torso.add(head);

        // Base Head
        createBox(0.9, 1.0, 0.9, 0x555555, 0, 0.5, 0, head); // Grey metallic skin/helm
        
        // Eyes (Glowing Red Slits)
        const eyeL = createBox(0.25, 0.1, 0.05, eyeRed, -0.2, 0.6, 0.46, head);
        (eyeL.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeRed);
        const eyeR = createBox(0.25, 0.1, 0.05, eyeRed, 0.2, 0.6, 0.46, head);
        (eyeR.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeRed);

        // --- GAS MASK ---
        const maskColor = 0x222222;
        const filterColor = 0x111111;
        const strapColor = 0x111111;
        
        // Main Mask Block (Snout)
        createBox(0.6, 0.4, 0.3, maskColor, 0, 0.25, 0.55, head);
        // Central Filter Canister
        createBox(0.3, 0.3, 0.2, filterColor, 0, 0.2, 0.75, head);
        // Side Filters (Smaller)
        createBox(0.25, 0.25, 0.25, filterColor, -0.35, 0.2, 0.5, head);
        createBox(0.25, 0.25, 0.25, filterColor, 0.35, 0.2, 0.5, head);
        // Straps to back of head
        createBox(0.92, 0.1, 0.92, strapColor, 0, 0.3, 0, head);

        // Crown (Spikes)
        const crownGroup = new THREE.Group();
        crownGroup.position.set(0, 1.0, 0);
        head.add(crownGroup);
        // Band
        createBox(1.0, 0.2, 1.0, copper, 0, 0, 0, crownGroup);
        // Spikes
        for(let i=0; i<5; i++) {
            const angle = (i / 5) * Math.PI; // Semicircle
            // 3 Main Front Spikes
            createBox(0.15, 0.6, 0.15, copper, (i-2)*0.35, 0.4, 0.4, crownGroup).rotation.x = -0.2;
        }
        createBox(0.15, 0.8, 0.15, copper, 0, 0.5, -0.4, crownGroup); // Tall back spike
        createBox(0.15, 0.6, 0.15, copper, -0.4, 0.4, 0, crownGroup).rotation.z = 0.3; // Side spikes
        createBox(0.15, 0.6, 0.15, copper, 0.4, 0.4, 0, crownGroup).rotation.z = -0.3;

        // 4. Arms (Massive Shoulders + Gauntlets)
        const createArm = (side: 'L' | 'R') => {
            const armGroup = new THREE.Group();
            armGroup.name = `${side}_Arm`; // For animation lookups
            const xDir = side === 'L' ? -1 : 1;
            
            // Shoulder Pad (Massive) - Centered on pivot now
            const shoulder = new THREE.Group();
            shoulder.position.set(0, 1.0, 0); 
            
            createBox(1.4, 1.2, 1.4, copper, 0, 0, 0, shoulder);
            createBox(1.2, 1.0, 1.5, darkCopper, 0, 0, 0, shoulder);
            // Spikes on Shoulder
            createBox(0.2, 0.8, 0.2, copper, 0, 0.7, 0, shoulder); // Top
            createBox(0.2, 0.6, 0.2, copper, xDir*0.7, 0.3, 0, shoulder).rotation.z = xDir * -1.0; // Side

            armGroup.add(shoulder);

            // Upper Arm (Centered relative to group)
            createBox(0.6, 1.0, 0.6, mechGrey, 0, -0.5, 0, armGroup);
            
            // Forearm (Gauntlet)
            const forearm = new THREE.Group();
            forearm.position.set(0, -1.2, 0);
            armGroup.add(forearm);
            
            createBox(0.8, 1.4, 0.8, copper, 0, -0.5, 0, forearm); // Main gauntlet
            createBox(0.9, 0.4, 0.9, darkCopper, 0, 0.1, 0, forearm); // Cuff
            
            // Hand/Claw
            const hand = new THREE.Group();
            hand.position.set(0, -1.3, 0);
            forearm.add(hand);
            createBox(0.6, 0.5, 0.6, 0x222222, 0, 0, 0, hand); // Palm
            // Fingers
            createBox(0.15, 0.6, 0.15, 0x111111, -0.2, -0.4, 0.2, hand);
            createBox(0.15, 0.6, 0.15, 0x111111, 0.2, -0.4, 0.2, hand);
            createBox(0.15, 0.5, 0.15, 0x111111, 0, -0.3, -0.2, hand); // Thumb/Back

            // Attach further out to prevent clipping when vertical (1.3 -> 1.8)
            armGroup.position.set(xDir * 1.8, 1.5, 0); 
            return armGroup;
        };

        const lArm = createArm('L'); torso.add(lArm);
        const rArm = createArm('R'); torso.add(rArm);

        // 5. Back Unit (Toilet Tank / Flight Pack)
        const pack = new THREE.Group();
        pack.position.set(0, 1.5, -1.0);
        torso.add(pack);
        
        // Tank shape but mechanized
        createBox(2.0, 2.5, 0.8, darkCopper, 0, 0, 0, pack);
        createBox(0.5, 2.0, 0.5, 0x333333, -1.2, -0.2, 0.2, pack); // Thruster L
        createBox(0.5, 2.0, 0.5, 0x333333, 1.2, -0.2, 0.2, pack); // Thruster R
        
        // Exhaust flames
        const fL = createBox(0.3, 0.6, 0.3, 0x00FFFF, -1.2, -1.4, 0.2, pack); // Blue flame
        (fL.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x00FFFF);
        const fR = createBox(0.3, 0.6, 0.3, 0x00FFFF, 1.2, -1.4, 0.2, pack);
        (fR.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x00FFFF);

        group.add(boss);
    }
    
    castShadows(group); return group;
};
