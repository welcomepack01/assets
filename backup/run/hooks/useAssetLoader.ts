
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { 
    DEFAULT_ASSETS, 
    GUIDE_IMAGES_KEY as KEY_IMAGES, 
    GUIDE_VIDEOS_KEY as KEY_VIDEOS, 
    GUIDE_AUDIO_KEY as KEY_AUDIO, 
    ASSET_VERSION_KEY 
} from '../gameConstants';
import { ASSET_VERSION, ASSETS } from '../config/gameAssets';
import { SoundManager } from '../utils/gameUtils';
import { CurrentTheme } from '../theme/gameTheme';

export const useAssetLoader = () => {
    const [guideImages, setGuideImages] = useState<Record<string, string[]>>(DEFAULT_ASSETS.images);
    const [guideVideos, setGuideVideos] = useState<Record<string, string[]>>(DEFAULT_ASSETS.videos);
    const [guideAudio, setGuideAudio] = useState<Record<string, string>>(DEFAULT_ASSETS.audio);

    const guideImagesRef = useRef(guideImages);
    const guideVideosRef = useRef(guideVideos);

    const texturesRef = useRef<Record<string, THREE.Texture>>({});
    const adTexturesRef = useRef<THREE.Texture[]>([]);
    const wallTexturesRef = useRef<THREE.Texture[]>([]);
    const passThroughWallTexturesRef = useRef<THREE.Texture[]>([]);
    
    // Model Cache
    const modelsRef = useRef<Record<string, THREE.Group>>({});

    useEffect(() => {
        const savedVersion = localStorage.getItem(ASSET_VERSION_KEY);
        
        if (savedVersion !== ASSET_VERSION) {
            console.log(`[AssetLoader] New version ${ASSET_VERSION} detected. Resetting assets.`);
            localStorage.removeItem(KEY_IMAGES);
            localStorage.removeItem(KEY_VIDEOS);
            localStorage.removeItem(KEY_AUDIO);
            localStorage.setItem(ASSET_VERSION_KEY, ASSET_VERSION);
            setGuideImages(DEFAULT_ASSETS.images);
            setGuideVideos(DEFAULT_ASSETS.videos);
            setGuideAudio(DEFAULT_ASSETS.audio);
        } else {
            try {
                const load = (key: string, setter: any) => {
                    const item = localStorage.getItem(key);
                    if (item) {
                        const parsed = JSON.parse(item);
                        const normalized: any = {};
                        Object.keys(parsed).forEach(k => {
                            if (Array.isArray(parsed[k])) normalized[k] = parsed[k];
                            else if (typeof parsed[k] === 'string') normalized[k] = key === KEY_AUDIO ? parsed[k] : [parsed[k]];
                        });
                        setter((prev: any) => ({ ...prev, ...normalized }));
                    }
                };
                load(KEY_IMAGES, setGuideImages);
                load(KEY_VIDEOS, setGuideVideos);
                load(KEY_AUDIO, setGuideAudio);
            } catch (e) {
                console.error("[AssetLoader] Failed to load custom assets", e);
            }
        }
    }, []);

    useEffect(() => { guideImagesRef.current = guideImages; }, [guideImages]);
    useEffect(() => { guideVideosRef.current = guideVideos; }, [guideVideos]);
    
    useEffect(() => {
        SoundManager.init();
        Object.keys(guideAudio).forEach(key => {
            const src = guideAudio[key];
            SoundManager.loadCustomSound(key, src);
            if (key.startsWith('sfx_') || key.startsWith('warning') || key === 'dingdong' || key === 'victory' || 
                ['jump', 'big_jump', 'crouch', 'left', 'right', 'punch', 'double_punch', 'sprint', 'final_blow', 'mirror_me', 'jump_attack'].includes(key)) {
                SoundManager.preloadSound(key, src);
            }
        });
    }, [guideAudio]);

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');

        const createVideoTexture = (src: string) => {
            const video = document.createElement('video');
            video.src = src;
            video.crossOrigin = "anonymous";
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.play().catch(e => console.warn("Video texture autoplay failed", e));
            const tex = new THREE.VideoTexture(video);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            return tex;
        };

        const adUrls = guideImages['ads'] || [];
        const loadedAds: THREE.Texture[] = [];
        adUrls.forEach(url => {
            loader.load(url, (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                loadedAds.push(tex);
            });
        });
        adTexturesRef.current = loadedAds;

        const wallUrls = guideImages['wall'] || [];
        const loadedWalls: THREE.Texture[] = [];
        wallUrls.forEach(url => {
            if (url.toLowerCase().includes('.mp4') || url.startsWith('data:video')) {
                loadedWalls.push(createVideoTexture(url));
            } else {
                loader.load(url, (tex) => {
                    tex.colorSpace = THREE.SRGBColorSpace;
                    loadedWalls.push(tex);
                });
            }
        });
        wallTexturesRef.current = loadedWalls;

        const ptLoaded: THREE.Texture[] = [];
        const ptIndices = new Set<number>();
        while(ptIndices.size < 30) {
            ptIndices.add(Math.floor(Math.random() * 51) + 1);
        }
        
        ptIndices.forEach(idx => {
            const url = ASSETS.getActionWallImage(idx);
            if (url.toLowerCase().includes('.mp4') || url.startsWith('data:video')) {
                 ptLoaded.push(createVideoTexture(url));
            } else {
                loader.load(url, (tex) => {
                    tex.colorSpace = THREE.SRGBColorSpace;
                    tex.minFilter = THREE.LinearFilter;
                    tex.magFilter = THREE.LinearFilter;
                    ptLoaded.push(tex);
                });
            }
        });
        passThroughWallTexturesRef.current = ptLoaded;

        const textures: Record<string, THREE.Texture> = {};
        const themeTextures = CurrentTheme.builders.generateTextures();
        Object.assign(textures, themeTextures);

        const mirrorTex = createVideoTexture(ASSETS.THEME.MIRROR_VIDEO_1);
        textures.mirrorVideo = mirrorTex;
        textures.mirrorVideo1 = mirrorTex;
        textures.mirrorVideo2 = mirrorTex;

        // --- NEW: Load Mini Game Videos as Textures for Level Mirrors ---
        textures.mini1 = createVideoTexture(ASSETS.MINIGAME.MINI_1);
        textures.mini2 = createVideoTexture(ASSETS.MINIGAME.MINI_2);
        textures.mini3 = createVideoTexture(ASSETS.MINIGAME.MINI_3);
        textures.mini4 = createVideoTexture(ASSETS.MINIGAME.MINI_4);

        // --- LOAD BOSS MOVIES ---
        textures.boss1_video = createVideoTexture(ASSETS.THEME.BOSS1_MOV);
        textures.boss2_video = createVideoTexture(ASSETS.THEME.BOSS2_MOV);
        textures.boss3_video = createVideoTexture(ASSETS.THEME.BOSS3_MOV);
        textures.boss4_video = createVideoTexture(ASSETS.THEME.BOSS4_VIDEO);

        texturesRef.current = textures;

    }, [guideImages]); 

    // MODEL LOADING (GLB)
    useEffect(() => {
        try {
            const gltfLoader = new GLTFLoader();
            console.log("[AssetLoader] Initializing GLTFLoader...");

            const loadModel = (key: string, url: string) => {
                console.log(`[AssetLoader] Requesting: ${key} -> ${url}`);
                gltfLoader.load(url, (gltf) => {
                    // Optimize model
                    gltf.scene.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            if (child.material instanceof THREE.MeshStandardMaterial) {
                                child.material.needsUpdate = true;
                            }
                        }
                    });
                    
                    // Attach animations to the scene userData so we can use them later
                    gltf.scene.userData.animations = gltf.animations;
                    
                    modelsRef.current[key] = gltf.scene;
                    console.log(`[AssetLoader] Success: ${key}`);
                }, 
                (xhr) => { /* Progress */ }, 
                (err) => {
                    console.error(`[AssetLoader] Error loading ${key}:`, err);
                });
            };

            if (ASSETS.MODELS) {
                Object.entries(ASSETS.MODELS).forEach(([key, url]) => {
                    loadModel(key, url);
                });
            }
        } catch (error) {
            console.error("[AssetLoader] GLTFLoader Crash:", error);
        }
    }, []);

    return {
        guideImages, setGuideImages,
        guideVideos, setGuideVideos,
        guideAudio, setGuideAudio,
        guideImagesRef,
        guideVideosRef,
        texturesRef,
        modelsRef,
        adTexturesRef,
        wallTexturesRef,
        passThroughWallTexturesRef
    };
};
