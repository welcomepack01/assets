
import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { SceneBuilder } from '../utils/SceneBuilder';
import { CurrentTheme } from '../theme/gameTheme';
import { VideoManager } from '../utils/gameUtils';

export const useThreeSetup = (
    containerRef: React.RefObject<HTMLDivElement>,
    guideImagesRef: React.MutableRefObject<Record<string, string[]>>,
    guideVideosRef: React.MutableRefObject<Record<string, string[]>>
) => {
    // Three.js Core Objects
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    
    // Game Specific Graphics Objects
    const playerMeshRef = useRef<THREE.Group | THREE.Mesh | null>(null);
    const skiMeshesRef = useRef<(THREE.Group | THREE.Mesh)[]>([]);
    const transitionMeshRef = useRef<THREE.Mesh | null>(null);
    
    // Background State
    const currentVideoElementRef = useRef<HTMLVideoElement | null>(null);
    const bgCycleIndicesRef = useRef<Record<string, number>>({ 
        'bg_tutorial': 0, 'bg_day': 0, 'bg_evening': 0, 'bg_night': 0, 'bg_dawn': 0 
    });

    // Background Switching Logic
    const setSceneBackground = useCallback((phaseIndex: string, defaultColor: number = 0x000000) => {
        const scene = sceneRef.current;
        if (!scene) return;

        const videos = guideVideosRef.current[phaseIndex] || [];
        
        // 1. Try Video Background
        if (videos.length > 0 && videos[0]) {
            const idx = Math.floor(Math.random() * videos.length);
            const rawUrl = videos[idx];
            
            // Check if we have a preloaded Blob URL for this asset
            // If preloaded, this returns the blob:http://... URL (instant load)
            // If not, it returns the rawUrl (network load)
            const videoUrl = VideoManager.get(rawUrl, rawUrl);

            // If the same video URL (blob or raw) is already playing, just resume
            if (currentVideoElementRef.current && currentVideoElementRef.current.src === videoUrl) {
                if (currentVideoElementRef.current.paused) {
                     currentVideoElementRef.current.play().catch(e => console.warn("Resume play failed", e));
                }
                return;
            }

            const video = document.createElement('video');
            video.src = videoUrl;
            video.crossOrigin = "anonymous";
            video.loop = true;
            video.muted = true;
            video.playsInline = true;

            // Since we might be using a Blob, it loads extremely fast.
            // onloadeddata is still safer than assuming sync readiness.
            video.onloadeddata = () => {
                if (!sceneRef.current) return;
                
                // Cleanup old video
                if (currentVideoElementRef.current && currentVideoElementRef.current !== video) {
                    currentVideoElementRef.current.pause();
                    currentVideoElementRef.current.src = "";
                    currentVideoElementRef.current = null;
                }
                
                const texture = new THREE.VideoTexture(video);
                texture.colorSpace = THREE.SRGBColorSpace;
                // Optimization: Filter settings for background
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                
                sceneRef.current.background = texture;
                currentVideoElementRef.current = video;
            };

            video.play().catch(e => {
                console.warn("Video BG play error, using color fallback", e);
            });
            return; 
        }

        // 2. Cleanup Video if switching to Image/Color
        if (currentVideoElementRef.current) {
            currentVideoElementRef.current.pause();
            currentVideoElementRef.current.src = "";
            currentVideoElementRef.current = null;
        }

        // 3. Try Image Background
        const images = guideImagesRef.current[phaseIndex] || [];
        if (images.length > 0) {
            let idx = bgCycleIndicesRef.current[phaseIndex] || 0;
            const imgUrl = images[idx % images.length];
            bgCycleIndicesRef.current[phaseIndex] = idx + 1;
            
            const loader = new THREE.TextureLoader();
            loader.setCrossOrigin('anonymous');
            
            loader.load(imgUrl, (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                if(sceneRef.current) sceneRef.current.background = tex;
            }, undefined, () => {
                 if(sceneRef.current) sceneRef.current.background = new THREE.Color(defaultColor);
            });
        } else {
            // 4. Fallback Color
            scene.background = new THREE.Color(defaultColor);
        }
    }, [guideVideosRef, guideImagesRef]);

    // Initialization Effect
    useEffect(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // 1. Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const bgColor = CurrentTheme.colors.sky;
        scene.background = new THREE.Color(bgColor);

        // 2. Camera
        const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 300);
        camera.position.set(0, 1.8, 0);
        cameraRef.current = camera;

        // 3. Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true; 
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
        rendererRef.current = renderer;

        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(renderer.domElement);

        // 4. Lights - EXTREME BRIGHTNESS MODE
        const ambientLight = new THREE.AmbientLight(CurrentTheme.colors.ambientLight, 3.5); 
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(CurrentTheme.colors.dirLight, 2.0); 
        dirLight.name = 'dirLight';
        dirLight.position.set(20, 40, 20); 
        dirLight.castShadow = true; 
        
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        const d = 50;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 150;
        dirLight.shadow.bias = -0.0005;
        scene.add(dirLight);

        // 5. Transition Overlay (Fade effect)
        const transGeo = new THREE.PlaneGeometry(20, 20); 
        const transMat = new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            transparent: true, 
            opacity: 0, 
            depthTest: false, 
            depthWrite: false, 
            side: THREE.DoubleSide
        });
        const transMesh = new THREE.Mesh(transGeo, transMat);
        transMesh.position.set(0, 0, -1.0); 
        transMesh.renderOrder = 9999;
        camera.add(transMesh);
        transitionMeshRef.current = transMesh;

        // 6. Player & Camera Attachments
        const playerMesh = SceneBuilder.createPlayerMesh();
        scene.add(playerMesh);
        playerMeshRef.current = playerMesh;

        const { left: leftSki, right: rightSki } = SceneBuilder.createSkis();
        camera.add(leftSki);
        camera.add(rightSki);
        skiMeshesRef.current = [leftSki, rightSki];

        scene.add(camera);

        // 7. Initial Background
        setSceneBackground('bg_tutorial', bgColor);

        // 8. Resize Handler
        const handleResize = () => {
            if (!containerRef.current || !camera || !renderer) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentVideoElementRef.current) {
                currentVideoElementRef.current.pause();
                currentVideoElementRef.current.src = "";
            }
            renderer.dispose();
        };
    }, [containerRef, setSceneBackground]);

    return {
        sceneRef,
        cameraRef,
        rendererRef,
        playerMeshRef,
        skiMeshesRef,
        transitionMeshRef,
        bgCycleIndicesRef,
        currentVideoElementRef,
        setSceneBackground
    };
};
