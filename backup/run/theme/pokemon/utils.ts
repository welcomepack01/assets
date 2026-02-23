
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

export const createVoxelEyes = (head: THREE.Group, xOffset: number, yOffset: number, zOffset: number, isVillain: boolean) => {
    const pupilColor = isVillain ? 0xFF0000 : 0x111111;
    const scleraColor = 0xFFFFFF;
    
    // Left Eye
    createBox(0.15, 0.15, 0.05, scleraColor, -xOffset, yOffset, zOffset, head);
    createBox(0.05, 0.05, 0.06, pupilColor, -xOffset, yOffset, zOffset + 0.01, head);
    // Eyebrow (Angry for villain)
    if (isVillain) {
        const brow = createBox(0.18, 0.04, 0.06, 0x111111, -xOffset, yOffset + 0.1, zOffset + 0.01, head);
        brow.rotation.z = -0.3;
    }

    // Right Eye
    createBox(0.15, 0.15, 0.05, scleraColor, xOffset, yOffset, zOffset, head);
    createBox(0.05, 0.05, 0.06, pupilColor, xOffset, yOffset, zOffset + 0.01, head);
    if (isVillain) {
        const brow = createBox(0.18, 0.04, 0.06, 0x111111, xOffset, yOffset + 0.1, zOffset + 0.01, head);
        brow.rotation.z = 0.3;
    }
};
