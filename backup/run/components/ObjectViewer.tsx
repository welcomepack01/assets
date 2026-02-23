import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CurrentTheme } from '../theme/gameTheme';
import { SceneBuilder } from '../utils/SceneBuilder';
import { ASSETS } from '../config/gameAssets';

interface ObjectViewerProps {
    onClose: () => void;
    modelsRef?: React.MutableRefObject<Record<string, THREE.Group>>;
}

const TABS = [
    { id: 'jump', label: 'Jump Obstacle' },
    { id: 'big_jump', label: 'Big Jump' },
    { id: 'crouch', label: 'Crouch' },
    { id: 'dodge_a', label: 'Dodge A' },
    { id: 'dodge_b', label: 'Dodge B' },
    { id: 'punch_weak', label: 'Punch Weak' },
    { id: 'punch_strong', label: 'Punch Strong' },
    { id: 'flying', label: 'Flying' },
    { id: 'boss1', label: 'Boss 1' },
    { id: 'boss2', label: 'Boss 2' },
    { id: 'boss3', label: 'Boss 3' },
    { id: 'boss4', label: 'Boss 4' },
];

export const ObjectViewer: React.FC<ObjectViewerProps> = ({ onClose, modelsRef }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState('jump');
    const sceneRef = useRef<THREE.Scene | null>(null);
    const objectRef = useRef<THREE.Group | null>(null);
    const [sceneReady, setSceneReady] = useState(false);

    // --- 1. INITIALIZE SCENE ---
    useEffect(() => {
        if (!mountRef.current) return;

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x333333);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 4, 10);
        
        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 1, 0);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 10, 5);
        scene.add(dirLight);

        // Animation Loop
        let animationId: number;
        const clock = new THREE.Clock();

        const animate = (time: number) => {
            animationId = requestAnimationFrame(animate);
            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();

            controls.update();

            if (objectRef.current) {
                // Reset to origin before animating to prevent accumulation
                objectRef.current.position.set(0, 0, 0);
                if (objectRef.current.userData.tabId?.startsWith('boss')) {
                    objectRef.current.scale.setScalar(0.5);
                } else {
                    objectRef.current.scale.setScalar(1);
                }
                objectRef.current.rotation.set(0, 0, 0);

                // Mock Obstacle Data for Animator
                const mockObs: any = {
                    id: 12345,
                    mesh: objectRef.current,
                    data: { type: 'jump', action: 'jump' } // Default
                };

                // Determine type based on active tab
                const tabId = TABS.find(t => t.id === objectRef.current?.userData.tabId)?.id || 'jump';
                
                if (tabId.startsWith('boss')) {
                    mockObs.data.type = 'boss';
                    mockObs.data.action = 'final_boss';
                    // Use phase 4 for boss animation test
                    CurrentTheme.animators.animateBoss(mockObs, elapsedTime, delta, 4);
                } else {
                    // Map tab to type
                    if (tabId === 'crouch') mockObs.data.type = 'duck';
                    else if (tabId === 'big_jump') mockObs.data.type = 'big_jump';
                    else if (tabId.startsWith('dodge')) mockObs.data.type = 'bees';
                    else if (tabId.startsWith('punch')) mockObs.data.type = 'monster_weak';
                    else if (tabId === 'flying') mockObs.data.type = 'drone';

                    CurrentTheme.animators.animateObstacle(mockObs, elapsedTime, delta);
                }
            }

            renderer.render(scene, camera);
        };
        animate(0);
        setSceneReady(true);

        // Resize Handler
        const handleResize = () => {
             if (!mountRef.current) return;
             const w = mountRef.current.clientWidth;
             const h = mountRef.current.clientHeight;
             if (w === 0 || h === 0) return;
             camera.aspect = w / h;
             camera.updateProjectionMatrix();
             renderer.setSize(w, h);
        };
        
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });
        resizeObserver.observe(mountRef.current);

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    // --- 2. UPDATE OBJECT ON TAB CHANGE ---
    useEffect(() => {
        if (!sceneRef.current || !sceneReady) return;

        // Clear previous object
        if (objectRef.current) {
            sceneRef.current.remove(objectRef.current);
            objectRef.current = null;
        }

        const textures: any = CurrentTheme.builders.generateTextures();
        const models = modelsRef?.current || {};

        // Helper to create video texture
        const createVideoTex = (src: string) => {
             const video = document.createElement('video');
             video.src = src;
             video.crossOrigin = "anonymous";
             video.loop = true;
             video.muted = true;
             video.playsInline = true;
             video.play().catch(e => console.warn("Video play failed", e));
             const tex = new THREE.VideoTexture(video);
             tex.colorSpace = THREE.SRGBColorSpace;
             return tex;
        };

        // Load Boss Videos if needed
        if (activeTab === 'boss1') textures.boss1_video = createVideoTex(ASSETS.THEME.BOSS1_MOV);
        if (activeTab === 'boss2') textures.boss2_video = createVideoTex(ASSETS.THEME.BOSS2_MOV);
        if (activeTab === 'boss3') textures.boss3_video = createVideoTex(ASSETS.THEME.BOSS3_MOV);
        if (activeTab === 'boss4') textures.boss4_video = createVideoTex(ASSETS.THEME.BOSS4_VIDEO);

        let newObject: THREE.Group | null = null;

        try {
            switch (activeTab) {
                case 'jump':
                    newObject = SceneBuilder.createJumpObstacle(0, textures, models, 0, 'A').mesh;
                    break;
                case 'big_jump':
                    newObject = SceneBuilder.createBigJumpObstacle(0, textures, models, 0, 'A').mesh;
                    break;
                case 'crouch':
                    newObject = SceneBuilder.createCrouchObstacle(0, textures, false, false, models, 0, 'A').mesh;
                    break;
                case 'dodge_a':
                    newObject = SceneBuilder.createCat(0, textures, models).mesh;
                    break;
                case 'dodge_b':
                    newObject = SceneBuilder.createOctopus(0, textures, models).mesh;
                    break;
                case 'punch_weak':
                    newObject = SceneBuilder.createRedMonster(0, textures, models).mesh;
                    break;
                case 'punch_strong':
                    newObject = SceneBuilder.createBlueMonster(0, textures, models).mesh;
                    break;
                case 'flying':
                    newObject = SceneBuilder.createIronEagle(0, models).mesh;
                    break;
                case 'boss1':
                    newObject = SceneBuilder.createBoss(0, textures, 100, 'mech', models).mesh;
                    break;
                case 'boss2':
                    newObject = SceneBuilder.createBoss(0, textures, 100, 'beast', models).mesh;
                    break;
                case 'boss3':
                    newObject = SceneBuilder.createBoss(0, textures, 100, 'mutant', models).mesh;
                    break;
                case 'boss4':
                    newObject = SceneBuilder.createBoss(0, textures, 100, 'demon', models).mesh;
                    break;
                default:
                    newObject = SceneBuilder.createJumpObstacle(0, textures, models, 0, 'A').mesh;
            }
        } catch (e) {
            console.error("Error building object:", e);
        }

        if (newObject) {
            newObject.position.set(0, 0, 0);
            newObject.userData.tabId = activeTab;
            sceneRef.current.add(newObject);
            objectRef.current = newObject;
        }

    }, [activeTab, sceneReady, modelsRef]);

    return (
        <div className="absolute inset-0 z-[200] bg-zinc-900 flex flex-col text-white font-sans">
            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-900">
                <h2 className="text-xl font-bold tracking-wider">OBJECT VIEWER</h2>
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-sm uppercase"
                >
                    Close [A]
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r border-white/10 overflow-y-auto bg-zinc-900/50">
                    <div className="p-4 space-y-2">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-4 py-3 rounded font-medium transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3D Viewport */}
                <div className="flex-1 relative overflow-hidden bg-white cursor-move">
                    <div ref={mountRef} className="w-full h-full" />
                    
                    {/* Instructions Overlay */}
                    <div className="absolute bottom-6 left-6 pointer-events-none opacity-50 text-black text-xs">
                        <p>Left Click: Rotate</p>
                        <p>Right Click: Pan</p>
                        <p>Scroll: Zoom</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
