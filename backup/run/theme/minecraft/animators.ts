
import * as THREE from 'three';
import { ThemeAnimators, Obstacle } from '../../gameTypes';

export const MinecraftAnimators: ThemeAnimators = {
    animateObstacle: (obs: Obstacle, elapsedTime: number, delta: number) => {
        // Jump: Blocks (Diverse Types)
        if (obs.data.action === 'jump') {
            const flashSpeed = 20; // Fast blinking for the prime block
            const isFlash = Math.sin(elapsedTime * flashSpeed) > 0;
            
            // Subtle pulse for all blocks
            const baseSwell = 1.0 + Math.abs(Math.sin(elapsedTime * 5)) * 0.02;

            obs.mesh.children.forEach(child => {
                if (child.name.startsWith('JumpBlock')) {
                    // Default scale
                    child.scale.set(baseSwell, baseSwell, baseSwell);
                    
                    // Logic for the flashing one (The "active" trap or just highlighted block)
                    if (child.name === 'JumpBlock_Prime') {
                        // Stronger swell for prime
                        const primeSwell = 1.0 + Math.abs(Math.sin(elapsedTime * 20)) * 0.1;
                        child.scale.set(primeSwell, primeSwell, primeSwell);

                        // Flash Emissive
                        child.traverse((c) => {
                            if (c instanceof THREE.Mesh && c.material instanceof THREE.MeshStandardMaterial) {
                                if (!c.userData.originalEmissive) {
                                    c.userData.originalEmissive = c.material.emissive.clone();
                                    c.userData.originalIntensity = c.material.emissiveIntensity;
                                }
                                
                                if (isFlash) {
                                    c.material.emissive.setHex(0xFFFFFF);
                                    c.material.emissiveIntensity = 0.5;
                                } else {
                                    c.material.emissive.copy(c.userData.originalEmissive);
                                    c.material.emissiveIntensity = c.userData.originalIntensity;
                                }
                            }
                        });
                    }
                }
            });
        }
        
        // Crouch: Ghasts - Floating & Tentacle Sway
        if (obs.data.action === 'crouch') {
            obs.mesh.children.forEach((child, idx) => {
                if (child.name === 'Ghast') {
                    // Bobbing up and down - Base height updated to 3.45
                    child.position.y = 3.45 + Math.sin(elapsedTime * 2.0 + idx) * 0.3;
                    
                    // Sway tentacles
                    const tentacles = child.getObjectByName('Tentacles');
                    if (tentacles) {
                        tentacles.rotation.x = Math.sin(elapsedTime * 3.0 + idx) * 0.1;
                        tentacles.rotation.z = Math.cos(elapsedTime * 2.5 + idx) * 0.1;
                    }
                }
            });
        }

        // Big Jump: Chest Wall - Jitter/Shake
        if (obs.data.action === 'big_jump') {
            const wall = obs.mesh.getObjectByName('ChestWall');
            if (wall) {
                // Subtle rattle/jitter Y position
                wall.position.y = Math.sin(elapsedTime * 20.0) * 0.02;
            }
        }
        
        // Dodge (Dynamic): Villager (Replaces Pig)
        if (obs.data.type === 'bees' || obs.mesh.getObjectByName('Villager')) {
            const villager = obs.mesh.getObjectByName('Villager');
            if (villager) {
                // Side to side movement (Dodging behavior)
                villager.position.x = Math.sin(elapsedTime * 3.0) * 1.5;
                
                // Head Turning (Looking left and right)
                const head = villager.getObjectByName('Head');
                if (head) {
                    // Turn head left and right (Rotation around Y axis)
                    head.rotation.y = Math.sin(elapsedTime * 4.0) * 0.6; // +/- 0.6 radians scanning
                }

                // Leg Swing (Walking)
                const lLeg = villager.getObjectByName('L_Leg');
                const rLeg = villager.getObjectByName('R_Leg');
                if(lLeg && rLeg) {
                    lLeg.rotation.x = Math.sin(elapsedTime * 10.0) * 0.5;
                    rLeg.rotation.x = -Math.sin(elapsedTime * 10.0) * 0.5;
                }
            }
        }
        // Dodge (Static -> Walking): Golem (Replaced Cactus)
        if (obs.data.type === 'ghost' || obs.mesh.getObjectByName('Golem')) {
            const golem = obs.mesh.getObjectByName('Golem');
            if (golem) {
                // Walking Animation Speed (Doubled from 4.0 to 8.0)
                const walkSpeed = 8.0;
                const swingAmp = 0.3;

                // Bobbing (Up and Down)
                golem.position.y = Math.abs(Math.sin(elapsedTime * walkSpeed)) * 0.1;
                
                // Arms Swing
                const lArm = golem.getObjectByName('L_Arm');
                const rArm = golem.getObjectByName('R_Arm');
                if (lArm) lArm.rotation.x = Math.sin(elapsedTime * walkSpeed) * swingAmp;
                if (rArm) rArm.rotation.x = -Math.sin(elapsedTime * walkSpeed) * swingAmp;

                // Legs Swing
                const lLeg = golem.getObjectByName('L_Leg');
                const rLeg = golem.getObjectByName('R_Leg');
                if (lLeg) lLeg.rotation.x = -Math.sin(elapsedTime * walkSpeed) * swingAmp;
                if (rLeg) rLeg.rotation.x = Math.sin(elapsedTime * walkSpeed) * swingAmp;

                // Move towards player (Positive Z) (Doubled from 1.5 to 3.0)
                obs.mesh.position.z += delta * 3.0; 
            }
        }

        // Punch 1: Creeper (Weak)
        if (obs.data.type === 'monster_weak' || obs.mesh.getObjectByName('Creeper')) {
            const creeper = obs.mesh.getObjectByName('Creeper');
            if (creeper) {
                // Sizzling Shake
                creeper.rotation.z = Math.sin(elapsedTime * 30) * 0.02;
                creeper.scale.x = 1.3 + Math.sin(elapsedTime * 10) * 0.05;
                creeper.scale.z = 1.3 + Math.sin(elapsedTime * 10) * 0.05;
                
                // Leg Swing
                ['FL', 'FR', 'BL', 'BR'].forEach((name, i) => {
                    const leg = creeper.getObjectByName(name);
                    if (leg) leg.rotation.x = Math.sin(elapsedTime * 15 + i) * 0.6;
                });

                // Flashing Effect (Explosion buildup)
                const flashSpeed = 12;
                const isFlash = Math.sin(elapsedTime * flashSpeed) > 0;
                
                creeper.traverse((child) => {
                    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                        // Store original color/emissive if not present
                        if (!child.userData.originalEmissive) {
                            child.userData.originalEmissive = child.material.emissive.clone();
                            child.userData.originalIntensity = child.material.emissiveIntensity;
                        }
                        
                        if (isFlash) {
                            child.material.emissive.setHex(0xFFFFFF);
                            child.material.emissiveIntensity = 0.5;
                        } else {
                            child.material.emissive.copy(child.userData.originalEmissive);
                            child.material.emissiveIntensity = child.userData.originalIntensity;
                        }
                    }
                });
            }
        }

        // Punch 2: Enderman (Strong)
        if (obs.data.type === 'monster_strong' || obs.mesh.getObjectByName('Enderman')) {
            const enderman = obs.mesh.getObjectByName('Enderman');
            if (enderman) {
                // Rage Shake
                enderman.rotation.y = (Math.random() - 0.5) * 0.2;
                // FIXED: Do NOT add obs.mesh.userData.origX here. The parent group is already at that position.
                // Adding it again pushes the child model off-center (biasing left if origX is negative).
                enderman.position.x = (Math.random() - 0.5) * 0.1; 
                
                // Arm Flail
                const lArm = enderman.getObjectByName('L_Arm');
                const rArm = enderman.getObjectByName('R_Arm');
                if (lArm) lArm.rotation.x = Math.sin(elapsedTime * 15) * 0.5;
                if (rArm) rArm.rotation.x = -Math.sin(elapsedTime * 15) * 0.5;

                // Particles float
                const particles = enderman.getObjectByName('Particles');
                if (particles) {
                    particles.children.forEach((p, i) => {
                        p.position.y += delta * 0.5;
                        if (p.position.y > 3.0) p.position.y = 0;
                    });
                }
            }
        }

        // Jump Attack: Phantom
        if (obs.data.type === 'drone' || obs.data.action === 'jump_attack') {
            const phantom = obs.mesh.getObjectByName('Phantom');
            if (phantom) {
                obs.mesh.position.y = 2.0 + Math.cos(elapsedTime * 3.0) * 0.5;
                const lWing = phantom.getObjectByName('L_Wing');
                const rWing = phantom.getObjectByName('R_Wing');
                if (lWing) lWing.rotation.z = Math.sin(elapsedTime * 10) * 0.5;
                if (rWing) rWing.rotation.z = -Math.sin(elapsedTime * 10) * 0.5;
            }
        }
    },
    
    animateBoss: (boss: Obstacle, elapsedTime: number, delta: number, currentPhase: number) => {
        // GLOBAL BOSS ROTATION (Look left and right slowly)
        const bossContainer = boss.mesh.children[0]; 
        if (bossContainer) {
            bossContainer.rotation.y = Math.sin(elapsedTime * 0.8) * 0.15;
        }

        if (currentPhase === 1) { // PHASE 1: Warden
            const warden = boss.mesh.getObjectByName('Warden');
            if (warden) {
                warden.position.y = Math.abs(Math.sin(elapsedTime * 3.0)) * 0.2; 
                
                const lArm = warden.getObjectByName('L_Arm');
                const rArm = warden.getObjectByName('R_Arm');
                if (lArm) lArm.rotation.x = Math.sin(elapsedTime * 3.0) * 0.8;
                if (rArm) rArm.rotation.x = Math.cos(elapsedTime * 3.0) * 0.8;

                const head = warden.getObjectByName('Head');
                if (head) {
                    head.rotation.x = Math.sin(elapsedTime * 5.0) * 0.1;
                    head.rotation.z = Math.cos(elapsedTime * 2.0) * 0.1;
                }
                
                const heart = warden.getObjectByName('Heart');
                if (heart && heart instanceof THREE.Mesh && heart.material instanceof THREE.MeshStandardMaterial) {
                    const pulse = 1.0 + Math.sin(elapsedTime * 10.0) * 0.3;
                    heart.scale.setScalar(pulse);
                    heart.material.emissiveIntensity = 1.0 + pulse;
                }
            }
        } else if (currentPhase === 2) { // PHASE 2: Necromancer
            const necro = boss.mesh.getObjectByName('Necromancer');
            if (necro) {
                necro.position.y = Math.sin(elapsedTime * 2.0) * 0.2;
                
                const rArm = necro.getObjectByName('R_Arm');
                if (rArm) rArm.rotation.x = -1.0 + Math.sin(elapsedTime * 3.0) * 0.3;
                
                const lArm = necro.getObjectByName('L_Arm');
                if (lArm) lArm.rotation.x = -0.2 + Math.cos(elapsedTime * 3.0) * 0.1;

                const aura = necro.getObjectByName('MagicAura');
                if (aura) {
                    aura.rotation.y += delta;
                    aura.children.forEach((particle, idx) => {
                        if (particle instanceof THREE.Mesh) {
                            particle.position.y += Math.sin(elapsedTime * 2 + idx) * 0.005;
                        }
                    });
                }
            }
        } else if (currentPhase === 3) { // Wither
            const wither = boss.mesh.getObjectByName('Wither');
            if (wither) {
                wither.position.y = 1.2 + Math.sin(elapsedTime * 2.0) * 0.5;
                const mHead = wither.getObjectByName('MainHead');
                const lHead = wither.getObjectByName('LHead');
                const rHead = wither.getObjectByName('RHead');
                if (mHead) mHead.rotation.y = Math.sin(elapsedTime * 3.0) * 0.3;
                if (lHead) lHead.rotation.y = Math.sin(elapsedTime * 4.0) * 0.4;
                if (rHead) rHead.rotation.y = Math.sin(elapsedTime * 5.0) * 0.4;

                const storm = wither.getObjectByName('WitherStorm');
                if (storm) {
                    storm.rotation.y -= delta * 2.0;
                    storm.scale.setScalar(1.0 + Math.sin(elapsedTime * 5) * 0.1);
                    storm.children.forEach(p => {
                        if (p instanceof THREE.Mesh) {
                            p.position.x += (Math.random() - 0.5) * 0.05;
                            p.position.z += (Math.random() - 0.5) * 0.05;
                        }
                    });
                }
            }
        } else if (currentPhase === 4) { // Ender Dragon
            const dragon = boss.mesh.getObjectByName('EnderDragon');
            if (dragon) {
                dragon.position.y = 4.0 + Math.sin(elapsedTime * 1.5) * 1.5;
                
                const lWing = dragon.getObjectByName('L_Wing');
                const rWing = dragon.getObjectByName('R_Wing');
                if (lWing) lWing.rotation.z = Math.sin(elapsedTime * 2.5) * 0.6;
                if (rWing) rWing.rotation.z = -Math.sin(elapsedTime * 2.5) * 0.6;
                
                const neck = dragon.getObjectByName('Neck');
                const head = dragon.getObjectByName('Head');
                if (neck) neck.rotation.x = 0.5 + Math.sin(elapsedTime * 2.0) * 0.1;
                if (head) {
                    head.rotation.x = Math.sin(elapsedTime * 3.0) * 0.1;
                    const jaw = head.getObjectByName('Jaw');
                    if (jaw) jaw.rotation.x = 0.2 + Math.abs(Math.sin(elapsedTime * 1.0)) * 0.3;
                }
                
                const tail = dragon.getObjectByName('Tail');
                if (tail) {
                    tail.rotation.y = Math.cos(elapsedTime * 2.0) * 0.2;
                    tail.rotation.x = -0.2 + Math.sin(elapsedTime * 1.5) * 0.1;
                }
            }
        }
    },
    
    animateBackgroundObject: (obj: THREE.Object3D, elapsedTime: number, delta: number) => {
        // ...
    }
};
