
import { ThemeBuilders } from '../../../gameTypes';
import { createPlayerMesh, createSkis, decorateChunk, createWallBlockade, createMirrorWall, createPassThroughWall } from './environment';
import { createJumpObstacle, createCrouchObstacle, createBigJumpObstacle } from './obstacles';
import { createDodgeObstacle, createPunchObstacle, createFlyingObstacle } from './enemies';
import { createBossMesh } from './bosses';
import { generateTextures } from './environment'; // Using generateTextures from environment

export const KPopBuilders: ThemeBuilders = {
    createPlayerMesh,
    createSkis,
    decorateChunk,
    createJumpObstacle,
    createBigJumpObstacle,
    createCrouchObstacle,
    createDodgeObstacle,
    createPunchObstacle,
    createFlyingObstacle,
    createBossMesh,
    createWallBlockade,
    createMirrorWall,
    createPassThroughWall,
    generateTextures
};
