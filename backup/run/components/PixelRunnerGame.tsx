
import React, { useRef, useState, useEffect } from 'react';
import { usePixelRunnerEngine } from '../hooks/usePixelRunnerEngine';
import { ACTION_TYPES, BGM_GROUPS, BACKGROUND_TYPES, ADS_CONFIG, MIRROR_CONFIG, WALL_CONFIG } from '../gameTypes';
import { SoundManager, VideoManager } from '../utils/gameUtils';
import { GUIDE_IMAGES_KEY, GUIDE_AUDIO_KEY, GUIDE_VIDEOS_KEY, CHEER_TEXTS, WALL_MAX_HP } from '../gameConstants';
import { ObjectViewer } from './ObjectViewer';
import { ASSETS } from '../config/gameAssets';
import { RhythmGameOverlay } from './RhythmGameOverlay';

export const PixelRunnerGame: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null); 
  const containerRef = useRef<HTMLDivElement>(null); 
  const [guideFrame, setGuideFrame] = useState(0);

  const { 
      gameState, 
      setGameState, 
      startGame, 
      guideImages, 
      setGuideImages, 
      guideVideos,
      setGuideVideos,
      guideAudio, 
      setGuideAudio,
      gameConfig,
      setGameConfig,
      skipLevel,
      handleMiniGameVictory,
      // EXPOSE MODELS REF FOR OBJECT VIEWER
      modelsRef 
  } = usePixelRunnerEngine(containerRef, wrapperRef);

  useEffect(() => {
      // Increased speed from 400ms to 250ms for smoother multi-frame animations (Jab/One-Two)
      const interval = setInterval(() => {
          setGuideFrame(prev => prev + 1);
      }, 250); 
      return () => clearInterval(interval);
  }, []);

  // Consolidate Keyboard Listeners
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          // --- VIEW MODE TOGGLE (A) ---
          if (gameState.gameStatus === 'MENU' && e.code === 'KeyA') {
              setGameState(prev => ({ ...prev, gameStatus: 'OBJECT_VIEWER' }));
              return;
          }
          if (gameState.gameStatus === 'OBJECT_VIEWER' && e.code === 'KeyA') {
              setGameState(prev => ({ ...prev, gameStatus: 'MENU' }));
              return;
          }

          // --- GLOBAL SHORTCUTS ---
          
          // Fullscreen (F)
          if (e.code === 'KeyF') {
              const el = wrapperRef.current;
              if (!document.fullscreenElement && el) {
                  el.requestFullscreen().catch(err => console.error(err));
              } else if (document.exitFullscreen) {
                  document.exitFullscreen().catch(err => console.error(err));
              }
              return;
          }

          // Audio Toggles
          if (e.code === 'KeyM') { SoundManager.toggleMute(); return; }
          if (e.code === 'KeyE') { SoundManager.toggleSfx(); return; }
          if (e.code === 'KeyV') { SoundManager.toggleVoice(); return; }

          // Guide Toggle (G)
          if (e.code === 'KeyG') {
              setGameState(prev => ({ ...prev, showTutorialGuide: !prev.showTutorialGuide }));
              return;
          }

          // Skip Level (S or N)
          if (e.code === 'KeyS' || e.code === 'KeyN') {
              skipLevel();
              return;
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameStatus, setGameState, skipLevel]); // Added skipLevel dependency

  // ... (Upload/Delete Handlers Omitted for Brevity) ...
  // (Rest of the component remains similar, but passing modelsRef to ObjectViewer)

  const isNight = gameState.currentPhase >= 2;

  let speedDuration = '0.4s'; 
  if (gameState.isTutorial) speedDuration = '0.6s'; 
  else if (gameState.currentPhase === 1) speedDuration = '0.4s';
  else if (gameState.currentPhase >= 2) speedDuration = '0.2s'; 

  const isSpeedEffectActive = gameState.gameStatus === 'PLAYING' && 
                              !gameState.cheerOverlay.visible && 
                              !gameState.isMirrorModeActive &&
                              !gameState.isWallFightActive; 

  // HELPER: Get correct video source (Preloaded or Fallback)
  const getCheerVideoSrc = (src?: string) => {
      if (!src) return undefined;
      if (src === ASSETS.COMMON.WALL_GUIDE) {
          return VideoManager.get('wall_guide', src);
      }
      return src;
  };

  // Determine if current cheer video is the wall guide (to keep it bright)
  const isWallGuide = gameState.cheerOverlay.videoSrc === ASSETS.COMMON.WALL_GUIDE;

  // Helper to select correct mirror video based on phase
  const getMirrorVideoSrc = () => {
      const phase = gameState.currentPhase;
      if (phase === 1) return VideoManager.get('mini1', ASSETS.MINIGAME.MINI_1);
      if (phase === 2) return VideoManager.get('mini2', ASSETS.MINIGAME.MINI_2);
      if (phase === 3) return VideoManager.get('mini3', ASSETS.MINIGAME.MINI_3);
      if (phase === 4) return VideoManager.get('mini4', ASSETS.MINIGAME.MINI_4);
      // Default / Tutorial
      return VideoManager.get('mini1', ASSETS.MINIGAME.MINI_1); 
  };

  return (
      <div ref={wrapperRef} className="relative w-full h-full bg-black overflow-hidden select-none">
           <div ref={containerRef} className="w-full h-full" />
           
           <div className={`speed-lines-container ${isSpeedEffectActive ? 'active' : ''}`}>
               <div className="speed-lines cw" style={{ animationDuration: speedDuration }}></div>
               <div className="speed-lines ccw" style={{ animationDuration: `calc(${speedDuration} * 1.25)` }}></div>
           </div>

           {gameState.uiVisible && (
               <div className="absolute inset-0 pointer-events-none z-20">
                   
                   {/* MINI GAME OVERLAY */}
                   {gameState.gameStatus === 'MINI_GAME' && (
                       <div className="absolute inset-0 z-[100] pointer-events-auto">
                           <RhythmGameOverlay
                               phase={gameState.currentPhase}
                               currentHP={gameState.bossHP}
                               maxHP={gameState.maxBossHP}
                               onComplete={handleMiniGameVictory}
                               onDamage={(amt) => {
                                   setGameState(prev => ({...prev, bossHP: Math.max(0, prev.bossHP - amt)}));
                               }}
                           />
                       </div>
                   )}

                   {/* CHEER OVERLAY */}
                   {gameState.cheerOverlay.visible && (
                       <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center animate-fade-in bg-black overflow-hidden`}>
                           {gameState.cheerOverlay.videoSrc && (
                               <div className="absolute inset-0 z-0">
                                   <video 
                                       src={getCheerVideoSrc(gameState.cheerOverlay.videoSrc)} 
                                       autoPlay 
                                       loop 
                                       muted 
                                       playsInline
                                       // CHANGED: Opacity 60 for Boss videos as requested, but keep Wall Guide bright (opacity-100)
                                       className={`w-full h-full object-cover ${isWallGuide ? 'opacity-100' : 'opacity-60'}`} 
                                   />
                                   {/* CHANGED: Add dark overlay for non-WallGuide videos to improve text readability */}
                                   <div className={`absolute inset-0 ${isWallGuide ? '' : 'bg-black/60'}`}></div>
                               </div>
                           )}
                           <div className="text-center flex flex-col items-center z-10 relative">
                                {gameState.cheerOverlay.text.split('\n').map((line, i, arr) => {
                                    const trimmed = line.trim();
                                    const isBigText = /^[1-4]$|^GO!*$/i.test(trimmed);
                                    let fontSizeClass = 'text-[180px]';
                                    if (isBigText) fontSizeClass = 'text-[420px]';
                                    else if (arr.length > 1) fontSizeClass = 'text-[130px]';
                                    
                                    return (
                                        <div key={`${i}-${line}`} className={`${fontSizeClass} font-black text-white leading-none uppercase tracking-tighter animate-zoom-fast drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]`}>
                                            {line}
                                        </div>
                                    );
                                })}
                           </div>
                       </div>
                   )}

                   {/* MIRROR OVERLAY */}
                   {gameState.isMirrorModeActive && (
                       <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${gameState.mirrorOverlayState === 'hidden' ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: gameState.mirrorOverlayState === 'black' ? 'black' : 'rgba(0,0,0,0.8)' }}>
                           {gameState.mirrorOverlayState !== 'black' && gameState.mirrorOverlayImage && (
                               <div className="absolute inset-0 z-0">
                                   <img 
                                     src={gameState.mirrorOverlayImage} 
                                     alt="Mirror Target" 
                                     className="w-full h-full object-cover animate-scale-up-smooth" 
                                   />
                               </div>
                           )}
                           {gameState.mirrorOverlayState !== 'black' && (
                                <div className="absolute inset-0 z-0 pointer-events-none">
                                   <video
                                       src={getMirrorVideoSrc()}
                                       autoPlay
                                       loop
                                       muted
                                       playsInline
                                       className="w-full h-full object-cover opacity-20" 
                                   />
                               </div>
                           )}
                           {gameState.mirrorOverlayState === 'countdown' && (
                               <div key={gameState.mirrorOverlayText} className="z-10 text-[280px] font-black text-white animate-zoom-fast drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                                   {gameState.mirrorOverlayText}
                               </div>
                           )}
                           {gameState.mirrorOverlayState === 'result' && (
                               <div className="z-10 text-[240px] font-black text-white animate-zoom-fast drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                                   {gameState.mirrorOverlayText}
                               </div>
                           )}
                       </div>
                   )}

                   {/* GAME HUD */}
                   {gameState.gameStatus === 'PLAYING' && !gameState.isMirrorModeActive && !gameState.cheerOverlay.visible && (
                       <>
                           <div className="absolute top-4 left-4 text-2xl font-black text-white z-50">
                               {gameState.distance}m
                           </div>
                           
                           <div className="w-full p-4 flex flex-col items-center">
                               <div className="w-full max-w-4xl flex items-center gap-3">
                                   <span className="text-white text-sm font-black tracking-widest uppercase w-32 text-right shrink-0">
                                       {gameState.stageLabel}
                                   </span>
                                   <div className="flex-1 h-6 bg-gray-900 border-2 border-white relative overflow-hidden">
                                       <div 
                                         className={`h-full ${gameState.stageColor} transition-all duration-100 ease-linear`}
                                         style={{ width: `${gameState.bossGaugeValue}%` }}
                                       />
                                   </div>
                                   <span className="text-white text-sm font-black w-12 text-left shrink-0">
                                       {(gameState.bossGaugeValue).toFixed(0)}%
                                   </span>
                               </div>

                               {gameState.bossMode && (
                                   <div className="w-full max-w-2xl mt-4 flex flex-col items-center animate-fade-in">
                                       <div className="w-full h-8 bg-gray-900 border-2 border-red-900 relative">
                                           <div 
                                             className="h-full bg-red-600 transition-all duration-100"
                                             style={{ width: `${(gameState.bossHP / gameState.maxBossHP) * 100}%` }}
                                           />
                                           <div className="absolute inset-0 flex items-center justify-center">
                                               <span className="text-white font-black text-xl tracking-widest uppercase">Boss HP</span>
                                           </div>
                                       </div>
                                   </div>
                               )}
                               
                               {gameState.isWallFightActive && (
                                   <div className="w-full max-w-xl mt-4 flex flex-col items-center animate-fade-in">
                                       <div className="w-full h-8 bg-gray-900 border-2 border-orange-600 relative">
                                           <div 
                                             className="h-full bg-orange-500 transition-all duration-100"
                                             style={{ width: `${(gameState.wallMonsterHP / WALL_MAX_HP) * 100}%` }}
                                           />
                                           <div className="absolute inset-0 flex items-center justify-center">
                                               <span className="text-white font-black text-xl tracking-widest uppercase">Wall HP</span>
                                           </div>
                                       </div>
                                   </div>
                               )}
                           </div>
                           
                           {/* Guide Popup */}
                           {gameState.guideActionText && (!gameState.isTutorial || gameState.showTutorialGuide) && (
                               <div key={gameState.guideActionId} className="absolute left-1/2 top-[calc(50%-290px)] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 animate-pop-in">
                                   {(() => {
                                       const images = guideImages[gameState.guideActionType];
                                       const imgShadowClass = isNight 
                                            ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" 
                                            : "drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]";

                                       if (images && images.length > 0) {
                                           const imgIndex = guideFrame % images.length;
                                           return (
                                               <div className="w-64 h-64 flex items-center justify-center">
                                                   <img 
                                                    src={images[imgIndex]} 
                                                    alt="Guide" 
                                                    className={`w-full h-full object-contain ${imgShadowClass}`}
                                                   />
                                               </div>
                                           );
                                       } else {
                                           const bubbleClass = isNight
                                                ? "bg-black/60 border-white shadow-[0_0_30px_rgba(255,255,255,0.7)]"
                                                : "bg-black/60 border-black shadow-[0_0_30px_rgba(0,0,0,0.8)]";
                                           
                                           return (
                                               <div className={`w-48 h-48 border-2 rounded-full flex flex-col items-center justify-center backdrop-blur-sm ${bubbleClass}`}>
                                                   {gameState.guideActionText.split('\n').map((line, i) => (
                                                       <span key={i} className={`${i === 0 ? 'text-5xl mb-2 not-italic' : 'text-2xl'} font-black text-white text-center leading-none tracking-tighter`}>
                                                           {line}
                                                       </span>
                                                   ))}
                                               </div>
                                           );
                                       }
                                   })()}
                               </div>
                           )}
                       </>
                   )}

                   {gameState.gameStatus === 'MENU' && (
                       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto">
                           <h1 className="text-8xl font-black text-white transform -skew-x-12 mb-8 text-center leading-tight">
                               NEON<br/><span className="text-cyan-400">RUNNER</span>
                           </h1>
                           <div className="space-y-4 w-72">
                               <button 
                                 onClick={() => startGame()}
                                 className="w-full py-5 bg-white text-black font-black text-2xl hover:bg-cyan-400 hover:scale-105 transition-all border-4 border-black shadow-[6px_6px_0px_0px_#fff] transform -skew-x-6"
                               >
                                   START SIMULATION
                               </button>
                               <button 
                                 onClick={() => setGameState(prev => ({ ...prev, gameStatus: 'ADMIN' }))}
                                 className="w-full py-3 bg-gray-800 text-white font-bold text-lg hover:bg-gray-700 hover:scale-105 transition-all border-2 border-gray-500 shadow-[4px_4px_0px_0px_#444] transform -skew-x-6"
                               >
                                   GUIDE ADMIN
                               </button>
                           </div>
                           
                           {/* SHORTCUTS LEGEND */}
                           <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-2 text-white/60 text-xs font-mono">
                                <span>[F] Fullscreen</span>
                                <span>[M] Music On/Off</span>
                                <span>[E] SFX On/Off</span>
                                <span>[V] Voice On/Off</span>
                                <span>[S] Skip Level</span>
                                <span>[G] Guide (Tutorial)</span>
                                <span>[A] Object Viewer</span>
                                <span>[I] Back to Start</span>
                           </div>
                       </div>
                   )}
                   
                   {/* OBJECT VIEWER - PASSING MODELS REF */}
                   {gameState.gameStatus === 'OBJECT_VIEWER' && (
                        <div className="absolute inset-0 pointer-events-auto">
                            <ObjectViewer 
                                onClose={() => setGameState(prev => ({ ...prev, gameStatus: 'MENU' }))} 
                                modelsRef={modelsRef} // Pass Models
                            />
                        </div>
                   )}
                   
                   {gameState.gameStatus === 'ADMIN' && (
                       <div className="absolute inset-0 bg-zinc-900/95 backdrop-blur-md pointer-events-auto overflow-y-auto">
                           {/* Admin Panel Implementation */}
                           <div className="min-h-full flex flex-col items-center justify-start p-10">
                               <div className="w-full max-w-6xl flex justify-between items-center mb-10 mt-4">
                                   <div className="flex flex-col">
                                       <h2 className="text-4xl font-black text-white tracking-tight">GAME ADMIN</h2>
                                       <p className="text-white/50 text-sm mt-1">Configure Stage Assets (Images, Videos, Music) & Obstacles</p>
                                   </div>
                                   <button 
                                     onClick={() => setGameState(prev => ({ ...prev, gameStatus: 'MENU' }))}
                                     className="px-8 py-3 bg-white text-black font-bold text-sm hover:bg-cyan-400 hover:scale-105 transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                                   >
                                       EXIT ADMIN
                                   </button>
                               </div>
                               <div className="text-white text-center w-full py-20 bg-white/5 rounded-lg border border-white/10">
                                   Admin Panel Content
                               </div>
                           </div>
                       </div>
                   )}

                   {gameState.gameStatus === 'VICTORY' && (
                       <div className="absolute inset-0 bg-yellow-500/20 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto animate-fade-in">
                           <h2 className="text-9xl font-black text-white mb-4 transform -skew-x-12 animate-pulse uppercase">Victory!</h2>
                           <p className="text-5xl text-white font-black mb-10 uppercase">Galaxy Conquered</p>
                           <button 
                             onClick={() => setGameState(prev => ({ ...prev, gameStatus: 'MENU' }))}
                             className="px-12 py-5 bg-white text-black font-black text-2xl hover:bg-gray-200 transition-colors border-4 border-black shadow-[6px_6px_0_#000] transform -skew-x-6 uppercase"
                           >
                               Play Again
                           </button>
                       </div>
                   )}
               </div>
           )}
      </div>
  );
};
