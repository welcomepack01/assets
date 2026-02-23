
import * as THREE from 'three';
import { ThemeAnimators, Obstacle } from '../../gameTypes';

const findMixer = (obj: THREE.Object3D): THREE.AnimationMixer | undefined => {
    if (obj.userData && obj.userData.mixer) return obj.userData.mixer;
    for (const child of obj.children) {
        const mixer = findMixer(child);
        if (mixer) return mixer;
    }
    return undefined;
};

export const KPopAnimators: ThemeAnimators = {
    animateObstacle: (obs: Obstacle, elapsedTime: number, delta: number) => {
        const mixer = findMixer(obs.mesh);
        if (mixer) mixer.update(delta);

        // JUMP
        if (obs.data.action === 'jump') {
            // Level 3: Rising Iron Spikes
            if (obs.mesh.name === 'RisingIronSpikes') {
                if (obs.mesh.userData.spawnTime === undefined) obs.mesh.userData.spawnTime = elapsedTime;
                const timeAlive = elapsedTime - obs.mesh.userData.spawnTime;
                
                obs.mesh.children.forEach((spikeGroup, i) => {
                    const startTime = i * 0.15;
                    const duration = 0.3; // Fast rise
                    let progress = 0;
                    if (timeAlive > startTime) progress = Math.min(1, (timeAlive - startTime) / duration);
                    // Easing out
                    progress = 1 - Math.pow(1 - progress, 3);
                    const y = -2.5 + progress * 2.5; 
                    spikeGroup.position.y = y;
                });
            }
            // Default: Rising Crystals
            else if (obs.mesh.name === 'RisingCrystals') {
                if (obs.mesh.userData.spawnTime === undefined) obs.mesh.userData.spawnTime = elapsedTime;
                const timeAlive = elapsedTime - obs.mesh.userData.spawnTime;
                
                obs.mesh.children.forEach((crystal, i) => {
                    const ud = crystal.userData;
                    const startTime = i * 0.1;
                    const duration = 0.5;
                    let progress = 0;
                    if (timeAlive > startTime) progress = Math.min(1, (timeAlive - startTime) / duration);
                    const y = -2.5 + progress * (ud.targetY - (-2.5));
                    crystal.position.y = y;
                });
            }
        }

        // CROUCH
        if (obs.data.action === 'crouch') {
            // Level 3: Iron Gate Trap (Spikes Descending)
            if (obs.mesh.getObjectByName('IronGateTrap')) {
                const bar = obs.mesh.getObjectByName('FallingSpikeBar');
                if (bar) {
                    // Descend periodically
                    const cycle = (elapsedTime * 1.5) % (Math.PI * 2);
                    // Move from 5.5 down to 2.5 and back up
                    const y = 4.0 + Math.sin(cycle) * 1.5;
                    bar.position.y = y;
                }
            }
            // Default: Snow Tunnel
            else {
                let tunnel = obs.mesh.name === 'SnowTunnel' ? obs.mesh : obs.mesh.getObjectByName('SnowTunnel');
                if (tunnel) {
                    tunnel.children.forEach(child => {
                        if (child.name === 'StabbingIcicle') {
                            const ud = child.userData;
                            const shake = Math.sin(elapsedTime * 20 + (ud.phaseOffset || 0)) * 0.05;
                            child.rotation.z = shake;
                            child.rotation.x = shake * 0.5;
                        }
                    });
                }
            }
        }

        // BIG JUMP
        if (obs.data.action === 'big_jump') {
            // Level 3: Rolling Iron Balls
            const ironBalls = obs.mesh.getObjectByName('RollingIronBalls');
            if (ironBalls) {
                const rollSpeed = 8.0; // Faster/Heavier
                const left = ironBalls.getObjectByName('IronBall_L');
                const right = ironBalls.getObjectByName('IronBall_R');
                
                if (left) { 
                    left.rotation.x += delta * rollSpeed; 
                    left.position.y = 2.0; // Steady
                }
                if (right) { 
                    right.rotation.x += delta * rollSpeed; 
                    right.position.y = 2.0; 
                }
            }
            // Default: Rolling Snowballs
            else {
                const snowballs = obs.mesh.getObjectByName('RollingSnowballs');
                if (snowballs) {
                    const rollSpeed = 6.0;
                    const left = snowballs.getObjectByName('Snowball_L');
                    const right = snowballs.getObjectByName('Snowball_R');
                    if (left) left.rotation.x += delta * rollSpeed;
                    if (right) right.rotation.x += delta * rollSpeed;
                    if (left) left.position.y = 2.0 + Math.sin(elapsedTime * 15) * 0.05;
                    if (right) right.position.y = 2.0 + Math.cos(elapsedTime * 15) * 0.05;
                } else {
                    // Fallback for old GLB logic
                    const wall = obs.mesh.getObjectByName('GiantIceWall');
                    if (wall) {
                        wall.children.forEach(child => {
                            if (child.name === 'Snowflake') {
                                child.rotation.z += delta * 0.5;
                                child.scale.setScalar(1.0 + Math.sin(elapsedTime * 3) * 0.2);
                            }
                        });
                    }
                }
            }
        }

        // DODGE A: Olaf (Updated for New Model)
        if (obs.mesh.getObjectByName('Olaf')) {
            const olaf = obs.mesh.getObjectByName('Olaf');
            if (olaf) {
                const hop = Math.abs(Math.sin(elapsedTime * 8));
                olaf.position.y = hop * 0.5;
                
                const torso = olaf.getObjectByName('Torso');
                const head = olaf.getObjectByName('Head'); // Head is child of Torso in new model
                const lArm = torso?.getObjectByName('L_Arm');
                const rArm = torso?.getObjectByName('R_Arm');
                
                if(torso) torso.rotation.y = Math.sin(elapsedTime * 4) * 0.15;
                // Head bob
                if(head) head.rotation.z = Math.sin(elapsedTime * 5) * 0.1;
                
                // Arm Wave
                if(lArm) {
                    lArm.rotation.z = 0.5 + Math.sin(elapsedTime * 10) * 0.5; // Wave up/down
                }
                if(rArm) {
                    rArm.rotation.z = -0.5 - Math.sin(elapsedTime * 10) * 0.5;
                }
                
                obs.mesh.position.z += delta * 2.0; 
            }
        }

        // DODGE B: Gale (Wind)
        if (obs.mesh.getObjectByName('Gale')) {
            const gale = obs.mesh.getObjectByName('Gale');
            if (gale) {
                gale.children.forEach(leaf => {
                    if(leaf.userData.speed) {
                        const ud = leaf.userData;
                        ud.angle += delta * ud.speed;
                        leaf.position.x = Math.cos(ud.angle) * ud.radius;
                        leaf.position.z = Math.sin(ud.angle) * ud.radius;
                        leaf.position.y += Math.sin(elapsedTime * 5 + ud.angle) * 0.01;
                        leaf.rotation.x += delta * 2;
                        leaf.rotation.y += delta * 2;
                    }
                });
                obs.mesh.position.x += Math.sin(elapsedTime * 2) * 0.05;
                obs.mesh.position.z += delta * 6.0;
            }
        }

        // PUNCH 1: Wolf
        if (obs.mesh.getObjectByName('Wolf')) {
            const wolf = obs.mesh.getObjectByName('Wolf');
            if (wolf) {
                const run = Math.sin(elapsedTime * 15);
                wolf.position.y = Math.abs(run) * 0.2;
                ['FL', 'BR'].forEach(n => { const l = wolf.getObjectByName(n); if(l) l.rotation.x = run * 0.5; });
                ['FR', 'BL'].forEach(n => { const l = wolf.getObjectByName(n); if(l) l.rotation.x = -run * 0.5; });
                const tail = wolf.getObjectByName('Tail');
                if(tail) tail.rotation.y = Math.sin(elapsedTime * 20) * 0.3;
            }
        }

        // PUNCH 2: Guard
        if (obs.mesh.getObjectByName('Guard')) {
            const guard = obs.mesh.getObjectByName('Guard');
            if (guard) {
                const torso = guard.getObjectByName('Torso');
                if (torso) {
                    torso.rotation.y = Math.sin(elapsedTime * 2) * 0.1;
                }
            }
        }

        // JUMP ATTACK: Winter Bat (Updated)
        if (obs.mesh.getObjectByName('WinterBat')) {
            const bat = obs.mesh.getObjectByName('WinterBat');
            if(bat) {
                // Bobbing
                bat.position.y = 2.5 + Math.sin(elapsedTime * 3) * 0.5;
                
                // Wing Flap - INCREASED SPEED AND AMPLITUDE
                const lWing = bat.getObjectByName('WingL');
                const rWing = bat.getObjectByName('WingR');
                if (lWing && rWing) {
                    // Increased speed to 25, amplitude to 0.8
                    const flap = Math.sin(elapsedTime * 25) * 0.8;
                    lWing.rotation.z = flap; 
                    rWing.rotation.z = -flap; 
                }
            }
        }
    },
    
    animateBoss: (boss: Obstacle, elapsedTime: number, delta: number, currentPhase: number) => {
        // --- ADDED MIXER UPDATE FOR BOSSES ---
        const mixer = findMixer(boss.mesh);
        if (mixer) mixer.update(delta);

        // --- ANIMATE MINIONS (PUNCH1/PUNCH2) BEHIND BOSS ---
        ['Minion_L', 'Minion_R'].forEach(name => {
            const minion = boss.mesh.getObjectByName(name);
            if (minion) {
                // 1. GLB Animation (If Model)
                const mMixer = findMixer(minion);
                if (mMixer) mMixer.update(delta);

                // 2. Voxel Animation Fallbacks
                
                // Fallback for PUNCH1 (Wolf)
                const wolf = minion.getObjectByName('Wolf');
                if (wolf) {
                    const run = Math.sin(elapsedTime * 15);
                    wolf.position.y = Math.abs(run) * 0.2;
                    ['FL', 'BR'].forEach(n => { const l = wolf.getObjectByName(n); if(l) l.rotation.x = run * 0.5; });
                    ['FR', 'BL'].forEach(n => { const l = wolf.getObjectByName(n); if(l) l.rotation.x = -run * 0.5; });
                    const tail = wolf.getObjectByName('Tail');
                    if(tail) tail.rotation.y = Math.sin(elapsedTime * 20) * 0.3;
                }

                // Fallback for PUNCH2 (Guard)
                const guard = minion.getObjectByName('Guard');
                if (guard) {
                    // Marching
                    const walk = Math.sin(elapsedTime * 10);
                    const lLeg = guard.getObjectByName('L_Leg');
                    const rLeg = guard.getObjectByName('R_Leg');
                    if (lLeg) lLeg.rotation.x = walk * 0.5;
                    if (rLeg) rLeg.rotation.x = -walk * 0.5;
                    const torso = guard.getObjectByName('Torso');
                    if(torso) torso.rotation.y = Math.sin(elapsedTime * 5) * 0.1;
                }
            }
        });

        if (currentPhase === 1) { // Alpha Wolf (Single)
            const wolf = boss.mesh.getObjectByName('AlphaWolf');
            if (wolf) {
                // Running / Breathing motion
                wolf.position.y = (wolf.userData.origY || -1.4) + Math.sin(elapsedTime * 5) * 0.1;
                
                // Simple logic for voxel fallback (GLB has its own animation via mixer)
                if (wolf.getObjectByName('Head')) {
                    const head = wolf.getObjectByName('Head');
                    if(head) head.rotation.x = Math.sin(elapsedTime * 5) * 0.1 + 0.2;
                    ['FL', 'BR'].forEach(n => { const l = wolf.getObjectByName(n); if(l) l.rotation.x = Math.sin(elapsedTime*10)*0.4; });
                    ['FR', 'BL'].forEach(n => { const l = wolf.getObjectByName(n); if(l) l.rotation.x = -Math.sin(elapsedTime*10)*0.4; });
                }
            }
        } 
        else if (currentPhase === 2) { // Marshmallow
            const m = boss.mesh.getObjectByName('Marshmallow');
            if (m) {
                m.position.y = (boss.mesh.userData.origY || 0); 
                const torso = m.getObjectByName('Torso');
                if(torso) {
                    const head = torso.getObjectByName('Head');
                    if(head) head.rotation.x = -0.2 + Math.sin(elapsedTime * 3) * 0.2;
                    const lArm = torso.getObjectByName('L_Arm');
                    const rArm = torso.getObjectByName('R_Arm');
                    if(lArm) { lArm.rotation.x = Math.sin(elapsedTime * 2) * 0.5 - 0.5; lArm.rotation.z = 0.2; }
                    if(rArm) { rArm.rotation.x = Math.cos(elapsedTime * 2) * 0.5 - 0.5; rArm.rotation.z = -0.2; }
                }
            }
        }
        else if (currentPhase === 3) { // Duke
            const duke = boss.mesh.getObjectByName('Duke');
            if (duke) {
                const torso = duke.getObjectByName('Torso');
                const rArm = torso?.getObjectByName('R_Arm');
                if (rArm) {
                    rArm.rotation.x = -1.5; 
                    rArm.rotation.z = Math.sin(elapsedTime * 15) * 0.1; 
                }
                duke.position.z = -1.0 + Math.sin(elapsedTime) * 0.5; 
            }
        }
        else if (currentPhase === 4) { // Hans
            const hans = boss.mesh.getObjectByName('Hans');
            if (hans) {
                const rArm = hans.getObjectByName('Torso')?.getObjectByName('R_Arm');
                if(rArm) {
                    rArm.rotation.x = -1.0 + Math.sin(elapsedTime * 4) * 0.5;
                    rArm.rotation.y = Math.cos(elapsedTime * 4) * 0.5;
                }
                hans.position.x = Math.sin(elapsedTime * 0.5) * 1.5; 
            }
        }
    },
    
    animateBackgroundObject: (obj: THREE.Object3D, elapsedTime: number, delta: number) => {
    }
};
