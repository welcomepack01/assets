
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
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
};

export const createCylinder = (rt: number, rb: number, h: number, color: number, x: number, y: number, z: number, parent: THREE.Object3D) => {
    const mat = new THREE.MeshStandardMaterial({ color });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 32), mat);
    m.position.set(x,y,z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
};
