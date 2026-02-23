
import { GameTheme } from '../../gameTypes';
import { COLORS, LEVELS, BOSSES } from './constants';
import { HarryPotterBuilders } from './builders/index';
import { HarryPotterAnimators } from './animators';

export const HarryPotterTheme: GameTheme = {
    id: 'harrypotter',
    css: {
        background: 'linear-gradient(180deg, #203050 0%, #000000 100%)', // Dark magical sky
        speedLineColor1: 'rgba(0, 255, 255, 0.3)', // Magic blue
        speedLineColor2: 'rgba(0, 255, 0, 0.2)'   // Avada Kedavra green hint
    },
    colors: {
        sky: 0x203050,
        ambientLight: 0x888888,
        dirLight: 0xFFFFFF,
        fog: 0x101010,
        particles: {
            dust: [0xFFD700, 0xC0C0C0], // Gold/Silver sparks
            explosion: [0x00FF00, 0xFF0000, 0xFFFFFF] // Magic sparks
        },
        ground: {
            tutorial: 0x808080 // Platform concrete
        }
    },
    levels: LEVELS,
    bosses: BOSSES,
    ui: {
        stageColors: { 
            tutorial: 'bg-yellow-700', // Hufflepuff-ish / Brick
            day: 'bg-red-800',         // Gryffindor
            evening: 'bg-green-900',   // Slytherin
            night: 'bg-blue-900',      // Ravenclaw
            dawn: 'bg-purple-900'      // Magic
        }
    },
    builders: HarryPotterBuilders,
    animators: HarryPotterAnimators
};
