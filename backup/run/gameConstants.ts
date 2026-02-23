
import { ASSETS } from './config/gameAssets';

export const LANE_DISTANCE = 4.0; 
export const BOSS_SPAWN_TIME = 55; 
export const DRAW_DISTANCE = 200; 
export const CHUNK_SIZE = 20; 
export const BOSS_MAX_HP = 42; 
export const WALL_MAX_HP = 6.5; // Reduced by 35% from 10
export const BOSS_FIGHT_DISTANCE = 13; 

// LocalStorage Keys
export const GUIDE_IMAGES_KEY = 'zootopia_guideImages_v1'; 
export const GUIDE_VIDEOS_KEY = 'zootopia_guideVideos_v1'; 
export const GUIDE_AUDIO_KEY = 'zootopia_guideAudio_v1';
export const GAME_CONFIG_KEY = 'zootopia_gameConfig_v1'; 
export const ASSET_VERSION_KEY = 'pixel_runner_asset_version_v10';

// Dynamic Cheer Texts
export const CHEER_TEXTS = {
    INTRO: [
        [
            "DETECTIVE MODE ON!",
            "LET'S CHASE IT DOWN!",
            "ARE YOU READY TO RUN?"
        ]
    ],
    TUTORIAL_END: [ 
        [
            "WATCH OUT FOR THAT VAN!",
            "IT'S COMING FAST!",
            "MOVE! MOVE! MOVE!"
        ]
    ],
    PHASE_1_CLEAR: [ 
        [
            "SOMETHING HUGE IS HERE!",
            "DON'T FREEZE NOW!",
            "KEEP YOUR EYES OPEN!"
        ]
    ],
    PHASE_2_CLEAR: [ 
        [
            "THAT SMILE IS A LIE!",
            "TRUST NO ONE!",
            "STAY SHARP!"
        ]
    ],
    PHASE_3_CLEAR: [
        [
            "THE BIG ONE IS HERE!",
            "DON'T BACK DOWN!",
            "THIS IS THE FINAL FIGHT!"
        ]
    ],
    VICTORY: [ 
        [
            "YOU CRACKED THE CASE!",
            "AMAZING DETECTIVE!",
            "JUSTICE FOR ALL!"
        ]
    ]
};

export const DEFAULT_GAME_CONFIG = {};

const mirrorActions: Record<string, string[]> = {};
for(let i=1; i<=40; i++) {
    const key = `action_${i.toString().padStart(2, '0')}`;
    mirrorActions[key] = [ASSETS.getMirrorActionImage(i)];
}

export const DEFAULT_ASSETS = {
    images: {
        'bg_tutorial': [ ASSETS.BACKGROUNDS.TUTORIAL ],
        'bg_day': [ ASSETS.BACKGROUNDS.DAY ],
        'bg_evening': [ ASSETS.BACKGROUNDS.EVENING ],
        'bg_night': [ ASSETS.BACKGROUNDS.NIGHT ],
        'bg_dawn': [ ASSETS.BACKGROUNDS.DAWN ],
        'ads': [ ASSETS.THEME.AD_1, ASSETS.THEME.AD_2, ASSETS.THEME.AD_3 ],
        'wall': [ 
            ASSETS.THEME.WALL_1, ASSETS.THEME.WALL_2, ASSETS.THEME.WALL_3, 
            ASSETS.THEME.WALL_4, ASSETS.THEME.WALL_5 
        ],
        'mirror_bg': [ ASSETS.COMMON.MIRROR_BG ],
        'mirror_me': [ ASSETS.COMMON.MIRROR_GUIDE ],
        ...mirrorActions,
        'jump': [ ASSETS.COMMON.JUMP ],
        'big_jump': [ ASSETS.COMMON.BIG_JUMP ],
        'crouch': [ ASSETS.COMMON.CROUCH ],
        'left': [ ASSETS.COMMON.LEFT ],
        'right': [ ASSETS.COMMON.RIGHT ],
        'punch': [ ASSETS.COMMON.PUNCH_1, ASSETS.COMMON.PUNCH_2 ],
        'double_punch': [ 
            ASSETS.COMMON.DOUBLE_PUNCH_1, ASSETS.COMMON.DOUBLE_PUNCH_2, 
            ASSETS.COMMON.DOUBLE_PUNCH_3, ASSETS.COMMON.DOUBLE_PUNCH_4 
        ],
        'sprint': [ 
            ASSETS.COMMON.SPRINT_1, ASSETS.COMMON.SPRINT_2, 
            ASSETS.COMMON.SPRINT_3, ASSETS.COMMON.SPRINT_4 
        ],
        'final_blow': [ 
            ASSETS.COMMON.FINAL_1, ASSETS.COMMON.FINAL_2, 
            ASSETS.COMMON.FINAL_3, ASSETS.COMMON.FINAL_4 
        ],
        'jump_attack': [ 
            ASSETS.COMMON.JUMP_ATTACK_1, ASSETS.COMMON.JUMP_ATTACK_2, 
            ASSETS.COMMON.JUMP_ATTACK_3, ASSETS.COMMON.JUMP_ATTACK_4 
        ]
    } as Record<string, string[]>,
    
    videos: {
        'bg_tutorial': [ ASSETS.THEME.BG_VIDEO_TUTORIAL ],
        'bg_day': [ ASSETS.THEME.BG_VIDEO_DAY ],
        'bg_evening': [ ASSETS.THEME.BG_VIDEO_EVENING ],
        'bg_night': [ ASSETS.THEME.BG_VIDEO_NIGHT ],
        'bg_dawn': [ ASSETS.THEME.BG_VIDEO_DAWN ]
    } as Record<string, string[]>,
    
    audio: {
        'bg0_1': ASSETS.COMMON.BGM_0,
        'bg1_1': ASSETS.COMMON.BGM_1,
        'bg2_1': ASSETS.COMMON.BGM_2,
        'bg3_1': ASSETS.COMMON.BGM_3,
        'bg4_1': ASSETS.COMMON.BGM_4,
        'mirror_me': ASSETS.COMMON.AUDIO_MIRROR,
        'jump': ASSETS.COMMON.AUDIO_JUMP,
        'big_jump': ASSETS.COMMON.AUDIO_BIG_JUMP,
        'crouch': ASSETS.COMMON.AUDIO_CROUCH,
        'left': ASSETS.COMMON.AUDIO_LEFT,
        'right': ASSETS.COMMON.AUDIO_RIGHT,
        'punch': ASSETS.COMMON.AUDIO_PUNCH,
        'double_punch': ASSETS.COMMON.AUDIO_DOUBLE_PUNCH,
        'sprint': ASSETS.COMMON.AUDIO_SPRINT,
        'final_blow': ASSETS.COMMON.AUDIO_FINAL,
        'jump_attack': ASSETS.COMMON.AUDIO_JUMP_ATTACK,
        'warning0': ASSETS.COMMON.AUDIO_WARN_0,
        'warning1': ASSETS.COMMON.AUDIO_WARN_1,
        'warning2': ASSETS.COMMON.AUDIO_WARN_2,
        'warning3': ASSETS.COMMON.AUDIO_WARN_3,
        'victory': ASSETS.COMMON.AUDIO_VICTORY,
        'dingdong': ASSETS.COMMON.AUDIO_DINGDONG,
        'sfx_jump': ASSETS.COMMON.SFX_JUMP,
        'sfx_big_jump': ASSETS.COMMON.SFX_BIGJUMP,
        'sfx_left': ASSETS.COMMON.SFX_LEFT,
        'sfx_right': ASSETS.COMMON.SFX_RIGHT,
        'sfx_wall': ASSETS.COMMON.SFX_WALL,
        'sfx_boss': ASSETS.COMMON.SFX_BOSS,
        'sfx_punch1': ASSETS.COMMON.SFX_PUNCH1,
        'sfx_punch2': ASSETS.COMMON.SFX_PUNCH2,
        'sfx_punch3': ASSETS.COMMON.SFX_PUNCH3,
        'sfx_duck': ASSETS.COMMON.SFX_DUCK,
    } as Record<string, string>
};
