
import { GameTheme } from '../../gameTypes';
import { COLORS, LEVELS, BOSSES } from './constants';
import { DragonBallBuilders } from './builders/index';
import { DragonBallAnimators } from './animators';

export const DragonBallTheme: GameTheme = {
    id: 'dragonball',
    css: {
        background: 'linear-gradient(180deg, #87CEEB 0%, #E0F7FA 100%)',
        speedLineColor1: 'rgba(255, 255, 255, 0.4)',
        speedLineColor2: 'rgba(255, 255, 0, 0.2)'
    },
    colors: {
        sky: 0x87CEEB,
        ambientLight: 0xFFFFFF,
        dirLight: 0xFFFFFF,
        fog: 0xA1C6CC,
        particles: {
            dust: [0xFFD700, 0xFFFFFF], // Gold/White Ki
            explosion: [0xFFA500, 0xFFFF00, 0xFFFFFF] // Explosion colors
        },
        ground: {
            tutorial: 0xEED6AF
        }
    },
    levels: LEVELS,
    bosses: BOSSES,
    ui: {
        stageColors: { tutorial: 'bg-yellow-400', day: 'bg-green-600', evening: 'bg-teal-600', night: 'bg-gray-600', dawn: 'bg-purple-600' }
    },
    builders: DragonBallBuilders,
    animators: DragonBallAnimators
};
