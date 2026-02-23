
import { GameTheme } from '../../gameTypes';
import { COLORS, LEVELS, BOSSES } from './constants';
import { PokemonBuilders } from './builders';
import { PokemonAnimators } from './animators';

export const PokemonTheme: GameTheme = {
    id: 'pokemon',
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
            dust: [0xFFFFFF, 0xFFEB3B],
            explosion: [0xFF0000, 0xFFFFFF, 0xFFFF00]
        },
        ground: {
            tutorial: 0x81C784
        }
    },
    levels: LEVELS,
    bosses: BOSSES,
    ui: {
        stageColors: { tutorial: 'bg-green-500', day: 'bg-green-700', evening: 'bg-gray-700', night: 'bg-blue-800', dawn: 'bg-purple-800' }
    },
    builders: PokemonBuilders,
    animators: PokemonAnimators
};
