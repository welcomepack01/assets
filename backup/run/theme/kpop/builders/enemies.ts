
import * as THREE from 'three';
import { createBox, castShadows, normalizeModel } from '../utils';
import { COLORS } from '../constants';

export const createDodgeObstacle = (variant: 'A' | 'B', models?: Record<string, THREE.Group>) => {
    const group = new THREE.Group();
    
    // Helper to fix material properties for textures
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
                    mat.emissive.setHex(0x222222); // Add slight emissive for visibility
                }
            }
            
            if ('roughness' in mat) mat.roughness = 0.8;
            if ('metalness' in mat) mat.metalness = 0.1;
            if ('emissive' in mat && !mat.map) (mat as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
            
            // CRITICAL FIX: Disable transparency and alpha testing to prevent bottom cut-off
            mat.transparent = false;
            mat.alphaTest = 0; // Force render all pixels regardless of alpha
            mat.opacity = 1.0;
            mat.side = THREE.DoubleSide; 
            mat.depthWrite = true; // Ensure it writes to depth buffer
            
            mat.needsUpdate = true;
        }
    };

    if (variant === 'A') { 
        if (models && models['DODGE1']) {
            const model = normalizeModel(models['DODGE1'], 1.8);
            
            // ADJUSTED: Lowered by 0.1 again (0.0 -> -0.1)
            model.position.y = -0.1; 
            
            // ADJUSTED: Rotated 30 degrees right (Math.PI - 0.52 radians)
            // Previously -0.26 (15 deg), now -0.52 (30 deg)
            model.rotation.y = Math.PI - 0.52; 

            model.traverse((child) => {
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
            group.add(model);
        } else {
            // REPLACED: High Quality Voxel Snowman
            const olaf = new THREE.Group(); olaf.name = 'Olaf';
            olaf.position.y = -0.1; // Lowered fallback as well

            const snowColor = 0xFFFAFA;
            const coalColor = 0x111111;
            const carrotColor = 0xFF6600;
            const stickColor = 0x5D4037;

            // 1. Bottom Snowball
            createBox(0.9, 0.8, 0.9, snowColor, 0, 0.4, 0, olaf);
            createBox(0.85, 0.1, 0.85, snowColor, 0, 0.8, 0, olaf); // Blend up

            // 2. Middle Snowball (Torso)
            const torso = new THREE.Group(); torso.name = 'Torso'; torso.position.set(0, 0.8, 0); olaf.add(torso);
            createBox(0.7, 0.65, 0.7, snowColor, 0, 0.325, 0, torso);
            // Buttons (Coal)
            createBox(0.1, 0.1, 0.05, coalColor, 0, 0.4, 0.36, torso);
            createBox(0.1, 0.1, 0.05, coalColor, 0, 0.2, 0.36, torso);

            // Stick Arms (Detailed)
            const lArm = new THREE.Group(); lArm.name = 'L_Arm'; lArm.position.set(-0.35, 0.4, 0); torso.add(lArm);
            createBox(0.06, 0.5, 0.06, stickColor, 0, 0.25, 0, lArm).rotation.z = 0.5;
            createBox(0.04, 0.15, 0.04, stickColor, -0.2, 0.45, 0, lArm).rotation.z = 0.2; // Finger
            createBox(0.04, 0.15, 0.04, stickColor, -0.25, 0.4, 0, lArm).rotation.z = 0.8; // Finger

            const rArm = new THREE.Group(); rArm.name = 'R_Arm'; rArm.position.set(0.35, 0.4, 0); torso.add(rArm);
            createBox(0.06, 0.5, 0.06, stickColor, 0, 0.25, 0, rArm).rotation.z = -0.5;
            createBox(0.04, 0.15, 0.04, stickColor, 0.2, 0.45, 0, rArm).rotation.z = -0.2;
            createBox(0.04, 0.15, 0.04, stickColor, 0.25, 0.4, 0, rArm).rotation.z = -0.8;

            // 3. Head
            const head = new THREE.Group(); head.name = 'Head'; head.position.set(0, 0.65, 0); torso.add(head);
            createBox(0.55, 0.5, 0.55, snowColor, 0, 0.25, 0, head);
            // Face
            createBox(0.08, 0.08, 0.02, coalColor, -0.12, 0.3, 0.28, head); // Eye L
            createBox(0.08, 0.08, 0.02, coalColor, 0.12, 0.3, 0.28, head); // Eye R
            // Carrot Nose
            createBox(0.1, 0.1, 0.4, carrotColor, 0, 0.2, 0.4, head); 
            // Tooth
            createBox(0.12, 0.08, 0.02, 0xFFFFFF, 0, 0.1, 0.28, head);

            // Hair (Twigs)
            createBox(0.03, 0.2, 0.03, stickColor, 0, 0.55, 0, head);
            createBox(0.03, 0.15, 0.03, stickColor, -0.05, 0.52, 0, head).rotation.z = -0.2;
            createBox(0.03, 0.15, 0.03, stickColor, 0.05, 0.52, 0, head).rotation.z = 0.2;

            olaf.scale.set(1.4, 1.4, 1.4);
            olaf.rotation.y = -0.52; // Rotate voxel backup too
            group.add(olaf);
        }
    } else { 
        if (models && models['DODGE2']) {
            // ADJUSTED: Increased scale by 30% (3.25 * 1.3 = 4.225)
            const model = normalizeModel(models['DODGE2'], 4.225);
            
            // ADJUSTED: Lowered position by another 0.1 (-3.2 -> -3.3)
            model.position.y = -3.3; 
            
            model.rotation.y = 0; 

            model.traverse((child) => {
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
            group.add(model);
        } else {
            // Fallback: GALE
            const gale = new THREE.Group(); gale.name = 'Gale'; 
            // Lowered by 0.1 (1.0 -> 0.9)
            gale.position.y = 0.9;
            
            const pCount = 12;
            const leafColor = [0xFFA500, 0x8B4513, 0xFFD700, 0xFFFFFF];
            for(let i=0; i<pCount; i++) {
                const leaf = new THREE.Group(); leaf.name = `Leaf_${i}`;
                const color = leafColor[i % leafColor.length];
                createBox(0.2, 0.02, 0.1, color, 0, 0, 0, leaf);
                const r = 0.5 + Math.random() * 0.5;
                const y = (Math.random() - 0.5) * 1.5;
                const angle = (i / pCount) * Math.PI * 2;
                leaf.position.set(Math.cos(angle)*r, y, Math.sin(angle)*r);
                leaf.userData = { radius: r, angle: angle, speed: 2.0 + Math.random() };
                gale.add(leaf);
            }
            const core = createBox(0.3, 0.3, 0.3, COLORS.windWhite, 0, 0, 0, gale);
            (core.material as THREE.MeshStandardMaterial).transparent = true;
            (core.material as THREE.MeshStandardMaterial).opacity = 0.3;
            
            // ADJUSTED: Increased scale by 30% (1.625 * 1.3 = 2.1125)
            gale.scale.set(2.11, 2.11, 2.11);
            group.add(gale);
        }
    }
    
    castShadows(group);
    return group;
};

export const createPunchObstacle = (variant: 'weak' | 'strong', models?: Record<string, THREE.Group>) => {
    const group = new THREE.Group();
    
    // Robust Material Fix for GLB Models
    const fixMaterial = (mat: THREE.Material) => {
        if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial || mat instanceof THREE.MeshPhongMaterial) {
            if (mat.map) {
                // If textured, force white to prevent tinting
                mat.color.setHex(0xFFFFFF);
                mat.map.colorSpace = THREE.SRGBColorSpace;
            }
            if ('roughness' in mat) mat.roughness = 0.8;
            if ('metalness' in mat) mat.metalness = 0.1;
            if ('emissive' in mat && !mat.map) (mat as THREE.MeshStandardMaterial).emissive.setHex(0x000000);
            
            // FORCE OPAQUE to fix disappearance issues
            mat.transparent = false;
            mat.opacity = 1.0;
            mat.alphaTest = 0;
            mat.depthWrite = true;
            mat.side = THREE.DoubleSide;
            // Remove any alpha map that might cause accidental transparency
            if (mat.alphaMap) mat.alphaMap = null; 

            mat.needsUpdate = true;
        }
    };

    if (variant === 'weak') { 
        if (models && models['PUNCH1']) {
            // Reduced scale from 2.2 to 2.1
            const model = normalizeModel(models['PUNCH1'], 2.1);
            
            // ADJUSTED Y: Lowered from -0.5 to -0.7
            model.position.y = -0.7; 
            
            model.rotation.y = 0; 
            
            model.traverse((child) => {
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

            group.add(model);
        } else {
            // Fallback: WOLF
            const wolf = new THREE.Group(); wolf.name = 'Wolf';
            const grey = COLORS.wolfGrey;
            createBox(0.5, 0.5, 1.0, grey, 0, 0.6, 0, wolf);
            const legW = 0.15; const legH = 0.6;
            const fl = createBox(legW, legH, legW, grey, -0.2, 0.3, 0.4, wolf); fl.name='FL';
            const fr = createBox(legW, legH, legW, grey, 0.2, 0.3, 0.4, wolf); fr.name='FR';
            const bl = createBox(legW, legH, legW, grey, -0.2, 0.3, -0.4, wolf); bl.name='BL';
            const br = createBox(legW, legH, legW, grey, 0.2, 0.3, -0.4, wolf); br.name='BR';
            const head = new THREE.Group(); head.name='Head'; head.position.set(0, 0.9, 0.6); wolf.add(head);
            createBox(0.4, 0.4, 0.4, grey, 0, 0, 0, head);
            createBox(0.3, 0.2, 0.3, grey, 0, -0.1, 0.3, head); 
            createBox(0.05, 0.05, 0.05, 0x000000, 0, 0, 0.46, head);
            createBox(0.08, 0.08, 0.02, COLORS.eyeYellow, -0.1, 0.1, 0.21, head);
            createBox(0.08, 0.08, 0.02, COLORS.eyeYellow, 0.1, 0.1, 0.21, head);
            createBox(0.1, 0.15, 0.05, grey, -0.15, 0.25, 0, head);
            createBox(0.1, 0.15, 0.05, grey, 0.15, 0.25, 0, head);
            const tail = createBox(0.15, 0.15, 0.5, grey, 0, 0.7, -0.6, wolf); tail.name='Tail';
            wolf.scale.set(1.5, 1.5, 1.5);
            group.add(wolf);
        }
        
    } else { 
        if (models && models['PUNCH2']) {
            // Reduced scale from 2.5 to 2.4
            const model = normalizeModel(models['PUNCH2'], 2.4);
            
            // ADJUSTED Y: Lowered from -0.4 to -0.6
            model.position.y = -0.6; 
            
            model.rotation.y = 0; 
            
            model.traverse((child) => {
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

            group.add(model);
        } else {
            // Fallback: WESELTON GUARD
            const guard = new THREE.Group(); guard.name = 'Guard';
            const red = COLORS.guardRed;
            const black = 0x111111;
            const skin = 0xFFCCAA;
            const lLeg = createBox(0.25, 0.8, 0.25, black, -0.2, 0.4, 0, guard); lLeg.name='L_Leg';
            const rLeg = createBox(0.25, 0.8, 0.25, black, 0.2, 0.4, 0, guard); rLeg.name='R_Leg';
            const torso = new THREE.Group(); torso.name='Torso'; torso.position.set(0, 0.8, 0); guard.add(torso);
            createBox(0.6, 0.8, 0.35, red, 0, 0.4, 0, torso);
            const lArm = createBox(0.2, 0.7, 0.2, red, -0.4, 0.5, 0.2, torso); lArm.name='L_Arm'; lArm.rotation.x = -1.5;
            const rArm = createBox(0.2, 0.7, 0.2, red, 0.4, 0.5, 0.2, torso); rArm.name='R_Arm'; rArm.rotation.x = -1.5;
            const bow = new THREE.Group(); bow.position.set(0, 0.5, 0.6); torso.add(bow);
            createBox(0.8, 0.1, 0.1, 0x5D4037, 0, 0, 0, bow);
            createBox(0.1, 0.1, 0.6, 0x333333, 0, 0, -0.3, bow);
            const head = new THREE.Group(); head.name='Head'; head.position.set(0, 1.3, 0); guard.add(head);
            createBox(0.4, 0.45, 0.4, skin, 0, 0.225, 0, head);
            createBox(0.45, 0.2, 0.45, COLORS.guardSilver, 0, 0.4, 0, head);
            createBox(0.1, 0.2, 0.1, COLORS.guardSilver, 0, 0.55, 0, head);
            guard.scale.set(1.5, 1.5, 1.5);
            guard.rotation.y = Math.PI; 
            group.add(guard);
        }
    }
    
    castShadows(group);
    return group;
};

export const createFlyingObstacle = (models?: Record<string, THREE.Group>) => {
    const group = new THREE.Group();
    
    // REPLACED: White Winter Bat (High Quality Voxel)
    const bat = new THREE.Group(); 
    bat.name = 'WinterBat'; 
    
    // Elevate
    bat.position.y = 2.5;

    const furWhite = 0xFFFAFA;
    const furGrey = 0xEEEEEE;
    const eyeRed = 0xFF0000;
    const wingMembrane = 0xF0F8FF;

    // Body (Small, Fuzzy)
    createBox(0.4, 0.5, 0.3, furWhite, 0, 0, 0, bat);
    createBox(0.3, 0.4, 0.25, furGrey, 0, -0.1, 0.1, bat); // Chest

    // Head
    const head = new THREE.Group();
    head.position.set(0, 0.35, 0.1);
    bat.add(head);
    createBox(0.35, 0.3, 0.35, furWhite, 0, 0, 0, head);
    
    // Ears (Large, pointed)
    createBox(0.1, 0.3, 0.05, furWhite, -0.15, 0.25, 0, head);
    createBox(0.1, 0.3, 0.05, furWhite, 0.15, 0.25, 0, head);

    // Eyes (Glowing Red)
    const lEye = createBox(0.08, 0.08, 0.02, eyeRed, -0.1, 0.0, 0.18, head);
    (lEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeRed);
    (lEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;

    const rEye = createBox(0.08, 0.08, 0.02, eyeRed, 0.1, 0.0, 0.18, head);
    (rEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeRed);
    (rEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;

    // Fangs
    createBox(0.02, 0.08, 0.02, 0xFFFFFF, -0.05, -0.15, 0.18, head);
    createBox(0.02, 0.08, 0.02, 0xFFFFFF, 0.05, -0.15, 0.18, head);

    // Wings (Large, animated parts)
    const createWing = (isLeft: boolean) => {
        const w = new THREE.Group();
        const dir = isLeft ? 1 : -1;
        
        // Pivot at shoulder
        w.position.set(dir * 0.2, 0.1, 0); 
        
        // ADJUSTED: Rotate 90 degrees to be horizontal to the ground
        w.rotation.x = Math.PI / 2;

        // Bone Structure (Arm)
        createBox(0.8, 0.05, 0.05, furGrey, dir * 0.4, 0, 0, w); // Humerus
        createBox(0.8, 0.05, 0.05, furGrey, dir * 1.1, 0.2, 0, w).rotation.z = dir * 0.3; // Forearm
        
        // Fingers
        const fingerRootX = dir * 1.5;
        const fingerRootY = 0.4;
        createBox(0.03, 0.8, 0.03, furGrey, fingerRootX, fingerRootY - 0.4, 0, w).rotation.z = dir * -0.1;
        createBox(0.03, 0.7, 0.03, furGrey, fingerRootX + (dir*0.3), fingerRootY - 0.35, 0, w).rotation.z = dir * -0.4;
        
        // Membrane
        // Main panel
        createBox(1.2, 0.6, 0.02, wingMembrane, dir * 0.8, -0.1, 0, w);
        // Tip panel
        createBox(0.8, 0.5, 0.02, wingMembrane, dir * 1.6, 0.1, 0, w).rotation.z = dir * 0.3;

        return w;
    };

    const lWing = createWing(true); lWing.name = 'WingL'; bat.add(lWing);
    const rWing = createWing(false); rWing.name = 'WingR'; bat.add(rWing);

    // Feet (Small claws)
    createBox(0.05, 0.15, 0.05, 0x333333, -0.1, -0.3, 0, bat);
    createBox(0.05, 0.15, 0.05, 0x333333, 0.1, -0.3, 0, bat);

    group.add(bat);
    castShadows(group);
    return group;
};
