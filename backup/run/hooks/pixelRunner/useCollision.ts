
import React, { useCallback } from 'react';
import * as THREE from 'three';
import { EngineState, GameState, Obstacle } from '../../gameTypes';
import { SoundManager } from '../../utils/gameUtils';
import { ParticleSystem } from '../../utils/ParticleSystem';
import { BOSS_FIGHT_DISTANCE, WALL_MAX_HP } from '../../gameConstants';

interface CollisionCallbacks {
    triggerMirrorSequence: (obstacle: Obstacle) => void;
    updateReactState: (updates: Partial<GameState>) => void;
}

export const useCollision = (
    engineRef: React.MutableRefObject<EngineState>,
    callbacks: CollisionCallbacks
) => {
    const { triggerMirrorSequence, updateReactState } = callbacks;

    const checkCollisions = useCallback((delta: number) => {
        const engine = engineRef.current;
        if (!engine.player.mesh || !engine.scene) return;

        const playerBox = new THREE.Box3().setFromObject(engine.player.mesh);
        playerBox.expandByScalar(-0.25);

        // Iterate backwards to allow removal
        for (let i = engine.obstacles.length - 1; i >= 0; i--) {
            const obs = engine.obstacles[i];

            // 1. DUMMY / LOGIC UPDATES
            if (obs.id === 99999) { 
                obs.mesh.rotation.y += 2.0 * delta; 
                continue; 
            }

            // 2. MIRROR WALL TRIGGER
            if (obs.data.action === 'mirror_wall') {
                const dist = obs.mesh.position.z - engine.player.mesh.position.z;
                if (dist > -2.0 && dist < 0.5 && !engine.isMirrorBlocked) { 
                    triggerMirrorSequence(obs); 
                    engine.player.mesh.position.z = obs.mesh.position.z + 1.5; 
                }
            }

            // 3. COLLISION BOX & BOSS MOVEMENT
            if (obs.data.action === 'final_boss') {
                const dist = obs.mesh.position.z - engine.player.mesh.position.z;
                if (dist > -15 && dist < -BOSS_FIGHT_DISTANCE && !engine.isBossFightActive) { 
                    engine.isBossFightActive = true; 
                    obs.mesh.position.z = engine.player.mesh.position.z - BOSS_FIGHT_DISTANCE; 
                }
                
                if (!engine.isBossFightActive) { 
                    // UPDATED: Boss moves away at 80% of player speed.
                    // This increases the relative closing speed, making the chase shorter.
                    const vSpeed = (engine.player.isBlocked || engine.isMirrorBlocked || engine.isCheering) 
                        ? 0 
                        : Math.max(0.01, engine.player.speed * 0.80); 
                        
                    obs.mesh.position.z -= vSpeed; 
                } else { 
                    obs.mesh.position.z = engine.player.mesh.position.z - BOSS_FIGHT_DISTANCE; 
                }
                obs.box.setFromObject(obs.mesh).expandByScalar(-0.2);
            } else if (obs.data.action === 'wall_blockade') {
                const dist = obs.mesh.position.z - engine.player.mesh.position.z;
                if (dist > -12 && dist < -2.5 && !engine.isWallFightActive) { 
                    engine.isWallFightActive = true; 
                    engine.player.isBlocked = true; 
                    updateReactState({ isWallFightActive: true, wallMonsterHP: obs.data.hp || WALL_MAX_HP }); 
                }
                obs.box.setFromObject(obs.mesh).expandByScalar(-0.2);
            } else { 
                 obs.box.setFromObject(obs.mesh);
                 if (obs.data.action === 'jump' || obs.data.type === 'cone' || obs.data.action === 'big_jump' || obs.data.action === 'jump_attack') { 
                     obs.box.max.y = 1.0; 
                     obs.box.expandByScalar(-0.5); 
                 } else { 
                     obs.box.expandByScalar(-0.3); 
                 }
            }
            
            // 4. INTERACTION (PUNCHING)
            const isPunchActive = engine.player.isPunching || engine.player.isDoublePunching;
            const zDiff = obs.mesh.position.z - engine.player.mesh.position.z;
            const xDiff = Math.abs(obs.mesh.position.x - engine.player.mesh.position.x);
            
            const isPunchTarget = ['punch', 'double_punch', 'monster_weak', 'monster_strong'].includes(obs.data.action) || 
                                  ['monster_weak', 'monster_strong'].includes(obs.data.type || ''); 
            
            if (isPunchActive && isPunchTarget && zDiff > -10 && zDiff < 5) {
                if ((obs.data.action === 'double_punch' || obs.data.type === 'monster_strong') && engine.player.isDoublePunching) {
                     // Punch 2 Obstacle (Strong) -> punch2.mp3
                     SoundManager.playCustom('sfx_punch2'); 
                     engine.distanceBonus += 20; 
                     engine.shakeIntensity = 0.6; 
                     ParticleSystem.createExplosion(engine, obs.mesh.position, engine.textures.iceGolem, 30);
                     engine.scene?.remove(obs.mesh); 
                     engine.obstacles.splice(i, 1); 
                     continue;
                } 
                else if (['punch', 'monster_weak'].includes(obs.data.action) || obs.data.type === 'monster_weak') {
                    // Punch 1 Obstacle (Weak) -> punch1.mp3
                    SoundManager.playCustom('sfx_punch1');
                    engine.distanceBonus += 10;
                    engine.shakeIntensity = 0.4; 
                    const texture = (obs.data.action === 'punch' || obs.data.type === 'monster_weak') ? engine.textures.iceGolem : engine.textures.giftBox;
                    ParticleSystem.createExplosion(engine, obs.mesh.position, texture, 20);
                    engine.scene?.remove(obs.mesh); 
                    engine.obstacles.splice(i, 1); 
                    continue;
                }
            }

            if (obs.data.action === 'jump_attack' && engine.player.isJumping && zDiff > -5 && zDiff < 5 && xDiff < 2.0) {
                // Jump Punch Obstacle -> punch3.mp3
                SoundManager.playCustom('sfx_punch3');
                engine.distanceBonus += 30; 
                engine.shakeIntensity = 0.7;
                ParticleSystem.createExplosion(engine, obs.mesh.position, engine.textures.iceGolem, 40);
                engine.scene?.remove(obs.mesh); 
                engine.obstacles.splice(i, 1); 
                continue;
            }

            // 5. PLAYER COLLISION
            if (playerBox.intersectsBox(obs.box)) {
                if (obs.data.action === 'final_boss' && engine.isBossFightActive) { continue; }
                
                if (obs.data.action === 'final_boss' || obs.data.action === 'wall_blockade') { 
                    if (!engine.player.isBlocked) { 
                        engine.player.isBlocked = true; 
                        SoundManager.playCrash(); 
                    } 
                }
                else if (obs.data.action !== 'mirror_wall') { 
                    if (engine.isAI) { 
                        engine.scene?.remove(obs.mesh); 
                        engine.obstacles.splice(i, 1); 
                        continue; 
                    }
                    SoundManager.playCrash(); 
                    if (obs.data.action !== 'jump') engine.shakeIntensity = 0.8; 
                    ParticleSystem.createExplosion(engine, engine.player.mesh.position, engine.textures.snowGround, 15);
                    engine.scene?.remove(obs.mesh); 
                    engine.obstacles.splice(i, 1);
                }
                continue;
            }
            
            // 6. CLEANUP (Out of view)
            if (obs.mesh.position.z > engine.player.mesh.position.z + 10 && !['final_boss', 'wall_blockade'].includes(obs.data.action)) { 
                engine.scene?.remove(obs.mesh); 
                engine.obstacles.splice(i, 1); 
            }
        }
    }, [engineRef, triggerMirrorSequence, updateReactState]);

    return { checkCollisions };
};
