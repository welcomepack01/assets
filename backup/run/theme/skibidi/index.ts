
import { GameTheme } from '../../gameTypes';
import { COLORS, LEVELS, BOSSES } from './constants';
import { SkibidiBuilders } from './builders';
import { SkibidiAnimators } from './animators';

export const SkibidiTheme: GameTheme = {
    id: 'skibidi_toilet',
    css: {
        background: 'linear-gradient(180deg, #333333 0%, #000000 100%)',
        speedLineColor1: 'rgba(0, 255, 0, 0.4)',
        speedLineColor2: 'rgba(255, 0, 0, 0.2)'
    },
    colors: {
        sky: 0x555555,
        ambientLight: 0x888888,
        dirLight: 0xFFFFFF,
        fog: 0x222222,
        particles: {
            dust: [0x555555, 0x888888],
            explosion: [0xFFFFFF, 0xFFFF00, 0xFF0000]
        },
        ground: {
            tutorial: 0x444444
        }
    },
    levels: LEVELS,
    bosses: BOSSES,
    ui: {
        stageColors: { tutorial: 'bg-yellow-600', day: 'bg-gray-600', evening: 'bg-orange-700', night: 'bg-purple-900', dawn: 'bg-red-900' }
    },
    builders: SkibidiBuilders,
    animators: SkibidiAnimators
};
