
import { GameTheme } from '../../gameTypes';
import { COLORS, LEVELS, BOSSES } from './constants';
import { KPopBuilders } from './builders/index';
import { KPopAnimators } from './animators';

export const KPopTheme: GameTheme = {
    id: 'demon_slayer',
    css: {
        background: 'linear-gradient(180deg, #1A1025 0%, #000000 100%)', // Dark Purple/Black
        speedLineColor1: 'rgba(155, 89, 182, 0.4)', // Wisteria Purple
        speedLineColor2: 'rgba(255, 69, 0, 0.2)'   // Blood Red
    },
    colors: {
        sky: 0x1A1025,
        ambientLight: 0x665577,
        dirLight: 0xFFFFFF,
        fog: 0x110022,
        particles: {
            dust: [0x9B59B6, 0xFFFFFF], // Purple/White petals
            explosion: [0xFF0000, 0xFFFF00, 0x00BFFF] // Blood/Lightning/Ice
        },
        ground: {
            tutorial: 0x5D4037
        }
    },
    levels: LEVELS,
    bosses: BOSSES,
    ui: {
        stageColors: { 
            tutorial: 'bg-purple-800', 
            day: 'bg-yellow-700', 
            evening: 'bg-blue-800', 
            night: 'bg-indigo-900', 
            dawn: 'bg-red-900' 
        }
    },
    builders: KPopBuilders,
    animators: KPopAnimators
};
