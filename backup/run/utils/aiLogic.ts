
import * as THREE from 'three';
import { EngineState, Obstacle } from '../gameTypes';
import { SoundManager } from './gameUtils';
import { LANE_DISTANCE, BOSS_FIGHT_DISTANCE } from '../gameConstants';

interface AIActionCallbacks {
    changeLane: (dir: number) => void;
    triggerPunch: () => void;
    triggerDoublePunch: () => void;
}

export const processAIAndGetGuide = (
    engine: EngineState,
    callbacks: AIActionCallbacks
): { text: string; id: number; actionType: string } => {
    if (!engine.player.mesh) return { text: "", id: -1, actionType: "" };
    if (engine.isBossDeadTransition) return { text: "", id: -1, actionType: "" };
    
    const { obstacles, player } = engine;
    const { changeLane, triggerPunch, triggerDoublePunch } = callbacks;
    const pz = player.mesh.position.z;

    // Check for Sprint condition (Trigger when boss is actually visible/close)
    if (engine.bossMode && !engine.isBossFightActive && !engine.player.isBlocked) {
        const boss = obstacles.find(o => o.data.action === 'final_boss');
        if (boss) {
            const dist = Math.abs(boss.mesh.position.z - player.mesh.position.z);
            
            // Adjusted: Trigger SPRINT! when boss is within 60m
            if (dist < 60 && dist > BOSS_FIGHT_DISTANCE + 5) {
                 return { text: "SPRINT!", id: 99990, actionType: "sprint" };
            }
        }
    }

    // Boss or Wall Fight Active
    if (engine.isBossFightActive || engine.isWallFightActive) {
            if (engine.isAI && !engine.player.isDoublePunching) triggerDoublePunch();
            
            // CHANGED: Boss Fight now uses "ONE-TWO!" guide instead of "FINAL BLOW!" (until mini-game)
            if (engine.isBossFightActive) return { text: "ONE-TWO!", id: 99999, actionType: "double_punch" };
            
            if (engine.isWallFightActive) return { text: "BREAK WALL!", id: 99999, actionType: "double_punch" };
            return { text: "ONE-TWO!", id: 99999, actionType: "double_punch" };
    }
    
    const currentLane = player.lane;
    const lookAheadDist = 45; 
    let closestObs: Obstacle | null = null;
    let closestDist = Infinity;

    // Find closest relevant obstacle
    for (const obs of obstacles) {
        const oz = obs.mesh.position.z;
        const d = pz - oz;
        if (d < -5 || d > lookAheadDist) continue;
        
        let isRelevant = false;
        if (obs.data.action === 'mirror_wall') { 
            isRelevant = true; 
        }
        else if (['red_monster', 'bat', 'blue_monster', 'eagle', 'jump_attack', 'punch', 'double_punch'].includes(obs.data.action)) {
            const laneVal = (obs.mesh.userData.origX / LANE_DISTANCE) + 0.5;
            if (Math.round(laneVal) === currentLane) isRelevant = true;
        } 
        else if (obs.data.type === 'cone' || obs.data.type === 'wall' || obs.data.action === 'big_jump' || obs.data.action === 'jump' || obs.data.action === 'crouch') {
            isRelevant = true;
        }
        else {
            const laneVal = (obs.mesh.userData.origX / LANE_DISTANCE) + 0.5;
            let lane = Math.round(laneVal);
            if (Math.abs(obs.mesh.userData.origX) < 0.1) lane = currentLane; 
            if (lane === currentLane) isRelevant = true;
        }
        
        if (isRelevant) {
            if (d < closestDist) { closestDist = d; closestObs = obs; }
        }
    }

    let guide = ""; let guideId = -1; let actionType = ""; let guideActionType = "";
    
    if (closestObs) {
        const act = closestObs.data.action;
        const d = closestDist;
        let actionDist = 8.0;
        if(act === 'crouch' || act === 'dodge' || act === 'animal') actionDist = 10.0;
        if(act === 'mirror_wall') actionDist = 15.0;

        const guideVisibleDist = actionDist + 14.0; 

        if (d <= guideVisibleDist) {
            guideId = closestObs.id;
            switch(act) {
                case 'jump': guide = "JUMP!"; actionType = "jump"; guideActionType = 'jump'; break;
                case 'big_jump': guide = "HIGH JUMP!"; actionType = "big_jump"; guideActionType = 'big_jump'; break;
                case 'jump_attack': guide = "JUMP ATTACK!"; actionType = "big_jump"; guideActionType = 'jump_attack'; break; 
                case 'crouch': guide = "DUCK!"; actionType = "crouch"; guideActionType = 'crouch'; break;
                case 'dodge': 
                    if (currentLane === 0) { guide = "RIGHT"; actionType = "right"; guideActionType = 'right'; }
                    else { guide = "LEFT"; actionType = "left"; guideActionType = 'left'; }
                    break; 
                case 'red_monster': case 'bat': case 'punch': guide = "JAB!"; actionType = "punch"; guideActionType = 'punch'; break;
                case 'blue_monster': case 'double_punch': guide = "ONE-TWO!"; actionType = "double_punch"; guideActionType = 'double_punch'; break;
                case 'final_boss': 
                    // This case usually isn't hit because of the check at top of function, 
                    // but kept for safety.
                    if (engine.isBossFightActive) { guide = "ONE-TWO!"; actionType = "double_punch"; guideActionType = 'double_punch'; } 
                    break;
                case 'wall_blockade': guide = "BREAK WALL!"; actionType = "double_punch"; guideActionType = 'double_punch'; break;
                case 'mirror_wall': guide = "MIRROR ME!"; actionType = "mirror_me"; guideActionType = 'mirror_me'; break;
                default: 
                    if (closestObs.data.type === 'animal' || closestObs.data.type === 'camel') { 
                        if (currentLane === 0) { guide = "RIGHT"; actionType = "right"; guideActionType = 'right'; }
                        else { guide = "LEFT"; actionType = "left"; guideActionType = 'left'; }
                    } 
                    break;
            }
            
            // AI Action Execution
            if (engine.isAI && !closestObs.reactedByAI && d <= actionDist) {
                    if ((actionType === 'jump' || actionType === 'big_jump') && !player.isJumping) { 
                        const isBig = actionType === 'big_jump'; 
                        player.velocity.y = isBig ? 0.33 : 0.25; 
                        player.isJumping = true; 
                        if (isBig) SoundManager.playBigJump(); else SoundManager.playJump();
                    }
                    else if (actionType === 'crouch' && !player.isCrouching) { 
                        player.isCrouching = true; 
                        SoundManager.playCustom('sfx_duck');
                        setTimeout(() => { if(engine.player.mesh) engine.player.isCrouching = false; }, 500); 
                    }
                    else if (actionType === 'left') changeLane(-1);
                    else if (actionType === 'right') changeLane(1);
                    else if (actionType === 'punch') triggerPunch();
                    else if (actionType === 'double_punch') triggerDoublePunch();
                    else if (actionType === 'final_blow') triggerDoublePunch();
                    
                    closestObs.reactedByAI = true;
            }
            if (closestObs.reactedByAI) guide = "";
        }
    }
    return { text: guide, id: guideId, actionType: guideActionType };
};
