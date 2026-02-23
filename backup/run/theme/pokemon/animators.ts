
import * as THREE from 'three';
import { ThemeAnimators, Obstacle } from '../../gameTypes';

export const PokemonAnimators: ThemeAnimators = {
    animateObstacle: (obs: Obstacle, elapsedTime: number, delta: number) => {
        // Jump (Pokeball) - Reverse spin direction
        if (obs.data.action === 'jump') {
            obs.mesh.children.forEach((child, idx) => {
                if (child.name === 'Pokeball') {
                     child.rotation.x += delta * 8.0; 
                }
            });
        }
        
        // Crouch (Spearow) - Flapping
        if (obs.data.action === 'crouch') {
            obs.mesh.children.forEach((child) => {
                if (child.name === 'Spearow') {
                    const lWing = child.getObjectByName('LWing');
                    const rWing = child.getObjectByName('RWing');
                    if (lWing && rWing) {
                        const flap = Math.sin(elapsedTime * 15) * 0.5;
                        lWing.rotation.z = flap;
                        rWing.rotation.z = -flap;
                    }
                    child.position.y = 2.5 + Math.sin(elapsedTime * 5) * 0.2;
                }
            });
        }

        // Big Jump (Snorlax) - Head Shake & Moving Wall
        if (obs.data.action === 'big_jump') {
             const movingWall = obs.mesh.getObjectByName('MovingWall');
             if (movingWall) {
                 movingWall.position.y = Math.sin(elapsedTime * 1.5) * 1.0; 
             }
             const snorlax = obs.mesh.getObjectByName('Snorlax');
             if (snorlax) {
                 snorlax.scale.y = 0.64 + Math.sin(elapsedTime * 2) * 0.02; 
                 snorlax.scale.x = 0.64 + Math.cos(elapsedTime * 2) * 0.02;
                 const head = snorlax.getObjectByName('Head');
                 if (head) {
                     head.rotation.y = Math.sin(elapsedTime * 3) * 0.3; 
                 }
             }
        }
        
        // POKEMON WALKING HELPER (Squirtle/Grunt/Charmander)
        const walkAnim = (mesh: THREE.Object3D) => {
            const lLeg = mesh.getObjectByName('L_Leg'); const rLeg = mesh.getObjectByName('R_Leg');
            const lArm = mesh.getObjectByName('L_Arm'); const rArm = mesh.getObjectByName('R_Arm');
            const swing = Math.sin(elapsedTime * 10);
            if(lLeg && rLeg) { lLeg.rotation.x = swing * 0.5; rLeg.rotation.x = -swing * 0.5; }
            if(lArm && rArm) { lArm.rotation.x = -swing * 0.5; rArm.rotation.x = swing * 0.5; }
        };
        
        if (obs.mesh.getObjectByName('Squirtle')) walkAnim(obs.mesh.getObjectByName('Squirtle')!);
        
        // CHARMANDER ANIMATION
        const charmander = obs.mesh.getObjectByName('Charmander');
        if (charmander) {
            walkAnim(charmander);
            const tail = charmander.getObjectByName('Tail');
            if (tail) {
                tail.rotation.z = Math.sin(elapsedTime * 10) * 0.3;
                tail.rotation.x = 0.2 + Math.sin(elapsedTime * 5) * 0.1;
            }
            const flame = charmander.getObjectByName('Flame');
            if (flame) {
                const s = 1.0 + Math.sin(elapsedTime * 20) * 0.2;
                flame.scale.set(s, s, s);
                flame.rotation.z = Math.sin(elapsedTime * 15) * 0.2;
            }
            // Bounce
            charmander.position.y = (obs.mesh.userData.origY || 0) + Math.abs(Math.sin(elapsedTime * 10)) * 0.15;
        }

        // ROCKET GRUNT (Punch Obstacle)
        const grunt = obs.mesh.getObjectByName('RocketGrunt');
        if (grunt) {
            walkAnim(grunt);
            // Floating Motion
            if (obs.mesh.userData.origY === undefined) obs.mesh.userData.origY = obs.mesh.position.y;
            obs.mesh.position.y = (obs.mesh.userData.origY || 0) + Math.sin(elapsedTime * 3) * 0.1;
        }

        // ARBOK (Double Punch Obstacle)
        const arbok = obs.mesh.getObjectByName('Arbok');
        if (arbok) {
            const neck = arbok.getObjectByName('Neck');
            if(neck) {
                neck.rotation.z = Math.sin(elapsedTime * 3) * 0.2;
                neck.rotation.x = Math.sin(elapsedTime * 2) * 0.1;
            }
            // Sway entire mesh slightly
            obs.mesh.rotation.z = Math.sin(elapsedTime * 2) * 0.05;
        }
        
        // Flying Obstacle Flap (Pidgeot & Golbat)
        const flyer = obs.mesh.getObjectByName('Aerodactyl'); // Both Pidgeot & Golbat use this name for compatibility
        if (flyer) {
            const lWing = flyer.getObjectByName('L_Wing'); const rWing = flyer.getObjectByName('R_Wing');
             if (lWing && rWing) { const flap = Math.sin(elapsedTime * 12) * 0.5; lWing.rotation.z = flap; rWing.rotation.z = -flap; }
             obs.mesh.position.y = (obs.mesh.userData.origY || 3.0) + Math.sin(elapsedTime * 3) * 0.3;
        }

        // BUTTERFREE ANIMATION
        const butterfree = obs.mesh.getObjectByName('Butterfree');
        if (butterfree) {
            // Float Up/Down - Raised base by 0.3
            butterfree.position.y = (obs.mesh.userData.origY || 0) + 0.3 + Math.sin(elapsedTime * 3) * 0.3;
            
            // Wing Flapping
            const lWing = butterfree.getObjectByName('WingL');
            const rWing = butterfree.getObjectByName('WingR');
            if (lWing && rWing) {
                const flapSpeed = 25; // Fast flap
                const flapAmp = 0.6;
                const flap = Math.sin(elapsedTime * flapSpeed) * flapAmp;
                lWing.rotation.z = flap;
                rWing.rotation.z = -flap;
            }
        }
    },
    
    animateBoss: (boss: Obstacle, elapsedTime: number, delta: number, currentPhase: number) => {
        if (currentPhase === 1) { 
             boss.mesh.position.y = (boss.mesh.userData.origY || 0) + Math.sin(elapsedTime * 5) * 0.1;
             
             // Animate James
             const james = boss.mesh.getObjectByName('James');
             if (james) {
                 const lArm = james.getObjectByName('L_Arm'); const rArm = james.getObjectByName('R_Arm');
                 const lLeg = james.getObjectByName('L_Leg'); const rLeg = james.getObjectByName('R_Leg');
                 const swing = Math.sin(elapsedTime * 8);
                 if(lArm) lArm.rotation.x = -swing * 0.5;
                 if(rArm) rArm.rotation.x = swing * 0.5;
                 if(lLeg) lLeg.rotation.x = swing * 0.5;
                 if(rLeg) rLeg.rotation.x = -swing * 0.5;
             }

             // Animate Jessie
             const jessie = boss.mesh.getObjectByName('Jessie');
             if (jessie) {
                 const lArm = jessie.getObjectByName('L_Arm'); const rArm = jessie.getObjectByName('R_Arm');
                 const lLeg = jessie.getObjectByName('L_Leg'); const rLeg = jessie.getObjectByName('R_Leg');
                 const swing = Math.sin(elapsedTime * 8);
                 if(lArm) lArm.rotation.x = -swing * 0.5;
                 if(rArm) rArm.rotation.x = swing * 0.5;
                 if(lLeg) lLeg.rotation.x = swing * 0.5;
                 if(rLeg) rLeg.rotation.x = -swing * 0.5;
             }

             // Animate Meowth
             const meowth = boss.mesh.getObjectByName('Meowth');
             if (meowth) {
                 const lArm = meowth.getObjectByName('L_Arm'); const rArm = meowth.getObjectByName('R_Arm');
                 const lLeg = meowth.getObjectByName('L_Leg'); const rLeg = meowth.getObjectByName('R_Leg');
                 const tail = meowth.getObjectByName('Tail');
                 const swing = Math.sin(elapsedTime * 12);
                 if(lArm) lArm.rotation.x = -swing * 0.6;
                 if(rArm) rArm.rotation.x = swing * 0.6;
                 if(lLeg) lLeg.rotation.x = swing * 0.6;
                 if(rLeg) rLeg.rotation.x = -swing * 0.6;
                 if(tail) tail.rotation.z = Math.sin(elapsedTime * 10) * 0.3;
             }

        } else if (currentPhase === 2) { 
             const bossWrapper = boss.mesh.getObjectByName('BossWrapper');
             if (bossWrapper) {
                 // Bobbing whole group
                 bossWrapper.position.y = (boss.mesh.userData.origY || 0) + Math.abs(Math.sin(elapsedTime * 8)) * 0.1;
                 
                 // --- BAJUQI ---
                 const bajuqi = bossWrapper.getObjectByName('Bajuqi');
                 if (bajuqi) {
                     const swing = Math.sin(elapsedTime * 10);
                     const lLeg = bajuqi.getObjectByName('L_Leg');
                     const rLeg = bajuqi.getObjectByName('R_Leg');
                     const lArm = bajuqi.getObjectByName('L_Arm');
                     const rArm = bajuqi.getObjectByName('R_Arm');
                     if (lLeg) lLeg.rotation.x = swing * 0.6;
                     if (rLeg) rLeg.rotation.x = -swing * 0.6;
                     // Arms pointing/commanding
                     if (lArm) { lArm.rotation.x = -0.5; lArm.rotation.z = -0.2 + Math.sin(elapsedTime * 5)*0.1; } // Pointing
                     if (rArm) { rArm.rotation.x = swing * 0.6; }
                 }

                 // --- NIDOKING ---
                 const nidoking = bossWrapper.getObjectByName('Nidoking');
                 if (nidoking) {
                     const heavySwing = Math.sin(elapsedTime * 6);
                     const nLleg = nidoking.getObjectByName('L_Leg');
                     const nRleg = nidoking.getObjectByName('R_Leg');
                     const nLarm = nidoking.getObjectByName('L_Arm');
                     const nRarm = nidoking.getObjectByName('R_Arm');
                     const nTail = nidoking.getObjectByName('Tail');
                     const nHead = nidoking.getObjectByName('Head');

                     if (nLleg) nLleg.rotation.x = heavySwing * 0.4;
                     if (nRleg) nRleg.rotation.x = -heavySwing * 0.4;
                     
                     // Arms Swinging Aggressively
                     if (nLarm) { nLarm.rotation.x = -heavySwing * 0.5 - 0.5; nLarm.rotation.z = -0.3; }
                     if (nRarm) { nRarm.rotation.x = heavySwing * 0.5 - 0.5; nRarm.rotation.z = 0.3; }

                     // Tail Sway
                     if (nTail) nTail.rotation.y = Math.sin(elapsedTime * 4) * 0.3;

                     // Head Roar
                     if (nHead) {
                         nHead.rotation.x = Math.abs(Math.sin(elapsedTime * 2)) * -0.2; // Nodding/Roaring
                     }
                 }
             }

        } else if (currentPhase === 3) { 
            const mewtwo = boss.mesh.getObjectByName('Mewtwo');
            if (mewtwo) {
                mewtwo.position.y = (boss.mesh.userData.origY || 0.5) + Math.sin(elapsedTime * 2) * 0.3;
                const lArm = mewtwo.getObjectByName('L_Arm'); const rArm = mewtwo.getObjectByName('R_Arm');
                const lLeg = mewtwo.getObjectByName('L_Leg'); const rLeg = mewtwo.getObjectByName('R_Leg');
                const tail = mewtwo.getObjectByName('Tail'); const aura = mewtwo.getObjectByName('AuraRing');
                if (lArm && rArm) { lArm.rotation.x = -0.5 + Math.sin(elapsedTime * 3) * 0.3; rArm.rotation.x = -0.5 + Math.cos(elapsedTime * 3) * 0.3; lArm.rotation.z = -0.2; rArm.rotation.z = 0.2; }
                if (lLeg && rLeg) { lLeg.rotation.x = 0.2 + Math.sin(elapsedTime * 2) * 0.1; rLeg.rotation.x = 0.2 + Math.cos(elapsedTime * 2) * 0.1; }
                if (tail) { tail.rotation.y = Math.sin(elapsedTime * 4) * 0.4; tail.rotation.x = 0.5 + Math.sin(elapsedTime * 2) * 0.1; }
                if (aura) { aura.rotation.y += delta * 2.0; aura.rotation.z = Math.sin(elapsedTime) * 0.2; }
            }
        } else if (currentPhase === 4) { 
             const arceus = boss.mesh.getObjectByName('Arceus');
             if (arceus) {
                 boss.mesh.position.y = (boss.mesh.userData.origY || 2.0) + Math.sin(elapsedTime * 1.5) * 0.3;
                 const ring = arceus.getObjectByName('Ring');
                 if (ring) ring.rotation.z += delta * 0.5;
             }
        }
    },
    
    animateBackgroundObject: (obj: THREE.Object3D, elapsedTime: number, delta: number) => {
        // ...
    }
};
