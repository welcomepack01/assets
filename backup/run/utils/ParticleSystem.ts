
import * as THREE from 'three';
import { EngineState } from '../gameTypes';
import { CurrentTheme } from '../theme/gameTheme';

export const ParticleSystem = {
    createCelebration: (engine: EngineState, pos: THREE.Vector3) => {
        if(!engine.scene) return;
        const colors = CurrentTheme.colors.particles.explosion;
        const geo = new THREE.PlaneGeometry(0.3, 0.3);
        for(let i=0; i<150; i++) {
            const mat = new THREE.MeshBasicMaterial({ color: colors[Math.floor(Math.random()*colors.length)], side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(pos);
            mesh.position.x += (Math.random()-0.5) * 5;
            mesh.position.y += (Math.random()-0.5) * 5;
            mesh.position.z += (Math.random()-0.5) * 5;
            engine.scene.add(mesh);
            engine.particles.push({ 
                mesh, velocity: new THREE.Vector3((Math.random()-0.5)*0.5, Math.random()*0.8, (Math.random()-0.5)*0.5), life: 4.0, type: 'confetti', color: new THREE.Color(mat.color)
            });
        }
    },

    createExplosion: (engine: EngineState, pos: THREE.Vector3, texture: THREE.Texture, count: number) => {
        if (!engine.scene) return;
        const geo = new THREE.PlaneGeometry(0.5, 0.5);
        const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
        for(let i=0; i<count; i++) {
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(pos);
            mesh.position.x += (Math.random() - 0.5) * 2;
            mesh.position.y += (Math.random() - 0.5) * 2;
            mesh.position.z += (Math.random() - 0.5) * 2;
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            engine.scene.add(mesh);
            engine.particles.push({
                mesh, velocity: new THREE.Vector3((Math.random()-0.5)*0.5, Math.random()*0.5, (Math.random()-0.5)*0.5), life: 1.0, type: 'debris'
            });
        }
    },

    createSnow: (engine: EngineState) => {
        if (!engine.scene || !engine.player.mesh) return;
        const px = engine.player.mesh.position.x; const pz = engine.player.mesh.position.z;
        const sandColors = CurrentTheme.colors.particles.dust;
        const pColor = sandColors[Math.floor(Math.random() * sandColors.length)];
        const geo = new THREE.BoxGeometry(0.15, 0.15, 0.15); 
        const mat = new THREE.MeshBasicMaterial({ color: pColor, transparent: true, opacity: 0.6 });
        const mesh = new THREE.Mesh(geo, mat); 
        mesh.position.set(px + (Math.random() - 0.5) * 40, 8 + Math.random() * 8, pz - 10 - Math.random() * 40);
        engine.scene.add(mesh); 
        engine.particles.push({ mesh, velocity: new THREE.Vector3((Math.random()-0.5)*0.2 + 0.1, -0.05 - Math.random()*0.05, 0), life: 3.0, type: 'snow' });
    },

    update: (engine: EngineState, delta: number) => {
        for (let i = engine.particles.length - 1; i >= 0; i--) {
            let p = engine.particles[i]; p.mesh.position.add(p.velocity);
            if (p.type === 'debris') { p.velocity.y -= 0.02; p.mesh.rotation.x += 0.1; p.mesh.rotation.y += 0.1; } 
            else if (p.type === 'snow') { p.mesh.rotation.x += 0.02; p.mesh.rotation.y += 0.02; } 
            else if (p.type === 'ember') { 
                p.mesh.rotation.x += 0.05; 
                if (p.mesh.material instanceof THREE.Material) (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(engine.elapsedTime * 10 + p.life) * 0.5 + 0.5;
            } else if (p.type === 'confetti') { p.velocity.y -= 0.01; p.mesh.rotation.x += 0.2; p.mesh.rotation.y += 0.2; }
            p.life -= delta;
            
            // Cleanup if far behind player
            if (engine.player.mesh && p.mesh.position.z > engine.player.mesh.position.z + 20) p.life = -1;
            
            if (p.life <= 0) { 
                engine.scene?.remove(p.mesh); 
                // Optional: dispose geometry/material here if needed for memory
                engine.particles.splice(i, 1); 
            }
        }
    },

    clear: (engine: EngineState) => {
        engine.particles.forEach(p => engine.scene?.remove(p.mesh));
        engine.particles = [];
    }
};
