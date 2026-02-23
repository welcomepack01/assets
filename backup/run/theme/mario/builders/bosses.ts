

import * as THREE from 'three';
import { TextureMap } from '../../../gameTypes';

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D map;
uniform float threshold;
varying vec2 vUv;
void main() {
    vec4 texColor = texture2D(map, vUv);
    float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    if (luminance < threshold) discard;
    gl_FragColor = texColor;
}
`;

export const createBossMesh = (type: string, models?: Record<string, THREE.Group>, textures?: TextureMap): THREE.Group => {
    const group = new THREE.Group();
    
    let tex: THREE.Texture | undefined;
    let width = 7.1;
    let height = 4.0;
    let yPos = 2.0;
    let threshold = 0.1;

    if (textures) {
        if (type === 'boss1') {
            tex = textures.boss1_video;
            // 100% larger (2x), lower by 0.8 total (was 0.5, now +0.3 down)
            width = 14.2;
            height = 8.0;
            yPos = 3.2; 
            threshold = 0.04;
        } else if (type === 'boss2') {
            tex = textures.boss2_video;
            // 50% smaller (0.5x), lower by 0.5
            width = 3.55;
            height = 2.0;
            yPos = 0.5; 
        } else if (type === 'boss3') {
            tex = textures.boss3_video;
            // 50% smaller (0.5x), lower by 0.4 total (was 0.5, now +0.1 up)
            width = 3.55;
            height = 2.0;
            yPos = 0.6; 
            threshold = 0.02;
        } else if (type === 'boss4') {
            tex = textures.boss4_video;
            // 20% smaller (0.8x), lower by 0.9 total (was 0.7, now +0.2 down)
            width = 5.68;
            height = 3.2;
            yPos = 0.7; 
        }
    }

    // Visual Mesh (Plane with Chroma Key Shader)
    let mat: THREE.Material;
    if (tex) {
        mat = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: tex },
                threshold: { value: threshold }
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
    } else {
        mat = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    }

    const visualGeo = new THREE.PlaneGeometry(width, height);
    const visualMesh = new THREE.Mesh(visualGeo, mat);
    visualMesh.position.set(0, yPos, 0);
    // Note: castShadow/receiveShadow will be set by SceneBuilder, 
    // but shadow shape will be square unless customDepthMaterial is added.
    group.add(visualMesh);

    // Collision Mesh (Invisible Box)
    // Needed because Plane has 0 depth, which can cause issues with collision logic (expandByScalar)
    const collisionGeo = new THREE.BoxGeometry(width * 0.7, height, 2); // Slightly narrower collision
    const collisionMesh = new THREE.Mesh(collisionGeo, new THREE.MeshBasicMaterial({ visible: false }));
    collisionMesh.position.set(0, yPos, 0);
    group.add(collisionMesh);
    
    return group;
};
