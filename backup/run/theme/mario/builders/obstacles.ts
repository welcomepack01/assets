

import * as THREE from 'three';
import { COLORS } from '../constants';
import { createBox, castShadows } from '../utils';
import { generateTextures } from './environment';

export const createJumpObstacle = (models?: Record<string, THREE.Group>, phase?: number, variant?: string): THREE.Group => {
    const group = new THREE.Group();
    const pipeMat = new THREE.MeshStandardMaterial({ color: COLORS.green, roughness: 0.3 });
    const blackMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const h = 1.0; 
    for(let x=-6.0; x<=6.0; x+=1.5) {
        const pipe = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, h, 16), pipeMat);
        body.position.y = h/2; pipe.add(body);
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.5, 16), pipeMat);
        rim.position.y = h; pipe.add(rim);
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16), blackMat);
        hole.position.y = h + 0.26; pipe.add(hole);
        pipe.position.set(x, 0, 0);
        castShadows(pipe);
        group.add(pipe);
    }
    return group;
};

export const createBigJumpObstacle = (models?: Record<string, THREE.Group>, phase?: number, variant?: string): THREE.Group => {
    const group = new THREE.Group();
    const movingPart = new THREE.Group();
    movingPart.name = 'movingWall';
    group.add(movingPart);

    const C = {
        brick: 0x8B4513, // Brown
        spike: 0xC0C0C0, // Silver
        mortar: 0x000000 // Black lines
    };

    // Increased Height by 15% (Old H=8.0 -> New H=9.2)
    // Adjusted Y position to keep visual bottom roughly consistent while stretching up
    // Old Y = -3.0. New Y = -3.45.
    // Old Top = 1.0. New Top = 1.15.
    // Spikes moved up by 15% as well (1.1 -> 1.265)
    
    createBox(13, 9.2, 2, C.brick, 0, -3.45, 0, movingPart);

    // Decorative mortar lines (black strips) - Adjusted Y by 1.15
    createBox(13.1, 0.1, 2.1, C.mortar, 0, -1.61, 0, movingPart);
    createBox(13.1, 0.1, 2.1, C.mortar, 0, -0.46, 0, movingPart);
    createBox(13.1, 0.1, 2.1, C.mortar, 0, -3.91, 0, movingPart);
    createBox(13.1, 0.1, 2.1, C.mortar, 0, -6.21, 0, movingPart);

    // Spikes on Top - Scaled Position (1.1 * 1.15)
    const spikeGeo = new THREE.ConeGeometry(0.3, 0.8, 8);
    const spikeMat = new THREE.MeshStandardMaterial({ color: C.spike, metalness: 0.5, roughness: 0.2 });
    
    // Row of spikes on top
    for(let x=-6.0; x<=6.0; x+=1.2) {
        const s = new THREE.Mesh(spikeGeo, spikeMat);
        s.position.set(x, 1.265, 0); 
        s.castShadow = true;
        movingPart.add(s);
    }
    
    // Spikes on Front (facing player) - Scaled Position by 1.15
    // Upper row 
    for(let x=-6.0; x<=6.0; x+=1.5) {
        const s = new THREE.Mesh(spikeGeo, spikeMat);
        s.rotation.x = Math.PI / 2;
        s.position.set(x, -0.75, 1.0); 
        s.castShadow = true;
        movingPart.add(s);
    }
    // Lower row 
    for(let x=-6.0; x<=6.0; x+=1.5) {
        const s = new THREE.Mesh(spikeGeo, spikeMat);
        s.rotation.x = Math.PI / 2;
        s.position.set(x, -3.05, 1.0); 
        s.castShadow = true;
        movingPart.add(s);
    }

    castShadows(group);
    return group;
};

export const createCrouchObstacle = (heightScale: number, models?: Record<string, THREE.Group>, phase?: number, variant?: string): THREE.Group => {
    const group = new THREE.Group();
    const yPos = 2.5 * 1.15;
    const positions = [-6.25, -3.75, -1.25, 1.25, 3.75, 6.25];
    const textures = generateTextures();
    const brickMat = new THREE.MeshStandardMaterial({ map: textures.mario_brick_brown });
    const qMat = new THREE.MeshStandardMaterial({ map: textures.mario_q_box });
    positions.forEach((x, i) => {
        const isQ = i % 2 !== 0;
        const mat = isQ ? qMat : brickMat;
        const size = 1.8;
        const box = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), mat);
        box.position.set(x, yPos, 0);
        box.castShadow = true; box.receiveShadow = true;
        group.add(box);
    });
    return group; 
};
