
import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

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

// Animal Head Helper
export const createAnimalHead = (parent: THREE.Object3D, yPos: number, color: number, snoutColor: number, earType: 'cat'|'round'|'long') => {
    const head = new THREE.Group();
    head.position.y = yPos;
    
    // Main Head
    createBox(0.6, 0.5, 0.6, color, 0, 0, 0, head);
    
    // Snout
    createBox(0.3, 0.25, 0.3, snoutColor, 0, -0.1, 0.4, head);
    createBox(0.1, 0.08, 0.05, 0x111111, 0, 0.05, 0.55, head); // Nose tip
    
    // Eyes
    createBox(0.15, 0.15, 0.05, 0xFFFFFF, -0.15, 0.1, 0.31, head);
    createBox(0.05, 0.05, 0.06, 0x000000, -0.15, 0.1, 0.31, head);
    createBox(0.15, 0.15, 0.05, 0xFFFFFF, 0.15, 0.1, 0.31, head);
    createBox(0.05, 0.05, 0.06, 0x000000, 0.15, 0.1, 0.31, head);
    
    // Ears
    if (earType === 'cat') {
        createBox(0.15, 0.25, 0.1, color, -0.25, 0.35, 0, head);
        createBox(0.15, 0.25, 0.1, color, 0.25, 0.35, 0, head);
    } else if (earType === 'long') {
        createBox(0.12, 0.5, 0.1, color, -0.2, 0.5, -0.1, head).rotation.z = 0.2;
        createBox(0.12, 0.5, 0.1, color, 0.2, 0.5, -0.1, head).rotation.z = -0.2;
    } else { // Round
        createBox(0.2, 0.2, 0.1, color, -0.35, 0.2, 0, head);
        createBox(0.2, 0.2, 0.1, color, 0.35, 0.2, 0, head);
    }
    
    parent.add(head);
    return head;
};

// Normalize GLB Model (Fix Scale, Center, Play Random Animation)
export const normalizeModel = (originalScene: THREE.Group, targetHeight: number): THREE.Group => {
    const wrapper = new THREE.Group();
    
    // Use SkeletonUtils to clone properly (maintaining bone structure for animations)
    const model = SkeletonUtils.clone(originalScene) as THREE.Group;
    
    // 1. Calculate Bounding Box
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // 2. Centering Logic
    // Reset position to center bottom at (0,0,0)
    model.position.x = -center.x;
    model.position.y = -box.min.y;
    model.position.z = -center.z;

    wrapper.add(model);

    // 3. Scaling Logic
    const currentHeight = size.y || 1; 
    const scale = targetHeight / currentHeight;
    wrapper.scale.set(scale, scale, scale);
    
    // 4. Animation Logic
    const animations = originalScene.userData.animations as THREE.AnimationClip[];
    
    if (animations && animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        
        // Randomly select an animation clip
        const randomClipIndex = Math.floor(Math.random() * animations.length);
        const clip = animations[randomClipIndex]; 
        
        const action = mixer.clipAction(clip);
        action.play();
        action.time = Math.random() * clip.duration;
        wrapper.userData.mixer = mixer;
    }

    castShadows(wrapper);

    return wrapper;
};
