
import { ThemeBuilders } from '../../../gameTypes';
import { createPlayerMesh, createSkis, decorateChunk, createWallBlockade, createMirrorWall, generateTextures } from './environment';
import { createJumpObstacle, createCrouchObstacle, createBigJumpObstacle, createPassThroughWall } from './obstacles';
import { createDodgeObstacle, createPunchObstacle, createFlyingObstacle } from './enemies';
import { createBossMesh } from './bosses';

export const SkibidiBuilders: ThemeBuilders = {
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
    createPassThroughWall, // Exported
    generateTextures
};
