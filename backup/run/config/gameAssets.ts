
// ==========================================
// GAME ASSET CONFIGURATION
// ==========================================

// 1. ASSET VERSION (Change this to force refresh all browsers)
export const ASSET_VERSION = '10.0';

// 2. THEME FOLDER SETTING
export const THEME_ID = '28_mariobro';

// ------------------------------------------
// PATH GENERATORS
// ------------------------------------------
const GITHUB_BASE = 'https://raw.githubusercontent.com/welcomepack01/assets/main';

const p = (path: string) => `${path}?v=${ASSET_VERSION}`;

const PATH_THEME = `${GITHUB_BASE}/${THEME_ID}`;

// Paths now point to theme specific folders
const PATH_MODEL = `${PATH_THEME}/model`; 
const PATH_GUIDE = `${GITHUB_BASE}/01_guide`;
const PATH_ACTION = `${GITHUB_BASE}/02_action`;
const PATH_ACTION_WALL = `${GITHUB_BASE}/02-action_wall`;
const PATH_EFFECT = `${GITHUB_BASE}/04_effect`;
const PATH_ROOT = `${PATH_THEME}`; // Root for backgrounds etc.

export const ASSETS = {
    THEME: {
        BG_VIDEO_TUTORIAL: p(`${PATH_THEME}/bg0.mp4`),
        BG_VIDEO_DAY: p(`${PATH_THEME}/bg1.mp4`),
        BG_VIDEO_EVENING: p(`${PATH_THEME}/bg2.mp4`),
        BG_VIDEO_NIGHT: p(`${PATH_THEME}/bg3.mp4`),
        BG_VIDEO_DAWN: p(`${PATH_THEME}/bg4.mp4`),
        MIRROR_VIDEO_1: p(`${PATH_THEME}/mirror.mp4`),
        MIRROR_VIDEO_2: p(`${PATH_THEME}/mirror2.mp4`), 
        BOSS4_VIDEO: p(`${PATH_THEME}/boss4-a.mp4`), 
        BOSS1_MOV: p(`${PATH_THEME}/boss1-a.mp4`), 
        BOSS2_MOV: p(`${PATH_THEME}/boss2-a.mp4`),
        BOSS3_MOV: p(`${PATH_THEME}/boss3-a.mp4`), 
        AD_1: p(`${PATH_THEME}/ad1.jpg`),
        AD_2: p(`${PATH_THEME}/ad2.jpg`),
        AD_3: p(`${PATH_THEME}/ad3.jpg`),
        WALL_1: p(`${PATH_THEME}/wall1.mp4`),
        WALL_2: p(`${PATH_THEME}/wall2.mp4`),
        WALL_3: p(`${PATH_THEME}/wall3.mp4`),
        WALL_4: p(`${PATH_THEME}/wall4.mp4`),
        WALL_5: p(`${PATH_THEME}/wall5.mp4`),
    },

    // --- 3D MODELS (GLB) ---
    MODELS: {
        // Models removed to prevent 404 errors in mario theme
    },

    MINIGAME: {
        MINI_1: p(`${PATH_THEME}/mini1.mp4`),
        MINI_2: p(`${PATH_THEME}/mini2.mp4`),
        MINI_3: p(`${PATH_THEME}/mini3.mp4`),
        MINI_4: p(`${PATH_THEME}/mini4.mp4`),
    },

    CHEER: {
        INTRO: p(`${PATH_THEME}/boss0.mp4`),
        TUTORIAL_END: p(`${PATH_THEME}/boss1.mp4`), 
        PHASE_1: p(`${PATH_THEME}/boss2.mp4`),      
        PHASE_2: p(`${PATH_THEME}/boss3.mp4`),      
        PHASE_3: p(`${PATH_THEME}/boss4.mp4`),      
        VICTORY_END: p(`${PATH_THEME}/boss5.mp4`), 
        RHYTHM_END_1: p(`${PATH_THEME}/end1.mp4`),
        RHYTHM_END_2: p(`${PATH_THEME}/end2.mp4`),
        RHYTHM_END_3: p(`${PATH_THEME}/end3.mp4`),
        RHYTHM_END_4: p(`${PATH_THEME}/end4.mp4`),
    },

    BACKGROUNDS: {
        TUTORIAL: p(`${PATH_ROOT}/bg0-1.png`), 
        DAY: p(`${PATH_ROOT}/bg1-1.png`),
        EVENING: p(`${PATH_ROOT}/bg2-1.png`),
        NIGHT: p(`${PATH_ROOT}/bg3-1.png`),
        DAWN: p(`${PATH_ROOT}/bg4.png`),
    },

    COMMON: {
        JUMP: p(`${PATH_GUIDE}/01_jump.png`),
        BIG_JUMP: p(`${PATH_GUIDE}/02_bigjump.png`),
        CROUCH: p(`${PATH_GUIDE}/03_duck.png`),
        LEFT: p(`${PATH_GUIDE}/04_left.png`),
        RIGHT: p(`${PATH_GUIDE}/05_right.png`),
        PUNCH_1: p(`${PATH_GUIDE}/06_jab1.png`),
        PUNCH_2: p(`${PATH_GUIDE}/06_jab2.png`),
        DOUBLE_PUNCH_1: p(`${PATH_GUIDE}/07_12_1.png`),
        DOUBLE_PUNCH_2: p(`${PATH_GUIDE}/07_12_2.png`),
        DOUBLE_PUNCH_3: p(`${PATH_GUIDE}/07_12_3.png`),
        DOUBLE_PUNCH_4: p(`${PATH_GUIDE}/07_12_4.png`),
        SPRINT_1: p(`${PATH_GUIDE}/08_sprint-1.png`),
        SPRINT_2: p(`${PATH_GUIDE}/08_sprint-2.png`),
        SPRINT_3: p(`${PATH_GUIDE}/08_sprint-3.png`),
        SPRINT_4: p(`${PATH_GUIDE}/08_sprint-4.png`),
        FINAL_1: p(`${PATH_GUIDE}/09_final1.png`),
        FINAL_2: p(`${PATH_GUIDE}/09_final2.png`),
        FINAL_3: p(`${PATH_GUIDE}/09_final3.png`),
        FINAL_4: p(`${PATH_GUIDE}/09_final4.png`),
        MIRROR_GUIDE: p(`${PATH_GUIDE}/10_Mirror.png`), 
        JUMP_ATTACK_1: p(`${PATH_GUIDE}/11_jumppunch1.png`),
        JUMP_ATTACK_2: p(`${PATH_GUIDE}/11_jumppunch2.png`),
        JUMP_ATTACK_3: p(`${PATH_GUIDE}/11_jumppunch3.png`),
        JUMP_ATTACK_4: p(`${PATH_GUIDE}/11_jumppunch4.png`),
        WALL_GUIDE: p(`${PATH_GUIDE}/wall_guide.mp4`),
        MIRROR_BG: p(`${PATH_ACTION}/Mirror_00.png`),
        AUDIO_JUMP: p(`${PATH_GUIDE}/01.MP3`),
        AUDIO_BIG_JUMP: p(`${PATH_GUIDE}/02.MP3`),
        AUDIO_CROUCH: p(`${PATH_GUIDE}/03.MP3`),
        AUDIO_LEFT: p(`${PATH_GUIDE}/04.MP3`),
        AUDIO_RIGHT: p(`${PATH_GUIDE}/05.MP3`),
        AUDIO_PUNCH: p(`${PATH_GUIDE}/06.MP3`),
        AUDIO_DOUBLE_PUNCH: p(`${PATH_GUIDE}/07.MP3`),
        AUDIO_SPRINT: p(`${PATH_GUIDE}/08.MP3`),
        AUDIO_FINAL: p(`${PATH_GUIDE}/09.MP3`),
        AUDIO_MIRROR: p(`${PATH_GUIDE}/10.MP3`),
        AUDIO_JUMP_ATTACK: p(`${PATH_GUIDE}/11.MP3`),
        
        AUDIO_WARN_0: p(`${GITHUB_BASE}/warning0.MP3`), 
        AUDIO_WARN_1: p(`${GITHUB_BASE}/warning1.mp3`),
        AUDIO_WARN_2: p(`${GITHUB_BASE}/warning2.mp3`),
        AUDIO_WARN_3: p(`${GITHUB_BASE}/warning3.mp3`),
        AUDIO_VICTORY: p(`${GITHUB_BASE}/victory.MP3`), 
        AUDIO_DINGDONG: p(`${GITHUB_BASE}/dingdong.MP3`),
        
        BGM_0: p(`${GITHUB_BASE}/bgm_kpop/bgm0.mp3`), 
        BGM_1: p(`${GITHUB_BASE}/bgm_kpop/bgm1.mp3`),
        BGM_2: p(`${GITHUB_BASE}/bgm_kpop/bgm2.mp3`),
        BGM_3: p(`${GITHUB_BASE}/bgm_kpop/bgm3.mp3`),
        BGM_4: p(`${GITHUB_BASE}/bgm_kpop/bgm4.mp3`),
        
        SFX_JUMP: p(`${PATH_EFFECT}/jump.mp3`),
        SFX_BIGJUMP: p(`${PATH_EFFECT}/bigjump.mp3`),
        SFX_LEFT: p(`${PATH_EFFECT}/left.mp3`),
        SFX_RIGHT: p(`${PATH_EFFECT}/right.mp3`),
        SFX_WALL: p(`${PATH_EFFECT}/wall.mp3`),
        SFX_BOSS: p(`${PATH_EFFECT}/boss.mp3`),
        SFX_PUNCH1: p(`${PATH_EFFECT}/punch1.mp3`),
        SFX_PUNCH2: p(`${PATH_EFFECT}/punch2.mp3`),
        SFX_PUNCH3: p(`${PATH_EFFECT}/punch3.mp3`),
        SFX_DUCK: p(`${PATH_EFFECT}/duck.mp3`),
    },
    
    getMirrorActionImage: (index: number) => {
        const numStr = index.toString().padStart(2, '0');
        return p(`${PATH_ACTION}/action_${numStr}.png`);
    },

    getActionWallImage: (index: number) => {
        const numStr = index.toString().padStart(2, '0');
        return p(`${PATH_ACTION_WALL}/action_${numStr}.png`);
    }
};
