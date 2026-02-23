
import * as THREE from 'three';
import { createDetailedTexture } from '../../../utils/gameUtils';
import { createBox, castShadows } from '../utils';
import { LevelConfig, TextureMap } from '../../../gameTypes';
import { COLORS } from '../constants';

export const createPlayerMesh = () => new THREE.Group();
export const createSkis = () => ({ left: new THREE.Group(), right: new THREE.Group() });

// --- HELPER: BLACK KEYING SHADER MATERIAL ---
export const createAlphaVideoMaterial = (texture: THREE.Texture) => {
    return new THREE.ShaderMaterial({
        uniforms: {
            map: { value: texture },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D map;
            varying vec2 vUv;
            void main() {
                vec4 texColor = texture2D(map, vUv);
                float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
                float alpha = smoothstep(0.05, 0.15, brightness);
                gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false, 
        blending: THREE.NormalBlending 
    });
};

export const createWallBlockade = (width: number, height: number, texture?: THREE.Texture) => {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, 1), 
        new THREE.MeshStandardMaterial({ 
            map: texture || null, 
            color: texture ? 0xffffff : 0x888888, 
            roughness: 0.8,
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
        new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2 }) 
    );
    frame.position.y = height / 2; frame.castShadow = true; frame.receiveShadow = true; 
    group.add(frame);
    
    const material = new THREE.MeshBasicMaterial({ 
        map: texture || null, 
        color: texture ? 0xffffff : 0x000000,
        transparent: false,
        opacity: 1.0,
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    plane.position.set(0, height / 2, 0.26); 
    group.add(plane);
    return group;
};

export const createPassThroughWall = (width: number, height: number, texture: THREE.Texture, videoTexture?: THREE.Texture) => {
    const group = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: false, 
        side: THREE.DoubleSide, 
        opacity: 1.0 
    });
    const wall = new THREE.Mesh(geometry, material);
    wall.position.y = height / 2;
    group.add(wall);
    
    if (videoTexture) {
        const overlayMaterial = createAlphaVideoMaterial(videoTexture);
        const overlay = new THREE.Mesh(geometry, overlayMaterial);
        overlay.position.y = (height / 2) - 1.0; 
        overlay.position.z = 0.05;
        group.add(overlay);
    }
    return group;
};

export const decorateChunk = (group: THREE.Group, levelConfig: LevelConfig, roadWidth: number, chunkDepth: number, textures: TextureMap) => {
    const edgeX = roadWidth / 2;
    const type = levelConfig.fence.type;
    
    // Helper: Create a catenary-like curve using boxes (for ropes)
    const createRope = (start: THREE.Vector3, end: THREE.Vector3, sag: number, color: number) => {
        const ropeGroup = new THREE.Group();
        // OPTIMIZATION: Reduced segments from 12 to 4 to improve Level 4 performance
        const segments = 4;
        const dist = start.distanceTo(end);
        
        for(let i=0; i<segments; i++) {
            const t1 = i / segments;
            const t2 = (i + 1) / segments;
            
            const p1 = new THREE.Vector3().lerpVectors(start, end, t1);
            p1.y -= Math.sin(t1 * Math.PI) * sag;
            
            const p2 = new THREE.Vector3().lerpVectors(start, end, t2);
            p2.y -= Math.sin(t2 * Math.PI) * sag;
            
            const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            const segVec = new THREE.Vector3().subVectors(p2, p1);
            const len = segVec.length();
            
            const box = createBox(0.12, 0.12, len, color, mid.x, mid.y, mid.z, ropeGroup);
            box.lookAt(p2);
        }
        group.add(ropeGroup);
    };

    // --- TUTORIAL: PASTEL COLORFUL GUARDRAIL ---
    if (type === 'tutorial_racing_rail') {
        const sidewalkW = 2.0;
        // Concrete sidewalk (Darkened to match floor)
        createBox(sidewalkW, 0.3, chunkDepth, 0x223344, -edgeX - sidewalkW/2, 0.15, 0, group);
        createBox(sidewalkW, 0.3, chunkDepth, 0x223344, edgeX + sidewalkW/2, 0.15, 0, group);

        const railX = edgeX + 0.5;
        const blockSize = 1.0; // Length of each color block
        const blockH = 0.5;    // Low height
        const blockW = 0.5;    // Width
        
        // Pastel Colors: Red, Yellow, Green, Blue (Darker/Vibrant versions)
        const colors = [0xE53935, 0xFDD835, 0x43A047, 0x1E88E5]; 

        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=blockSize) {
            // Calculate color index based on position
            const colorIndex = Math.abs(Math.floor((z + chunkDepth/2) / blockSize)) % colors.length;
            const color = colors[colorIndex];
            
            // Left Rail Block
            createBox(blockW, blockH, blockSize, color, -railX, blockH/2, z + blockSize/2, group);
            
            // Right Rail Block
            createBox(blockW, blockH, blockSize, color, railX, blockH/2, z + blockSize/2, group);
        }
    }
    // --- OLD TUTORIAL: ZPD HARBOR (Bollards & Ropes) - KEPT FOR REFERENCE OR FALLBACK ---
    else if (type === 'harbor_rope') {
        const bankW = 2.0;
        // Concrete dock edge
        createBox(bankW, 0.5, chunkDepth, COLORS.floorConcrete, -edgeX - bankW/2, 0.25, 0, group);
        createBox(bankW, 0.5, chunkDepth, COLORS.floorConcrete, edgeX + bankW/2, 0.25, 0, group);
        
        // Hazard stripe along edge
        createBox(0.2, 0.05, chunkDepth, COLORS.safetyYellow, -edgeX - 0.1, 0.51, 0, group);
        createBox(0.2, 0.05, chunkDepth, COLORS.safetyYellow, edgeX + 0.1, 0.51, 0, group);

        const bollardSpacing = 5.0;
        const bollardH = 1.2;
        const bX = edgeX + 0.8;
        
        const bollardsL: THREE.Vector3[] = [];
        const bollardsR: THREE.Vector3[] = [];

        // Create Bollards
        for(let z=-chunkDepth/2; z<=chunkDepth/2; z+=bollardSpacing) {
            const createBollard = (x: number) => {
                const b = new THREE.Group();
                b.position.set(x, 0.5, z);
                // Base
                createBox(0.6, 0.2, 0.6, 0x111111, 0, 0.1, 0, b);
                // Stem
                createBox(0.4, bollardH, 0.4, COLORS.bollardIron, 0, bollardH/2, 0, b);
                // Head
                createBox(0.5, 0.3, 0.5, COLORS.bollardIron, 0, bollardH, 0, b);
                group.add(b);
                return new THREE.Vector3(x, 0.5 + bollardH - 0.2, z);
            };
            
            if (z < chunkDepth/2 - 1) { 
                bollardsL.push(createBollard(-bX));
                bollardsR.push(createBollard(bX));
            }
        }

        // String Ropes between bollards
        for(let i=0; i<bollardsL.length-1; i++) {
            createRope(bollardsL[i], bollardsL[i+1], 0.5, COLORS.ropeTan);
            createRope(bollardsR[i], bollardsR[i+1], 0.5, COLORS.ropeTan);
        }
    }

    // --- LEVEL 1: DOWNTOWN (Racing Guardrails) ---
    else if (type === 'city_guardrail') {
        const sidewalkW = 3.0;
        // Asphalt sidewalk - Darker
        createBox(sidewalkW, 0.3, chunkDepth, 0x111111, -edgeX - sidewalkW/2, 0.15, 0, group);
        createBox(sidewalkW, 0.3, chunkDepth, 0x111111, edgeX + sidewalkW/2, 0.15, 0, group);

        const railH = 0.8;
        const railX = edgeX + 0.5;
        const railColor = 0xFFAB00; 
        
        // Continuous Rail
        createBox(0.2, 0.4, chunkDepth, railColor, -railX, railH, 0, group);
        createBox(0.2, 0.4, chunkDepth, railColor, railX, railH, 0, group);
        
        // Checkered Racing Pattern on Rail
        const checkSize = 1.0;
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=checkSize) {
            const color = ((z / checkSize) % 2 === 0) ? 0x000000 : railColor;
            createBox(0.21, 0.25, checkSize/2, color, -railX, railH, z + checkSize/4, group);
            createBox(0.21, 0.25, checkSize/2, (color===0x000000?railColor:0x000000), -railX, railH, z - checkSize/4, group); // Checker
            
            createBox(0.21, 0.25, checkSize/2, color, railX, railH, z + checkSize/4, group);
            createBox(0.21, 0.25, checkSize/2, (color===0x000000?railColor:0x000000), railX, railH, z - checkSize/4, group);
        }

        // Posts
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=3.0) {
            createBox(0.2, railH, 0.2, 0x333333, -railX, railH/2, z, group);
            createBox(0.2, railH, 0.2, 0x333333, railX, railH/2, z, group);
            
            // Street Lamp
            if (z % 15 === 0) {
                const lampH = 5.0;
                const lamp = new THREE.Group();
                lamp.position.set(-railX - 1.0, 0, z);
                createBox(0.3, lampH, 0.3, 0x222222, 0, lampH/2, 0, lamp);
                createBox(1.5, 0.2, 0.2, 0x222222, 0.6, lampH, 0, lamp);
                const bulb = createBox(0.5, 0.2, 0.3, 0xFFFFCC, 1.2, lampH-0.2, 0, lamp);
                (bulb.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0xFFFFAA);
                group.add(lamp);
            }
        }
    }

    // --- LEVEL 2: ZOOTENNIAL GALA (Pastel Pink & Bronze) ---
    else if (type === 'gala_pillars') {
        const floorW = 4.0;
        // BRONZE Side Floors (As requested "bronze point color")
        createBox(floorW, 0.2, chunkDepth, COLORS.galaBronze, -edgeX - floorW/2, 0.1, 0, group);
        createBox(floorW, 0.2, chunkDepth, COLORS.galaBronze, edgeX + floorW/2, 0.1, 0, group);
        
        // Deep Pink Trim
        createBox(0.2, 0.25, chunkDepth, COLORS.galaDeepPink, -edgeX, 0.125, 0, group);
        createBox(0.2, 0.25, chunkDepth, COLORS.galaDeepPink, edgeX, 0.125, 0, group);

        // European Style Lamps with Bronze
        const lampX = edgeX + 1.2;
        
        const createEuropeanLamp = (x: number, z: number) => {
            const lamp = new THREE.Group();
            lamp.position.set(x, 0, z);
            
            // Base - Bronze
            createBox(0.8, 0.4, 0.8, COLORS.galaBronze, 0, 0.2, 0, lamp);
            
            // Pole - Bronze
            const poleH = 3.5;
            createBox(0.3, poleH, 0.3, COLORS.galaDarkBronze, 0, 0.4 + poleH/2, 0, lamp);
            
            // Decorative Rings
            createBox(0.4, 0.1, 0.4, COLORS.galaBronze, 0, 1.5, 0, lamp);
            createBox(0.35, 0.1, 0.35, COLORS.galaBronze, 0, 2.5, 0, lamp);
            
            // Lamp Head
            const headY = 0.4 + poleH;
            
            // Lantern Frame
            createBox(0.6, 0.1, 0.6, COLORS.galaBronze, 0, headY, 0, lamp); // Bottom plate
            createBox(0.8, 0.1, 0.8, COLORS.galaBronze, 0, headY + 0.8, 0, lamp); // Top Roof Base
            
            // Glass (Pinkish White)
            const glass = createBox(0.5, 0.7, 0.5, 0xFFE4E1, 0, headY + 0.4, 0, lamp);
            (glass.material as THREE.MeshStandardMaterial).transparent = true;
            (glass.material as THREE.MeshStandardMaterial).opacity = 0.7;
            (glass.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(COLORS.galaPink);
            (glass.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
            
            // Pointed Roof
            const roof = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.5, 4), new THREE.MeshStandardMaterial({ color: COLORS.galaBronze }));
            roof.position.y = headY + 1.05;
            roof.rotation.y = Math.PI/4;
            lamp.add(roof);
            
            group.add(lamp);
        };

        // Place lamps periodically
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=12.0) {
            createEuropeanLamp(-lampX, z);
            createEuropeanLamp(lampX, z);
        }
    }

    // --- LEVEL 3: HONEYMOON LODGE (Snowy Stone & Crests) ---
    else if (type === 'stone_crest_fence') {
        const bankW = 2.5;
        // CHANGED: Use Navy Blue constant for railing elements
        const railingColor = COLORS.lodgeNavy; 
        
        createBox(bankW, 0.6, chunkDepth, railingColor, -edgeX - bankW/2, 0.3, 0, group);
        createBox(bankW, 0.6, chunkDepth, railingColor, edgeX + bankW/2, 0.3, 0, group);
        
        // Snow Topping
        createBox(bankW+0.2, 0.3, chunkDepth, 0xFFFFFF, -edgeX - bankW/2, 0.7, 0, group);
        createBox(bankW+0.2, 0.3, chunkDepth, 0xFFFFFF, edgeX + bankW/2, 0.7, 0, group);

        const fenceX = edgeX + 0.5;
        const wallH = 1.5;
        
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=5.0) {
            const createSection = (x: number) => {
                const s = new THREE.Group();
                s.position.set(x, 0.6, z);
                
                // Stone Pillar (Navy)
                createBox(0.8, wallH, 0.8, railingColor, 0, wallH/2, 0, s);
                // Snow Cap
                createBox(1.0, 0.2, 1.0, 0xFFFFFF, 0, wallH, 0, s);
                
                // Crest (European Stone Relief)
                const crest = new THREE.Group();
                crest.position.set(0, wallH/2 + 0.2, 0.5); // Face inward
                if (x > 0) crest.position.z = -0.5; // Flip for other side if needed
                
                crest.position.set(x > 0 ? -0.5 : 0.5, wallH/2, 0);
                crest.rotation.y = x > 0 ? -Math.PI/2 : Math.PI/2;

                createBox(0.5, 0.6, 0.1, 0x555555, 0, 0, 0, crest); // Shield
                createBox(0.3, 0.4, 0.12, 0x88CCFF, 0, 0, 0, crest); // Inner Ice Gem
                
                s.add(crest);
                
                if (z < chunkDepth/2 - 2) {
                    createBox(0.4, wallH*0.7, 4.2, railingColor, 0, wallH*0.35, 2.5, s);
                    createBox(0.5, 0.1, 4.2, 0xFFFFFF, 0, wallH*0.7, 2.5, s); // Snow on wall
                }
                
                group.add(s);
            };
            createSection(-fenceX);
            createSection(fenceX);
        }
    }

    // --- LEVEL 4: LYNXLEY MANOR (OPTIMIZED) ---
    else if (type === 'ceremony_rail') {
        const bankW = 3.0;
        const floorMat = new THREE.MeshStandardMaterial({ color: COLORS.manorBlue, roughness: 0.0, metalness: 0.5 });
        const lFloor = new THREE.Mesh(new THREE.BoxGeometry(bankW, 0.2, chunkDepth), floorMat);
        lFloor.position.set(-edgeX - bankW/2, 0.1, 0); group.add(lFloor);
        const rFloor = new THREE.Mesh(new THREE.BoxGeometry(bankW, 0.2, chunkDepth), floorMat);
        rFloor.position.set(edgeX + bankW/2, 0.1, 0); group.add(rFloor);

        const stanchionX = edgeX + 0.5;
        // OPTIMIZATION: Increased spacing from 6.0 to 12.0 to reduce object count
        const spacing = 12.0; 
        
        const postsL: THREE.Vector3[] = [];
        const postsR: THREE.Vector3[] = [];

        // Gold Stanchions
        for(let z=-chunkDepth/2; z<=chunkDepth/2; z+=spacing) {
            const createPost = (x: number) => {
                const p = new THREE.Group();
                p.position.set(x, 0.2, z);
                
                // Base
                createBox(0.5, 0.1, 0.5, COLORS.manorGold, 0, 0.05, 0, p);
                // Pole
                createBox(0.1, 1.0, 0.1, COLORS.manorGold, 0, 0.6, 0, p);
                // Ball Top
                const ball = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshStandardMaterial({ color: COLORS.manorGold, metalness: 0.8, roughness: 0.2 }));
                ball.position.set(0, 1.15, 0);
                p.add(ball);
                
                group.add(p);
                return new THREE.Vector3(x, 1.0, z); // Hook point
            };
            
            if (z < chunkDepth/2 - 1) {
                postsL.push(createPost(-stanchionX));
                postsR.push(createPost(stanchionX));
            }
        }

        // Velvet Ropes
        for(let i=0; i<postsL.length-1; i++) {
            createRope(postsL[i], postsL[i+1], 0.4, COLORS.velvetRed);
            createRope(postsR[i], postsR[i+1], 0.4, COLORS.velvetRed);
        }
        
        // Emissive Boxes for Lights (Reduced density matching posts)
        for(let z=-chunkDepth/2; z<chunkDepth/2; z+=spacing) {
            const lightBoxL = createBox(0.3, 0.1, 0.3, 0x0000FF, -edgeX - 1.0, 0.25, z, group);
            (lightBoxL.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x0000FF);
            (lightBoxL.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
            
            const lightBoxR = createBox(0.3, 0.1, 0.3, 0x0000FF, edgeX + 1.0, 0.25, z, group);
            (lightBoxR.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x0000FF);
            (lightBoxR.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
        }
    }
};

export const generateTextures = () => {
    const textures: Record<string, THREE.Texture> = {};
    const size = 512;

    const createCtx = () => {
        const c = document.createElement('canvas');
        c.width = size; c.height = size;
        return c.getContext('2d')!;
    };
    
    // UPDATED: Changed Default Filter to NearestFilter to fix blurry center lines
    // Added generateMipmaps = false to prevent smudging at distance
    const finishTex = (ctx: CanvasRenderingContext2D, repeatX=1, repeatY=1) => {
        const t = new THREE.CanvasTexture(ctx.canvas);
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(repeatX, repeatY);
        // CHANGED: Use Nearest Filter and disable mipmaps for sharp pixel-art style lines
        t.minFilter = THREE.NearestFilter; 
        t.magFilter = THREE.NearestFilter;
        t.generateMipmaps = false;
        return t;
    };

    // 1. TUTORIAL: Dock Concrete (Darker Grey - NO HAZARD STRIPES)
    const ctx0 = createCtx();
    ctx0.fillStyle = '#223344'; ctx0.fillRect(0,0,size,size);
    // Grid lines
    ctx0.strokeStyle = '#112233'; ctx0.lineWidth = 4;
    ctx0.beginPath();
    for(let i=0; i<=size; i+=64) { ctx0.moveTo(i,0); ctx0.lineTo(i,size); ctx0.moveTo(0,i); ctx0.lineTo(size,i); }
    ctx0.stroke();
    
    // REMOVED: Yellow Orange Safety Side Stripes & Black hazard hashes
    
    // Center Arrows (UPDATED COLOR)
    ctx0.fillStyle = 'rgba(255, 171, 0, 0.5)'; // Yellow Orange semi-transparent
    ctx0.beginPath(); ctx0.moveTo(size/2, 100); ctx0.lineTo(size/2-100, 300); ctx0.lineTo(size/2, 250); ctx0.lineTo(size/2+100, 300); ctx0.fill();
    textures['dock_concrete'] = finishTex(ctx0, 1, 4);

    // 2. LEVEL 1: City Asphalt (Darker Black/Grey - WITH WHITE DASHED CENTER LANE)
    const ctx1 = createCtx();
    ctx1.fillStyle = '#1A1A1A'; 
    ctx1.fillRect(0,0,size,size);
    for(let i=0; i<5000; i++) { ctx1.fillStyle = Math.random()>0.5?'#222222':'#111111'; ctx1.fillRect(Math.random()*size, Math.random()*size, 2, 2); }
    
    // Center White Dashed Lane
    ctx1.strokeStyle = '#FFFFFF';
    ctx1.lineWidth = 8;
    ctx1.setLineDash([40, 40]); // Dashed pattern
    ctx1.beginPath();
    ctx1.moveTo(size/2, 0);
    ctx1.lineTo(size/2, size);
    ctx1.stroke();
    ctx1.setLineDash([]); // Reset
    
    textures['city_asphalt'] = finishTex(ctx1, 1, 4);

    // 3. LEVEL 2: Geometric Angular Carpet (No Center Line)
    const ctx2 = createCtx();
    // Deep Red/Burgundy Background
    ctx2.fillStyle = '#4A0E0E'; 
    ctx2.fillRect(0,0,size,size);
    
    // Gold/Bronze Geometric Pattern (Diamonds/Triangles)
    ctx2.fillStyle = '#CD7F32'; 
    
    // Intricate Border
    ctx2.fillRect(0, 0, 40, size);
    ctx2.fillRect(size-40, 0, 40, size);
    
    // Inner Pattern (Geometric Angular)
    ctx2.globalAlpha = 0.3;
    for (let y = 0; y < size; y += 128) {
        for (let x = 40; x < size-40; x += 128) {
            // Diamond Shape
            ctx2.beginPath();
            ctx2.moveTo(x + 64, y);
            ctx2.lineTo(x + 128, y + 64);
            ctx2.lineTo(x + 64, y + 128);
            ctx2.lineTo(x, y + 64);
            ctx2.fill();
            
            // Inner Square
            ctx2.fillRect(x + 48, y + 48, 32, 32);
        }
    }
    ctx2.globalAlpha = 1.0;

    // Gold Trim Lines (Borders only)
    ctx2.fillStyle = '#FFD700';
    ctx2.fillRect(35, 0, 5, size);
    ctx2.fillRect(size-40, 0, 5, size);
    
    // CHANGED: RepeatX = 1 to avoid center seam (double border)
    textures['gala_marble'] = finishTex(ctx2, 1, 2);

    // 4. LEVEL 3: Snowy Stone (DARKER LOW SATURATION NAVY)
    const ctx3 = createCtx();
    // CHANGED: #1A237E -> #0A0E20 (Deep Dark Navy)
    ctx3.fillStyle = '#0A0E20'; 
    ctx3.fillRect(0,0,size,size);
    // CHANGED: Lines darker too (#3949AB -> #151B35)
    ctx3.strokeStyle = '#151B35'; 
    ctx3.lineWidth = 5;
    for(let y=0; y<size; y+=128) {
        for(let x=0; x<size; x+=128) {
            ctx3.strokeRect(x,y,128,128);
        }
    }
    ctx3.strokeStyle = '#283593'; // Cracks darker
    ctx3.lineWidth = 2;
    for(let i=0; i<15; i++) {
        ctx3.beginPath(); ctx3.moveTo(Math.random()*size, Math.random()*size);
        ctx3.lineTo(Math.random()*size, Math.random()*size); ctx3.stroke();
    }
    ctx3.fillStyle = 'rgba(255,255,255,0.2)'; // Reduced Snow Opacity further
    for(let i=0; i<20; i++) {
        ctx3.beginPath(); ctx3.arc(Math.random()*size, Math.random()*size, 20 + Math.random()*30, 0, Math.PI*2); ctx3.fill();
    }
    textures['snowy_stone'] = finishTex(ctx3, 2, 4);

    // 5. LEVEL 4: Manor Floor (Dark Blue Gloss + Tiles)
    const ctx4 = createCtx();
    const grad = ctx4.createLinearGradient(0,0,size,size);
    grad.addColorStop(0, '#000022'); grad.addColorStop(1, '#000044');
    ctx4.fillStyle = grad; ctx4.fillRect(0,0,size,size);
    
    ctx4.fillStyle = 'rgba(0,0,0,0.3)';
    for(let y=0; y<size; y+=128) {
        for(let x=0; x<size; x+=128) {
            if ((x+y)%256 === 0) ctx4.fillRect(x,y,128,128);
        }
    }
    const gradRef = ctx4.createLinearGradient(0,0,size,0);
    gradRef.addColorStop(0, 'rgba(0,0,255,0)');
    gradRef.addColorStop(0.5, 'rgba(100,100,255,0.2)');
    gradRef.addColorStop(1, 'rgba(0,0,255,0)');
    ctx4.fillStyle = gradRef;
    ctx4.fillRect(0, 0, size, size);
    
    textures['manor_floor'] = finishTex(ctx4, 1, 1);

    return textures;
};
