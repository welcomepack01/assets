
import React, { useEffect, useState } from 'react';
import { PixelRunnerGame } from './components/PixelRunnerGame';
import { CurrentTheme } from './theme/gameTheme';
import { SoundManager, VideoManager } from './utils/gameUtils';
import { ASSETS } from './config/gameAssets';

const App: React.FC = () => {
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    // Apply Theme CSS variables
    const root = document.documentElement;
    root.style.setProperty('--bg-gradient', CurrentTheme.css.background);
    root.style.setProperty('--speed-line-color-1', CurrentTheme.css.speedLineColor1);
    root.style.setProperty('--speed-line-color-2', CurrentTheme.css.speedLineColor2);

    // --- PRELOAD CRITICAL VIDEO ASSETS (Instant Playback) ---
    const preloadList = async () => {
        // 1. Overlay Videos
        await VideoManager.preloadVideo('mirror', ASSETS.THEME.MIRROR_VIDEO_1);
        await VideoManager.preloadVideo('wall_guide', ASSETS.COMMON.WALL_GUIDE);
        await VideoManager.preloadVideo('mini1', ASSETS.MINIGAME.MINI_1);

        // 2. Background Videos (Use the Asset URL itself as the key for easy lookup)
        await VideoManager.preloadVideo(ASSETS.THEME.BG_VIDEO_TUTORIAL, ASSETS.THEME.BG_VIDEO_TUTORIAL);
        await VideoManager.preloadVideo(ASSETS.THEME.BG_VIDEO_DAY, ASSETS.THEME.BG_VIDEO_DAY);
        await VideoManager.preloadVideo(ASSETS.THEME.BG_VIDEO_EVENING, ASSETS.THEME.BG_VIDEO_EVENING);
        await VideoManager.preloadVideo(ASSETS.THEME.BG_VIDEO_NIGHT, ASSETS.THEME.BG_VIDEO_NIGHT);
        await VideoManager.preloadVideo(ASSETS.THEME.BG_VIDEO_DAWN, ASSETS.THEME.BG_VIDEO_DAWN);
        
        // 3. Boss Videos (Preload ALL Bosses)
        await VideoManager.preloadVideo(ASSETS.THEME.BOSS1_MOV, ASSETS.THEME.BOSS1_MOV);
        await VideoManager.preloadVideo(ASSETS.THEME.BOSS2_MOV, ASSETS.THEME.BOSS2_MOV);
        await VideoManager.preloadVideo(ASSETS.THEME.BOSS3_MOV, ASSETS.THEME.BOSS3_MOV);
        await VideoManager.preloadVideo(ASSETS.THEME.BOSS4_VIDEO, ASSETS.THEME.BOSS4_VIDEO);
    };

    preloadList();

    // Hard Reset Listener (I Key) - Forces a complete remount of the game component
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyI') {
        console.log("Hard Reset Triggered via App Key");
        SoundManager.stopBGM(); // Stop music immediately
        setGameKey(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-zinc-900">
      {/* Changing the key prop forces React to destroy the old component and create a new one */}
      <PixelRunnerGame key={gameKey} />
    </div>
  );
};

export default App;
