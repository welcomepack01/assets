
import { GameTheme } from '../../gameTypes';
import { COLORS, LEVELS, BOSSES } from './constants';
import { MinecraftBuilders } from './builders';
import { MinecraftAnimators } from './animators';

export const MinecraftTheme: GameTheme = {
    id: 'minecraft',
    css: {
        background: 'linear-gradient(180deg, #87CEEB 0%, #E0F7FA 100%)',
        speedLineColor1: 'rgba(255, 255, 255, 0.4)',
        speedLineColor2: 'rgba(255, 255, 255, 0.2)'
    },
    colors: {
        sky: 0x87CEEB,
        ambientLight: 0xFFFFFF,
        dirLight: 0xFFFFFF,
        fog: 0xA1C6CC,
        particles: {
            dust: [0x8B4513, 0x808080],
            explosion: [0xFF0000, 0xFFFFFF, 0x000000]
        },
        ground: {
            tutorial: 0x5C4033 // Darker dirt
        }
    },
    levels: LEVELS,
    bosses: BOSSES,
    ui: {
        stageColors: { tutorial: 'bg-green-600', day: 'bg-green-800', evening: 'bg-blue-300', night: 'bg-red-900', dawn: 'bg-purple-900' }
    },
    builders: MinecraftBuilders,
    animators: MinecraftAnimators
};
