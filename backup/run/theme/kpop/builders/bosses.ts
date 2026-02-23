
import * as THREE from 'three';
import { createBox, castShadows, normalizeModel } from '../utils';
import { COLORS } from '../constants';
import { createPunchObstacle } from './enemies.ts'; // Ensure extension is correct or import from module

// Function to unify material settings across all models (copied from Dodge1 logic)
const fixMaterial = (mat: THREE.Material) => {
    if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial || mat instanceof THREE.MeshPhongMaterial) {
        if (mat.map) {
            // If texture exists, reset color to white to avoid tinting
            mat.color.setHex(0xFFFFFF);
            mat.map.colorSpace = THREE.SRGBColorSpace;
        } else {
            // If no texture, ensure color is bright enough if it looks too dark
            const isDark = mat.color.r < 0.2 && mat.color.g < 0.2 && mat.color.b < 0.2;
            if (isDark && mat instanceof THREE.MeshStandardMaterial) {
                mat.emissive.setHex(0x222222); 
            }
        }
        
        if ('roughness' in mat) mat.roughness = 0.8;
        if ('metalness' in mat) mat.metalness = 0.1;
        if ('emissive' in mat && !mat.map) (mat as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
        
        // CRITICAL FIX: Disable transparency and alpha testing to prevent cut-off
        mat.transparent = false;
        mat.alphaTest = 0; // Force render all pixels regardless of alpha
        mat.opacity = 1.0;
        mat.side = THREE.DoubleSide; 
        mat.depthWrite = true; // Ensure it writes to depth buffer
        
        mat.needsUpdate = true;
    }
};

const applyMaterialFixToModel = (group: THREE.Group) => {
    group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (Array.isArray(child.material)) {
                child.material = child.material.map(m => { const newMat = m.clone(); fixMaterial(newMat); return newMat; });
            } else if (child.material) {
                const newMat = child.material.clone();
                fixMaterial(newMat);
                child.material = newMat;
            }
        }
    });
};

export const createBossMesh = (type: string, models?: Record<string, THREE.Group>) => {
    const group = new THREE.Group();

    if (type === 'boss1') { 
        if (models && models['BOSS1']) {
            // Boss 1: Scaled down by 25% (2.8 -> 2.1)
            const model = normalizeModel(models['BOSS1'], 2.1);
            model.position.y = -1.4; 
            model.rotation.y = 0; 
            applyMaterialFixToModel(model);
            group.add(model);
        } else {
            // Fallback: ALPHA WOLF (Single)
            const wolf = new THREE.Group(); wolf.name = 'AlphaWolf';
            const black = COLORS.wolfDark;
            const grey = COLORS.wolfGrey;
            createBox(1.2, 1.2, 2.5, black, 0, 1.5, 0, wolf);
            createBox(1.4, 1.4, 1.0, grey, 0, 1.6, 0.8, wolf);
            const lLeg = createBox(0.4, 1.5, 0.4, black, -0.5, 0.75, 1.0, wolf); lLeg.name='FL';
            const rLeg = createBox(0.4, 1.5, 0.4, black, 0.5, 0.75, 1.0, wolf); rLeg.name='FR';
            const blLeg = createBox(0.4, 1.5, 0.4, black, -0.5, 0.75, -1.0, wolf); blLeg.name='BL';
            const brLeg = createBox(0.4, 1.5, 0.4, black, 0.5, 0.75, -1.0, wolf); brLeg.name='BR';
            const head = new THREE.Group(); head.name='Head'; head.position.set(0, 2.0, 1.5); wolf.add(head);
            createBox(0.9, 0.9, 1.0, black, 0, 0, 0, head);
            createBox(0.7, 0.5, 0.8, black, 0, -0.2, 0.8, head);
            const eyeL = createBox(0.15, 0.15, 0.05, COLORS.eyeYellow, -0.25, 0.1, 0.51, head); (eyeL.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(COLORS.eyeYellow);
            const eyeR = createBox(0.15, 0.15, 0.05, COLORS.eyeYellow, 0.25, 0.1, 0.51, head); (eyeR.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(COLORS.eyeYellow);
            createBox(0.05, 0.4, 0.02, 0xFF0000, -0.25, 0.1, 0.55, head).rotation.z = 0.2;
            createBox(0.2, 0.4, 0.1, black, -0.3, 0.5, 0, head); createBox(0.2, 0.4, 0.1, black, 0.3, 0.5, 0, head);
            wolf.scale.set(1.2, 1.2, 1.2);
            group.add(wolf);
        }
    } 
    else if (type === 'boss2') { 
        if (models && models['BOSS2']) {
            const model = normalizeModel(models['BOSS2'], 2.43);
            model.position.y = -1.0; 
            model.rotation.y = 0; 
            applyMaterialFixToModel(model);
            group.add(model);
        } else {
            // Fallback: MARSHMALLOW
            const monster = new THREE.Group(); monster.name = 'Marshmallow';
            const white = COLORS.marshmallowBody; const blue = COLORS.marshmallowSpike;
            const lLeg = createBox(0.8, 1.5, 0.8, white, -0.8, 0.75, 0, monster); lLeg.name='L_Leg';
            const rLeg = createBox(0.8, 1.5, 0.8, white, 0.8, 0.75, 0, monster); rLeg.name='R_Leg';
            const torso = new THREE.Group(); torso.name='Torso'; torso.position.set(0, 2.5, 0); monster.add(torso);
            createBox(2.2, 2.0, 1.5, white, 0, 0, 0, torso);
            for(let i=0; i<6; i++) { const s = createBox(0.3, 1.2, 0.3, blue, (Math.random()-0.5)*1.5, 0.8, -0.6, torso); s.rotation.x = -0.5; }
            const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-1.5, 0.5, 0); torso.add(lArm); createBox(0.8, 2.5, 0.8, white, 0, -1.0, 0, lArm); createBox(0.9, 0.6, 0.9, blue, 0, -2.5, 0, lArm);
            const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(1.5, 0.5, 0); torso.add(rArm); createBox(0.8, 2.5, 0.8, white, 0, -1.0, 0, rArm); createBox(0.9, 0.6, 0.9, blue, 0, -2.5, 0, rArm);
            const head = new THREE.Group(); head.name='Head'; head.position.set(0, 1.2, 0.5); torso.add(head); createBox(1.2, 0.8, 1.0, white, 0, 0, 0, head);
            const eyeColor = 0x9C27B0;
            const eL = createBox(0.2, 0.15, 0.1, eyeColor, -0.3, 0, 0.5, head); (eL.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeColor);
            const eR = createBox(0.2, 0.15, 0.1, eyeColor, 0.3, 0, 0.5, head); (eR.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeColor);
            createBox(0.15, 0.4, 0.15, blue, -0.4, -0.4, 0.5, head); createBox(0.15, 0.4, 0.15, blue, 0.4, -0.4, 0.5, head);
            group.add(monster);
        }
    }
    else if (type === 'boss3') { 
        if (models && models['BOSS3']) {
            // Reduced size by 60% (3.0 * 0.4 = 1.2)
            const model = normalizeModel(models['BOSS3'], 1.2);
            
            // ADJUSTED: Raised by 0.2 from -0.6 -> -0.4
            model.position.y = -0.4; 
            
            model.rotation.y = 0;
            
            // Fix Dark Model: Add dedicated light
            const light = new THREE.PointLight(0xFFFFFF, 3.0, 15);
            light.position.set(0, 3, 4);
            group.add(light);
            
            applyMaterialFixToModel(model);
            
            group.add(model);
        } else {
            // Fallback: DUKE
            const duke = new THREE.Group(); duke.name = 'Duke';
            const black = COLORS.dukeBlack; const skin = COLORS.dukeSkin;
            const lLeg = createBox(0.2, 0.6, 0.2, black, -0.2, 0.3, 0, duke); lLeg.name='L_Leg';
            const rLeg = createBox(0.2, 0.6, 0.2, black, 0.2, 0.3, 0, duke); rLeg.name='R_Leg';
            const torso = new THREE.Group(); torso.name='Torso'; torso.position.set(0, 0.6, 0); duke.add(torso);
            createBox(0.5, 0.7, 0.3, black, 0, 0.35, 0, torso);
            createBox(0.52, 0.15, 0.32, 0xFF0000, 0, 0.3, 0, torso).rotation.z = 0.2;
            createBox(0.1, 0.1, 0.05, 0xFFD700, -0.15, 0.5, 0.16, torso);
            const lArm = createBox(0.15, 0.6, 0.15, black, -0.35, 0.5, 0, torso); lArm.name='L_Arm';
            const rArm = createBox(0.15, 0.6, 0.15, black, 0.35, 0.5, 0, torso); rArm.name='R_Arm';
            const head = new THREE.Group(); head.name='Head'; head.position.set(0, 0.8, 0); torso.add(head);
            createBox(0.35, 0.4, 0.35, skin, 0, 0.2, 0, head); createBox(0.08, 0.15, 0.15, skin, 0, 0.15, 0.2, head);
            createBox(0.12, 0.08, 0.05, 0x111111, -0.1, 0.25, 0.18, head); createBox(0.12, 0.08, 0.05, 0x111111, 0.1, 0.25, 0.18, head);
            createBox(0.4, 0.15, 0.4, 0xFFFFFF, 0, 0.45, 0, head); createBox(0.45, 0.3, 0.15, 0xFFFFFF, 0, 0.3, -0.15, head);
            duke.scale.set(1.5, 1.5, 1.5);
            group.add(duke);
        }

        // --- ADD 2x PUNCH1 MINIONS (WEAK) ---
        // ADJUSTED: Scale increased by 50% (0.375 -> 0.5625)
        const mScale = 0.5625; 
        const mL = createPunchObstacle('weak', models);
        mL.name = 'Minion_L'; // Name for animator
        mL.scale.set(mScale, mScale, mScale);
        
        mL.position.set(-1.2, 0, -1.0); 
        group.add(mL);

        const mR = createPunchObstacle('weak', models);
        mR.name = 'Minion_R'; // Name for animator
        mR.scale.set(mScale, mScale, mScale);
        mR.position.set(1.2, 0, -1.0); 
        group.add(mR);
    }
    else if (type === 'boss4') { 
        if (models && models['BOSS4']) {
            // ADJUSTED: Reduced size by 10% (1.4 -> 1.26)
            const model = normalizeModel(models['BOSS4'], 1.26);
            
            // ADJUSTED: Position lowered by 0.3 (0 -> -0.3)
            model.position.y = -0.3; 
            model.rotation.y = 0; 
            applyMaterialFixToModel(model);
            group.add(model);
        } else {
            // Fallback: HANS (Scaled down by 10%: 1.5 -> 1.35)
            const hans = new THREE.Group(); hans.name = 'Hans';
            const white = COLORS.hansWhite; const blue = COLORS.hansBlue; const gold = COLORS.hansGold; const hair = 0xB71C1C;
            const lLeg = createBox(0.3, 0.9, 0.3, blue, -0.3, 0.45, 0, hans); lLeg.name='L_Leg';
            const rLeg = createBox(0.3, 0.9, 0.3, blue, 0.3, 0.45, 0, hans); rLeg.name='R_Leg';
            createBox(0.32, 0.2, 0.32, 0x111111, 0, -0.35, 0, lLeg); createBox(0.32, 0.2, 0.32, 0x111111, 0, -0.35, 0, rLeg);
            const torso = new THREE.Group(); torso.name='Torso'; torso.position.set(0, 0.9, 0); hans.add(torso);
            createBox(0.7, 0.9, 0.4, white, 0, 0.45, 0, torso);
            createBox(0.3, 0.1, 0.4, gold, -0.4, 0.8, 0, torso); createBox(0.3, 0.1, 0.4, gold, 0.4, 0.8, 0, torso);
            createBox(0.72, 0.15, 0.42, blue, 0, 0.4, 0, torso).rotation.z = -0.3;
            const lArm = createBox(0.25, 0.8, 0.25, white, -0.5, 0.6, 0, torso); lArm.name='L_Arm';
            const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.5, 0.6, 0); torso.add(rArm);
            createBox(0.25, 0.8, 0.25, white, 0, -0.3, 0, rArm);
            const sword = new THREE.Group(); sword.position.set(0, -0.8, 0.2); rArm.add(sword);
            createBox(0.1, 0.3, 0.1, gold, 0, 0, 0, sword); createBox(0.3, 0.05, 0.1, gold, 0, 0.15, 0, sword); createBox(0.08, 1.5, 0.02, 0xCCCCCC, 0, 0.9, 0, sword); sword.rotation.x = -1.5;
            const head = new THREE.Group(); head.name='Head'; head.position.set(0, 1.0, 0); torso.add(head);
            createBox(0.4, 0.5, 0.4, COLORS.dukeSkin, 0, 0.25, 0, head);
            createBox(0.45, 0.2, 0.45, hair, 0, 0.5, 0, head); createBox(0.1, 0.3, 0.1, hair, -0.2, 0.3, 0.1, head); createBox(0.1, 0.3, 0.1, hair, 0.2, 0.3, 0.1, head);
            
            // Reduced scale by 10%
            hans.scale.set(1.35, 1.35, 1.35);
            group.add(hans);
        }

        // --- ADD 2x PUNCH2 MINIONS (STRONG) ---
        // ADJUSTED: Scale increased by 50% (0.28 * 1.5 = 0.42)
        const mScale = 0.42;
        const mL = createPunchObstacle('strong', models);
        mL.name = 'Minion_L'; // Name for animator
        mL.scale.set(mScale, mScale, mScale);
        
        mL.position.set(-1.5, 0, -1.2); 
        group.add(mL);

        const mR = createPunchObstacle('strong', models);
        mR.name = 'Minion_R'; // Name for animator
        mR.scale.set(mScale, mScale, mScale);
        mR.position.set(1.5, 0, -1.2);
        group.add(mR);
    }

    castShadows(group);
    return group;
};
