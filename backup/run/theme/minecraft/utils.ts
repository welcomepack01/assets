
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

// Helper for Pixelated Face
export const createPixelFace = (head: THREE.Group, zOffset: number) => {
    // Eyes (Black)
    createBox(0.1, 0.1, 0.05, 0x000000, -0.2, 0.1, zOffset, head);
    createBox(0.1, 0.1, 0.05, 0x000000, 0.2, 0.1, zOffset, head);
    // Mouth (Black)
    createBox(0.4, 0.1, 0.05, 0x000000, 0, -0.2, zOffset, head);
};
