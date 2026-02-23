
import { GameTheme } from '../../gameTypes';
import { COLORS, LEVELS, BOSSES } from './constants';
import { MarioBuilders } from './builders/index';
import { MarioAnimators } from './animators';

export const MarioTheme: GameTheme = {
    id: 'mario',
    css: {
        background: 'linear-gradient(180deg, #87CEEB 0%, #FFFFFF 100%)',
        speedLineColor1: 'rgba(255, 255, 255, 0.4)',
        speedLineColor2: 'rgba(255, 215, 0, 0.2)'
    },
    colors: {
        sky: 0x87CEEB,
        ambientLight: 0xFFFFFF,
        dirLight: 0xFFFFFF,
        fog: 0xCCE5FF,
        particles: {
            dust: [0xFFD700, 0xFFFFFF], 
            explosion: [0xFFD700, 0xFF4500, 0x00BFFF] 
        },
        ground: {
            tutorial: 0x8B6914
        }
    },
    levels: LEVELS,
    bosses: BOSSES,
    ui: {
        stageColors: { 
            tutorial: 'bg-blue-500', 
            day: 'bg-green-500', 
            evening: 'bg-yellow-500', 
            night: 'bg-blue-800', 
            dawn: 'bg-red-700' 
        }
    },
    builders: MarioBuilders,
    animators: MarioAnimators
};
