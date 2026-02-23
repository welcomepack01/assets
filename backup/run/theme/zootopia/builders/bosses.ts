
import * as THREE from 'three';
import { createBox, castShadows, normalizeModel } from '../utils';
import { COLORS } from '../constants';
import { TextureMap } from '../../../gameTypes';

const PLANE_WIDTH = 9.0; // Reduced by 25% (was 12.0)
const PLANE_HEIGHT = 5.0625; // Reduced by 25% (was 6.75)

// --- CHROMA KEY SHADER MATERIAL ---
const createChromaVideoMaterial = (tex: THREE.Texture) => {
    return new THREE.ShaderMaterial({
        uniforms: {
            map: { value: tex },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D map;
            varying vec2 vUv;
            void main() {
                vec4 texColor = texture2D(map, vUv);
                
                // New Logic: Max Channel Keying
                // This preserves dark colors (like dark blue/red) better than luminance
                float maxChan = max(texColor.r, max(texColor.g, texColor.b));
                
                // Only pixels darker than 0.02 (almost pure black) become transparent
                // Threshold lowered significantly to prevent feet/dark clothes from disappearing
                // UPDATED: Increased to 0.12 to further reduce noise in black areas
                float alpha = smoothstep(0.01, 0.12, maxChan);
                
                gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.NormalBlending
    });
};

export const createBossMesh = (type: string, models?: Record<string, THREE.Group>, textures?: TextureMap) => {
    const group = new THREE.Group();
    
    // Generic Plane Creator with Scale support
    const addVideoPlane = (texKey: string, yOffset: number, scale: number = 1.0) => {
        if (textures && textures[texKey]) {
            const vidTex = textures[texKey];
            const material = createChromaVideoMaterial(vidTex);
            const plane = new THREE.Mesh(
                new THREE.PlaneGeometry(PLANE_WIDTH * scale, PLANE_HEIGHT * scale), 
                material
            );
            plane.name = 'VideoPlane';
            plane.position.y = yOffset;
            plane.rotation.set(0, 0, 0);
            group.add(plane);
            return true;
        }
        return false;
    };

    if (type === 'boss1') { 
        // BOSS 1: SNOOTLY'S VAN
        // PRIORITY: Use 3D Model if available
        if (models && models['BOSS1']) {
            // User requested additional 10% reduction (0.35 -> 0.315)
            const model = normalizeModel(models['BOSS1'], 0.315); 
            model.position.y = 0.5; // Raised by 0.2 (was 0.3)
            // Rotation might need adjustment depending on the GLB orientation
            // Standardizing to face player usually means rotating Y if default forward is +Z
            // Assuming model forward is +Z, rotate 180 (Math.PI) to face -Z (Camera)
            // But let's stick to standard no-rotation or check if it needs flip
            // model.rotation.y = Math.PI; 
            group.add(model);
        } else if (!addVideoPlane('boss1_video', 2.4, 0.75)) {
            // Fallback Voxel Box
            createBox(3.0, 2.0, 1.0, 0xFF0000, 0, 1.0, 0, group);
        }
    } else if (type === 'boss2') { 
        // BOSS 2: GARY THE SNAKE
        // UPDATED: Raised by 0.1 (1.8 -> 1.9)
        if (!addVideoPlane('boss2_video', 1.9, 0.75)) {
            createBox(1.0, 3.0, 1.0, 0x0000FF, 0, 1.5, 0, group);
        }
    } else if (type === 'boss3') { 
        // BOSS 3: ROBERT RINGSLEY
        // UPDATED: Lowered by 0.2 (2.7 -> 2.5)
        if (!addVideoPlane('boss3_video', 2.5)) {
            createBox(1.0, 2.0, 1.0, 0x555555, 0, 1.0, 0, group);
        }
    } else if (type === 'boss4') { 
        // BOSS 4: MILTON RINGSLEY
        // SCALED DOWN 20% from previous 0.7 -> 0.56
        // Lowered by 0.3 from previous 1.8 -> 1.5
        if (!addVideoPlane('boss4_video', 1.5, 0.56)) {
            createBox(2.0, 3.0, 2.0, 0xEEEEEE, 0, 1.5, 0, group);
        }
    }
    
    castShadows(group); return group;
};
