
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

export const createBossMesh = (type: string) => {
    const group = new THREE.Group();
    
    // Helper to make glowing wand tip (Old style for Boss 1)
    const addWand = (parent: THREE.Object3D, color: number) => {
        const wand = new THREE.Group();
        // Wand geometry (Vertical Y-axis)
        createBox(0.05, 0.6, 0.05, 0x5D4037, 0, 0.3, 0, wand);
        const glow = createBox(0.1, 0.1, 0.1, color, 0, 0.65, 0, wand);
        (glow.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(color);
        (glow.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
        parent.add(wand);
        return wand;
    };

    // NEW Helper: Attach Straight Wand (For Boss 2, 3, 4)
    // Attaches a wand extending straight down from the hand position.
    // When the arm is rotated -90 deg X (pointing forward), this wand points forward.
    const attachStraightWand = (parent: THREE.Group, color: number, yOffset: number) => {
        const wand = new THREE.Group();
        wand.position.set(0, yOffset, 0); // At hand position
        
        // Wand Stick (Dark Wood) - Extending outwards (local -Y)
        createBox(0.04, 0.8, 0.04, 0x2E1505, 0, -0.4, 0, wand);
        
        // Very Bright Glowing Tip
        const tip = createBox(0.15, 0.15, 0.15, color, 0, -0.8, 0, wand);
        if (tip.material instanceof THREE.MeshStandardMaterial) {
            tip.material.emissive = new THREE.Color(color);
            tip.material.emissiveIntensity = 8.0; // High intensity for bloom
            tip.material.toneMapped = false;
        }
        
        // Point Light for Ambient Effect
        const light = new THREE.PointLight(color, 3.0, 8.0);
        light.position.set(0, -0.8, 0);
        wand.add(light);

        parent.add(wand);
        return wand;
    };

    // Helper to create rotating aura ring
    const createAura = (parent: THREE.Group, color: number, count: number, radius: number, yPos: number) => {
        const auraGroup = new THREE.Group();
        auraGroup.name = 'BossAura';
        auraGroup.position.y = yPos;
        
        for(let i=0; i<count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            // Small floating particles
            const p = createBox(0.1, 0.1, 0.1, color, x, (Math.random()-0.5)*0.5, z, auraGroup);
            if (p.material instanceof THREE.MeshStandardMaterial) {
                p.material.emissive = new THREE.Color(color);
                p.material.emissiveIntensity = 1.5;
                p.material.transparent = true;
                p.material.opacity = 0.8;
            }
        }
        parent.add(auraGroup);
    };

    if (type === 'boss1') { // PETER PETTIGREW (Rat Hybrid Form)
        const peter = new THREE.Group(); peter.name = 'Peter';
        
        // Colors derived from image reference
        const cSkin = 0xE6C29C; 
        const cJacket = 0x404F3A; // Olive Green Jacket
        const cShirt = 0x4E342E;  // Brown Shirt
        const cPants = 0x3E2723;  // Dark Brown Pants
        const cGreyFeature = 0x757575; // Snout & Hands (Silver/Grey Blocky)
        const cPink = 0xEFA9A9;   // Ears/Tail/Nose/Feet
        const cHair = 0x96794D;   // Dirty Blonde/Brown Hair
        const cTooth = 0xFFFFFF;

        // 1. LEGS (Short, with rat-like feet)
        const legH = 0.5;
        const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.25, legH, 0); peter.add(lLeg);
        createBox(0.24, 0.5, 0.24, cPants, 0, -0.25, 0, lLeg);
        createBox(0.24, 0.15, 0.3, cPink, 0, -0.55, 0.05, lLeg); // Foot

        const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.25, legH, 0); peter.add(rLeg);
        createBox(0.24, 0.5, 0.24, cPants, 0, -0.25, 0, rLeg);
        createBox(0.24, 0.15, 0.3, cPink, 0, -0.55, 0.05, rLeg); // Foot

        // 2. TORSO (Jacket over Shirt) - Lowered to attach to legs
        const torso = new THREE.Group(); torso.position.set(0, legH + 0.35, 0); peter.add(torso);
        // Shirt (Underlayer)
        createBox(0.6, 0.7, 0.35, cShirt, 0, 0, 0, torso);
        // Jacket (Open)
        createBox(0.25, 0.72, 0.4, cJacket, -0.25, 0, 0.05, torso); // Left side
        createBox(0.25, 0.72, 0.4, cJacket, 0.25, 0, 0.05, torso);  // Right side
        createBox(0.7, 0.72, 0.1, cJacket, 0, 0, -0.2, torso);      // Back
        // Buttons
        createBox(0.05, 0.05, 0.05, 0x111111, 0, 0.1, 0.18, torso);
        createBox(0.05, 0.05, 0.05, 0x111111, 0, -0.2, 0.18, torso);

        // 3. ARMS (Strictly Parallel - 11 Shape)
        // Position X pulled in to attach to side of torso properly, no angle
        const armY = legH + 0.65;
        
        const lArm = new THREE.Group(); 
        lArm.name='L_Arm'; 
        lArm.position.set(-0.45, armY, 0); // Closer to body
        peter.add(lArm);
        createBox(0.22, 0.5, 0.22, cJacket, 0, -0.1, 0, lArm); // Sleeve vertically down
        createBox(0.3, 0.3, 0.3, cGreyFeature, 0, -0.5, 0, lArm); // Big Block Hand
        createBox(0.1, 0.1, 0.1, cGreyFeature, 0, -0.5, 0.2, lArm); // Knuckle bump

        const rArm = new THREE.Group(); 
        rArm.name='R_Arm'; 
        rArm.position.set(0.45, armY, 0); // Closer to body
        peter.add(rArm);
        createBox(0.22, 0.5, 0.22, cJacket, 0, -0.1, 0, rArm); // Sleeve vertically down
        createBox(0.3, 0.3, 0.3, cGreyFeature, 0, -0.5, 0, rArm); // Big Block Hand (Silver Hand)
        createBox(0.1, 0.1, 0.1, cGreyFeature, 0, -0.5, 0.2, rArm); // Knuckle bump

        // Wand attached to R hand (Old style, held sideways)
        const w = addWand(rArm, 0xFF0000); w.position.set(0, -0.5, 0.2); w.rotation.x = -1.5;

        // 4. TAIL (Pink Rat Tail)
        const tail = new THREE.Group(); tail.name='Tail'; tail.position.set(0, legH, -0.2); peter.add(tail);
        createBox(0.15, 0.15, 0.6, cPink, 0, 0, -0.3, tail); // Base
        createBox(0.12, 0.12, 0.6, cPink, 0, 0.1, -0.8, tail).rotation.x = 0.2; // Tip

        // 5. HEAD (Detailed Rat Face)
        const head = new THREE.Group(); head.name='Head'; head.position.set(0, legH + 0.95, 0); peter.add(head);
        
        // Main Head Block
        createBox(0.6, 0.55, 0.55, cSkin, 0, 0, 0, head);
        
        // Hair (Flat top + sides)
        createBox(0.65, 0.15, 0.6, cHair, 0, 0.35, 0, head); // Top
        createBox(0.65, 0.4, 0.15, cHair, 0, 0.1, -0.25, head); // Back
        createBox(0.1, 0.4, 0.4, cHair, -0.3, 0.1, 0, head); // Side L
        createBox(0.1, 0.4, 0.4, cHair, 0.3, 0.1, 0, head); // Side R

        // Ears (Mouse/Rat like on top)
        const lEar = new THREE.Group(); lEar.position.set(-0.25, 0.45, 0.1); head.add(lEar);
        createBox(0.15, 0.2, 0.05, cHair, 0, 0, 0, lEar);
        createBox(0.1, 0.15, 0.05, cPink, 0, 0, 0.01, lEar); // Inner pink

        const rEar = new THREE.Group(); rEar.position.set(0.25, 0.45, 0.1); head.add(rEar);
        createBox(0.15, 0.2, 0.05, cHair, 0, 0, 0, rEar);
        createBox(0.1, 0.15, 0.05, cPink, 0, 0, 0.01, rEar); // Inner pink

        // Face Features
        const faceZ = 0.28;
        // Eyes
        createBox(0.12, 0.12, 0.02, 0xFFFFFF, -0.15, 0.05, faceZ, head); // Whites
        createBox(0.05, 0.05, 0.03, 0x000000, -0.15, 0.05, faceZ+0.01, head); // Pupil
        createBox(0.12, 0.12, 0.02, 0xFFFFFF, 0.15, 0.05, faceZ, head);
        createBox(0.05, 0.05, 0.03, 0x000000, 0.15, 0.05, faceZ+0.01, head);
        
        // Eyebrows (Angry)
        createBox(0.15, 0.04, 0.03, cHair, -0.15, 0.15, faceZ, head).rotation.z = -0.2;
        createBox(0.15, 0.04, 0.03, cHair, 0.15, 0.15, faceZ, head).rotation.z = 0.2;

        // Snout (Big Grey Block sticking out)
        createBox(0.25, 0.2, 0.3, cGreyFeature, 0, -0.1, faceZ + 0.1, head);
        // Pink Nose Tip
        createBox(0.1, 0.08, 0.05, cPink, 0, -0.05, faceZ + 0.25, head);
        // Buck Tooth (Single block)
        createBox(0.08, 0.1, 0.02, cTooth, 0, -0.22, faceZ + 0.25, head);

        peter.scale.set(1.5, 1.5, 1.5);
        group.add(peter);

    } else if (type === 'boss2') { // BELLATRIX LESTRANGE
        const bella = new THREE.Group(); bella.name = 'Bellatrix';
        
        const cBlack = 0x1A1A1A; // Dress
        const cDarkHair = 0x110B0B; // Almost black hair
        const cPaleSkin = 0xFADADD; // Very pale skin
        
        // 1. DRESS / BODY
        const skirtH = 0.9;
        const skirt = new THREE.Group();
        skirt.position.set(0, skirtH/2, 0);
        bella.add(skirt);
        
        createBox(0.5, skirtH, 0.4, cBlack, 0, 0, 0, skirt);
        createBox(0.55, 0.2, 0.45, cBlack, 0, -skirtH/2 + 0.1, 0, skirt);
        createBox(0.15, 0.15, 0.2, cBlack, -0.15, -skirtH/2 - 0.075, 0.1, skirt);
        createBox(0.15, 0.15, 0.2, cBlack, 0.15, -skirtH/2 - 0.075, 0.1, skirt);

        const torsoY = skirtH;
        const torso = new THREE.Group();
        torso.position.set(0, torsoY + 0.35, 0); 
        bella.add(torso);
        
        createBox(0.45, 0.7, 0.35, cBlack, 0, 0, 0, torso);
        createBox(0.15, 0.15, 0.05, cPaleSkin, 0, 0.25, 0.16, torso);

        // 2. ARMS
        const lArm = new THREE.Group();
        lArm.name = 'L_Arm';
        lArm.position.set(-0.35, torsoY + 0.5, 0);
        bella.add(lArm);
        createBox(0.15, 0.6, 0.15, cBlack, 0, -0.2, 0, lArm); 
        createBox(0.12, 0.15, 0.12, cPaleSkin, 0, -0.55, 0, lArm); 

        const rArm = new THREE.Group();
        rArm.name = 'R_Arm';
        rArm.position.set(0.35, torsoY + 0.5, 0);
        
        // Set Initial Pose: Pointing Forward (approx -90 deg X)
        rArm.rotation.x = -1.57; 
        
        bella.add(rArm);
        createBox(0.15, 0.6, 0.15, cBlack, 0, -0.2, 0, rArm); 
        createBox(0.12, 0.15, 0.12, cPaleSkin, 0, -0.55, 0, rArm); 
        
        // Wand: Attached straight at hand position
        attachStraightWand(rArm, 0x00FF00, -0.55); // Green Glow

        // 3. HEAD
        const headY = torsoY + 0.7 + 0.1;
        const head = new THREE.Group();
        head.name = 'Head';
        head.position.set(0, headY, 0);
        bella.add(head);

        createBox(0.4, 0.45, 0.4, cPaleSkin, 0, 0, 0, head);

        const eyeZ = 0.21;
        const eyeY = 0.05;
        createBox(0.12, 0.12, 0.02, 0xFFFFFF, -0.1, eyeY, eyeZ, head);
        createBox(0.12, 0.12, 0.02, 0xFFFFFF, 0.1, eyeY, eyeZ, head);
        createBox(0.04, 0.04, 0.03, 0x000000, -0.1, eyeY, eyeZ+0.01, head);
        createBox(0.04, 0.04, 0.03, 0x000000, 0.1, eyeY, eyeZ+0.01, head);
        createBox(0.1, 0.02, 0.02, 0x553333, 0, -0.12, eyeZ, head);

        const hair = new THREE.Group();
        hair.name = 'Hair';
        head.add(hair);
        
        const addHair = (w, h, d, x, y, z) => {
            createBox(w, h, d, cDarkHair, x, y, z, hair);
        };

        addHair(0.6, 0.3, 0.6, 0, 0.35, 0);
        addHair(0.7, 0.8, 0.3, 0, 0, -0.25);
        
        const hairPositions = [
            { s: [0.2, 0.4, 0.2], p: [-0.3, 0.1, 0] },
            { s: [0.25, 0.3, 0.25], p: [-0.35, 0.3, -0.1] },
            { s: [0.2, 0.5, 0.2], p: [-0.3, -0.2, 0.1] },
            { s: [0.15, 0.3, 0.15], p: [-0.25, 0.4, 0.2] },
            { s: [0.2, 0.4, 0.2], p: [0.3, 0.1, 0] },
            { s: [0.25, 0.3, 0.25], p: [0.35, 0.3, -0.1] },
            { s: [0.2, 0.5, 0.2], p: [0.3, -0.2, 0.1] },
            { s: [0.15, 0.3, 0.15], p: [0.25, 0.4, 0.2] },
            { s: [0.2, 0.2, 0.2], p: [0, 0.55, 0] },
            { s: [0.2, 0.2, 0.2], p: [-0.15, 0.5, 0.1] },
            { s: [0.2, 0.2, 0.2], p: [0.15, 0.5, -0.1] },
            { s: [0.15, 0.6, 0.15], p: [-0.35, -0.4, -0.1] },
            { s: [0.15, 0.6, 0.15], p: [0.35, -0.4, -0.1] },
        ];

        hairPositions.forEach(h => {
            addHair(h.s[0], h.s[1], h.s[2], h.p[0], h.p[1], h.p[2]);
        });

        createBox(0.05, 0.2, 0.02, cDarkHair, -0.05, 0.15, 0.22, head).rotation.z = 0.2;

        // GREEN AURA
        createAura(bella, 0x00FF00, 8, 1.2, 1.5);

        bella.scale.set(1.6, 1.6, 1.6);
        group.add(bella);

    } else if (type === 'boss3') { // BARTY CROUCH JR
        const barty = new THREE.Group(); barty.name = 'Barty';
        
        const cCoat = 0x4A3728; const cVest = 0x222222; const cPants = 0x1A1A1A; const cSkin = 0xF0D5BE; const cHair = 0x3E2723; const cTongue = 0xFF0000; const cTie = 0x8B0000; const cButton = 0xD4AF37;

        const legH = 0.8; const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.22, legH, 0); barty.add(lLeg);
        createBox(0.22, legH, 0.24, cPants, 0, -legH/2, 0, lLeg);
        createBox(0.24, 0.12, 0.28, 0x050505, 0, -legH + 0.06, 0.05, lLeg); 

        const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.22, legH, 0); barty.add(rLeg);
        createBox(0.22, legH, 0.24, cPants, 0, -legH/2, 0, rLeg);
        createBox(0.24, 0.12, 0.28, 0x050505, 0, -legH + 0.06, 0.05, rLeg);

        const torso = new THREE.Group(); torso.position.set(0, legH + 0.7, 0); barty.add(torso);
        createBox(0.5, 0.7, 0.3, cVest, 0, 0, 0, torso);
        createBox(0.1, 0.35, 0.31, cTie, 0, 0.1, 0, torso);
        createBox(0.04, 0.04, 0.31, cButton, 0, -0.1, 0, torso);
        createBox(0.04, 0.04, 0.31, cButton, 0, -0.25, 0, torso);
        
        createBox(0.2, 0.75, 0.35, cCoat, -0.3, 0, 0.05, torso); 
        createBox(0.2, 0.75, 0.35, cCoat, 0.3, 0, 0.05, torso); 
        createBox(0.8, 0.75, 0.1, cCoat, 0, 0, -0.15, torso); 
        createBox(0.22, 0.6, 0.36, cCoat, -0.3, -0.65, 0.05, torso); 
        createBox(0.22, 0.6, 0.36, cCoat, 0.3, -0.65, 0.05, torso); 
        createBox(0.8, 0.6, 0.1, cCoat, 0, -0.65, -0.15, torso);

        createBox(0.8, 0.2, 0.15, cCoat, 0, 0.45, -0.15, torso); 
        createBox(0.2, 0.15, 0.3, cCoat, -0.35, 0.45, 0, torso); 
        createBox(0.2, 0.15, 0.3, cCoat, 0.35, 0.45, 0, torso);

        const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.55, legH + 1.1, 0); barty.add(lArm);
        createBox(0.2, 0.6, 0.2, cCoat, 0, -0.2, 0, lArm);
        createBox(0.15, 0.2, 0.15, cSkin, 0, -0.6, 0, lArm); 

        const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.55, legH + 1.1, 0); 
        
        // Set Initial Pose: Pointing Forward
        rArm.rotation.x = -1.57;
        
        barty.add(rArm);
        createBox(0.2, 0.6, 0.2, cCoat, 0, -0.2, 0, rArm);
        createBox(0.15, 0.2, 0.15, cSkin, 0, -0.6, 0, rArm); 
        
        // Wand: Straight attachment with Red Glow
        attachStraightWand(rArm, 0xFF0000, -0.6); 

        const head = new THREE.Group(); head.name='Head'; head.position.set(0, legH + 1.55, 0); barty.add(head);
        createBox(0.45, 0.5, 0.45, cSkin, 0, 0, 0, head);
        
        const hairGroup = new THREE.Group();
        createBox(0.5, 0.15, 0.5, cHair, 0, 0.3, 0, hairGroup); 
        createBox(0.52, 0.4, 0.15, cHair, 0, 0.1, -0.2, hairGroup); 
        createBox(0.1, 0.3, 0.4, cHair, -0.25, 0.1, 0, hairGroup); 
        createBox(0.1, 0.3, 0.4, cHair, 0.25, 0.1, 0, hairGroup); 
        createBox(0.15, 0.2, 0.05, cHair, -0.15, 0.3, 0.23, hairGroup).rotation.z = 0.2;
        createBox(0.15, 0.2, 0.05, cHair, 0.15, 0.3, 0.23, hairGroup).rotation.z = -0.2;
        head.add(hairGroup);

        const faceZ = 0.23;
        createBox(0.12, 0.1, 0.02, 0xFFFFFF, -0.12, 0.05, faceZ, head); 
        createBox(0.04, 0.04, 0.03, 0x000000, -0.12, 0.05, faceZ+0.01, head);
        createBox(0.12, 0.1, 0.02, 0xFFFFFF, 0.12, 0.05, faceZ, head); 
        createBox(0.04, 0.04, 0.03, 0x000000, 0.12, 0.05, faceZ+0.01, head);
        
        createBox(0.15, 0.04, 0.03, cHair, -0.12, 0.13, faceZ, head).rotation.z = -0.3;
        createBox(0.15, 0.04, 0.03, cHair, 0.12, 0.13, faceZ, head).rotation.z = 0.3;

        createBox(0.06, 0.1, 0.05, cSkin, 0, -0.05, faceZ, head);

        const tongue = createBox(0.1, 0.04, 0.25, cTongue, 0.05, -0.18, faceZ + 0.1, head);
        tongue.name = 'Tongue';
        tongue.rotation.set(0, 0, 0); 

        // RED AURA
        createAura(barty, 0xFF0000, 8, 1.2, 1.5);

        barty.scale.set(1.6, 1.6, 1.6);
        group.add(barty);

    } else if (type === 'boss4') { // VOLDEMORT
        const voldy = new THREE.Group(); voldy.name = 'Voldemort';
        const robeColor = 0x151719; 
        const cRobeInner = 0x0F1112; 
        const pale = 0xF2F2F2; 
        const cEye = 0xFF0000; 
        const greenMagic = COLORS.spellGreen;

        const legH = 0.8;
        const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.25, legH, 0); voldy.add(lLeg);
        createBox(0.24, legH, 0.24, robeColor, 0, -legH/2, 0, lLeg);
        
        const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.25, legH, 0); voldy.add(rLeg);
        createBox(0.24, legH, 0.24, robeColor, 0, -legH/2, 0, rLeg);

        const torso = new THREE.Group(); torso.name='Robe'; torso.position.set(0, legH + 0.7, 0); voldy.add(torso);
        createBox(0.55, 0.8, 0.35, cRobeInner, 0, 0, 0, torso);
        
        createBox(0.25, 1.4, 0.45, robeColor, -0.35, -0.3, 0.05, torso); 
        createBox(0.25, 1.4, 0.45, robeColor, 0.35, -0.3, 0.05, torso);  
        createBox(0.95, 1.4, 0.15, robeColor, 0, -0.3, -0.2, torso);     
        
        const collar = new THREE.Group(); collar.position.set(0, 0.4, -0.1); torso.add(collar);
        createBox(0.8, 0.3, 0.1, robeColor, 0, 0.15, -0.1, collar); 
        createBox(0.15, 0.2, 0.3, robeColor, -0.35, 0.1, 0.1, collar);
        createBox(0.15, 0.2, 0.3, robeColor, 0.35, 0.1, 0.1, collar);

        const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.6, legH + 1.1, 0); voldy.add(lArm);
        createBox(0.24, 0.6, 0.24, robeColor, 0, -0.2, 0, lArm); 
        createBox(0.26, 0.15, 0.26, robeColor, 0, -0.5, 0, lArm); 
        createBox(0.2, 0.1, 0.2, 0xFFFFFF, 0, -0.6, 0, lArm); 
        createBox(0.15, 0.25, 0.15, pale, 0, -0.75, 0, lArm); 

        const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.6, legH + 1.1, 0);
        
        // Set Initial Pose: Pointing Forward
        rArm.rotation.x = -1.57;
        
        voldy.add(rArm);
        createBox(0.24, 0.6, 0.24, robeColor, 0, -0.2, 0, rArm); 
        createBox(0.26, 0.15, 0.26, robeColor, 0, -0.5, 0, rArm); 
        createBox(0.2, 0.1, 0.2, 0xFFFFFF, 0, -0.6, 0, rArm); 
        createBox(0.15, 0.25, 0.15, pale, 0, -0.75, 0, rArm); 
        
        // Wand: Straight attachment with Green Glow
        attachStraightWand(rArm, greenMagic, -0.75); 

        const head = new THREE.Group(); head.name='Head'; head.position.set(0, legH + 1.55, 0); voldy.add(head);
        createBox(0.5, 0.6, 0.5, pale, 0, 0.1, 0, head);
        
        const fZ = 0.26;
        const eyeL = createBox(0.12, 0.06, 0.02, cEye, -0.12, 0.15, fZ, head);
        const eyeR = createBox(0.12, 0.06, 0.02, cEye, 0.12, 0.15, fZ, head);
        (eyeL.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(cEye);
        (eyeR.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(cEye);
        
        createBox(0.15, 0.03, 0.03, 0xCCCCCC, -0.12, 0.2, fZ, head).rotation.z = -0.2;
        createBox(0.15, 0.03, 0.03, 0xCCCCCC, 0.12, 0.2, fZ, head).rotation.z = 0.2;

        createBox(0.02, 0.08, 0.01, 0x888888, -0.03, 0.05, fZ, head).rotation.z = 0.2;
        createBox(0.02, 0.08, 0.01, 0x888888, 0.03, 0.05, fZ, head).rotation.z = -0.2;

        createBox(0.15, 0.02, 0.01, 0x666666, 0, -0.15, fZ, head);

        createBox(0.05, 0.15, 0.1, pale, -0.26, 0.1, 0, head);
        createBox(0.05, 0.15, 0.1, pale, 0.26, 0.1, 0, head);

        // GREEN AURA
        createAura(voldy, 0x00FF00, 8, 1.2, 1.5);

        voldy.scale.set(1.5, 1.5, 1.5);
        group.add(voldy);
    }
    
    castShadows(group); return group;
};
