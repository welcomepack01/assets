
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ASSETS } from '../config/gameAssets';
import { SoundManager } from '../utils/gameUtils';

interface RhythmGameOverlayProps {
    phase: number;
    currentHP: number; 
    maxHP: number;     
    onComplete: () => void;
    onDamage: (amount: number) => void;
}

interface Note {
    id: number;
    lane: 'left' | 'right' | 'center';
    height: 'low' | 'high'; 
    z: number; 
    speed: number;
    targetTime: number; 
    noteIndex: number;  
    isHit: boolean;
    isMissed: boolean;
    hitTime?: number;
    type: 'normal' | 'uppercut';
    isWarmup?: boolean; 
    speedMulti?: number;
    isChord?: boolean; 
}

interface CubeNoteProps {
    note: Note;
    x: number;
    z: number;
}

const CubeNote: React.FC<CubeNoteProps> = ({ note, x, z }) => {
    const rotation = note.isHit ? '' : `rotateX(${z * 0.2}deg) rotateY(${z * 0.1}deg) rotateZ(${z * 0.05}deg)`;
    const yPos = note.height === 'high' ? 120 : 0;
    const slopeY = (z - 200) * 0.15; 
    const finalY = 50 - yPos - slopeY;

    const hitStyle = note.isHit ? {
        transform: `translate3d(${x}px, ${finalY}px, ${z}px) scale(3)`, 
        opacity: 0,
        transition: 'transform 0.15s ease-out, opacity 0.15s ease-out'
    } : {
        transform: `translate3d(${x}px, ${finalY}px, ${z}px) ${rotation}`,
        opacity: 1.0 
    };

    let faceStyle = '';
    let containerClass = '';

    if (note.isWarmup) {
        faceStyle = 'bg-gray-600 border-4 border-gray-400 shadow-[0_0_30px_#888888]'; 
    } else if (note.type === 'uppercut') {
        faceStyle = 'bg-yellow-400 border-4 border-white shadow-[0_0_40px_#FFFF00]'; 
    } else if (note.isChord) {
        // CHANGED: SPHERE STYLE (Emerald) - Rounded Full, No Ambient Pulse
        faceStyle = 'bg-emerald-400 border-4 border-emerald-100 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] opacity-95'; 
        containerClass = 'z-20';
    } else {
        faceStyle = note.lane === 'left' 
            ? 'bg-blue-600 border-4 border-blue-400 shadow-[0_0_30px_#2563EB]' 
            : 'bg-purple-600 border-4 border-purple-400 shadow-[0_0_30px_#9333EA]'; 
    }
    
    const faceSize = 120;
    const half = faceSize / 2;

    return (
        <div 
            className={`absolute ${containerClass}`}
            style={{
                width: `${faceSize}px`,
                height: `${faceSize}px`,
                transformStyle: 'preserve-3d',
                ...hitStyle
            }}
        >
            {/* Ambient Pulse REMOVED */}

            {note.isHit && (
                <>
                    <div className="absolute inset-0 bg-white animate-ping opacity-75 rounded-full z-50"></div>
                    <div className="absolute inset-[-50px] border-4 border-cyan-400 rounded-full animate-ping opacity-50 z-40"></div>
                </>
            )}
            
            {/* Front Face */}
            <div className={`absolute inset-0 flex items-center justify-center ${faceStyle}`} 
                 style={{ transform: `translateZ(${half}px)` }}>
                {note.isWarmup ? (
                    <div className="text-white font-bold text-4xl">READY</div>
                ) : note.isChord ? (
                    // Circular internal design for the Sphere
                    <div className="w-20 h-20 border-4 border-white rounded-full bg-emerald-300 shadow-[0_0_15px_white]"></div>
                ) : (
                    <div className="w-16 h-16 bg-white/80 rounded-full"></div>
                )}
            </div>
            
            {/* Back Face */}
            <div className={`absolute inset-0 ${faceStyle}`} 
                 style={{ transform: `rotateY(180deg) translateZ(${half}px)` }}></div>
            
            {/* Right Face */}
            <div className={`absolute inset-0 ${faceStyle}`} 
                 style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}></div>
            
            {/* Left Face */}
            <div className={`absolute inset-0 ${faceStyle}`} 
                 style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }}></div>
            
            {/* Top Face */}
            <div className={`absolute inset-0 ${faceStyle}`} 
                 style={{ transform: `rotateX(90deg) translateZ(${half}px)` }}></div>
            
            {/* Bottom Face */}
            <div className={`absolute inset-0 ${faceStyle}`} 
                 style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}></div>
        </div>
    );
};

const SPAWN_Z = -3000;
const HIT_Z = 200;
const TRAVEL_DIST = HIT_Z - SPAWN_Z; 
const NOTE_TRAVEL_TIME = 2000; 
const NOTE_SPEED = TRAVEL_DIST / NOTE_TRAVEL_TIME; 

// --- DYNAMIC CHART GENERATOR (FROZEN THEME) ---
const generateFrozenChart = (bpm: number, phase: number) => {
    const beatTime = 60000 / bpm; // ms per beat
    const notes: any[] = [];
    
    // Target counts
    let targetNoteCount = 30;
    if (phase === 2) targetNoteCount = 55; 
    if (phase === 3) targetNoteCount = 70;
    if (phase === 4) targetNoteCount = 80; 

    const addNote = (time: number, lane: 'left'|'right'|'center', height: 'low'|'high', idx: number, type: 'normal'|'uppercut' = 'normal', speedMulti: number = 1.0, isChord: boolean = false) => {
        notes.push({ time, lane, height, noteIndex: idx, type, speedMulti, isChord });
    };

    let currentTime = 2000; // Start delay
    
    const scaleIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let noteBag: number[] = [];
    
    const refillBag = () => {
        const base = [...scaleIndices, ...scaleIndices];
        for (let i = base.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [base[i], base[j]] = [base[j], base[i]];
        }
        noteBag = base;
    };

    const getNextMelodyNote = () => {
        if (noteBag.length === 0) refillBag();
        return noteBag.pop() || 1;
    };

    refillBag();

    let noteCounter = 0;
    let barCount = 0;

    // --- WARMUP (LEVEL 1 ONLY) ---
    if (phase === 1) {
        let t = 3500;
        const warmupSpeed = 0.75; 
        notes.push({ time: t, lane: 'left', height: 'low', noteIndex: 1, type: 'normal', speedMulti: warmupSpeed, isWarmup: true });
        t += 2000; 
        notes.push({ time: t, lane: 'right', height: 'low', noteIndex: 2, type: 'normal', speedMulti: warmupSpeed, isWarmup: true });
        t += 2000;
        notes.push({ time: t, lane: 'center', height: 'high', noteIndex: 3, type: 'uppercut', speedMulti: warmupSpeed, isWarmup: true });
        currentTime = t + 2500; 
    } else {
        currentTime = 2000; 
    }

    // --- CHART GENERATION PATTERNS ---
    while (noteCounter < targetNoteCount) {
        barCount++;
        
        // --- PHASE 1: SNOWY FOREST (Steady, Marching) ---
        if (phase === 1) {
            if (barCount % 4 === 0) {
                // Chord (Simultaneous)
                addNote(currentTime, 'left', 'low', getNextMelodyNote(), 'normal', 1.0, true);
                addNote(currentTime, 'right', 'low', getNextMelodyNote(), 'normal', 1.0, true);
                noteCounter += 2;
                currentTime += beatTime;
            } else if (barCount % 4 === 3) {
                addNote(currentTime, 'center', 'high', 8, 'uppercut');
                noteCounter++;
                currentTime += beatTime;
            } else {
                addNote(currentTime, 'left', 'low', getNextMelodyNote());
                currentTime += beatTime;
                noteCounter++;
                addNote(currentTime, 'right', 'low', getNextMelodyNote());
                currentTime += beatTime;
                noteCounter++;
            }
        }
        
        // --- PHASE 2: ICE PALACE / GALA (Complex Jazz/Pop Patterns) ---
        else if (phase === 2) {
            // Cycle through 3 distinct patterns to avoid monotony
            const patternType = barCount % 3; 

            if (patternType === 0) {
                // Pattern A: "Swing Steps" (Left... Right... Fast-Left-Right)
                // Jazzy syncopation
                addNote(currentTime, 'left', 'low', getNextMelodyNote()); // Beat 1
                currentTime += beatTime;
                addNote(currentTime, 'right', 'low', getNextMelodyNote()); // Beat 2
                currentTime += beatTime;
                // Beat 3 & 4 (Quick switching)
                addNote(currentTime, 'left', 'low', getNextMelodyNote(), 'normal', 1.0);
                currentTime += beatTime / 2;
                addNote(currentTime, 'right', 'low', getNextMelodyNote(), 'normal', 1.0);
                currentTime += beatTime * 1.5; // Rest of bar
                
                noteCounter += 4;
            } 
            else if (patternType === 1) {
                // Pattern B: "Pop Chord" (Double Hit -> Pause -> Uppercut)
                // Impactful hits
                addNote(currentTime, 'left', 'low', getNextMelodyNote(), 'normal', 1.0, true);
                addNote(currentTime, 'right', 'low', getNextMelodyNote(), 'normal', 1.0, true);
                currentTime += beatTime * 1.5; // Syncopated delay
                
                addNote(currentTime, 'center', 'high', getNextMelodyNote(), 'uppercut');
                currentTime += beatTime * 0.5;
                
                // Finish bar with quick taps
                addNote(currentTime, 'left', 'low', getNextMelodyNote());
                currentTime += beatTime;
                addNote(currentTime, 'right', 'low', getNextMelodyNote());
                currentTime += beatTime;
                
                noteCounter += 5;
            } 
            else {
                // Pattern C: "Rapid Flow" (Left->Center->Right Staircase)
                // Fast movement
                addNote(currentTime, 'left', 'low', getNextMelodyNote());
                currentTime += beatTime / 2;
                addNote(currentTime, 'center', 'low', getNextMelodyNote()); // Use center lane for flow
                currentTime += beatTime / 2;
                addNote(currentTime, 'right', 'low', getNextMelodyNote());
                currentTime += beatTime;
                
                // End with emphasis
                addNote(currentTime, 'center', 'high', 10, 'uppercut', 1.2); // Slightly faster visual
                currentTime += beatTime * 2.0; // Long pause/sustain
                
                noteCounter += 4;
            }
        }
        
        // --- PHASE 3: CASTLE (Varied, Complex Waltz) ---
        else if (phase === 3) {
            const patternType = Math.floor(Math.random() * 4);
            if (patternType === 0) {
                addNote(currentTime, 'left', 'low', getNextMelodyNote());
                currentTime += beatTime / 2;
                addNote(currentTime, 'right', 'low', getNextMelodyNote());
                currentTime += beatTime / 4;
                addNote(currentTime, 'left', 'low', getNextMelodyNote());
                currentTime += beatTime * 1.25; 
                noteCounter += 3;
            } else if (patternType === 1) {
                addNote(currentTime, 'left', 'low', getNextMelodyNote(), 'normal', 1.0, true);
                addNote(currentTime, 'right', 'low', getNextMelodyNote(), 'normal', 1.0, true);
                currentTime += beatTime;
                addNote(currentTime, 'center', 'high', getNextMelodyNote(), 'uppercut');
                currentTime += beatTime;
                noteCounter += 3;
            } else if (patternType === 2) {
                for(let k=0; k<4; k++) {
                    const lane = k%2===0 ? 'left' : 'right';
                    addNote(currentTime, lane, 'low', getNextMelodyNote());
                    currentTime += beatTime / 2;
                }
                noteCounter += 4;
            } else {
                currentTime += beatTime / 2;
                addNote(currentTime, 'center', 'high', getNextMelodyNote(), 'uppercut', 1.3);
                currentTime += beatTime * 1.5;
                noteCounter++;
            }
        }
        
        // --- PHASE 4: FJORD (Epic) ---
        else if (phase === 4) {
            const pattern = Math.random();
            if (pattern < 0.3) { 
                for(let k=0; k<4; k++) {
                    if (noteCounter >= targetNoteCount) break;
                    const lane = k % 2 === 0 ? 'left' : 'right';
                    addNote(currentTime, lane, 'low', getNextMelodyNote(), 'normal', 1.0);
                    currentTime += beatTime / 2;
                    noteCounter++;
                }
                currentTime += beatTime / 2; 
            } else if (pattern < 0.7) {
                addNote(currentTime, 'left', 'low', getNextMelodyNote(), 'normal', 1.0, true);
                addNote(currentTime, 'right', 'low', getNextMelodyNote(), 'normal', 1.0, true);
                currentTime += beatTime; 
                addNote(currentTime, 'center', 'high', 10, 'uppercut', 1.1); 
                currentTime += beatTime; 
                noteCounter += 3;
            } else {
                const randomLane = Math.random() > 0.5 ? 'left' : 'right';
                addNote(currentTime, randomLane, 'low', getNextMelodyNote());
                currentTime += beatTime;
                noteCounter++;
            }
        }
    }

    currentTime += beatTime;
    addNote(currentTime, 'center', 'low', 1, 'uppercut', 1.0);

    return { notes, totalDuration: currentTime + 3000 };
};

export const RhythmGameOverlay: React.FC<RhythmGameOverlayProps> = ({ 
    phase, onComplete, onDamage 
}) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'success' | 'video'>('intro');
    const [notes, setNotes] = useState<Note[]>([]);
    const [combo, setCombo] = useState(0);
    const [hitCount, setHitCount] = useState(0); 
    const [showTitle, setShowTitle] = useState(false);
    const [shake, setShake] = useState(0);
    
    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const spawnedIndicesRef = useRef<Set<string>>(new Set());
    const handledNotesRef = useRef<Set<number>>(new Set());
    const hitCountRef = useRef<number>(0); 
    const chartRef = useRef<{notes: any[], totalDuration: number} | null>(null);
    const totalNotesRef = useRef<number>(0);

    useEffect(() => {
        // RESET REFS ON PHASE CHANGE to prevent state leakage
        spawnedIndicesRef.current = new Set();
        handledNotesRef.current = new Set();
        hitCountRef.current = 0;
        startTimeRef.current = 0;
        setNotes([]);
        setCombo(0);
        setHitCount(0);

        let bpm = 110; 
        if (phase === 2) bpm = 128; 
        if (phase === 3) bpm = 145; // Faster for complexity
        if (phase === 4) bpm = 150; // Lowered from 160 to 150 for difficulty balance

        const chart = generateFrozenChart(bpm, phase);
        chartRef.current = chart;
        
        const scoringNotes = chart.notes.filter(n => !n.isWarmup).length;
        totalNotesRef.current = scoringNotes;

        setShowTitle(true);
        const titleTimer = setTimeout(() => setShowTitle(false), 2000);
        
        const startDelay = 2000;
        const startTimer = setTimeout(() => {
            setGameState('playing');
            startTimeRef.current = performance.now();
        }, startDelay);

        return () => {
            clearTimeout(titleTimer);
            clearTimeout(startTimer);
        };
    }, [phase]);

    const triggerHit = useCallback((note: Note) => {
        setShake(20);
        SoundManager.playScaleNote(note.noteIndex, phase, note.type === 'uppercut'); 
        
        if (note.isWarmup) {
            return;
        }

        setCombo(c => c + 1);
        setHitCount(c => c + 1);
        hitCountRef.current += 1;
        
        // Wrap in setTimeout to prevent "Cannot update a component while rendering" error
        setTimeout(() => onDamage(1), 0);
    }, [onDamage, phase]);

    const update = useCallback((now: number) => {
        if (gameState !== 'playing' || !chartRef.current) return;

        const songTime = now - startTimeRef.current;
        const chart = chartRef.current;

        if (hitCountRef.current >= totalNotesRef.current || songTime > chart.totalDuration) {
            setGameState('success');
            SoundManager.setBGMVolume(0.4); 
            setTimeout(() => setGameState('video'), 1500);
            return;
        }

        setShake(prev => (prev > 0.5 ? prev * 0.9 : 0));

        // BATCH SPAWNING
        const newNotes: Note[] = [];
        chart.notes.forEach((noteData, index) => {
            const spawnId = `note_${index}`;
            const timeUntilHit = noteData.time - songTime;
            
            const speedMulti = noteData.speedMulti || 1.0;
            const effectiveTravelTime = NOTE_TRAVEL_TIME / speedMulti;

            if (timeUntilHit <= effectiveTravelTime && timeUntilHit > -200 && !spawnedIndicesRef.current.has(spawnId)) {
                spawnedIndicesRef.current.add(spawnId);
                
                newNotes.push({
                    id: Date.now() + Math.random(),
                    lane: noteData.lane,
                    height: noteData.height,
                    z: SPAWN_Z, 
                    speed: NOTE_SPEED * speedMulti, 
                    targetTime: noteData.time,
                    noteIndex: noteData.noteIndex,
                    isHit: false,
                    isMissed: false,
                    type: noteData.type || 'normal',
                    isWarmup: noteData.isWarmup,
                    isChord: noteData.isChord 
                });
            }
        });

        if (newNotes.length > 0) {
            setNotes(prev => [...prev, ...newNotes]);
        }

        setNotes(prev => {
            const nextNotes: Note[] = [];
            
            prev.forEach(note => {
                if (note.isHit) {
                    if (Date.now() - (note.hitTime || 0) < 300) nextNotes.push(note);
                    return;
                }

                const timeToTarget = note.targetTime - songTime;
                note.z = HIT_Z - (timeToTarget * note.speed);

                if (!note.isHit && !note.isMissed && note.z >= HIT_Z - 20) {
                    if (!handledNotesRef.current.has(note.id)) {
                        handledNotesRef.current.add(note.id);
                        triggerHit(note);
                        note.isHit = true; 
                        note.hitTime = Date.now();
                    }
                }

                if (note.z <= HIT_Z + 500) { 
                    nextNotes.push(note);
                }
            });
            return nextNotes;
        });

        requestRef.current = requestAnimationFrame(update);
    }, [gameState, triggerHit]);

    useEffect(() => {
        if (gameState === 'playing') {
            requestRef.current = requestAnimationFrame(update);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, update]);

    const getVideoSrc = () => {
        if (phase === 1) return ASSETS.CHEER.RHYTHM_END_1;
        if (phase === 2) return ASSETS.CHEER.RHYTHM_END_2;
        if (phase === 3) return ASSETS.CHEER.RHYTHM_END_3;
        if (phase === 4) return ASSETS.CHEER.RHYTHM_END_4;
        return ASSETS.CHEER.RHYTHM_END_1;
    };

    const getBgVideoSrc = () => {
        if (phase === 1) return ASSETS.MINIGAME.MINI_1;
        if (phase === 2) return ASSETS.MINIGAME.MINI_2;
        if (phase === 3) return ASSETS.MINIGAME.MINI_3;
        if (phase === 4) return ASSETS.MINIGAME.MINI_4;
        return ASSETS.MINIGAME.MINI_1; 
    };

    const getBossTitle = () => {
        return `LEVEL ${phase} BOSS`;
    };

    const RoadContent = () => (
        <>
            <div 
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(0deg, transparent 0%, rgba(0, 255, 255, 0.5) 2%, transparent 4%, transparent 100%),
                        linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 1%, transparent 2%)
                    `,
                    backgroundSize: '100% 100px, 100px 100%',
                    animation: 'roadScroll 0.3s linear infinite'
                }}
            ></div>
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-blue-500 shadow-[0_0_50px_#3b82f6,0_0_100px_#3b82f6]"></div>
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-purple-500 shadow-[0_0_50px_#a855f7,0_0_100px_#a855f7]"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 bg-white/40 blur-sm"></div>
        </>
    );

    if (gameState === 'video') {
        return (
            <div className="absolute inset-0 z-[200] bg-black flex items-center justify-center">
                <video 
                    src={getVideoSrc()} 
                    autoPlay 
                    className="w-full h-full object-cover"
                    onEnded={onComplete}
                />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-50 overflow-hidden bg-black flex flex-col items-center justify-center select-none"
             style={{ 
                 perspective: '600px', 
                 fontFamily: '"Archivo Black", sans-serif'
             }}>
            
            <style>{`
                @keyframes roadScroll {
                    from { background-position: 0 0; }
                    to { background-position: 0 200px; }
                }
                @keyframes finalTitleZoom {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.2); opacity: 1; }
                    80% { transform: scale(1.0); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>

            <div className="absolute inset-0 z-0">
                <video 
                    src={getBgVideoSrc()} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover opacity-50" 
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center" 
                 style={{ 
                     transformStyle: 'preserve-3d',
                     transform: `translate(${Math.random() * shake - shake/2}px, ${Math.random() * shake - shake/2}px)`
                 }}>
                <div 
                    className="absolute bottom-[-200px] w-[800px] h-[3000px] bg-black"
                    style={{ 
                        transform: 'rotateX(80deg) translateZ(-400px)',
                        boxShadow: '0 0 50px rgba(0,255,255,0.2)'
                    }}
                >
                    <RoadContent />
                </div>

                <div 
                    className="absolute top-[-200px] w-[800px] h-[3000px] bg-black"
                    style={{ 
                        transform: 'rotateX(-80deg) translateZ(-400px)',
                        boxShadow: '0 0 50px rgba(0,255,255,0.2)'
                    }}
                >
                    <RoadContent />
                </div>

                {notes.map(note => {
                    let xPos = 0;
                    if (note.lane === 'left') xPos = -350;
                    else if (note.lane === 'right') xPos = 350;
                    
                    return <CubeNote key={note.id} note={note} x={xPos} z={note.z} />;
                })}

                <div className="absolute w-[900px] h-[30px] bg-white/20 blur-md border-t-4 border-white/50"
                     style={{ transform: `translate3d(0, 100px, ${HIT_Z}px)` }}>
                </div>
            </div>

            {showTitle && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    <h1 className="text-[100px] md:text-[150px] font-black text-white not-italic tracking-tighter"
                        style={{ animation: 'finalTitleZoom 2s ease-in-out forwards' }}>
                        FINAL BLOW!
                    </h1>
                </div>
            )}

            <div className="absolute top-8 w-full flex flex-col items-center z-50">
                <h2 className="text-6xl font-black text-white not-italic mb-4 animate-pulse tracking-tight uppercase">
                    {getBossTitle()}
                </h2>
                <div className="flex gap-1 justify-center">
                    {Array.from({ length: totalNotesRef.current }).map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-2 h-8 border border-white/20 skew-x-[-12deg] transition-all duration-100 ${
                                i < hitCount
                                ? 'bg-gradient-to-t from-cyan-600 to-white shadow-[0_0_10px_#06b6d4]' 
                                : 'bg-gray-900 opacity-20'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {gameState === 'success' && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center animate-zoom-fast">
                        <span className="text-[250px] leading-none font-black text-white not-italic tracking-tight">
                            PERFECT!
                        </span>
                    </div>
                </div>
            )}

            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-none">
                {combo > 1 && gameState === 'playing' && !showTitle && (
                    <div className="flex flex-col items-center animate-bounce-fast opacity-80">
                        <span className="text-4xl text-white font-black italic">
                            COMBO!
                        </span>
                        <span className="text-[160px] font-black text-white not-italic leading-none">
                            {combo}
                        </span>
                    </div>
                )}
            </div>
            
            <div className="absolute bottom-10 text-white font-mono text-xl animate-pulse">
                [ FROZEN RHYTHM: PHASE {phase} ]
            </div>
        </div>
    );
};
