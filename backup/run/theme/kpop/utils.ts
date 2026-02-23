
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

// NEW: Normalize GLB Model (Fix Scale, Center, Play Random Animation)
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
    // Access animations from the original scene's userData (set during loading)
    const animations = originalScene.userData.animations as THREE.AnimationClip[];
    
    if (animations && animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        
        // Pick one animation randomly or the first one
        const clip = animations[0]; // Default to first animation
        
        // Play the action
        const action = mixer.clipAction(clip);
        action.play();
        
        // Randomize start time to desync multiple instances
        action.time = Math.random() * clip.duration;
        
        // Store mixer in userData so the Animator can update it
        wrapper.userData.mixer = mixer;
    }

    castShadows(wrapper);

    return wrapper;
};
