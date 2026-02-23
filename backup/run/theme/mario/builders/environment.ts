

import * as THREE from 'three';
import { LevelConfig, TextureMap } from '../../../gameTypes';
import { COLORS } from '../constants';
import { createBox, createCylinder } from '../utils';
import { createDetailedTexture } from '../../../utils/gameUtils';

const buildRoad = (levelId: number): THREE.Group => {
    const group = new THREE.Group();

    if (levelId === 0) { // Tutorial
        // Brown dirt with green grass stripes
        createBox(12, 0.05, 1, COLORS.grassGreen, 0, 0.01, -1, group);
        createBox(12, 0.05, 1, COLORS.grassGreen, 0, 0.01, 1, group);
    } else if (levelId === 1) { // Mushroom Hills (Asphalt)
        // White dashed lines for asphalt road
        for(let z = -2; z <= 2; z += 2) {
            createBox(0.5, 0.05, 1, 0xFFFFFF, 0, 0.01, z, group);
        }
    } else if (levelId === 2) { // Sky Garden (Cloud Road)
        // Fluffy cloud bits on edges
        createBox(14, 0.05, 0.5, 0xFFFFFF, 0, 0.01, -1.8, group);
        createBox(14, 0.05, 0.5, 0xFFFFFF, 0, 0.01, 1.8, group);
    } else if (levelId === 3) { // Underground Cave (Blue Brick)
        // Darker patches
        createBox(2, 0.05, 2, 0x0A1020, -2, 0.01, 0, group);
        createBox(2, 0.05, 2, 0x0A1020, 2, 0.01, 0, group);
    } else if (levelId === 4) { // Bowser Castle
        // Lava cracks
        createBox(12, 0.05, 0.5, COLORS.lavaOrange, 0, 0.01, 0, group);
    }

    return group;
};

const buildFence = (levelId: number): THREE.Group => {
    const group = new THREE.Group();
    
    if (levelId === 0) { // Tutorial: ? Block & Warp Pipe
        // ? Block
        createBox(1, 1, 1, COLORS.questionBlockGold, 0, 2.5, 0, group);
        // Question mark (white squares)
        createBox(0.2, 0.2, 0.1, COLORS.white, 0, 2.8, 0.5, group);
        createBox(0.2, 0.4, 0.1, COLORS.white, 0, 2.4, 0.5, group);
        
        // Warp Pipe
        const pipeHeight = 2 + Math.random() * 2;
        createCylinder(0.8, 0.8, pipeHeight, COLORS.warpPipeGreen, 2, pipeHeight/2, 0, group);
        createCylinder(0.9, 0.9, 0.5, COLORS.warpPipeGreen, 2, pipeHeight, 0, group); // Flange
    } else if (levelId === 1) { // Mushroom Hills: Green Hills
        // Simple Green Hill shape
        const hillColor = 0x00B400;
        createCylinder(2, 3, 3, hillColor, 0, 1.5, 0, group);
        // White spots
        createCylinder(0.5, 0.4, 0.1, 0xFFFFFF, 1, 2, 1.5, group);
        createCylinder(0.5, 0.4, 0.1, 0xFFFFFF, -1, 1, 1.5, group);
    } else if (levelId === 2) { // Sky Garden: Clouds
        // Cloud puffs
        const cloudColor = 0xC8E6FF;
        createBox(2, 1.5, 2, cloudColor, 0, 1, 0, group);
        createBox(1.5, 1.5, 1.5, cloudColor, 1.2, 0.8, 0.5, group);
        createBox(1.5, 1.5, 1.5, cloudColor, -1.2, 1.2, -0.5, group);
    } else if (levelId === 3) { // Underground Cave: Blue Rocks
        // Rock formation
        const rockColor = 0x141E32;
        createBox(2, 3, 2, rockColor, 0, 1.5, 0, group);
        createBox(1.5, 2, 1.5, rockColor, 1, 0.5, 1, group);
        createBox(1, 1, 1, rockColor, -1, 2.5, -0.5, group);
    } else if (levelId === 4) { // Bowser Castle: Red Pillars
        // Bowser Pillar
        const pillarColor = 0xDC3200;
        createBox(1.5, 4, 1.5, pillarColor, -1, 2, 0, group);
        // Spikes
        createCylinder(0, 0.3, 0.8, 0xFFFFFF, -1, 4.4, 0, group);
    }

    return group;
};

export const createPlayerMesh = (): THREE.Group => {
    return new THREE.Group(); // Invisible
};

export const createSkis = () => {
    return { left: new THREE.Group(), right: new THREE.Group() };
};

export const decorateChunk = (group: THREE.Group, levelConfig: LevelConfig, roadWidth: number, chunkDepth: number, textures: TextureMap) => {
    let levelId = 0;
    if (levelConfig.id === 'level1') levelId = 1;
    else if (levelConfig.id === 'level2') levelId = 2;
    else if (levelConfig.id === 'level3') levelId = 3;
    else if (levelConfig.id === 'level4') levelId = 4;

    // Road Details
    const roadDetail = buildRoad(levelId);
    group.add(roadDetail);

    // Fences
    const fenceLeft = buildFence(levelId);
    fenceLeft.position.set(-roadWidth/2 - 2, 0, 0);
    group.add(fenceLeft);
    
    const fenceRight = buildFence(levelId);
    fenceRight.position.set(roadWidth/2 + 2, 0, 0);
    group.add(fenceRight);
};

export const createWallBlockade = (width: number, height: number, texture?: THREE.Texture): THREE.Group => {
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(width, height, 1);
    const material = new THREE.MeshStandardMaterial({ 
        map: texture || null, 
        color: texture ? 0xffffff : 0x808080,
        roughness: 0.5 
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = height / 2;
    group.add(mesh);
    return group;
};

export const createMirrorWall = (width: number, height: number, texture?: THREE.Texture): THREE.Group => {
    const group = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(width + 0.5, height + 0.5, 0.5);
    // CHANGED: Use White Concrete instead of Gold
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9, metalness: 0.0 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = height / 2;
    frame.castShadow = true;
    frame.receiveShadow = true;
    group.add(frame);

    const planeGeo = new THREE.PlaneGeometry(width, height);
    const planeMat = new THREE.MeshBasicMaterial({ 
        map: texture || null, 
        color: texture ? 0xffffff : 0xcccccc 
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.set(0, height / 2, 0.26);
    group.add(plane);
    
    return group;
};

export const createPassThroughWall = (width: number, height: number, texture: THREE.Texture, videoTexture?: THREE.Texture): THREE.Group => {
    const group = new THREE.Group();
    const mat = texture ? new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide }) : new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
    mesh.position.set(0, height/2, 0);
    group.add(mesh);
    return group;
};

export const generateTextures = (): TextureMap => {
    const textures: Record<string, THREE.Texture> = {};
    textures['tutorial_dirt'] = createDetailedTexture('tutorial_dirt', '#E0A665', 0.15);
    textures['mario_brick_brown'] = createDetailedTexture('mario_brick_brown', '#B46432');
    textures['mario_brick_blue'] = createDetailedTexture('mario_brick_blue', '#1A2530');
    textures['mario_cloud_road'] = createDetailedTexture('mario_cloud_road', '#F0F0FF');
    textures['mario_castle_floor'] = createDetailedTexture('mario_castle_floor', '#646464');
    textures['mario_q_box'] = createDetailedTexture('mario_q_box', '#FFD700');
    
    // NEW TEXTURES FOR LEVEL 1 UPDATE
    textures['level1_asphalt'] = createDetailedTexture('level1_asphalt', '#333333');
    textures['candy_cane'] = createDetailedTexture('candy_cane', '#FFFFFF');
    textures['retro_dirt_wall'] = createDetailedTexture('retro_dirt_wall', '#8B4513');
    
    return textures;
};
