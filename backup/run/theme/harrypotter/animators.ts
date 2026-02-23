
import * as THREE from 'three';
import { ThemeAnimators, Obstacle } from '../../gameTypes';

export const HarryPotterAnimators: ThemeAnimators = {
    animateObstacle: (obs: Obstacle, elapsedTime: number, delta: number) => {
        // Jump: Mandrakes
        if (obs.data.action === 'jump') {
            obs.mesh.children.forEach((pot, idx) => {
                if (pot.name.startsWith('Mandrake')) {
                    const plant = pot.getObjectByName('Plant');
                    if (plant) {
                        // Pop up and down screaming
                        plant.position.y = 0.6 + Math.sin(elapsedTime * 8 + idx) * 0.1;
                        plant.rotation.z = Math.sin(elapsedTime * 15) * 0.1;
                    }
                }
            });
        }

        // Crouch: Flying Owls
        if (obs.data.action === 'crouch') {
            obs.mesh.children.forEach((owl, idx) => {
                if (owl.name.startsWith('Owl')) {
                    // Bobbing flight
                    owl.position.y += Math.sin(elapsedTime * 4 + idx) * 0.01;
                    
                    // Wing Flapping
                    const lWing = owl.getObjectByName('WingL');
                    const rWing = owl.getObjectByName('WingR');
                    if (lWing && rWing) {
                        const flapSpeed = 15;
                        const flapAmp = 0.6;
                        const flap = Math.sin(elapsedTime * flapSpeed + idx) * flapAmp;
                        lWing.rotation.z = flap; // Up/Down
                        rWing.rotation.z = -flap;
                    }
                }
            });
        }

        // Big Jump: Animated Armor Phalanx
        if (obs.data.action === 'big_jump') {
            const phalanx = obs.mesh;
            if (phalanx.name === 'ArmorPhalanx') {
                phalanx.children.forEach((knight, i) => {
                    if (knight.name.startsWith('Knight')) {
                        // Floating/Bobbing motion (Ghostly armor)
                        knight.position.y = 2.0 + Math.sin(elapsedTime * 2.0 + i) * 0.2;
                        
                        // Slight rotation towards player/center
                        knight.rotation.y = Math.sin(elapsedTime * 1.5 + i) * 0.1;
                    }
                });
            }
        }

        // DODGE A: RON & HERMIONE (Walking)
        const ron = obs.mesh.getObjectByName('Ron');
        const hermione = obs.mesh.getObjectByName('Hermione');
        const char = ron || hermione;
        if (char) {
            // Walking cycle
            const speed = 10;
            const swing = Math.sin(elapsedTime * speed) * 0.6;
            
            // Move forward towards player
            obs.mesh.position.z += delta * 4.0;

            const lLeg = char.getObjectByName('L_Leg');
            const rLeg = char.getObjectByName('R_Leg');
            const lArm = char.getObjectByName('L_Arm');
            const rArm = char.getObjectByName('R_Arm');
            
            if (lLeg) lLeg.rotation.x = swing;
            if (rLeg) rLeg.rotation.x = -swing;
            if (lArm) lArm.rotation.x = -swing;
            if (rArm) rArm.rotation.x = swing;
            
            // Bobbing
            char.position.y = Math.abs(Math.sin(elapsedTime * speed)) * 0.1;
        }

        // DODGE B: DOBBY (Nervous Hop/Walk)
        if (obs.mesh.getObjectByName('Dobby')) {
            const dobby = obs.mesh.getObjectByName('Dobby');
            if (dobby) {
                // Skittish movement
                const hop = Math.abs(Math.sin(elapsedTime * 12));
                dobby.position.y = hop * 0.3;
                
                // Arm flail
                const lArm = dobby.getObjectByName('L_Arm');
                const rArm = dobby.getObjectByName('R_Arm');
                if(lArm) lArm.rotation.z = 0.5 + Math.sin(elapsedTime * 20) * 0.5;
                if(rArm) rArm.rotation.z = -0.5 - Math.sin(elapsedTime * 20) * 0.5;

                // Move forward
                obs.mesh.position.z += delta * 6.0;
            }
        }

        // PUNCH 1: DEATH EATER (Menacing Walk)
        if (obs.mesh.getObjectByName('DeathEater')) {
            const de = obs.mesh.getObjectByName('DeathEater');
            if (de) {
                // Increased speed from 6 to 12
                const speed = 12;
                const swing = Math.sin(elapsedTime * speed) * 0.5;
                
                const lLeg = de.getObjectByName('L_Leg');
                const rLeg = de.getObjectByName('R_Leg');
                const lArm = de.getObjectByName('L_Arm');
                const rArm = de.getObjectByName('R_Arm'); // Holding wand
                
                if (lLeg) lLeg.rotation.x = swing;
                if (rLeg) rLeg.rotation.x = -swing;
                if (lArm) lArm.rotation.x = -swing;
                
                // Wand arm steady but slight bob
                if (rArm) {
                    rArm.rotation.x = -0.5 + Math.sin(elapsedTime * 2) * 0.1;
                    rArm.rotation.z = 0.2;
                }
                
                obs.mesh.position.z += delta * 3.5; // Slightly faster advance
            }
        }

        // PUNCH 2: DEMENTOR (Eerie Float & Sway)
        const dem = obs.mesh.getObjectByName('Dementor');
        if (dem) {
            // Eerie floating - Intensified Sine Wave
            dem.position.y = 0.5 + Math.sin(elapsedTime * 2.5) * 0.4;
            
            // Subtle Sway side-to-side
            dem.rotation.z = Math.sin(elapsedTime * 1.5) * 0.05;

            // Move towards player
            obs.mesh.position.z += delta * 5.0;

            const cloak = dem.getObjectByName('Cloak');
            if (cloak) {
                // Main Billowing
                cloak.rotation.x = Math.sin(elapsedTime * 3.0) * 0.1; 
                
                // Animate Cloth Strips (Children that are Meshes)
                cloak.children.forEach((child, i) => {
                    if (child instanceof THREE.Mesh) {
                        // Independent sway for each strip
                        child.rotation.x = Math.sin(elapsedTime * 5.0 + i) * 0.2;
                        child.rotation.z = Math.cos(elapsedTime * 4.0 + i) * 0.1;
                    }
                });
            }
            
            const lArm = dem.getObjectByName('L_Arm');
            const rArm = dem.getObjectByName('R_Arm');
            // Reaching out (Soul Sucking)
            if (lArm) { 
                lArm.rotation.x = 1.4 + Math.sin(elapsedTime * 2.0) * 0.1; 
                lArm.rotation.z = 0.2; 
            }
            if (rArm) { 
                rArm.rotation.x = 1.4 + Math.cos(elapsedTime * 2.0) * 0.1; 
                rArm.rotation.z = -0.2;
            }
        }

        // Flying: Broom Rider
        if (obs.mesh.getObjectByName('BroomRider')) {
            const rider = obs.mesh.getObjectByName('BroomRider');
            if (rider) {
                rider.position.y = 1.5 + Math.sin(elapsedTime * 3) * 0.5;
                rider.rotation.z = Math.sin(elapsedTime * 2) * 0.1; // Banking
            }
        }
    },
    
    animateBoss: (boss: Obstacle, elapsedTime: number, delta: number, currentPhase: number) => {
        // Global float for all bosses
        boss.mesh.position.y = (boss.mesh.userData.origY || 0) + Math.sin(elapsedTime * 2) * 0.1;

        // GLOBAL AURA ANIMATION
        const aura = boss.mesh.getObjectByName('BossAura');
        if (aura) {
            // Rotate the whole group
            aura.rotation.y += delta * 2.0;
            
            // Animate individual particles (Bobbing up and down)
            aura.children.forEach((p, idx) => {
                // Simple up/down motion relative to parent
                p.position.y = (Math.sin(elapsedTime * 3 + idx) * 0.2);
            });
        }

        if (currentPhase === 1) { // Pettigrew
            const peter = boss.mesh.getObjectByName('Peter');
            if (peter) {
                // Twitchy movements
                peter.rotation.y = Math.sin(elapsedTime * 10) * 0.1;
                const head = peter.getObjectByName('Head');
                if (head) head.rotation.x = Math.abs(Math.sin(elapsedTime * 8)) * 0.2; // Sniffing
                
                // Nervous hands - Kept 11 shape (Parallel)
                const lArm = peter.getObjectByName('L_Arm');
                const rArm = peter.getObjectByName('R_Arm');
                // Arms swing forward/back parallel, no splaying (Z rotation kept strictly 0)
                if(lArm) {
                    lArm.rotation.x = Math.sin(elapsedTime * 5) * 0.2;
                    lArm.rotation.z = 0; // Lock to parallel
                }
                if(rArm) {
                    rArm.rotation.x = Math.cos(elapsedTime * 5) * 0.2;
                    rArm.rotation.z = 0; // Lock to parallel
                }
            }
        } else if (currentPhase === 2) { // Bellatrix
            const bella = boss.mesh.getObjectByName('Bellatrix');
            if (bella) {
                const head = bella.getObjectByName('Head');
                if (head) {
                    // Head shake left/right slowly
                    head.rotation.y = Math.sin(elapsedTime * 1.5) * 0.3; 
                }
                
                const lArm = bella.getObjectByName('L_Arm');
                const rArm = bella.getObjectByName('R_Arm');
                
                // Left Arm free
                if (lArm) lArm.rotation.x = Math.sin(elapsedTime * 3.0) * 0.4;
                
                // Right Arm (Aiming) - Keep steady forward (-1.5) with slight recoil/bob
                if (rArm) rArm.rotation.x = -1.5 + Math.sin(elapsedTime * 5.0) * 0.05;
            }
        } else if (currentPhase === 3) { // Barty Crouch Jr
            const barty = boss.mesh.getObjectByName('Barty');
            if (barty) {
                const head = barty.getObjectByName('Head');
                if (head) {
                    // Head shake left/right slowly
                    head.rotation.y = Math.sin(elapsedTime * 1.5) * 0.3; 
                    
                    const tongue = head.getObjectByName('Tongue');
                    if (tongue) {
                        tongue.scale.z = 1.0 + Math.abs(Math.sin(elapsedTime * 15));
                    }
                }
                
                const lArm = barty.getObjectByName('L_Arm');
                const rArm = barty.getObjectByName('R_Arm');
                
                if (lArm) lArm.rotation.x = Math.sin(elapsedTime * 3.0) * 0.4;
                
                // Right Arm (Aiming) - Keep steady forward (-1.5)
                if (rArm) rArm.rotation.x = -1.5 + Math.sin(elapsedTime * 6.0) * 0.05;
            }
        } else if (currentPhase === 4) { // Voldemort
            const voldy = boss.mesh.getObjectByName('Voldemort');
            if (voldy) {
                voldy.position.y = 0.5 + Math.sin(elapsedTime * 1.5) * 0.5;
                
                const head = voldy.getObjectByName('Head');
                if (head) {
                    // Head shake left/right slowly (Menacing)
                    head.rotation.y = Math.sin(elapsedTime * 1.0) * 0.4; 
                }

                const lArm = voldy.getObjectByName('L_Arm');
                const rArm = voldy.getObjectByName('R_Arm');
                
                if (lArm) lArm.rotation.x = Math.sin(elapsedTime * 2.5) * 0.5;
                
                // Right Arm (Aiming) - Keep steady forward (-1.5)
                if (rArm) rArm.rotation.x = -1.5 + Math.cos(elapsedTime * 4.0) * 0.05;

                const robe = voldy.getObjectByName('Robe');
                if (robe) {
                    robe.rotation.z = Math.sin(elapsedTime * 1) * 0.05;
                }
                const glow = voldy.getObjectByName('WandGlow');
                if (glow && glow instanceof THREE.Mesh) {
                    const s = 1.0 + Math.random() * 0.5;
                    glow.scale.setScalar(s);
                }
            }
        }
    },
    
    animateBackgroundObject: (obj: THREE.Object3D, elapsedTime: number, delta: number) => {
        if (obj.name === 'bg_floater') {
            const data = obj.userData;
            obj.rotation.x += delta * data.rotSpeedX;
            obj.rotation.y += delta * data.rotSpeedY;
            obj.position.y += Math.sin(elapsedTime * data.floatSpeed + data.floatOffset) * delta * 0.5;
        }
    }
};
