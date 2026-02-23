
import { GameTheme } from '../../gameTypes';
import { COLORS, LEVELS, BOSSES } from './constants';
import { ZootopiaBuilders } from './builders/index';
import { ZootopiaAnimators } from './animators';

export const ZootopiaTheme: GameTheme = {
    id: 'zootopia',
    css: {
        background: 'linear-gradient(180deg, #87CEEB 0%, #FFFFFF 100%)', // Bright Sky
        speedLineColor1: 'rgba(255, 255, 255, 0.4)',
        speedLineColor2: 'rgba(255, 215, 0, 0.2)'   // Gold
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
            tutorial: 0x8899AA
        }
    },
    levels: LEVELS,
    bosses: BOSSES,
    ui: {
        stageColors: { 
            tutorial: 'bg-blue-500', 
            day: 'bg-orange-400', 
            evening: 'bg-red-700', 
            night: 'bg-blue-900', 
            dawn: 'bg-green-700' 
        }
    },
    builders: ZootopiaBuilders,
    animators: ZootopiaAnimators
};
