
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

export const createJumpObstacle = () => {
    const group = new THREE.Group();
    const ballColors = [COLORS.pokeballRed, 0xFFFF00, 0x2196F3];
    const createPokeball = (x: number) => {
        const ball = new THREE.Group(); ball.name = 'Pokeball';
        const size = 0.8;
        const topColor = ballColors[Math.floor(Math.random() * ballColors.length)];
        createBox(size, size/2, size, COLORS.pokeballWhite, 0, -size/4, 0, ball);
        createBox(size, size/2, size, topColor, 0, size/4, 0, ball);
        createBox(size+0.05, 0.1, size+0.05, COLORS.pokeballBlack, 0, 0, 0, ball);
        createBox(0.2, 0.2, 0.1, COLORS.pokeballWhite, 0, 0, size/2+0.05, ball);
        ball.position.set(x, 0.45, 0);
        return ball;
    };
    [-4.5, -3, -1.5, 0, 1.5, 3, 4.5].forEach(x => group.add(createPokeball(x)));
    castShadows(group); return group;
};

export const createCrouchObstacle = (heightScale) => {
    const group = new THREE.Group();
    const colors = [0xFF1493, 0xFFFF00, 0x00FF00, 0x00BFFF, 0xFF4500];
    const createSpearow = (x: number, index: number) => {
        const bird = new THREE.Group(); bird.name = 'Spearow';
        const baseColor = colors[index % colors.length];
        createBox(0.6, 0.4, 0.6, baseColor, 0, 0, 0, bird);
        const head = new THREE.Group(); head.position.set(0, 0.3, 0.3); bird.add(head);
        createBox(0.4, 0.4, 0.4, baseColor, 0, 0, 0, head);
        createBox(0.2, 0.1, 0.3, 0xFFC0CB, 0, 0, 0.3, head); 
        createBox(0.08, 0.08, 0.02, 0xFFFFFF, -0.1, 0.1, 0.21, head); 
        createBox(0.03, 0.03, 0.02, 0x000000, -0.1, 0.1, 0.22, head); 
        createBox(0.08, 0.08, 0.02, 0xFFFFFF, 0.1, 0.1, 0.21, head); 
        createBox(0.03, 0.03, 0.02, 0x000000, 0.1, 0.1, 0.22, head); 
        
        const lWingGroup = new THREE.Group(); lWingGroup.name = 'LWing';
        lWingGroup.position.set(-0.3, 0.1, 0); 
        // Extended Wing 10%: Width 1.2 -> 1.32, Offset -0.6 -> -0.66
        createBox(1.32, 0.1, 0.5, 0xEECFA1, -0.66, 0, 0, lWingGroup); 
        bird.add(lWingGroup);
        
        const rWingGroup = new THREE.Group(); rWingGroup.name = 'RWing';
        rWingGroup.position.set(0.3, 0.1, 0); 
        // Extended Wing 10%: Width 1.2 -> 1.32, Offset 0.6 -> 0.66
        createBox(1.32, 0.1, 0.5, 0xEECFA1, 0.66, 0, 0, rWingGroup); 
        bird.add(rWingGroup);
        
        bird.position.set(x, 2.5, 0);
        return bird;
    };
    [-4, 0, 4].forEach((x, i) => group.add(createSpearow(x, i)));
    castShadows(group); return group;
};

export const createBigJumpObstacle = () => {
    const group = new THREE.Group();
    const wallGroup = new THREE.Group(); wallGroup.name = 'MovingWall';
    const brickColor = 0xCCCCCC; 
    const mortarColor = 0x555555; 
    const yOffset = -2.0;
    createBox(14.0, 3.75, 1.0, mortarColor, 0, 1.875 + yOffset, -2.5, wallGroup);
    for(let y=0; y<8; y++) {
        for(let x=-6; x<=6; x+=1.2) {
            const xOff = (y % 2 === 0) ? 0 : 0.6;
            createBox(1.0, 0.4, 1.1, brickColor, x + xOff, (y * 0.5 + 0.25) + yOffset, -2.5, wallGroup);
        }
    }
    for(let x=-6; x<=6; x+=1.5) {
        const spikeGeo = new THREE.ConeGeometry(0.25, 1.0, 4);
        const spikeMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(x, 4.25 + yOffset, -2.5); 
        spike.castShadow = true;
        wallGroup.add(spike);
    }
    group.add(wallGroup);

    const createSnorlax = (xOffset: number) => {
        const snorlax = new THREE.Group(); snorlax.name = 'Snorlax';
        createBox(4.5, 4.0, 3.0, COLORS.snorlaxTeal, 0, 2.0, 0, snorlax); 
        createBox(3.8, 3.2, 0.2, COLORS.snorlaxCream, 0, 1.8, 1.6, snorlax); 
        const head = new THREE.Group(); head.name = 'Head'; head.position.set(0, 4.0, 0); 
        snorlax.add(head);
        createBox(2.4, 1.6, 2.0, COLORS.snorlaxTeal, 0, 0.8, 0, head);
        createBox(2.0, 1.1, 0.2, COLORS.snorlaxCream, 0, 0.6, 1.05, head);
        createBox(0.7, 0.6, 0.5, COLORS.snorlaxTeal, -1.0, 1.5, 0, head);
        createBox(0.7, 0.6, 0.5, COLORS.snorlaxTeal, 1.0, 1.5, 0, head);
        createBox(0.6, 0.06, 0.05, 0x111111, -0.6, 0.6, 1.16, head);
        createBox(0.6, 0.06, 0.05, 0x111111, 0.6, 0.6, 1.16, head);
        createBox(0.6, 0.06, 0.05, 0x111111, 0, 0.3, 1.16, head);
        createBox(0.12, 0.14, 0.05, 0xFFFFFF, -0.25, 0.35, 1.18, head);
        createBox(0.12, 0.14, 0.05, 0xFFFFFF, 0.25, 0.35, 1.18, head);
        const lArm = createBox(1.2, 1.8, 1.2, COLORS.snorlaxTeal, -2.8, 2.5, 0.5, snorlax); 
        lArm.name = 'L_Arm'; lArm.rotation.z = 0.4;
        const rArm = createBox(1.2, 1.8, 1.2, COLORS.snorlaxTeal, 2.8, 2.5, 0.5, snorlax); 
        rArm.name = 'R_Arm'; rArm.rotation.z = -0.4;
        createBox(1.6, 0.8, 1.6, COLORS.snorlaxCream, -2.0, 0.4, 1.5, snorlax);
        createBox(1.6, 0.8, 1.6, COLORS.snorlaxCream, 2.0, 0.4, 1.5, snorlax);
        for(let i=-1; i<=1; i++) {
            createBox(0.3, 0.3, 0.2, 0xFFFFFF, -2.0 + i*0.45, 0.4, 2.35, snorlax);
            createBox(0.3, 0.3, 0.2, 0xFFFFFF, 2.0 + i*0.45, 0.4, 2.35, snorlax);
        }
        snorlax.scale.set(0.64, 0.64, 0.64); 
        snorlax.position.set(xOffset, 0, 0.5);
        return snorlax;
    };
    group.add(createSnorlax(0));
    castShadows(group); return group;
};
