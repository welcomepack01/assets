
import * as THREE from 'three';
import { ThemeAnimators, Obstacle } from '../../gameTypes';

export const SkibidiAnimators: ThemeAnimators = {
    animateObstacle: (obs: Obstacle, elapsedTime: number, delta: number) => {
        // Jump: 6 Grinder Blades (Spinning)
        if (obs.data.action === 'jump') {
            obs.mesh.children.forEach(group => {
                const blade = group.getObjectByName('Blade');
                if (blade) {
                    // Spin on Z axis (Sawblade motion)
                    blade.rotation.z -= delta * 15.0; 
                }
            });
        }

        // Crouch: Moving Tunnel Ceiling & Grinders
        if (obs.data.action === 'crouch') {
            const ceiling = obs.mesh.getObjectByName('TunnelCeiling');
            if (ceiling) {
                // Move Up/Down
                ceiling.position.y = 3.8 + Math.sin(elapsedTime * 2.5) * 1.2; 
                // Spin Grinders
                ceiling.traverse(child => {
                    if (child.name === 'CeilingGrinder') {
                        child.rotation.y += delta * 12.0; 
                    }
                });
            }
        }

        // Big Jump: Fortified Barrier
        if (obs.data.action === 'big_jump') {
            const flash = Math.sin(elapsedTime * 15) > 0;
            obs.mesh.traverse(child => {
                if (child.name === 'WarningLight' && child instanceof THREE.Mesh) {
                    const mat = child.material as THREE.MeshStandardMaterial;
                    mat.emissiveIntensity = flash ? 3.0 : 0.2;
                }
            });
            const movingPart = obs.mesh.getObjectByName('MovingBarrierPart');
            if (movingPart) {
                movingPart.position.y = -Math.abs(Math.sin(elapsedTime * 2.0)) * 1.5;
            }
        }

        // Dodge 2 (Obstacle): Speakerman (Walking/Dancing)
        if (obs.data.type === 'ghost') {
            const speakerman = obs.mesh.getObjectByName('Speakerman');
            if (speakerman) {
                // Dancing Motion (Just Dance / Techno Vibe)
                const beat = Math.sin(elapsedTime * 12);
                
                // 1. Body Bobbing
                speakerman.position.y = (obs.mesh.userData.origY || 0) + Math.abs(beat) * 0.1;
                
                // 2. Arms Pumping - 11 Shape (Vertical)
                const lArm = speakerman.getObjectByName('L_Arm');
                const rArm = speakerman.getObjectByName('R_Arm');
                if (lArm) {
                    lArm.rotation.x = beat * 0.5; // Swing forward/back
                    lArm.rotation.z = 0; // Vertical
                }
                if (rArm) {
                    rArm.rotation.x = -beat * 0.5; // Opposite swing
                    rArm.rotation.z = 0; // Vertical
                }

                // 3. Head Bob
                const head = speakerman.getObjectByName('Head');
                if (head) {
                    head.rotation.x = Math.abs(beat) * 0.1; 
                }

                // 4. Move forward
                obs.mesh.position.z += delta * 5.0;
            }
        }

        // Dodge 1 (Monster): Cameraman (Walking with Rifle)
        if (obs.data.type === 'bees') { 
            const cameraman = obs.mesh.getObjectByName('Cameraman');
            if (cameraman) {
                // Walking Motion
                const beat = Math.sin(elapsedTime * 12);
                
                // 1. Body Bobbing
                cameraman.position.y = (obs.mesh.userData.origY || 0) + Math.abs(beat) * 0.1;
                
                // 2. Arms Pumping (Vertical 11 Shape)
                const lArm = cameraman.getObjectByName('L_Arm');
                const rArm = cameraman.getObjectByName('R_Arm');
                if (lArm) {
                    lArm.rotation.x = beat * 0.5; 
                    lArm.rotation.z = 0; 
                }
                if (rArm) {
                    // Right arm holds rifle
                    rArm.rotation.x = -beat * 0.5; 
                    rArm.rotation.z = 0; 
                }

                // 3. Head Bob
                const head = cameraman.getObjectByName('Head');
                if (head) {
                    head.rotation.x = Math.abs(beat) * 0.05; 
                }

                // Move forward towards player
                obs.mesh.position.z += delta * 5.0;
            }
        }

        // Punch 1: Laser G-Man (Weak)
        if (obs.data.type === 'monster_weak') {
            const gman = obs.mesh.getObjectByName('LaserGMan');
            if (gman) {
                // Head Bob / Laughing motion
                const head = gman.getObjectByName('Head');
                if(head) {
                    head.rotation.x = Math.abs(Math.sin(elapsedTime * 15)) * 0.2;
                    head.rotation.z = Math.sin(elapsedTime * 5) * 0.1;
                }
                // Floating slightly
                gman.position.y = (obs.mesh.userData.origY || 0) + Math.sin(elapsedTime * 4) * 0.1;
            }
        }

        // Punch 2: DJ Toilet (Strong)
        if (obs.data.type === 'monster_strong') {
            const dj = obs.mesh.getObjectByName('DJToilet');
            if (dj) {
                // Head Banging to beat
                const head = dj.getObjectByName('Head');
                if(head) {
                    head.rotation.x = Math.sin(elapsedTime * 20) * 0.2;
                }
                // Vibrate/Bounce
                dj.position.y = (obs.mesh.userData.origY || 0) + Math.abs(Math.sin(elapsedTime * 20)) * 0.05;
            }
        }

        // Jump Attack: Heli Toilet (Fixed Height)
        if (obs.data.action === 'jump_attack') {
            const heli = obs.mesh.getObjectByName('HeliToilet');
            if (heli) {
                // NO vertical sine wave (Requested change)
                // Just fixed height based on spawn Y
                heli.position.y = (obs.mesh.userData.origY || 3.2);
                
                // Spin Rotor
                const blades = heli.getObjectByName('Blades');
                if (blades) blades.rotation.y += delta * 25.0;
                
                // Slight Tilt sway
                heli.rotation.z = Math.sin(elapsedTime * 2) * 0.05;
            }
        }
    },
    
    animateBoss: (boss: Obstacle, elapsedTime: number, delta: number, currentPhase: number) => {
        boss.mesh.position.y = (boss.mesh.userData.origY || 0) + Math.sin(elapsedTime * 2) * 0.2;

        if (currentPhase === 1) { // G-Man 4.0
            const b = boss.mesh.getObjectByName('GMan4');
            if (b) {
                for(let i=0; i<6; i++) {
                    const cannon = b.getObjectByName(`Laser_${i}`);
                    if (cannon) {
                        const recoil = Math.sin(elapsedTime * (10 + i)) > 0.8 ? -0.5 : 0;
                        cannon.position.z = 0.5 + recoil;
                    }
                }
                const fire = b.getObjectByName('FireBase');
                if (fire) {
                    fire.children.forEach((f, i) => {
                        f.scale.y = 1.0 + Math.random();
                        f.position.y = Math.random() * 0.5;
                    });
                }
            }
        } 
        else if (currentPhase === 2) { // Titan TV
            const b = boss.mesh.getObjectByName('TitanTV');
            if (b) {
                const rArm = b.getObjectByName('R_Arm');
                if (rArm) rArm.rotation.x = -Math.PI/2 + Math.sin(elapsedTime * 3) * 0.5;
                const mainTV = b.getObjectByName('MainTV');
                if (mainTV) mainTV.position.x = Math.random() * 0.05;
            }
        }
        else if (currentPhase === 3) { // Astro
            const b = boss.mesh.getObjectByName('Astro');
            if (b) {
                // 1. Head Rotation (Left/Right)
                const head = b.getObjectByName('Head');
                if (head) {
                    head.rotation.y = Math.sin(elapsedTime * 1.5) * 0.3; // Look left/right
                }

                // 2. Arms & Weapon Rotation
                ['L_Arm', 'R_Arm'].forEach(name => {
                    const arm = b.getObjectByName(name);
                    if (arm) {
                        const side = name === 'L_Arm' ? -1 : 1;
                        // Shoulder movement (Up/Down + Spread)
                        arm.rotation.z = (side * 0.2) + Math.sin(elapsedTime * 2) * 0.1 * side;
                        arm.rotation.x = Math.sin(elapsedTime * 1.5) * 0.1;

                        // Fist/Claw Rotation
                        const weapon = arm.getObjectByName('Weapon');
                        if (weapon) {
                            weapon.rotation.z += delta * 5.0 * side; // Spin the claw
                        }
                    }
                });
            }
        }
        else if (currentPhase === 4) { // Emperor
            const b = boss.mesh.getObjectByName('Emperor');
            if (b) {
                b.rotation.z = Math.sin(elapsedTime * 1.5) * 0.02;
                const lArm = b.getObjectByName('L_Arm');
                const rArm = b.getObjectByName('R_Arm');
                const head = b.getObjectByName('Head');
                if (lArm) { lArm.rotation.x = Math.sin(elapsedTime * 3) * 0.2; lArm.rotation.z = 0; }
                if (rArm) { rArm.rotation.x = Math.cos(elapsedTime * 3) * 0.2; rArm.rotation.z = 0; }
                if (head) {
                    head.rotation.y = Math.sin(elapsedTime * 1) * 0.2;
                    head.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;
                }
            }
        }
    },
    
    animateBackgroundObject: (obj: THREE.Object3D, elapsedTime: number, delta: number) => {
    }
};
