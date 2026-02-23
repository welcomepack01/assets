
import * as THREE from 'three';
import { createBox, castShadows, normalizeModel } from '../utils';
import { COLORS } from '../constants';

// Helper to fix material properties for GLB models
const fixMaterial = (mat: THREE.Material) => {
    if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshBasicMaterial || mat instanceof THREE.MeshPhongMaterial) {
        if (mat.map) {
            // REDUCED BRIGHTNESS: 0xFFFFFF -> 0xBBBBBB
            // This darkens the base color, preventing the texture from looking washed out/too bright,
            // effectively increasing perceived saturation.
            mat.color.setHex(0xBBBBBB); 
            mat.map.colorSpace = THREE.SRGBColorSpace;
        } else {
            const isDark = mat.color.r < 0.2 && mat.color.g < 0.2 && mat.color.b < 0.2;
            if (isDark && mat instanceof THREE.MeshStandardMaterial) {
                mat.emissive.setHex(0x222222); 
            }
        }
        if ('roughness' in mat) mat.roughness = 0.8;
        if ('metalness' in mat) mat.metalness = 0.1;
        if ('emissive' in mat && !mat.map) (mat as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
        
        mat.transparent = false;
        mat.alphaTest = 0; 
        mat.opacity = 1.0;
        mat.side = THREE.DoubleSide; 
        mat.depthWrite = true; 
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

export const createDodgeObstacle = (variant: 'A' | 'B' | 'C', models?: Record<string, THREE.Group>) => {
    const group = new THREE.Group();
    
    // --- VARIANT A: DODGE1 MODEL (e.g., Cat/Fox) ---
    if (variant === 'A') { 
        if (models && models['DODGE1']) {
            // SCALED DOWN ADDITIONAL 15% (0.04536 -> 0.038556)
            const model = normalizeModel(models['DODGE1'], 0.038556); 
            model.position.y = 0.0; // Raised by 0.1 (was -0.1)
            // ROTATED 180 DEGREES TO FACE PLAYER
            model.rotation.y = Math.PI; 
            applyMaterialFixToModel(model);
            group.add(model);
        } else {
            // Fallback Voxel Box
            createBox(1, 1, 1, 0xFF0000, 0, 0.5, 0, group);
        }
    } 
    // --- VARIANT B: DODGE2 MODEL (e.g., Rabbit) ---
    else if (variant === 'B') { 
        if (models && models['DODGE2']) {
            // SCALED DOWN ADDITIONAL 15% (0.09184 -> 0.078064)
            const model = normalizeModel(models['DODGE2'], 0.078064); 
            model.position.y = -0.1;
            model.rotation.y = 0; // Face player
            applyMaterialFixToModel(model);
            group.add(model);
        } else {
            // Fallback Voxel Box
            createBox(1, 1, 1, 0x00FF00, 0, 0.5, 0, group);
        }
    } 
    // --- VARIANT C: DODGE3 MODEL (e.g., Rhino/Big Guy) ---
    else if (variant === 'C') {
        if (models && models['DODGE3']) {
            // SCALED DOWN ADDITIONAL 15% (0.0784 -> 0.06664)
            const model = normalizeModel(models['DODGE3'], 0.06664); 
            model.position.y = -0.1;
            model.rotation.y = 0; // Face player
            applyMaterialFixToModel(model);
            group.add(model);
        } else {
            // Fallback Voxel Box
            createBox(1.5, 1.5, 1.5, 0x0000FF, 0, 0.75, 0, group);
        }
    }
    
    castShadows(group);
    return group;
};

export const createPunchObstacle = (variant: 'weak' | 'strong', models?: Record<string, THREE.Group>) => {
    const group = new THREE.Group();
    
    // --- WEAK: PUNCH1 MODEL ---
    if (variant === 'weak') { 
        if (models && models['PUNCH1']) {
            // SCALED DOWN ADDITIONAL 15% (0.04736 -> 0.040256)
            const model = normalizeModel(models['PUNCH1'], 0.040256);
            model.position.y = 0.1; // Raised by 0.1 (was 0.0)
            model.rotation.y = 0; // Face player
            applyMaterialFixToModel(model);
            group.add(model);
        } else {
            // Fallback
            createBox(0.8, 1.25, 0.8, 0xFFA500, 0, 0.6, 0, group);
        }
    } 
    // --- STRONG: PUNCH2 MODEL ---
    else { 
        if (models && models['PUNCH2']) {
            // SCALED DOWN ADDITIONAL 15% (0.06272 -> 0.053312)
            const model = normalizeModel(models['PUNCH2'], 0.053312);
            model.position.y = -0.1; 
            model.rotation.y = 0; // Face player
            applyMaterialFixToModel(model);
            group.add(model);
        } else {
            // Fallback
            createBox(1.0, 2.2, 1.0, 0x800080, 0, 1.1, 0, group);
        }
    }
    
    castShadows(group);
    return group;
};

// --- FLYING OBSTACLE: ZPD DRONE (VOXEL ONLY - NO GLB) ---
export const createFlyingObstacle = (models?: Record<string, THREE.Group>) => {
    const group = new THREE.Group();
    const drone = new THREE.Group(); 
    drone.name = 'Drone'; // Identifier for animator
    
    // Position High
    drone.position.y = 3.2;

    const darkMetal = 0x223344; // Navy Blue tint
    const lightMetal = 0x8899AA;
    const policeBlue = 0x0000AA;
    const sirenRed = 0xFF0000;
    const sirenBlue = 0x0000FF;
    const bladeColor = 0x111111;

    // 1. Central Body Hub
    createBox(0.6, 0.3, 0.6, darkMetal, 0, 0, 0, drone);
    createBox(0.5, 0.2, 0.5, policeBlue, 0, 0.2, 0, drone); // Top cap
    
    // ZPD Badge (Gold)
    createBox(0.3, 0.05, 0.3, 0xFFD700, 0, 0.3, 0, drone);

    // 2. Arms (X Configuration)
    const armL = 1.8;
    const armW = 0.15;
    
    const arm1 = createBox(armL, 0.1, armW, lightMetal, 0, 0, 0, drone);
    arm1.rotation.y = Math.PI / 4; // 45 deg
    
    const arm2 = createBox(armL, 0.1, armW, lightMetal, 0, 0, 0, drone);
    arm2.rotation.y = -Math.PI / 4; // -45 deg

    // 3. Propellers (4 Rotors)
    const createRotor = (x: number, z: number, isCW: boolean) => {
        const rGroup = new THREE.Group();
        rGroup.position.set(x, 0.1, z);
        
        // Motor housing
        createBox(0.2, 0.2, 0.2, darkMetal, 0, 0, 0, rGroup);
        
        // Blade Group (to spin)
        const bladeGroup = new THREE.Group();
        bladeGroup.name = 'Propeller';
        bladeGroup.position.y = 0.15;
        
        // 2 Cross Blades
        createBox(1.2, 0.02, 0.1, bladeColor, 0, 0, 0, bladeGroup);
        createBox(0.1, 0.02, 1.2, bladeColor, 0, 0, 0, bladeGroup);
        
        // Blade Guards (Rings) - Torus
        const guardGeo = new THREE.TorusGeometry(0.65, 0.02, 8, 16);
        const guardMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const guard = new THREE.Mesh(guardGeo, guardMat);
        guard.rotation.x = Math.PI / 2;
        rGroup.add(guard);

        rGroup.add(bladeGroup);
        return rGroup;
    };

    // Positions based on 45 deg arms at 0.7 radius (approx 0.5, 0.5)
    drone.add(createRotor(0.5, 0.5, true));
    drone.add(createRotor(-0.5, 0.5, false));
    drone.add(createRotor(0.5, -0.5, false));
    drone.add(createRotor(-0.5, -0.5, true));

    // 4. Underside Camera
    const camGroup = new THREE.Group();
    camGroup.position.set(0, -0.2, 0.2);
    drone.add(camGroup);
    createBox(0.3, 0.3, 0.4, 0x111111, 0, 0, 0, camGroup); // Body
    createBox(0.2, 0.2, 0.1, 0x00FFFF, 0, 0, 0.25, camGroup); // Lens
    (camGroup.children[1] as THREE.Mesh).material = new THREE.MeshStandardMaterial({ 
        color: 0x00FFFF, emissive: 0x00FFFF, emissiveIntensity: 1.0 
    });

    // 5. Siren Lights (Under arms)
    const addSiren = (x: number, z: number, color: number, name: string) => {
        const s = createBox(0.15, 0.1, 0.15, color, x, -0.1, z, drone);
        s.name = name;
        (s.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(color);
        return s;
    };
    addSiren(-0.3, 0, sirenRed, 'SirenRed');
    addSiren(0.3, 0, sirenBlue, 'SirenBlue');

    group.add(drone);
    castShadows(group);
    return group;
};
