
import * as THREE from 'three';
import { CHUNK_SIZE, LANE_DISTANCE, WALL_MAX_HP } from '../gameConstants';
import { ObstacleData, TextureMap, LevelConfig } from '../gameTypes';
import { CurrentTheme } from '../theme/gameTheme';

// Helper to enable shadows recursively
const castShadows = (group: THREE.Group | THREE.Mesh) => {
    group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });
};

export const SceneBuilder = {
    createPlayerMesh: (): THREE.Group | THREE.Mesh => {
        const mesh = CurrentTheme.builders.createPlayerMesh();
        mesh.userData = { origX: 0, origY: 0.9 };
        return mesh;
    },

    createSkis: (): { left: THREE.Group | THREE.Mesh, right: THREE.Group | THREE.Mesh } => {
        return CurrentTheme.builders.createSkis();
    },

    createChunk: (zPos: number, textures: TextureMap, adTextures?: THREE.Texture[], wallTextures?: THREE.Texture[], phase: number = 0): THREE.Group => {
        const group = new THREE.Group();
        
        // --- 1. LOAD LEVEL CONFIG ---
        const levelData: LevelConfig = CurrentTheme.levels[phase] || CurrentTheme.levels[0];
        
        // --- 2. ROAD GENERATION ---
        const floorMap = textures[levelData.road.textureKey] || textures['wednesday_stone'];
        const floorColor = levelData.road.color;
        const roadWidth = levelData.road.width;
        
        const roadGeo = new THREE.PlaneGeometry(roadWidth, CHUNK_SIZE); 
        const roadMat = new THREE.MeshStandardMaterial({ 
            map: floorMap, 
            color: floorColor,
            side: THREE.DoubleSide,
            roughness: levelData.road.roughness || 0.8
        });
        const road = new THREE.Mesh(roadGeo, roadMat); 
        road.rotation.x = -Math.PI / 2; 
        road.position.y = 0;
        road.receiveShadow = true; 
        group.add(road);

        // --- 3. ENVIRONMENT DETAILS (DELEGATED TO THEME) ---
        // Pass textures to decorators so they can apply specific textures (e.g. lava)
        CurrentTheme.builders.decorateChunk(group, levelData, roadWidth, CHUNK_SIZE, textures);

        group.userData = { zPos: zPos, origX: 0, origY: 0 }; 
        return group;
    },

    // --- OBSTACLE FACTORY ---
    
    // UPDATED: Accept 'variant' optional parameter
    createJumpObstacle: (zPos: number, textures: TextureMap, models?: Record<string, THREE.Group>, phase: number = 0, variant?: string): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const group = CurrentTheme.builders.createJumpObstacle(models, phase, variant);
        group.position.set(0, 0, zPos); 
        castShadows(group);
        return { mesh: group, data: { type: 'thing', action: 'jump', isRotating: false }, origY: 0 };
    },

    createBigJumpObstacle: (zPos: number, textures: TextureMap, models?: Record<string, THREE.Group>, phase: number = 0, variant?: string): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const group = CurrentTheme.builders.createBigJumpObstacle(models, phase, variant);
        group.position.set(0, 0, zPos); 
        castShadows(group);
        return { mesh: group, data: { type: 'cone', action: 'big_jump', hp: 1, isRotating: false }, origY: 0 };
    },

    createCrouchObstacle: (zPos: number, textures: TextureMap, isLavaMode: boolean, isIceMode: boolean, models?: Record<string, THREE.Group>, phase: number = 0, variant?: string): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const heightScale = 1.0;
        const group = CurrentTheme.builders.createCrouchObstacle(heightScale, models, phase, variant);
        group.position.set(0, 0, zPos); 
        castShadows(group);
        return { mesh: group, data: { type: 'potions', action: 'crouch' }, origY: 0 };
    },

    createCat: (zPos: number, textures: TextureMap, models?: Record<string, THREE.Group>): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const group = CurrentTheme.builders.createDodgeObstacle('A', models);
        const lane = Math.random() < 0.5 ? 0 : 1; 
        const xPos = (lane - 0.5) * LANE_DISTANCE;
        group.position.set(xPos, 0, zPos); 
        
        group.rotation.y = Math.PI; 
        
        group.userData.origX = xPos;
        group.userData.origRotY = Math.PI; // Store for reset logic
        
        castShadows(group);
        return { mesh: group, data: { type: 'bees', action: 'dodge', hp: 1 }, origY: 0 };
    },

    createOctopus: (zPos: number, textures: TextureMap, models?: Record<string, THREE.Group>): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const group = CurrentTheme.builders.createDodgeObstacle('B', models);
        const lane = Math.random() < 0.5 ? 0 : 1; 
        const xPos = (lane - 0.5) * LANE_DISTANCE;
        
        group.position.set(xPos, 0, zPos); 
        group.userData.origX = xPos;
        
        castShadows(group);
        return { mesh: group, data: { type: 'ghost', action: 'dodge', hp: 1 }, origY: 0 };
    },

    // NEW: VARIANT C (DODGE3)
    createDodgeVariantC: (zPos: number, textures: TextureMap, models?: Record<string, THREE.Group>): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const group = CurrentTheme.builders.createDodgeObstacle('C', models);
        const lane = Math.random() < 0.5 ? 0 : 1; 
        const xPos = (lane - 0.5) * LANE_DISTANCE;
        
        group.position.set(xPos, 0, zPos); 
        group.userData.origX = xPos;
        
        castShadows(group);
        // Use a generic type or re-use 'bees'/'ghost' since logic is same
        return { mesh: group, data: { type: 'rhino', action: 'dodge', hp: 1 }, origY: 0 };
    },

    createRedMonster: (zPos: number, textures: TextureMap, models?: Record<string, THREE.Group>): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const lane = Math.random() < 0.5 ? 0 : 1; const xPos = (lane - 0.5) * LANE_DISTANCE;
        const group = CurrentTheme.builders.createPunchObstacle('weak', models); 
        group.position.set(xPos, 0, zPos); 
        group.userData.origX = xPos; 
        castShadows(group);
        return { mesh: group, data: { type: 'monster_weak', action: 'punch', hp: 1 }, origY: 0 };
    },

    createBlueMonster: (zPos: number, textures: TextureMap, models?: Record<string, THREE.Group>): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const lane = Math.random() < 0.5 ? 0 : 1; const xPos = (lane - 0.5) * LANE_DISTANCE;
        const group = CurrentTheme.builders.createPunchObstacle('strong', models);
        group.position.set(xPos, 0, zPos); 
        group.userData.origX = xPos; 
        castShadows(group);
        return { mesh: group, data: { type: 'monster_strong', action: 'double_punch', hp: 1 }, origY: 0 };
    },

    createIronEagle: (zPos: number, models?: Record<string, THREE.Group>): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const group = CurrentTheme.builders.createFlyingObstacle(models);
        const lane = Math.random() < 0.5 ? 0 : 1; 
        const xPos = (lane - 0.5) * LANE_DISTANCE; 
        // Lowered height by another 15% (2.6 -> 2.2)
        const yPos = 2.2; 
        group.position.set(xPos, yPos, zPos); 
        group.userData.origX = xPos;
        group.userData.origY = yPos;
        castShadows(group);
        return { mesh: group, data: { type: 'drone', action: 'jump_attack', hp: 1, isSpinning: false }, origY: yPos };
    },

    createWallBlockade: (zPos: number, textures: TextureMap, wallTextures: THREE.Texture[], index: number = 0): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const tex = wallTextures && wallTextures.length > 0 ? wallTextures[index % wallTextures.length] : undefined;
        const group = CurrentTheme.builders.createWallBlockade(16.0, 9.0, tex);
        group.scale.set(0.8, 0.8, 0.8); 
        group.position.set(0, 0, zPos); 
        castShadows(group);
        return { mesh: group, data: { type: 'wall', action: 'wall_blockade', hp: WALL_MAX_HP }, origY: 0 };
    },

    createMirrorWall: (zPos: number, textures: TextureMap, phase: number = 1): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        let texKey = 'mini1'; 
        if (phase === 2) texKey = 'mini2';
        else if (phase === 3) texKey = 'mini3';
        else if (phase === 4) texKey = 'mini4';
        
        const tex = textures[texKey] || textures['mirrorVideo1'];
        
        const group = CurrentTheme.builders.createMirrorWall(14.2, 8.0, tex);
        group.position.set(0, 0, zPos); 
        castShadows(group);
        return { mesh: group, data: { type: 'mirror', action: 'mirror_wall', hp: 1 }, origY: 0 };
    },

    createPassThroughWall: (zPos: number, ptTextures: THREE.Texture[], index: number = 0, textures: TextureMap): { mesh: THREE.Group, data: ObstacleData, origY: number } => {
        const tex = ptTextures && ptTextures.length > 0 ? ptTextures[index % ptTextures.length] : undefined;
        const videoTex = textures['mirrorVideo'] || textures['mirrorVideo1'];

        if (!CurrentTheme.builders.createPassThroughWall || !tex) {
             if(tex) {
                 const group = new THREE.Group();
                 const geometry = new THREE.PlaneGeometry(16, 9);
                 const material = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
                 const mesh = new THREE.Mesh(geometry, material);
                 mesh.position.y = 4.5;
                 group.add(mesh);
                 group.position.set(0, 0, zPos);
                 return { mesh: group, data: { type: 'wall', action: 'pass_through_wall' }, origY: 0 };
             }
             return { mesh: new THREE.Group(), data: { type: 'static', action: 'none' }, origY: 0 };
        }
        const group = CurrentTheme.builders.createPassThroughWall(16.0, 9.0, tex, videoTex);
        group.position.set(0, 0, zPos);
        return { mesh: group, data: { type: 'wall', action: 'pass_through_wall' }, origY: 0 };
    },
    
    createBoss: (zPos: number, textures: TextureMap, maxHP: number, bossType: 'mech' | 'beast' | 'mutant' | 'demon', models?: Record<string, THREE.Group>): { mesh: THREE.Group, box: THREE.Box3, data: ObstacleData } => {
        let bossKey = 'boss1';
        if (bossType === 'beast') bossKey = 'boss2';
        else if (bossType === 'mutant') bossKey = 'boss3';
        else if (bossType === 'demon') bossKey = 'boss4';

        const config = CurrentTheme.bosses[bossKey];
        const scale = config ? config.scale : 4.5;
        const yOffset = config ? config.yOffset : 0;
        const meshKey = bossKey as 'boss1' | 'boss2' | 'boss3' | 'boss4';
        
        // PASS TEXTURES TO CREATE BOSS MESH
        const group = CurrentTheme.builders.createBossMesh(meshKey, models, textures);
        group.scale.set(scale, scale, scale); 
        group.position.set(0, yOffset, zPos);
        
        group.userData.origX = 0;
        group.userData.origY = yOffset;
        
        castShadows(group);
        const box = new THREE.Box3().setFromObject(group);
        box.expandByScalar(-0.5);
        return { mesh: group, box, data: { type: 'boss', action: 'final_boss', hp: maxHP } };
    }
};
