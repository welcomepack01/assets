
import * as THREE from 'three';

export const castShadows = (group: THREE.Group | THREE.Mesh) => {
    group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });
};

export const createBox = (w: number, h: number, d: number, color: number, x: number, y: number, z: number, parent: THREE.Object3D) => {
    const mat = new THREE.MeshStandardMaterial({ color });
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true;
    parent.add(m);
    return m;
};

// Helper for Toilet Construction
export const createToiletShape = (parent: THREE.Object3D, scale: number = 1.0) => {
    const group = new THREE.Group();
    // Base
    createBox(0.5, 0.4, 0.6, 0xFFFFFF, 0, 0.2, 0, group);
    // Bowl
    createBox(0.7, 0.4, 0.8, 0xFFFFFF, 0, 0.6, 0.1, group);
    // Tank
    createBox(0.8, 0.8, 0.3, 0xFFFFFF, 0, 0.8, -0.4, group);
    // Flush Handle
    createBox(0.15, 0.05, 0.05, 0xCCCCCC, 0.3, 1.1, -0.24, group);
    
    group.scale.set(scale, scale, scale);
    parent.add(group);
    return group;
};

// Helper for Head Construction
export const createHead = (parent: THREE.Object3D, yPos: number, zPos: number, isAngry: boolean = false, skinColor: number = 0xE0AC69) => {
    const head = new THREE.Group();
    head.name = 'Head';
    head.position.set(0, yPos, zPos);
    
    // Main Head
    createBox(0.5, 0.6, 0.5, skinColor, 0, 0.3, 0, head);
    
    // Eyes
    const eyeColor = 0xFFFFFF;
    const pupilColor = 0x000000;
    createBox(0.12, 0.08, 0.02, eyeColor, -0.12, 0.35, 0.26, head);
    createBox(0.04, 0.04, 0.03, pupilColor, -0.12, 0.35, 0.27, head);
    createBox(0.12, 0.08, 0.02, eyeColor, 0.12, 0.35, 0.26, head);
    createBox(0.04, 0.04, 0.03, pupilColor, 0.12, 0.35, 0.27, head);
    
    // Mouth (Smile or Angry Open)
    if (isAngry) {
        createBox(0.2, 0.15, 0.02, 0x550000, 0, 0.15, 0.26, head); // Open mouth
        createBox(0.25, 0.05, 0.03, 0x3E2723, 0, 0.45, 0.26, head).rotation.z = -0.1; // Angry Brow L
        createBox(0.25, 0.05, 0.03, 0x3E2723, 0, 0.45, 0.26, head).rotation.z = 0.1; // Angry Brow R
    } else {
        createBox(0.2, 0.05, 0.02, 0x8B4513, 0, 0.15, 0.26, head); // Smile
    }

    parent.add(head);
    return head;
};
