
import * as THREE from 'three';
import { ThemeAnimators, Obstacle } from '../../gameTypes';

export const DragonBallAnimators: ThemeAnimators = {
    animateObstacle: (obs: Obstacle, elapsedTime: number, delta: number) => {
        // Jump: Dragon Balls (Roll Towards Player)
        if (obs.data.action === 'jump') {
            obs.mesh.children.forEach((child) => {
                if (child.name === 'DragonBall') {
                     child.rotation.x -= delta * 10.0; 
                }
            });
        }
        
        // Crouch: Tunnel
        
        // Big Jump: Giant Rising Rocks (Move Up)
        if (obs.data.action === 'big_jump') {
            obs.mesh.children.forEach((child) => {
                if (child.name === 'RisingRock') {
                    // Vertical motion removed as requested
                    child.position.y = 0; 
                    child.rotation.y += delta * 0.5; // Slow spin
                }
            });
        }
        
        // Dodge A: Bulma
        if (obs.mesh.getObjectByName('Bulma')) {
            const bulma = obs.mesh.getObjectByName('Bulma');
            if(bulma) {
                const swing = Math.sin(elapsedTime * 10) * 0.6;
                const lLeg = bulma.getObjectByName('L_Leg');
                const rLeg = bulma.getObjectByName('R_Leg');
                const torso = bulma.getObjectByName('Torso');
                const lArm = torso?.getObjectByName('L_Arm'); 
                const rArm = torso?.getObjectByName('R_Arm');
                if (lLeg) lLeg.rotation.x = swing;
                if (rLeg) rLeg.rotation.x = -swing;
                if (lArm) { lArm.rotation.x = -swing; lArm.rotation.z = 0.1; }
                if (rArm) { rArm.rotation.x = swing; rArm.rotation.z = -0.1; }
                const head = bulma.getObjectByName('Head');
                const hair = head?.getObjectByName('Hair');
                const pony = hair?.getObjectByName('Ponytail');
                if (pony) {
                    pony.rotation.z = Math.sin(elapsedTime * 10) * 0.3; 
                    pony.rotation.x = 0.2 + Math.abs(Math.cos(elapsedTime * 10)) * 0.2; 
                }
            }
        }

        // Dodge A: Master Roshi
        if (obs.mesh.getObjectByName('MasterRoshi')) {
            const roshi = obs.mesh.getObjectByName('MasterRoshi');
            if (roshi) {
                const swing = Math.sin(elapsedTime * 10) * 0.5;
                const lLeg = roshi.getObjectByName('L_Leg');
                const rLeg = roshi.getObjectByName('R_Leg');
                const torso = roshi.getObjectByName('Torso');
                const lArm = torso?.getObjectByName('L_Arm');
                const rArm = torso?.getObjectByName('R_Arm');
                const head = torso?.getObjectByName('Head');
                const beard = head?.getObjectByName('Beard');
                if (lLeg) lLeg.rotation.x = swing;
                if (rLeg) rLeg.rotation.x = -swing;
                if (lArm) lArm.rotation.x = -swing;
                if (rArm) rArm.rotation.x = swing * 0.3; 
                if (beard) {
                    beard.rotation.z = Math.sin(elapsedTime * 10) * 0.2;
                }
                roshi.position.y = Math.abs(Math.sin(elapsedTime * 10)) * 0.05;
            }
        }
        
        // Dodge B: Piccolo / Krillin
        const piccolo = obs.mesh.getObjectByName('Piccolo');
        const krillin = obs.mesh.getObjectByName('Krillin');
        const dodgerB = piccolo || krillin;
        if (dodgerB) {
            const swing = Math.sin(elapsedTime * 10) * 0.6;
            const lLeg = dodgerB.getObjectByName('L_Leg');
            const rLeg = dodgerB.getObjectByName('R_Leg');
            const torso = dodgerB.getObjectByName('Torso'); 
            const lArm = torso?.getObjectByName('L_Arm'); 
            const rArm = torso?.getObjectByName('R_Arm');
            const cape = torso?.getObjectByName('Cape');
            if (lLeg) lLeg.rotation.x = swing;
            if (rLeg) rLeg.rotation.x = -swing;
            if (lArm) lArm.rotation.x = -swing;
            if (rArm) rArm.rotation.x = swing;
            if (cape) {
                cape.rotation.x = 0.1 + Math.sin(elapsedTime * 10) * 0.1;
            }
            if (krillin) {
                dodgerB.position.y = Math.abs(Math.sin(elapsedTime * 12)) * 0.05; 
            }
        }
        
        // Punch 1 & 2: Dabura / Android 20
        if (obs.mesh.getObjectByName('Ginyu')) {
            const char = obs.mesh.getObjectByName('Ginyu');
            const dabura = char?.getObjectByName('Dabura');
            if (dabura) {
                const torso = dabura.getObjectByName('Torso');
                const lLeg = dabura.getObjectByName('L_Leg');
                const rLeg = dabura.getObjectByName('R_Leg');
                const lArm = torso?.getObjectByName('L_Arm');
                const rArm = torso?.getObjectByName('R_Arm');
                const cape = torso?.getObjectByName('Cape');
                const walkCycle = Math.sin(elapsedTime * 9);
                if (lLeg) lLeg.rotation.x = walkCycle * 0.5;
                if (rLeg) rLeg.rotation.x = -walkCycle * 0.5;
                if (lArm) { lArm.rotation.x = -walkCycle * 0.4; lArm.rotation.z = -0.1; }
                if (rArm) { rArm.rotation.x = walkCycle * 0.4; rArm.rotation.z = 0.1; }
                if (cape) cape.rotation.x = 0.2 + Math.sin(elapsedTime * 10) * 0.15;
                dabura.position.y = Math.abs(Math.sin(elapsedTime * 18)) * 0.05;
            } else if (char?.getObjectByName('Android20')) {
                const android = char.getObjectByName('Android20');
                if (android) {
                    const lLeg = android.getObjectByName('L_Leg');
                    const rLeg = android.getObjectByName('R_Leg');
                    const torso = android.getObjectByName('Torso');
                    const head = torso?.getObjectByName('Head');
                    const hair = head?.getObjectByName('Hair');
                    const lArm = torso?.getObjectByName('L_Arm');
                    const rArm = torso?.getObjectByName('R_Arm');
                    const walkCycle = Math.sin(elapsedTime * 8);
                    if (lLeg) lLeg.rotation.x = walkCycle * 0.5;
                    if (rLeg) rLeg.rotation.x = -walkCycle * 0.5;
                    if (lArm) { lArm.rotation.x = -0.5 + walkCycle * 0.3; lArm.rotation.z = -0.2; }
                    if (rArm) { rArm.rotation.x = -0.5 - walkCycle * 0.3; rArm.rotation.z = 0.2; }
                    if (hair) {
                        hair.rotation.x = 0.2 + Math.sin(elapsedTime * 8) * 0.1;
                        hair.rotation.z = Math.cos(elapsedTime * 4) * 0.05;
                    }
                    android.position.y = Math.abs(Math.sin(elapsedTime * 16)) * 0.03;
                }
            }
        }
        
        // Jump Attack: Babidi
        if (obs.mesh.getObjectByName('Babidi')) {
            const babidi = obs.mesh.getObjectByName('Babidi');
            if (babidi) {
                babidi.position.y = 2.5 + Math.sin(elapsedTime * 4) * 0.4;
                babidi.rotation.z = Math.sin(elapsedTime * 2) * 0.1; 
                const cape = babidi.getObjectByName('Cape');
                if (cape) {
                    cape.rotation.x = 0.3 + Math.sin(elapsedTime * 10) * 0.2;
                }
                const lArm = babidi.getObjectByName('L_Arm');
                const rArm = babidi.getObjectByName('R_Arm');
                if (lArm && rArm) {
                    lArm.rotation.z = Math.sin(elapsedTime * 8) * 0.3;
                    rArm.rotation.z = -Math.sin(elapsedTime * 8) * 0.3;
                }
            }
        }
    },
    
    animateBoss: (boss: Obstacle, elapsedTime: number, delta: number, currentPhase: number) => {
        if (currentPhase === 1) { // VEGETA - CHARGING KI (Natural Down / A-Pose)
            const vegeta = boss.mesh.getObjectByName('Vegeta');
            if (vegeta) {
                // Violent Shake effect
                vegeta.position.x = (Math.random() - 0.5) * 0.05;
                vegeta.position.y = 0.7 + (Math.random() - 0.5) * 0.05;
                vegeta.position.z = (Math.random() - 0.5) * 0.05;

                const lLeg = vegeta.getObjectByName('L_Leg');
                const rLeg = vegeta.getObjectByName('R_Leg');
                const torso = vegeta.getObjectByName('Torso');
                const lArm = vegeta.getObjectByName('L_Arm');
                const rArm = vegeta.getObjectByName('R_Arm');
                
                // Stand firm (Wide stance)
                if (lLeg) lLeg.rotation.x = 0.2;
                if (rLeg) rLeg.rotation.x = 0.2;
                if (torso) torso.rotation.x = 0.1;

                // Charging Pose (Natural A-Shape: Arms Down and slightly Out)
                // Arms hang down (-Y geometry).
                // Left Arm (-X): Rotate Negative Z (CW) to move tip Left (Outwards).
                // Right Arm (+X): Rotate Positive Z (CCW) to move tip Right (Outwards).
                if (lArm) { 
                    lArm.rotation.z = -0.4 + Math.sin(elapsedTime * 20) * 0.05; 
                    lArm.rotation.x = -0.1; 
                }
                if (rArm) { 
                    rArm.rotation.z = 0.4 - Math.sin(elapsedTime * 20) * 0.05; 
                    rArm.rotation.x = -0.1;
                }

                // Aura Pulse (Fast)
                const aura = vegeta.getObjectByName('KiAura');
                if (aura) {
                    const s = 1.0 + Math.random() * 0.2;
                    aura.scale.set(s, s*1.3, s);
                    aura.rotation.y += delta * 8.0;
                }
            }
        } else if (currentPhase === 2) { // FRIEZA
            const frieza = boss.mesh.getObjectByName('Frieza');
            if (frieza) {
                frieza.position.y = 1.0 + Math.sin(elapsedTime * 1.5) * 0.4;
                frieza.position.x = 0; 
                frieza.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1;
                const tail = frieza.getObjectByName('Tail');
                const lLeg = frieza.getObjectByName('L_Leg');
                const rLeg = frieza.getObjectByName('R_Leg');
                const torso = frieza.getObjectByName('Torso');
                if (tail) { tail.rotation.y = Math.sin(elapsedTime * 3) * 0.3; tail.rotation.x = 0.2 + Math.sin(elapsedTime * 2) * 0.1; }
                if (lLeg) lLeg.rotation.x = 0.2 + Math.sin(elapsedTime * 1.5 + 0.5) * 0.1;
                if (rLeg) rLeg.rotation.x = 0.2 + Math.sin(elapsedTime * 1.5) * 0.1;

                // Animate Magic Rocks
                const magic = frieza.getObjectByName('PurpleMagic');
                if (magic) {
                    magic.rotation.y -= delta * 1.5;
                    magic.rotation.x = Math.sin(elapsedTime) * 0.2;
                    magic.children.forEach((rock, i) => {
                        rock.position.y += Math.sin(elapsedTime * 3 + i) * 0.01;
                    });
                }
            }
        } else if (currentPhase === 3) { // PERFECT CELL
            const cell = boss.mesh.getObjectByName('Cell');
            if (cell) {
                const speed = 6; 
                cell.position.x = 0; 
                cell.rotation.y = Math.cos(elapsedTime * 0.4) * 0.1;
                const lLeg = cell.getObjectByName('L_Leg');
                const rLeg = cell.getObjectByName('R_Leg');
                const lArm = cell.getObjectByName('Torso')?.getObjectByName('L_Arm');
                const rArm = cell.getObjectByName('Torso')?.getObjectByName('R_Arm');
                const wings = cell.getObjectByName('Torso')?.getObjectByName('Wings');
                const swing = Math.sin(elapsedTime * speed) * 0.6;
                if (lLeg) lLeg.rotation.x = swing;
                if (rLeg) rLeg.rotation.x = -swing;
                if (lArm) { lArm.rotation.x = -swing * 0.5; lArm.rotation.z = 0.1; }
                if (rArm) { rArm.rotation.x = swing * 0.5; rArm.rotation.z = -0.1; }
                if (wings) {
                    const wingL = wings.getObjectByName('Wing_L');
                    const wingR = wings.getObjectByName('Wing_R');
                    if (wingL && wingR) {
                        const flap = Math.sin(elapsedTime * 15) * 0.5;
                        wingL.rotation.y = flap; 
                        wingR.rotation.y = -flap;
                    }
                }
                
                // Animate Green Aura Shield
                const shield = cell.getObjectByName('GreenAura');
                if (shield && shield instanceof THREE.Mesh) {
                    const s = 1.2 + Math.sin(elapsedTime * 5) * 0.05;
                    shield.scale.set(s, s*1.2, s);
                    if (shield.material instanceof THREE.MeshStandardMaterial) {
                        shield.material.opacity = 0.2 + Math.abs(Math.sin(elapsedTime * 3)) * 0.2;
                    }
                }
            }
        } else if (currentPhase === 4) { // MAJIN BUU
            const buu = boss.mesh.getObjectByName('Buu');
            if (buu) {
                const speed = 7; 
                buu.position.x = 0; 
                buu.position.y = 0; 
                
                buu.rotation.z = Math.sin(elapsedTime * 1.5) * 0.05; 

                const lLeg = buu.getObjectByName('L_Leg');
                const rLeg = buu.getObjectByName('R_Leg');
                const torso = buu.getObjectByName('Torso');
                const cape = torso?.getObjectByName('Cape');
                const head = torso?.getObjectByName('Head');
                const tentacle = head?.getObjectByName('Tentacle');
                const lArm = torso?.getObjectByName('L_Arm');
                const rArm = torso?.getObjectByName('R_Arm');

                // Walking Legs
                const legSwing = Math.sin(elapsedTime * speed) * 0.7;
                if (lLeg) lLeg.rotation.x = legSwing;
                if (rLeg) rLeg.rotation.x = -legSwing;

                // Arms Swinging opposite to legs
                if (lArm) lArm.rotation.x = -legSwing * 0.6;
                if (rArm) rArm.rotation.x = legSwing * 0.6;

                if (cape) { cape.rotation.x = 0.3 + Math.sin(elapsedTime * 5) * 0.2; }
                if (tentacle) { tentacle.rotation.z = Math.sin(elapsedTime * 4) * 0.4; tentacle.rotation.x = -0.3 + Math.cos(elapsedTime * 3) * 0.2; }

                // Animate Electro Sparks
                const sparks = buu.getObjectByName('ElectroField');
                if (sparks) {
                    sparks.children.forEach(s => {
                        s.visible = Math.random() > 0.5;
                        s.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
                    });
                }
            }
        }
    },
    
    animateBackgroundObject: (obj: THREE.Object3D, elapsedTime: number, delta: number) => {
        // Flying Objects - Tumbling towards player effect
        if (obj.name === 'bg_floater') {
            const data = obj.userData;
            // Tumble
            obj.rotation.x += delta * data.rotSpeedX;
            obj.rotation.y += delta * data.rotSpeedY;
            obj.rotation.z += delta * 1.0; 
            
            // Bob up/down
            obj.position.y += Math.sin(elapsedTime * data.floatSpeed + data.floatOffset) * delta * 0.5;
        }
    }
};
