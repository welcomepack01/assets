
import * as THREE from 'three';

export const createDetailedTexture = (type: string, baseColor: string, noiseAmount: number = 0.1): THREE.Texture => {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();
  
  const fill = (color: string) => { ctx.fillStyle = color; ctx.fillRect(0, 0, size, size); };
  const addNoise = (amount: number) => {
      const count = Math.floor(size * size * 0.2);
      for(let i=0; i < count; i++) {
          const x = Math.floor(Math.random() * size); const y = Math.floor(Math.random() * size);
          ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000'; 
          ctx.globalAlpha = Math.random() * amount; 
          ctx.fillRect(x, y, 1, 1);
      }
      ctx.globalAlpha = 1.0;
  };

  if (type === 'frozen_cobble') {
      fill('#A08C75'); 
      const tileSize = 64; 
      const gap = 4;
      for(let y=0; y<size; y+=tileSize) {
          for(let x=0; x<size; x+=tileSize) {
              ctx.fillStyle = Math.random() > 0.5 ? '#BCAAA4' : '#8D6E63';
              const rX = x + gap; const rY = y + gap;
              const rW = tileSize - gap*2; const rH = tileSize - gap*2;
              ctx.fillRect(rX, rY, rW, rH);
          }
      }
      // Snow patches
      ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = 0.4;
      for(let i=0; i<30; i++) {
          const cx = Math.random() * size; const cy = Math.random() * size;
          ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI*2); ctx.fill();
      }
      addNoise(0.1);
  }
  else if (type === 'frozen_snow') {
      fill('#FFFFFF');
      addNoise(0.05);
      ctx.fillStyle = '#E0F7FA'; 
      ctx.globalAlpha = 0.3;
      for(let i=0; i<1000; i++) {
          ctx.fillRect(Math.random()*size, Math.random()*size, 4, 4);
      }
  }
  else if (type === 'frozen_ice') {
      const grad = ctx.createLinearGradient(0,0,size,size);
      grad.addColorStop(0, '#81D4FA'); grad.addColorStop(1, '#E1F5FE');
      ctx.fillStyle = grad; ctx.fillRect(0,0,size,size);
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
      for(let i=0; i<20; i++) {
          ctx.beginPath(); ctx.moveTo(Math.random()*size, Math.random()*size); 
          ctx.lineTo(Math.random()*size, Math.random()*size); ctx.stroke();
      }
      addNoise(0.05);
  }
  else if (type === 'frozen_castle_tile') {
      // Replaced with Royal Carpet logic inside environment.ts, 
      // but keeping basic texture here just in case fallback is needed
      fill('#607D8B'); 
      ctx.fillStyle = '#455A64';
      const tileSize = 64;
      for(let y=0; y<size; y+=tileSize) {
          for(let x=0; x<size; x+=tileSize) {
              if ((x/tileSize + y/tileSize) % 2 === 0) ctx.fillRect(x,y,tileSize,tileSize);
          }
      }
      addNoise(0.1);
  }
  else if (type === 'frozen_cracked_ice') {
      fill('#01579B'); 
      ctx.fillStyle = '#4FC3F7'; 
      ctx.fillRect(0,0,size,size);
      ctx.fillStyle = '#0277BD';
      for(let i=0; i<20; i++) {
          const w = Math.random() * 150; const h = Math.random() * 10;
          const x = Math.random() * size; const y = Math.random() * size;
          ctx.save(); ctx.translate(x, y); ctx.rotate(Math.random() * Math.PI);
          ctx.fillRect(-w/2, -h/2, w, h); ctx.restore();
      }
      addNoise(0.1);
  }
  else {
      ctx.fillStyle = baseColor; ctx.fillRect(0, 0, size, size); addNoise(0.1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace; 
  tex.magFilter = THREE.NearestFilter; 
  tex.minFilter = THREE.NearestFilter; 
  tex.generateMipmaps = false; 
  return tex;
};

export const VideoManager = {
    videos: {} as Record<string, string>, 

    async preloadVideo(key: string, src: string) {
        if (this.videos[key]) return; 
        try {
            const response = await fetch(src);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            this.videos[key] = blobUrl;
            console.log(`[VideoManager] Video preloaded: ${key}`);
        } catch (error) {
            console.warn(`[VideoManager] Failed to preload video ${key}:`, error);
        }
    },

    get(key: string, fallbackSrc: string) {
        return this.videos[key] || fallbackSrc;
    }
};

// --- AUDIO HELPERS FOR SYNTHESIS ---
const makeDistortionCurve = (amount: number) => {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    return curve;
};

export const SoundManager = {
    bgm: null as HTMLAudioElement | null,
    customSounds: {} as Record<string, string>,
    audioBuffers: {} as Record<string, AudioBuffer>, 
    isMuted: false,
    isSfxMuted: false,
    isVoiceMuted: false,
    currentTheme: 'normal',
    ctx: null as AudioContext | null,
    distCurve: null as Float32Array | null,

    init() {
        const Ctor = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctor) {
            this.ctx = new Ctor();
            this.distCurve = makeDistortionCurve(400); 
            if(this.ctx.state === 'suspended') {
                const resumeHandler = () => {
                    this.ctx?.resume();
                    window.removeEventListener('click', resumeHandler);
                    window.removeEventListener('keydown', resumeHandler);
                };
                window.addEventListener('click', resumeHandler);
                window.addEventListener('keydown', resumeHandler);
            }
        }
    },

    loadCustomSound(key: string, src: string) {
        this.customSounds[key] = src;
    },

    async preloadSound(key: string, src: string) {
        if (this.audioBuffers[key]) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;
        try {
            const response = await fetch(src);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            this.audioBuffers[key] = audioBuffer;
        } catch (e) {
            console.warn(`Failed to preload audio ${key}:`, e);
        }
    },

    removeCustomSound(key: string) {
        delete this.customSounds[key];
        delete this.audioBuffers[key];
    },

    playCustom(key: string) {
        if (this.isMuted) return;
        const guideKeys = ['jump', 'big_jump', 'crouch', 'left', 'right', 'punch', 'double_punch', 'sprint', 'final_blow', 'mirror_me', 'jump_attack'];
        if (this.isVoiceMuted && guideKeys.includes(key)) return;
        let volume = 0.85;
        if (guideKeys.includes(key)) volume = 0.68;
        else if (key.startsWith('sfx_')) volume = 0.5; 
        else if (key.startsWith('warning')) volume = 0.6; // Correctly set to 60%
        else if (key === 'victory') volume = 1.0; 

        if (this.audioBuffers[key] && this.ctx) {
            try {
                if (this.ctx.state === 'suspended') this.ctx.resume();
                const source = this.ctx.createBufferSource();
                source.buffer = this.audioBuffers[key];
                const gainNode = this.ctx.createGain();
                gainNode.gain.value = volume; 
                source.connect(gainNode);
                gainNode.connect(this.ctx.destination);
                source.start(0);
                return;
            } catch (e) { console.warn('Web Audio play failed', e); }
        }
        const src = this.customSounds[key];
        if (src) {
            const audio = new Audio(src);
            audio.volume = volume;
            audio.play().catch(() => {});
        }
    },

    getAudioContext() {
        if (!this.ctx) {
            const Ctor = window.AudioContext || (window as any).webkitAudioContext;
            if (Ctor) this.ctx = new Ctor();
        }
        return this.ctx;
    },

    playTone(freq: number, type: OscillatorType, duration: number) {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    },

    playNoise(duration: number) {
        const ctx = this.getAudioContext();
        if(!ctx) return;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        noise.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
    },

    playJump() { if (!this.isMuted && !this.isSfxMuted) this.playCustom('sfx_jump'); },
    playBigJump() { if (!this.isMuted && !this.isSfxMuted) this.playCustom('sfx_big_jump'); },
    playLeft() { if (!this.isMuted && !this.isSfxMuted) this.playCustom('sfx_left'); },
    playRight() { if (!this.isMuted && !this.isSfxMuted) this.playCustom('sfx_right'); },
    playPunch() { if (!this.isMuted && !this.isSfxMuted) this.playTone(150, 'sawtooth', 0.1); },
    playCrash() { if (!this.isMuted && !this.isSfxMuted) this.playNoise(0.3); },
    playPowerUp() { if (!this.isMuted && !this.isSfxMuted) this.playTone(800, 'sine', 0.3); },
    playGlassBreak() { if (!this.isMuted && !this.isSfxMuted) this.playNoise(0.2); },
    playCountdown() { if (!this.isMuted && !this.isSfxMuted) this.playTone(600, 'sine', 0.1); },
    playActionSignal() { if (!this.isMuted && !this.isSfxMuted) this.playTone(800, 'square', 0.2); },
    playWallBreak() { if (!this.isMuted && !this.isSfxMuted) this.playCustom('sfx_wall'); },
    playBossExplosion() { if (!this.isMuted && !this.isSfxMuted) this.playCustom('sfx_boss'); },
    playRhythmHit(lane: 'left' | 'right' | 'center') {
        if (!this.isMuted && !this.isSfxMuted) {
            if (lane === 'left') this.playCustom('sfx_punch1');
            else if (lane === 'right') this.playCustom('sfx_punch2');
            else this.playCustom('sfx_punch3');
        }
    },

    // --- ZOOTOPIA THEME INSTRUMENT SYNTHESIS (Bright & Upbeat) ---
    playScaleNote(index: number, phase: number = 1, isSpecial: boolean = false) {
        if (this.isMuted || this.isSfxMuted) return;
        const ctx = this.getAudioContext();
        if (!ctx) return;

        // SCALES: Pop & Funk Inspired
        let melody: number[] = [];
        
        // Phase 1: Sahara Square (Tropical Pop) - C Major Pentatonic
        if (phase === 1) { 
            // C, D, E, G, A, C, D, E...
            melody = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        } 
        // Phase 2: Ringsley Hall (Big Band Party) - F Major (Bright & Fun)
        else if (phase === 2) { 
            // F, G, A, Bb, C, D, E, F...
            melody = [349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 1046.50];
        } 
        // Phase 3: Power Plant (Chase Funk) - D Dorian (Cool & Fast)
        else if (phase === 3) {
            // D, E, F, G, A, B, C, D...
            melody = [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 880.00];
        } 
        // Phase 4: Finale Concert (Try Everything Vibe) - G Major High Energy
        else {
            // G, A, B, C, D, E, F#, G...
            melody = [392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 739.99, 783.99, 880.00, 987.77, 1174.66];
        }

        const noteIndex = Math.max(0, index - 1);
        const freq = melody[noteIndex % melody.length];

        // --- CUSTOM POP INSTRUMENTS ---

        // 1. Tropical Marimba/Pluck (Phase 1)
        const playPopPluck = (f: number, vol: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            // Triangle wave for pure but bright sound
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, ctx.currentTime);
            
            // Short percussive envelope
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3); // Quick decay

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        };

        // 2. Synth Brass Stabs (Phase 2)
        const playJazzBrass = (f: number, vol: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            osc.type = 'sawtooth'; // Sawtooth for brass buzz
            osc.frequency.setValueAtTime(f, ctx.currentTime);
            
            // Lowpass filter envelope (Wah effect)
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(f, ctx.currentTime);
            filter.frequency.linearRampToValueAtTime(f * 4, ctx.currentTime + 0.05); // Open up quickly
            filter.frequency.exponentialRampToValueAtTime(f, ctx.currentTime + 0.3);

            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        };

        // 3. Funky Square Lead (Phase 3)
        const playFunkyLead = (f: number, vol: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'square'; // Distinct retro/funk sound
            osc.frequency.setValueAtTime(f, ctx.currentTime);
            
            // Slight slide up for funk feel
            osc.frequency.linearRampToValueAtTime(f, ctx.currentTime + 0.05);

            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(vol * 0.7, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.25);
        };

        // 4. Anthem Super Saw (Phase 4)
        const playAnthemSynth = (f: number, vol: number) => {
            // Create two detuned sawtooths for a thick sound
            const osc1 = ctx.createOscillator(); osc1.type = 'sawtooth'; osc1.frequency.value = f;
            const osc2 = ctx.createOscillator(); osc2.type = 'sawtooth'; osc2.frequency.value = f * 1.01; // Detune up
            const osc3 = ctx.createOscillator(); osc3.type = 'sawtooth'; osc3.frequency.value = f * 0.99; // Detune down

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(vol * 0.3, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6); // Longer sustain

            osc1.connect(gain); osc2.connect(gain); osc3.connect(gain);
            gain.connect(ctx.destination);
            
            const stopTime = ctx.currentTime + 0.6;
            osc1.start(); osc1.stop(stopTime);
            osc2.start(); osc2.stop(stopTime);
            osc3.start(); osc3.stop(stopTime);
        };

        // --- SPECIAL IMPACT SFX (Orchestra Hit) ---
        const playOrchHit = () => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3); // Drop pitch
            
            gain.gain.setValueAtTime(0.8, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        };

        // Select Instrument based on Phase
        if (phase === 1) playPopPluck(freq, 0.4);
        else if (phase === 2) playJazzBrass(freq, 0.35);
        else if (phase === 3) playFunkyLead(freq, 0.3);
        else playAnthemSynth(freq, 0.3);

        // Special Kick/Crash for Uppercuts (Yellow Blocks)
        if (isSpecial) {
            playOrchHit();
        }
    },

    setTheme(theme: string) {
        this.currentTheme = theme;
        if (this.bgm && !this.bgm.paused) {
            this.startBGM(); 
        }
    },

    startBGM() {
        if (this.isMuted) return;
        this.stopBGM();
        
        let bgmKey = '';
        if (this.currentTheme === 'tutorial') bgmKey = 'bg0_1';
        else if (this.currentTheme === 'normal') bgmKey = 'bg1_1';
        else if (this.currentTheme === 'lava') bgmKey = 'bg2_1';
        else if (this.currentTheme === 'ice') bgmKey = 'bg3_1';
        else if (this.currentTheme === 'dawn') bgmKey = 'bg4_1';

        const src = this.customSounds[bgmKey];
        if (src) {
            this.bgm = new Audio(src);
            this.bgm.loop = true;
            this.bgm.volume = 0.4;
            this.bgm.play().catch(() => {});
        }
    },

    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm = null;
        }
    },

    fadeOutBGM(duration: number) {
        if (!this.bgm) return;
        const originalVolume = this.bgm.volume;
        const steps = 10;
        const stepTime = duration * 1000 / steps;
        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            currentStep++;
            if (!this.bgm) { clearInterval(fadeInterval); return; }
            this.bgm.volume = originalVolume * (1 - currentStep / steps);
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                this.stopBGM();
            }
        }, stepTime);
    },
    
    setBGMVolume(vol: number) {
        if (this.bgm && !this.isMuted) {
            this.bgm.volume = Math.max(0, Math.min(1, vol));
        }
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) this.stopBGM();
        else this.startBGM();
    },
    toggleSfx() {
        this.isSfxMuted = !this.isSfxMuted;
    },
    toggleVoice() {
        this.isVoiceMuted = !this.isVoiceMuted;
    }
};
