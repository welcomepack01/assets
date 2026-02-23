
import * as THREE from 'three';
import { createBox, castShadows, createVoxelEyes } from '../utils';
import { COLORS } from '../constants';

export const createDodgeObstacle = (variant) => {
    const group = new THREE.Group();
    if (variant === 'A') { 
        const squirtle = new THREE.Group(); squirtle.name = 'Squirtle';
        const skinColor = COLORS.squirtleSkin;
        const shellColor = COLORS.squirtleShell;
        const bellyColor = COLORS.squirtleBelly;
        const rimColor = COLORS.squirtleRim;
        const body = new THREE.Group(); body.position.set(0, 0.6, 0); squirtle.add(body);
        createBox(0.8, 0.9, 0.7, skinColor, 0, 0, 0, body);
        createBox(0.65, 0.75, 0.1, bellyColor, 0, -0.05, 0.36, body);
        createBox(0.85, 0.8, 0.4, shellColor, 0, 0, -0.4, body);
        createBox(0.9, 0.85, 0.1, rimColor, 0, 0, -0.2, body);
        const head = new THREE.Group(); head.position.set(0, 1.25, 0.1); squirtle.add(head);
        createBox(0.9, 0.9, 0.9, skinColor, 0, 0, 0, head);
        createBox(0.15, 0.35, 0.05, 0x111111, -0.25, 0.1, 0.46, head);
        createBox(0.05, 0.1, 0.06, 0xFFFFFF, -0.25, 0.18, 0.46, head);
        createBox(0.15, 0.35, 0.05, 0x111111, 0.25, 0.1, 0.46, head);
        createBox(0.05, 0.1, 0.06, 0xFFFFFF, 0.25, 0.18, 0.46, head);
        createBox(0.5, 0.15, 0.05, 0xFF69B4, 0, -0.25, 0.46, head);
        createBox(0.2, 0.4, 0.2, skinColor, -0.5, 0.7, 0.2, squirtle).name='L_Arm';
        createBox(0.2, 0.4, 0.2, skinColor, 0.5, 0.7, 0.2, squirtle).name='R_Arm';
        createBox(0.25, 0.4, 0.3, skinColor, -0.3, 0.2, 0, squirtle).name='L_Leg';
        createBox(0.25, 0.4, 0.3, skinColor, 0.3, 0.2, 0, squirtle).name='R_Leg';
        const tail = new THREE.Group(); tail.position.set(0, 0.4, -0.6); squirtle.add(tail);
        createBox(0.2, 0.2, 0.3, skinColor, 0, 0, 0, tail);
        createBox(0.2, 0.3, 0.2, skinColor, 0, 0.2, 0.1, tail); 
        createBox(0.25, 0.2, 0.2, skinColor, 0, 0.3, 0.2, tail);
        squirtle.scale.set(1.5, 1.5, 1.5);
        squirtle.rotation.y = Math.PI;
        group.add(squirtle);
    } else { 
        if (Math.random() < 0.5) {
            // BUTTERFREE
            const butterfree = new THREE.Group(); butterfree.name = 'Butterfree';
            const purple = COLORS.butterfreeBody;
            const teal = COLORS.butterfreeTeal;
            const white = COLORS.butterfreeWingWhite;
            const black = COLORS.butterfreeWingBlack;

            const body = new THREE.Group(); body.position.set(0, 0.8, 0); butterfree.add(body);
            createBox(0.5, 0.6, 0.5, purple, 0, 0, 0, body);
            createBox(0.45, 0.5, 0.45, purple, 0, -0.5, 0, body);
            
            const head = new THREE.Group(); head.position.set(0, 0.4, 0); body.add(head);
            createBox(0.55, 0.5, 0.5, purple, 0, 0, 0, head);
            
            createBox(0.22, 0.35, 0.05, 0x111111, -0.15, 0.05, 0.26, head); 
            createBox(0.08, 0.12, 0.06, 0xFFFFFF, -0.15, 0.15, 0.26, head); 
            createBox(0.22, 0.35, 0.05, 0x111111, 0.15, 0.05, 0.26, head);
            createBox(0.08, 0.12, 0.06, 0xFFFFFF, 0.15, 0.15, 0.26, head);
            createBox(0.1, 0.1, 0.05, teal, 0, -0.15, 0.26, head);
            createBox(0.03, 0.05, 0.02, 0xFFFFFF, -0.03, -0.22, 0.26, head);
            createBox(0.03, 0.05, 0.02, 0xFFFFFF, 0.03, -0.22, 0.26, head);

            const antL = createBox(0.04, 0.6, 0.04, black, -0.1, 0.5, 0, head); antL.rotation.z = 0.3;
            const antR = createBox(0.04, 0.6, 0.04, black, 0.1, 0.5, 0, head); antR.rotation.z = -0.3;

            const createWing = (isLeft: boolean) => {
                const w = new THREE.Group();
                const sign = isLeft ? -1 : 1;
                const upW = new THREE.Group();
                createBox(1.2, 1.4, 0.05, white, sign * 0.6, 0.7, 0, upW);
                createBox(1.25, 1.45, 0.04, black, sign * 0.6, 0.7, 0, upW); 
                createBox(0.4, 0.4, 0.06, black, sign * 0.8, 1.1, 0, upW); 
                w.add(upW);
                const loW = new THREE.Group();
                createBox(0.9, 0.9, 0.05, white, sign * 0.45, -0.4, 0, loW);
                createBox(0.95, 0.95, 0.04, black, sign * 0.45, -0.4, 0, loW);
                w.add(loW);
                return w;
            };

            const wingL = createWing(true); wingL.name = 'WingL'; wingL.position.set(-0.2, 0.2, -0.25); body.add(wingL);
            const wingR = createWing(false); wingR.name = 'WingR'; wingR.position.set(0.2, 0.2, -0.25); body.add(wingR);

            createBox(0.12, 0.2, 0.12, teal, -0.25, 0.1, 0.25, body).rotation.x = -0.5;
            createBox(0.12, 0.2, 0.12, teal, 0.25, 0.1, 0.25, body).rotation.x = -0.5;
            createBox(0.15, 0.3, 0.15, teal, -0.15, -0.8, 0, body);
            createBox(0.15, 0.3, 0.15, teal, 0.15, -0.8, 0, body);

            butterfree.scale.set(1.4, 1.4, 1.4);
            butterfree.position.set(0, 0.3, 0); 
            group.add(butterfree);
        } else {
            // CHARMANDER
            const charmander = new THREE.Group(); charmander.name = 'Charmander';
            const orange = 0xFF8800; const belly = 0xFFEEAA; 
            const body = new THREE.Group(); body.position.set(0, 0.6, 0); charmander.add(body);
            createBox(0.7, 0.8, 0.5, orange, 0, 0, 0, body);
            createBox(0.5, 0.6, 0.1, belly, 0, -0.05, 0.26, body);
            
            const head = new THREE.Group(); head.position.set(0, 1.25, 0.1); charmander.add(head);
            createBox(0.8, 0.8, 0.8, orange, 0, 0, 0, head); 

            const faceZ = 0.41;
            createBox(0.15, 0.35, 0.05, 0x111111, -0.25, 0.1, faceZ, head); 
            createBox(0.05, 0.1, 0.06, 0xFFFFFF, -0.25, 0.18, faceZ, head); 
            createBox(0.15, 0.35, 0.05, 0x111111, 0.25, 0.1, faceZ, head); 
            createBox(0.05, 0.1, 0.06, 0xFFFFFF, 0.25, 0.18, faceZ, head); 
            createBox(0.5, 0.15, 0.05, 0xFF69B4, 0, -0.25, faceZ, head); 
            
            const lLeg = createBox(0.22, 0.35, 0.3, orange, -0.2, 0.175, 0, charmander); lLeg.name='L_Leg';
            const rLeg = createBox(0.22, 0.35, 0.3, orange, 0.2, 0.175, 0, charmander); rLeg.name='R_Leg';
            createBox(0.05, 0.05, 0.1, 0xFFFFFF, -0.2, 0.05, 0.15, charmander); 
            createBox(0.05, 0.05, 0.1, 0xFFFFFF, 0.2, 0.05, 0.15, charmander); 

            const lArm = createBox(0.15, 0.35, 0.15, orange, -0.38, 0.7, 0.2, charmander); lArm.name='L_Arm'; lArm.rotation.x = -0.5;
            const rArm = createBox(0.15, 0.35, 0.15, orange, 0.38, 0.7, 0.2, charmander); rArm.name='R_Arm'; rArm.rotation.x = -0.5;

            const tail = new THREE.Group(); tail.name='Tail'; tail.position.set(0, 0.4, -0.25); charmander.add(tail);
            createBox(0.2, 0.2, 0.5, orange, 0, 0, -0.25, tail).rotation.x = 0.2;
            createBox(0.15, 0.15, 0.4, orange, 0, 0.15, -0.6, tail).rotation.x = 0.5;
            
            const flame = new THREE.Group(); flame.name='Flame'; flame.position.set(0, 0.35, -0.8); tail.add(flame);
            const f1 = createBox(0.2, 0.3, 0.2, 0xFF2200, 0, 0, 0, flame); (f1.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0xFF2200);
            const f2 = createBox(0.12, 0.2, 0.12, 0xFFDD00, 0, 0.1, 0, flame); (f2.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0xFFDD00);
            flame.add(new THREE.PointLight(0xFF4400, 1, 3));

            charmander.scale.set(1.5, 1.5, 1.5);
            charmander.rotation.y = Math.PI; 
            group.add(charmander);
        }
    }
    castShadows(group); return group;
};

export const createPunchObstacle = (variant) => {
    const group = new THREE.Group();
    if (variant === 'weak') { 
        const grunt = new THREE.Group(); grunt.name = 'RocketGrunt';
        const black = 0x111111; const red = 0xD32F2F; const grey = 0xCCCCCC; const skin = COLORS.skin;
        
        const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.25, 0.9, 0); 
        createBox(0.22, 0.8, 0.22, black, 0, -0.4, 0, lLeg); 
        grunt.add(lLeg);
        const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.25, 0.9, 0);
        createBox(0.22, 0.8, 0.22, black, 0, -0.4, 0, rLeg); 
        grunt.add(rLeg);

        const torso = new THREE.Group(); torso.position.set(0, 1.35, 0); grunt.add(torso);
        createBox(0.7, 0.9, 0.35, black, 0, 0, 0, torso);
        createBox(0.72, 0.1, 0.37, grey, 0, -0.4, 0, torso);
        createBox(0.15, 0.12, 0.4, red, 0, -0.4, 0, torso); 
        const rZ = 0.18;
        createBox(0.08, 0.4, 0.02, red, -0.15, 0.1, rZ, torso); 
        createBox(0.25, 0.08, 0.02, red, 0, 0.26, rZ, torso); 
        createBox(0.25, 0.08, 0.02, red, 0, 0.0, rZ, torso); 
        createBox(0.08, 0.2, 0.02, red, 0.15, 0.15, rZ, torso); 
        createBox(0.08, 0.25, 0.02, red, 0.15, -0.15, rZ, torso); 

        const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.5, 1.7, 0);
        createBox(0.2, 0.5, 0.2, black, 0, -0.25, 0, lArm); 
        createBox(0.22, 0.4, 0.22, grey, 0, -0.7, 0, lArm); 
        grunt.add(lArm);
        const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.5, 1.7, 0);
        createBox(0.2, 0.5, 0.2, black, 0, -0.25, 0, rArm); 
        createBox(0.22, 0.4, 0.22, grey, 0, -0.7, 0, rArm); 
        grunt.add(rArm);

        const head = new THREE.Group(); head.position.set(0, 2.0, 0); grunt.add(head);
        createBox(0.45, 0.45, 0.45, skin, 0, 0, 0, head);
        createBox(0.5, 0.15, 0.5, black, 0, 0.3, 0, head); 
        createBox(0.48, 0.15, 0.2, black, 0, 0.25, 0.3, head); 
        createBox(0.05, 0.25, 0.1, 0x5D4037, -0.23, 0, 0, head);
        createBox(0.05, 0.25, 0.1, 0x5D4037, 0.23, 0, 0, head);
        
        createBox(0.08, 0.08, 0.02, 0xFFFFFF, -0.14, 0.05, 0.23, head); 
        createBox(0.08, 0.08, 0.03, 0x111111, -0.06, 0.05, 0.235, head); 
        createBox(0.16, 0.04, 0.03, 0x3E2723, -0.1, 0.12, 0.24, head).rotation.z = -0.2;

        createBox(0.08, 0.08, 0.02, 0xFFFFFF, 0.14, 0.05, 0.23, head); 
        createBox(0.08, 0.08, 0.03, 0x111111, 0.06, 0.05, 0.235, head); 
        createBox(0.16, 0.04, 0.03, 0x3E2723, 0.1, 0.12, 0.24, head).rotation.z = 0.2;

        createBox(0.1, 0.03, 0.02, 0x552222, 0, -0.18, 0.23, head); 

        grunt.scale.set(1.5, 1.5, 1.5);
        group.add(grunt);
    } else { 
        const arbok = new THREE.Group(); arbok.name = 'Arbok';
        const colorOptions = [
            { body: 0x9C27B0, pattern: 0xFFFF00 },
            { body: 0x2196F3, pattern: 0xFFEB3B },
            { body: 0xFFEB3B, pattern: 0x000000 }
        ];
        const sel = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        const bodyColor = sel.body;
        const patColor = sel.pattern;

        createBox(1.6, 0.3, 1.6, bodyColor, 0, 0.15, 0, arbok);
        createBox(1.3, 0.3, 1.3, bodyColor, 0, 0.45, 0, arbok);
        createBox(1.0, 0.3, 1.0, bodyColor, 0, 0.75, 0, arbok);
        const neck = new THREE.Group(); neck.name = 'Neck'; neck.position.set(0, 0.9, -0.3);
        createBox(0.5, 1.2, 0.5, bodyColor, 0, 0.6, 0, neck);
        const hood = new THREE.Group(); hood.position.set(0, 0.8, 0.1);
        createBox(1.8, 1.2, 0.1, bodyColor, 0, 0, 0, hood);
        createBox(0.4, 0.2, 0.05, 0x000000, -0.4, 0.2, 0.05, hood); 
        createBox(0.4, 0.2, 0.05, 0x000000, 0.4, 0.2, 0.05, hood); 
        createBox(0.1, 0.1, 0.05, patColor, -0.4, 0.2, 0.06, hood);
        createBox(0.1, 0.1, 0.05, patColor, 0.4, 0.2, 0.06, hood);
        neck.add(hood);
        const head = new THREE.Group(); head.position.set(0, 1.3, 0.3);
        createBox(0.5, 0.4, 0.6, bodyColor, 0, 0, 0, head);
        createVoxelEyes(head, 0.15, 0.05, 0.31, true); 
        createBox(0.1, 0.1, 0.1, 0xFFFFFF, -0.15, -0.15, 0.3, head); 
        createBox(0.1, 0.1, 0.1, 0xFFFFFF, 0.15, -0.15, 0.3, head); 
        neck.add(head);
        arbok.add(neck);
        arbok.scale.set(1.5, 1.5, 1.5);
        group.add(arbok);
    }
    castShadows(group); return group;
};

export const createFlyingObstacle = () => {
    const group = new THREE.Group();
    
    if (Math.random() < 0.5) {
        // PIDGEOT
        const pidgeot = new THREE.Group(); pidgeot.name = 'Aerodactyl'; 
        const colors = {
            brown: 0xA0522D, cream: 0xFFE4C4, red: 0xFF4500, yellow: 0xFFD700, pink: 0xFF9999, black: 0x111111
        };

        const body = new THREE.Group(); body.position.set(0, 0, 0); pidgeot.add(body);
        createBox(1.0, 0.8, 1.2, colors.brown, 0, 0, 0, body);
        createBox(0.9, 0.7, 1.1, colors.cream, 0, -0.1, 0.1, body); 

        const head = new THREE.Group(); head.position.set(0, 0.6, 0.5); pidgeot.add(head);
        createBox(0.7, 0.7, 0.7, colors.brown, 0, 0, 0, head);
        
        createBox(0.15, 0.15, 0.05, colors.black, -0.2, 0.1, 0.36, head);
        createBox(0.05, 0.05, 0.06, 0xFFFFFF, -0.25, 0.15, 0.36, head);
        createBox(0.15, 0.15, 0.05, colors.black, 0.2, 0.1, 0.36, head);
        createBox(0.05, 0.05, 0.06, 0xFFFFFF, 0.25, 0.15, 0.36, head);
        createBox(0.2, 0.2, 0.3, colors.pink, 0, -0.1, 0.45, head);

        const crest = new THREE.Group(); crest.position.set(0, 0.4, 0); head.add(crest);
        createBox(0.3, 0.2, 0.6, colors.red, 0, 0, 0.1, crest); 
        createBox(0.3, 0.2, 0.8, colors.yellow, 0, 0, -0.6, crest); 
        
        const lWing = new THREE.Group(); lWing.name = 'L_Wing'; 
        // Moved wings closer to body: (-0.5 -> -0.4)
        lWing.position.set(-0.4, 0.3, 0); 
        pidgeot.add(lWing);
        createBox(1.5, 0.15, 0.8, colors.brown, -0.75, 0, 0, lWing);
        createBox(1.5, 0.1, 0.6, colors.cream, -0.75, -0.05, 0.1, lWing); 

        const rWing = new THREE.Group(); rWing.name = 'R_Wing'; 
        // Moved wings closer to body: (0.5 -> 0.4)
        rWing.position.set(0.4, 0.3, 0); 
        pidgeot.add(rWing);
        createBox(1.5, 0.15, 0.8, colors.brown, 0.75, 0, 0, rWing);
        createBox(1.5, 0.1, 0.6, colors.cream, 0.75, -0.05, 0.1, rWing); 

        const tail = new THREE.Group(); tail.position.set(0, 0, -0.6); pidgeot.add(tail);
        createBox(0.6, 0.1, 0.8, colors.red, 0, 0, -0.4, tail);
        
        const lFoot = new THREE.Group(); lFoot.position.set(-0.3, -0.5, 0); pidgeot.add(lFoot);
        createBox(0.15, 0.3, 0.15, colors.pink, 0, 0, 0, lFoot);
        createBox(0.15, 0.1, 0.2, colors.pink, 0, -0.15, 0.1, lFoot); 

        const rFoot = new THREE.Group(); rFoot.position.set(0.3, -0.5, 0); pidgeot.add(rFoot);
        createBox(0.15, 0.3, 0.15, colors.pink, 0, 0, 0, rFoot);
        createBox(0.15, 0.1, 0.2, colors.pink, 0, -0.15, 0.1, rFoot); 

        group.add(pidgeot);
    } else {
        // BLUE GOLBAT
        const golbat = new THREE.Group(); golbat.name = 'Aerodactyl'; 
        const blue = COLORS.golbatBlue;
        const dark = COLORS.golbatMouth;
        const purple = COLORS.golbatPurple;

        const body = new THREE.Group(); body.position.set(0, 0, 0); golbat.add(body);
        createBox(1.2, 1.4, 0.6, blue, 0, 0, 0, body);
        
        createBox(0.2, 0.2, 0.2, blue, -0.3, 0.8, 0, body);
        createBox(0.2, 0.2, 0.2, blue, 0.3, 0.8, 0, body);
        createBox(0.1, 0.1, 0.05, purple, -0.3, 0.8, 0.11, body);
        createBox(0.1, 0.1, 0.05, purple, 0.3, 0.8, 0.11, body);

        createBox(1.0, 1.0, 0.1, dark, 0, -0.1, 0.31, body); 
        createBox(0.1, 0.2, 0.1, 0xFFFFFF, -0.3, 0.3, 0.35, body);
        createBox(0.1, 0.2, 0.1, 0xFFFFFF, 0.3, 0.3, 0.35, body);
        createBox(0.1, 0.2, 0.1, 0xFFFFFF, -0.3, -0.5, 0.35, body);
        createBox(0.1, 0.2, 0.1, 0xFFFFFF, 0.3, -0.5, 0.35, body);

        createBox(0.3, 0.15, 0.1, 0xFFFFFF, -0.3, 0.55, 0.3, body);
        createBox(0.08, 0.08, 0.11, 0x111111, -0.3, 0.55, 0.3, body);
        createBox(0.3, 0.15, 0.1, 0xFFFFFF, 0.3, 0.55, 0.3, body);
        createBox(0.08, 0.08, 0.11, 0x111111, 0.3, 0.55, 0.3, body);

        const createBatWing = (isLeft: boolean) => {
            const wGroup = new THREE.Group();
            const sign = isLeft ? -1 : 1;
            createBox(1.2, 0.15, 0.15, blue, sign * 0.6, 0.5, 0, wGroup); 
            createBox(0.15, 1.0, 0.15, blue, sign * 1.2, 0.0, 0, wGroup); 
            createBox(1.0, 0.8, 0.05, purple, sign * 0.6, 0.1, 0, wGroup); 
            createBox(0.8, 0.4, 0.05, purple, sign * 0.5, -0.5, 0, wGroup); 
            return wGroup;
        };

        // Moved wings closer to body: +/- 0.5 (was 0.6)
        const lWing = createBatWing(true); lWing.name = 'L_Wing'; lWing.position.set(-0.5, 0.2, 0); golbat.add(lWing);
        const rWing = createBatWing(false); rWing.name = 'R_Wing'; rWing.position.set(0.5, 0.2, 0); golbat.add(rWing);

        createBox(0.15, 0.3, 0.15, blue, -0.3, -0.85, 0, golbat);
        createBox(0.2, 0.1, 0.3, blue, -0.3, -1.0, 0.1, golbat);
        
        createBox(0.15, 0.3, 0.15, blue, 0.3, -0.85, 0, golbat);
        createBox(0.2, 0.1, 0.3, blue, 0.3, -1.0, 0.1, golbat);

        group.add(golbat);
    }

    castShadows(group);
    return group;
};
