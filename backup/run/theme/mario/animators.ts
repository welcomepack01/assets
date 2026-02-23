

import * as THREE from 'three';
import { Obstacle, ThemeAnimators } from '../../gameTypes';

export const MarioAnimators: ThemeAnimators = {
    animateObstacle: (obstacle: Obstacle, elapsedTime: number, delta: number) => {
        const type = obstacle.data.type; 
        const group = obstacle.mesh;
        const phase = elapsedTime;

        if (type === 'jump') {
            // Pipe: No animation
        } else if (type === 'big_jump') {
            // Spiked Wall: Move up/down
            const movingWall = group.getObjectByName('movingWall');
            if(movingWall) {
                // Amplitude 2.5, Speed 2
                movingWall.position.y = Math.sin(phase * 2) * 2.5;
            }
        } else if (type === 'duck') {
            // Brick/Q Blocks: No animation
        } else if (type === 'dodge') {
            // Toad/Luigi: Idle Animation
            // Arms swing slightly
            const lArm = group.getObjectByName('L_Arm');
            const rArm = group.getObjectByName('R_Arm');
            if (lArm && rArm) {
                lArm.rotation.x = Math.sin(phase * 5) * 0.5;
                rArm.rotation.x = -Math.sin(phase * 5) * 0.5;
            }
        } else if (type === 'punch') {
            // Piranha Plant (Biting) or Koopa (Walking)
            // Check for specific parts to identify variant
            const jawTop = group.getObjectByName('JawTop');
            if (jawTop) {
                // Piranha Plant
                // Biting
                const jawBottom = group.getObjectByName('JawBottom');
                const lFore = group.getObjectByName('L_Fore');
                const rFore = group.getObjectByName('R_Fore');
                
                const bite = (Math.sin(phase * 10) + 1) * 0.5; // 0 to 1
                jawTop.rotation.x = -bite * 0.5;
                if(jawBottom) jawBottom.rotation.x = bite * 0.5;

                // Leaves waving
                if(lFore) lFore.rotation.z = Math.sin(phase * 3) * 0.3;
                if(rFore) rFore.rotation.z = -Math.sin(phase * 3) * 0.3;
            } else {
                // Koopa Troopa (Walking)
                const lLeg = group.getObjectByName('L_Leg');
                const rLeg = group.getObjectByName('R_Leg');
                const lArm = group.getObjectByName('L_Arm');
                const rArm = group.getObjectByName('R_Arm');
                
                if (lLeg && rLeg) {
                    lLeg.rotation.x = Math.sin(phase * 10) * 0.8;
                    rLeg.rotation.x = -Math.sin(phase * 10) * 0.8;
                }
                if (lArm && rArm) {
                    lArm.rotation.x = -Math.sin(phase * 10) * 0.8;
                    rArm.rotation.x = Math.sin(phase * 10) * 0.8;
                }
            }
        } else if (type === 'jump_punch') { // Flying Obstacle (Paratroopa)
            // Bobbing up and down
            const inner = group.getObjectByName('floatingSmooth');
            if (inner) {
                inner.position.y = Math.sin(phase * 3) * 0.5;
                
                // Wings flapping
                const lWing = inner.getObjectByName('L_Wing');
                const rWing = inner.getObjectByName('R_Wing');
                if (lWing && rWing) {
                    lWing.rotation.z = Math.sin(phase * 15) * 0.5;
                    rWing.rotation.z = -Math.sin(phase * 15) * 0.5;
                }
            }
        }
    },
    animateBoss: (boss: Obstacle, elapsedTime: number, delta: number, currentPhase: number) => {
        // No motion as requested
    },
    animateBackgroundObject: (obj: THREE.Object3D, elapsedTime: number, delta: number) => {
        // Floating effect for environment objects
        obj.position.y += Math.sin(elapsedTime * 2 + obj.id) * 0.01;
    }
};
