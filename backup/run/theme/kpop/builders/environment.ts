
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { LevelConfig, TextureMap } from '../../../gameTypes';
import { COLORS } from '../constants';
import { createDetailedTexture } from '../../../utils/gameUtils';

export const createPlayerMesh = () => new THREE.Group();
export const createSkis = () => ({ left: new THREE.Group(), right: new THREE.Group() });

export const createWallBlockade = (width: number, height: number, texture?: THREE.Texture) => {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 1), 
        new THREE.MeshStandardMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x88CCFF, 
            roughness: 0.2,
            metalness: 0.1,
            // CHANGED: Transparency removed as requested
            transparent: false,
            opacity: 1.0
        })
    );
    mesh.castShadow = true; mesh.receiveShadow = true; 
    mesh.position.y = height / 2; 
    group.add(mesh);
    return group;
};

export const createMirrorWall = (width: number, height: number, texture?: THREE.Texture) => {
    const group = new THREE.Group();
    const frame = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.5, height + 0.5, 0.5), 
        new THREE.MeshStandardMaterial({ color: 0xADD8E6, roughness: 0.1 }) 
    );
    frame.position.y = height / 2; frame.castShadow = true; frame.receiveShadow = true; 
    group.add(frame);
    
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height), 
        new THREE.MeshBasicMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x000000,
            // CHANGED: Removed transparency to make video sharp and clear
            transparent: false,
            opacity: 1.0
        })
    );
    plane.position.set(0, height / 2, 0.26); 
    group.add(plane);
    return group;
};

export const createPassThroughWall = (width: number, height: number, texture: THREE.Texture, videoTexture?: THREE.Texture) => {
    const group = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, opacity: 1.0 });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.y = height / 2;
    group.add(wall);
    if (videoTexture) {
        const overlayMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, opacity: 0.5 });
        const overlay = new THREE.Mesh(geometry, overlayMaterial);
        overlay.position.y = height / 2; overlay.position.z = 0.05;
        group.add(overlay);
    }
    return group;
};

export const decorateChunk = (group: THREE.Group, levelConfig: LevelConfig, roadWidth: number, chunkDepth: number, textures: TextureMap) => {
    const edgeX = roadWidth / 2;
    const type = levelConfig.fence.type;
    
    // Base Foundation
    const foundationGeo = new THREE.BoxGeometry(roadWidth + 10, 6, chunkDepth);
    const foundationMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const foundation = new THREE.Mesh(foundationGeo, foundationMat);
    foundation.position.set(0, -3.05, 0);
    group.add(foundation);

    // --- TUTORIAL: ARENDELLE SQUARE (Flags & Snow Piles) ---
    if (type === 'arendelle_fence') {
        const bankW = 2.0;
        createBox(bankW, 0.5, chunkDepth, 0xEEEEEE, -edgeX - bankW/2, 0.25, 0, group);
        createBox(bankW, 0.5, chunkDepth, 0xEEEEEE, edgeX + bankW/2, 0.25, 0, group);

        // Snow Piles
        const createSnowPile = (x: number, z: number) => {
            const s = new THREE.Group();
            s.position.set(x, 0.5, z);
            const pileMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 1.0 });
            const m1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6, 0), pileMat); m1.scale.set(1.5, 0.6, 1.2); s.add(m1);
            const m2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), pileMat); m2.position.set(0.5, 0.2, 0.3); s.add(m2);
            s.rotation.y = Math.random() * Math.PI; group.add(s);
        };

        // ARENDELLE FLAGS
        const flagColors = [0x3A2250, 0x006633, 0x003366, 0x800080]; // Purple, Green, Blue, Magenta
        const gold = 0xFFD700;
        
        const createArendelleFlag = (x: number, z: number) => {
            const flagGroup = new THREE.Group();
            flagGroup.position.set(x, 0, z);
            
            // Pole (Silver)
            const poleH = 4.0;
            createBox(0.1, poleH, 0.1, 0xAAAAAA, 0, poleH/2, 0, flagGroup);
            // Top Ornament (Gold Sphere)
            const orb = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2, 0), new THREE.MeshStandardMaterial({ color: gold }));
            orb.position.set(0, poleH, 0);
            flagGroup.add(orb);
            
            // Crossbar
            const armLen = 1.2;
            const armDir = x > 0 ? -1 : 1; // Point inward
            createBox(armLen, 0.1, 0.1, 0xAAAAAA, armDir * (armLen/2 - 0.05), poleH - 0.2, 0, flagGroup);
            
            // Banner Cloth
            const bannerW = 0.8;
            const bannerH = 1.8;
            const color = flagColors[Math.floor(Math.random() * flagColors.length)];
            
            const bannerGroup = new THREE.Group();
            // Position relative to arm
            bannerGroup.position.set(armDir * 0.6, poleH - 0.3 - bannerH/2, 0);
            
            // Main Cloth
            createBox(bannerW, bannerH, 0.05, color, 0, 0, 0, bannerGroup);
            
            // Gold Trim (Bottom Triangle)
            createBox(bannerW, 0.1, 0.06, gold, 0, -bannerH/2 + 0.05, 0, bannerGroup);
            
            // Crocus Symbol (Simplified Gold Diamond)
            const symbol = createBox(0.4, 0.4, 0.06, gold, 0, 0.2, 0, bannerGroup);
            symbol.rotation.z = Math.PI / 4;
            
            flagGroup.add(bannerGroup);
            group.add(flagGroup);
        };

        const flagX = edgeX + 1.5; 

        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=5.0) {
            createArendelleFlag(-flagX, z);
            createArendelleFlag(flagX, z);
            
            if (Math.random() > 0.7) createSnowPile(-flagX - 1.0, z + 2.5);
            if (Math.random() > 0.7) createSnowPile(flagX + 1.0, z + 2.5);
        }
    }

    // --- LEVEL 1: SNOWY FOREST (Snow Piles) ---
    else if (type === 'snow_trees') {
        const bankW = 4.0;
        createBox(bankW, 0.8, chunkDepth, 0xFFFFFF, -edgeX - bankW/2, 0.4, 0, group);
        createBox(bankW, 0.8, chunkDepth, 0xFFFFFF, edgeX + bankW/2, 0.4, 0, group);
        
        // ADDED: Random Snow Piles / Snow Fences
        const snowMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 });
        
        for(let z = -chunkDepth/2; z < chunkDepth/2; z += 3.0) {
            // Left Side Snow Piles
            if(Math.random() > 0.3) {
                const s = 0.5 + Math.random() * 1.5;
                const xOff = -edgeX - 1.0 - Math.random() * 2.0;
                const pile = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), snowMat);
                pile.scale.set(1.5, 0.6, 1.2);
                pile.position.set(xOff, s * 0.3, z + Math.random());
                pile.rotation.y = Math.random() * Math.PI;
                group.add(pile);
            }
            // Right Side Snow Piles
            if(Math.random() > 0.3) {
                const s = 0.5 + Math.random() * 1.5;
                const xOff = edgeX + 1.0 + Math.random() * 2.0;
                const pile = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), snowMat);
                pile.scale.set(1.5, 0.6, 1.2);
                pile.position.set(xOff, s * 0.3, z + Math.random());
                pile.rotation.y = Math.random() * Math.PI;
                group.add(pile);
            }
        }
    }

    // --- LEVEL 2: NORTH MOUNTAIN (White Ice Fence) ---
    else if (type === 'ice_spires') {
        const bankW = 2.0;
        
        // CHANGED: White Material
        const iceMat = new THREE.MeshStandardMaterial({ 
            color: 0xFFFFFF, // Pure White
            transparent: true, 
            opacity: 0.85, 
            roughness: 0.1,
            metalness: 0.2,
            emissive: 0xEEEEFF,
            emissiveIntensity: 0.2
        });

        // Snow Bank base
        createBox(bankW, 0.5, chunkDepth, 0xFFFFFF, -edgeX - bankW/2, 0.25, 0, group);
        createBox(bankW, 0.5, chunkDepth, 0xFFFFFF, edgeX + bankW/2, 0.25, 0, group);

        const fenceX = edgeX + 0.8;
        const pillarSpacing = 4.0;
        
        // ADJUSTED: Reduced height by 50% (1.6 -> 0.8)
        const railHeight = 0.8;

        for (let z = -chunkDepth/2; z < chunkDepth/2; z += pillarSpacing) {
            // 1. MAIN PILLARS
            const createPillar = (x: number) => {
                const pGroup = new THREE.Group();
                pGroup.position.set(x, 0.5, z);
                
                const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), iceMat);
                base.position.y = 0.15; pGroup.add(base);
                
                const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.6, railHeight, 0.6), iceMat);
                shaft.position.y = 0.3 + railHeight/2; pGroup.add(shaft);
                
                const cap = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.2, 0.9), iceMat);
                cap.position.y = 0.3 + railHeight + 0.1; pGroup.add(cap);
                
                const finial = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35, 1), iceMat);
                finial.position.y = 0.3 + railHeight + 0.5; pGroup.add(finial);
                
                group.add(pGroup);
            };
            
            createPillar(-fenceX);
            createPillar(fenceX);

            // 2. BALUSTRADE
            if (z + pillarSpacing < chunkDepth/2 + 0.1) {
                const railLen = pillarSpacing - 0.6;
                const midZ = z + pillarSpacing/2;
                
                const createRailSection = (x: number) => {
                    const rGroup = new THREE.Group();
                    rGroup.position.set(x, 0.5, midZ);
                    
                    const bRail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, railLen), iceMat);
                    bRail.position.y = 0.2; rGroup.add(bRail);
                    
                    const tRail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, railLen), iceMat);
                    tRail.position.y = 0.3 + railHeight; rGroup.add(tRail);
                    
                    const bCount = 4;
                    const bSpace = railLen / (bCount + 1);
                    const balusterGeo = new THREE.OctahedronGeometry(0.15, 0); 
                    
                    for(let i=1; i<=bCount; i++) {
                        const bz = -railLen/2 + i*bSpace;
                        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.15, railHeight, 0.15), iceMat);
                        bar.position.set(0, 0.3 + railHeight/2, bz);
                        rGroup.add(bar);
                        
                        const decor = new THREE.Mesh(balusterGeo, iceMat);
                        decor.position.set(0, 0.3 + railHeight/2, bz);
                        // decor.scale.y = 1.5; // Removed scaling to keep it proportional
                        rGroup.add(decor);
                    }
                    group.add(rGroup);
                };
                createRailSection(-fenceX);
                createRailSection(fenceX);
            }
        }
    }

    // --- LEVEL 3: CASTLE HALLS (WARM GREY UPDATE) ---
    else if (type === 'castle_columns') {
        const bufferW = 3.0;
        createBox(bufferW, 0.2, chunkDepth, 0x110022, -edgeX - bufferW/2, 0.1, 0, group);
        createBox(bufferW, 0.2, chunkDepth, 0x110022, edgeX + bufferW/2, 0.1, 0, group);

        const decorX = edgeX + 1.2;
        const createNeonCandelabra = (x: number, z: number) => {
            const lamp = new THREE.Group();
            lamp.position.set(x, 0, z);
            
            // CHANGED: Warm Grey (Silver/Taupe) instead of Neon Green
            const standColor = 0xADA098; // Warm Grey
            
            createBox(1.0, 0.2, 1.0, standColor, 0, 0.1, 0, lamp);
            createBox(0.8, 0.2, 0.8, standColor, 0, 0.3, 0, lamp);
            createBox(0.2, 3.0, 0.2, standColor, 0, 1.6, 0, lamp);
            
            const armW = 1.8;
            createBox(armW, 0.1, 0.1, standColor, 0, 2.8, 0, lamp);
            createBox(0.1, 0.1, armW, standColor, 0, 2.8, 0, lamp);
            
            const candlePositions = [[armW/2 - 0.1, 0], [-armW/2 + 0.1, 0], [0, armW/2 - 0.1], [0, -armW/2 + 0.1], [0, 0]];
            // UPDATED: Deeper Orange-Yellow
            const flameColor = 0xFF8800; 
            
            candlePositions.forEach(([cx, cz], i) => {
                const isCenter = i === 4;
                const h = isCenter ? 0.6 : 0.4;
                const yBase = isCenter ? 3.1 : 2.85;
                createBox(0.2, 0.1, 0.2, standColor, cx, yBase, cz, lamp);
                createBox(0.1, h, 0.1, 0xFFFFFF, cx, yBase + h/2 + 0.05, cz, lamp);
                
                const flame = createBox(0.08, 0.15, 0.08, flameColor, cx, yBase + h + 0.1, cz, lamp);
                (flame.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(flameColor);
                (flame.material as THREE.MeshStandardMaterial).emissiveIntensity = 3.0; 
            });
            group.add(lamp);
        };
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=8) {
            createNeonCandelabra(-decorX, z);
            createNeonCandelabra(decorX, z);
        }
    }

    // --- LEVEL 4: FROZEN FJORD (SPIKE ICE UPDATE) ---
    else if (type === 'ice_debris') {
        const bufferW = 5.0;
        // CHANGED: White buffer
        createBox(bufferW, 0.5, chunkDepth, 0xFFFFFF, -edgeX - bufferW/2, -0.2, 0, group);
        createBox(bufferW, 0.5, chunkDepth, 0xFFFFFF, edgeX + bufferW/2, -0.2, 0, group);
        
        const brightIce = 0xE0FFFF; // Very bright cyan/white
        const spikeMat = new THREE.MeshStandardMaterial({
            color: brightIce,
            transparent: true,
            opacity: 0.9,
            roughness: 0.1,
            metalness: 0.3,
            emissive: 0x0088FF,
            emissiveIntensity: 0.2
        });

        // Use Cone Geometry for Sharp Spikes
        const spikeGeo = new THREE.ConeGeometry(0.5, 3.0, 5); 

        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=3) {
            const createIceSpikes = (xBase: number) => {
                const grp = new THREE.Group();
                const xPos = xBase + (Math.random()-0.5)*1.5;
                const zPos = z + Math.random()*2;
                grp.position.set(xPos, 0, zPos);
                
                // Cluster of spikes
                const count = 2 + Math.floor(Math.random() * 3);
                for(let i=0; i<count; i++) {
                    const spike = new THREE.Mesh(spikeGeo, spikeMat);
                    const s = 0.5 + Math.random() * 0.8;
                    spike.scale.set(s, s * (0.8 + Math.random()*0.5), s);
                    // Random tilt
                    spike.rotation.x = (Math.random() - 0.5) * 0.5;
                    spike.rotation.z = (Math.random() - 0.5) * 0.5;
                    spike.position.set((Math.random()-0.5), s*1.5 - 0.5, (Math.random()-0.5));
                    grp.add(spike);
                }
                
                group.add(grp);
            };
            createIceSpikes(-edgeX - 2.5);
            createIceSpikes(edgeX + 2.5);
        }
    }
};

export const generateTextures = () => {
    const textures: Record<string, THREE.Texture> = {};
    const size = 512;

    // 1. Frozen Brown Cobble (Tutorial)
    const createBrownCobble = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#4E342E';
            ctx.fillRect(0,0,size,size);
            const tileSize = 64;
            const gap = 4;
            for(let y=0; y<size; y+=tileSize) {
                for(let x=0; x<size; x+=tileSize) {
                    const varC = Math.random() > 0.5 ? '#5D4037' : '#6D4C41';
                    ctx.fillStyle = varC;
                    ctx.fillRect(x+gap, y+gap, tileSize-gap*2, tileSize-gap*2);
                }
            }
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            for(let i=0; i<800; i++) {
                 const x = Math.random()*size; const y = Math.random()*size;
                 ctx.fillRect(x,y, 4, 4);
            }
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.NearestFilter;
        tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 2);
        return tex;
    };
    textures['frozen_brown_cobble'] = createBrownCobble();

    // 2. Snow Path (Level 1)
    const createDetailedSnow = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const grd = ctx.createLinearGradient(0, 0, size, size);
            grd.addColorStop(0, '#FFFFFF');
            grd.addColorStop(1, '#E6F0FF');
            ctx.fillStyle = grd;
            ctx.fillRect(0,0,size,size);
            for(let i=0; i<10000; i++) {
                ctx.fillStyle = Math.random() > 0.5 ? '#FFFFFF' : '#DDEEFF';
                ctx.fillRect(Math.random()*size, Math.random()*size, 2, 2);
            }
            ctx.fillStyle = '#00FFFF';
            for(let i=0; i<100; i++) {
                const x = Math.random()*size; const y = Math.random()*size;
                ctx.beginPath(); ctx.arc(x,y, 1.5, 0, Math.PI*2); ctx.fill();
            }
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.NearestFilter;
        return tex;
    };
    textures['frozen_snow'] = createDetailedSnow();

    // 3. Clear Ice (Level 2)
    const createIce = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const grad = ctx.createLinearGradient(0,0,size,size);
            grad.addColorStop(0, '#AADDFF'); grad.addColorStop(1, '#FFFFFF');
            ctx.fillStyle = grad; ctx.fillRect(0,0,size,size);
            ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
            for(let i=0; i<20; i++) {
                ctx.beginPath(); ctx.moveTo(Math.random()*size, Math.random()*size); 
                ctx.lineTo(Math.random()*size, Math.random()*size); ctx.stroke();
            }
            ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = 0.3;
            for(let i=0; i<10; i++) {
                const x = Math.random()*size; const y = Math.random()*size;
                ctx.fillRect(x-10, y-2, 20, 4); ctx.fillRect(x-2, y-10, 4, 20);
                ctx.fillRect(x-8, y-8, 16, 16); 
            }
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.NearestFilter;
        return tex;
    };
    textures['frozen_ice'] = createIce();

    // 4. NEON CARPET (Level 3)
    const createNeonCarpet = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#220044'; 
            ctx.fillRect(0,0,size,size);
            ctx.fillStyle = '#330055';
            ctx.globalAlpha = 0.2;
            for(let i=0; i<10000; i++) ctx.fillRect(Math.random()*size, Math.random()*size, 2, 2);
            ctx.globalAlpha = 1.0;
            const borderW = 50;
            ctx.fillStyle = '#ADA098'; // Warm Grey Borders (Changed from Neon Green)
            ctx.fillRect(0, 0, borderW, size); 
            ctx.fillRect(size-borderW, 0, borderW, size); 
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for(let y=0; y<size; y+=20) {
                ctx.moveTo(10, y); ctx.lineTo(borderW-10, y+10); ctx.lineTo(10, y+20);
                ctx.moveTo(size-borderW+10, y); ctx.lineTo(size-10, y+10); ctx.lineTo(size-borderW+10, y+20);
            }
            ctx.stroke();
            const tileSize = 128;
            ctx.strokeStyle = '#FF00FF'; 
            ctx.fillStyle = '#FF00FF';
            ctx.lineWidth = 4;
            for(let y=0; y<size; y+=tileSize) {
                for(let x=borderW; x<size-borderW; x+=tileSize) {
                    const cx = x + tileSize/2;
                    const cy = y + tileSize/2;
                    ctx.beginPath();
                    ctx.moveTo(cx, y + 10);
                    ctx.lineTo(x + tileSize - 10, cy);
                    ctx.lineTo(cx, y + tileSize - 10);
                    ctx.lineTo(x + 10, cy);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fillStyle = '#00FFFF';
                    ctx.beginPath();
                    ctx.arc(cx, cy, 15, 0, Math.PI*2);
                    ctx.fill();
                }
            }
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.NearestFilter;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1); 
        return tex;
    };
    textures['frozen_castle_tile'] = createNeonCarpet();

    // 5. Cracked Ice (Level 4 - UPDATED TO BRIGHT WHITE/BLUE)
    const createCrackedIce = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Bright Pale Blue Base (Almost White)
            ctx.fillStyle = '#E1F5FE'; 
            ctx.fillRect(0,0,size,size);
            
            // Lighter Blue noise
            ctx.fillStyle = '#B3E5FC'; 
            for(let i=0; i<30; i++) {
                const w = Math.random() * 100 + 20;
                const h = Math.random() * 5 + 2;
                const x = Math.random() * size; const y = Math.random() * size;
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(Math.random() * Math.PI);
                ctx.fillRect(-w/2, -h/2, w, h);
                ctx.restore();
            }
            
            // White highlights
            ctx.fillStyle = '#FFFFFF';
            for(let i=0; i<100; i++) {
                 ctx.fillRect(Math.random()*size, Math.random()*size, 2, 2);
            }
        }
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.NearestFilter;
        return tex;
    };
    textures['frozen_cracked_ice'] = createCrackedIce();

    return textures;
};
