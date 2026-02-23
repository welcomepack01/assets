
import * as THREE from 'three';
import { ThemeAnimators, Obstacle } from '../../gameTypes';

// Helper to find mixer in hierarchy
const findMixer = (obj: THREE.Object3D): THREE.AnimationMixer | undefined => {
    if (obj.userData && obj.userData.mixer) return obj.userData.mixer;
    for (const child of obj.children) {
        const mixer = findMixer(child);
        if (mixer) return mixer;
    }
    return undefined;
};

export const ZootopiaAnimators: ThemeAnimators = {
    animateObstacle: (obs: Obstacle, elapsedTime: number, delta: number) => {
        // --- CRITICAL: Update Animation Mixer for GLB Models ---
        const mixer = findMixer(obs.mesh);
        if (mixer) {
            mixer.update(delta);
        }

        // Jump: Wide Road Barricade (A) OR Cones (B)
        if (obs.data.action === 'jump') {
            const barricade = obs.mesh.getObjectByName('Barricade');
            if (barricade) {
                // Flash Speed (Fast strobe)
                const flash = Math.sin(elapsedTime * 15) > 0;
                barricade.traverse(child => {
                    if (child.name === 'WarningLightLens' && child instanceof THREE.Mesh) {
                        const mat = child.material as THREE.MeshStandardMaterial;
                        mat.emissiveIntensity = flash ? 3.0 : 0.2;
                    }
                });
            }
            
            // Variant B: Cones
            const cones = obs.mesh.getObjectByName('ConstructionCones');
            if (cones) {
                // Flash Lights (Yellow / Orange Blinking)
                const time = elapsedTime * 10;
                const flash = Math.sin(time) > 0;
                cones.traverse(child => {
                    if (child.name === 'ConeLight' && child instanceof THREE.Mesh) {
                        const mat = child.material as THREE.MeshStandardMaterial;
                        mat.emissiveIntensity = 2.0;
                        // Blink between Yellow (0xFFC107) and Orange (0xFF5722)
                        mat.emissive.setHex(flash ? 0xFFC107 : 0xFF5722);
                    }
                });
            }
        }
        
        // Crouch: Pipe Arch (A) OR Industrial Pipe (B)
        if (obs.data.action === 'crouch') {
            // Variant A: Hanging Sign
            const sign = obs.mesh.getObjectByName('HangingSign');
            if (sign) {
                // UPDATED: Swinging motion pivoted at top (Windblown)
                // Remove previous sliding
                sign.position.x = 0; 
                
                // Swing back and forth (X-axis rotation)
                sign.rotation.x = Math.sin(elapsedTime * 3.0) * 0.25; 
                
                // Slight twist for turbulence
                sign.rotation.y = Math.sin(elapsedTime * 1.0) * 0.05; 
            }
            
            // Variant B: Industrial Pipe Fan
            // UPDATED: Rotate only the spinner, not the whole pipe or housing
            const spinner = obs.mesh.getObjectByName('FanSpinner');
            if (spinner) {
                spinner.rotation.z -= delta * 10.0;
            }
        }
        
        // Big Jump: ZPD Barricade (A) OR Construction Barrier (B)
        if (obs.data.action === 'big_jump') {
            // Variant A: Sirens
            const zpd = obs.mesh.getObjectByName('ZPDBarrier');
            if (zpd) {
                const flashSpeed = 12.0;
                const phase = Math.sin(elapsedTime * flashSpeed);
                zpd.traverse(child => {
                    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                        if (child.name === 'SirenRed') child.material.emissiveIntensity = phase > 0 ? 4.0 : 0.2;
                        if (child.name === 'SirenBlue') child.material.emissiveIntensity = phase < 0 ? 4.0 : 0.2;
                    }
                });
                const logo = zpd.getObjectByName('ZPDLogo');
                if (logo) logo.position.y = 2.6 + Math.sin(elapsedTime * 2) * 0.1; 
            }
            
            // Variant B: Construction
            const constr = obs.mesh.getObjectByName('ConstructionBarrier');
            if (constr) {
                const beacon = constr.getObjectByName('RotatingBeacon');
                if (beacon) beacon.rotation.y += delta * 5.0; // Rotate light
                
                const sign = constr.getObjectByName('HangingDangerSign');
                if (sign) sign.rotation.x = Math.sin(elapsedTime * 3) * 0.1; // Swinging sign
            }
        }
        
        // Dodge A: Benny (Wave)
        if (obs.mesh.getObjectByName('Benny')) {
            const benny = obs.mesh.getObjectByName('Benny');
            if (benny) {
                const rArm = benny.getObjectByName('R_Arm');
                if (rArm) {
                    rArm.rotation.z = Math.sin(elapsedTime * 5) * 0.5 + 0.5; // Wave
                }
                const head = benny.getObjectByName('Head');
                if (head) head.rotation.y = Math.sin(elapsedTime) * 0.2;
            }
        }
        
        // Dodge B: Pen (Stab)
        if (obs.mesh.getObjectByName('PoisonPen')) {
            const pen = obs.mesh.getObjectByName('PoisonPen');
            if (pen) {
                const stab = Math.sin(elapsedTime * 5);
                pen.position.z += stab * 0.1; // Thrust
                if (stab > 0.8) pen.position.z += 0.2; // Jerk
            }
        }
        
        // Punch 1: Duke (Run)
        if (obs.mesh.getObjectByName('Duke')) {
            const duke = obs.mesh.getObjectByName('Duke');
            if (duke) {
                const run = Math.sin(elapsedTime * 15);
                duke.position.y = Math.abs(run) * 0.1;
            }
        }
        
        // Punch 2: Guard (Swipe)
        if (obs.mesh.getObjectByName('LynxGuard')) {
            const guard = obs.mesh.getObjectByName('LynxGuard');
            if (guard) {
                const rArm = guard.getObjectByName('R_Arm');
                if (rArm) rArm.rotation.x = -Math.abs(Math.sin(elapsedTime * 5)) * 1.5;
            }
        }
        
        // Jump Punch: ZPD Drone (High Quality Animation)
        if (obs.mesh.getObjectByName('Drone')) {
            const drone = obs.mesh.getObjectByName('Drone');
            if (drone) {
                // 1. Hover Motion (Gentle Bobbing)
                drone.position.y = 3.2 + Math.sin(elapsedTime * 2.5) * 0.3;
                
                // 2. Banking/Tilt (Searching Pattern)
                drone.rotation.z = Math.sin(elapsedTime * 1.5) * 0.1; // Roll
                drone.rotation.x = Math.sin(elapsedTime * 1.0) * 0.05; // Pitch

                // 3. Propeller Spin (Fast)
                drone.traverse(child => {
                    if (child.name === 'Propeller') {
                        child.rotation.y += delta * 25.0; // Fast spin
                    }
                });

                // 4. Siren Flashing (Red/Blue Alternate)
                const flashSpeed = 8.0; 
                const sirenRed = drone.getObjectByName('SirenRed') as THREE.Mesh;
                const sirenBlue = drone.getObjectByName('SirenBlue') as THREE.Mesh;
                
                if (sirenRed && sirenRed.material instanceof THREE.MeshStandardMaterial) {
                    const intensity = Math.sin(elapsedTime * flashSpeed) > 0 ? 3.0 : 0.2;
                    sirenRed.material.emissiveIntensity = intensity;
                }
                if (sirenBlue && sirenBlue.material instanceof THREE.MeshStandardMaterial) {
                    const intensity = Math.sin(elapsedTime * flashSpeed + Math.PI) > 0 ? 3.0 : 0.2; 
                    sirenBlue.material.emissiveIntensity = intensity;
                }
            }
        }
    },
    
    animateBoss: (boss: Obstacle, elapsedTime: number, delta: number, currentPhase: number) => {
        // Update Mixer for Bosses too
        const mixer = findMixer(boss.mesh);
        if (mixer) mixer.update(delta);

        // --- DISABLE MOTION FOR VIDEO PLANES ---
        // If the boss mesh contains a VideoPlane, we skip procedural animation
        if (boss.mesh.getObjectByName('VideoPlane')) return;

        // Fallback animations for Voxel/GLB models if VideoPlane is not present
        if (currentPhase === 1) { // Van
            const van = boss.mesh.getObjectByName('Van');
            if (van) {
                van.position.x = Math.sin(elapsedTime * 2) * 2.0; // Zigzag
                van.rotation.z = -Math.sin(elapsedTime * 2) * 0.1; // Tilt
            }
        } else if (currentPhase === 2) { // Gary
            const snake = boss.mesh.getObjectByName('Gary');
            if (snake) {
                const neck = snake.getObjectByName('Neck');
                if (neck) {
                    neck.rotation.z = Math.sin(elapsedTime * 2) * 0.3;
                    const head = neck.getObjectByName('Head');
                    if(head) head.rotation.x = Math.sin(elapsedTime * 5) * 0.2; // Hiss
                }
            }
        } else if (currentPhase === 3) { // Robert
            const robert = boss.mesh.getObjectByName('Robert');
            if (robert) {
                robert.position.y = Math.sin(elapsedTime) * 0.5;
            }
        } else if (currentPhase === 4) { // Milton
            const milton = boss.mesh.getObjectByName('Milton');
            if (milton) {
                const lClaw = milton.getObjectByName('L_Claw');
                const rClaw = milton.getObjectByName('R_Claw');
                if (lClaw) lClaw.rotation.x = -Math.abs(Math.sin(elapsedTime * 2)) * 1.0;
                if (rClaw) rClaw.rotation.x = -Math.abs(Math.sin(elapsedTime * 2 + 1)) * 1.0;
            }
        }
    },
    
    animateBackgroundObject: (obj: THREE.Object3D, elapsedTime: number, delta: number) => {}
};
