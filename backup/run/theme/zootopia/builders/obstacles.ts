
import * as THREE from 'three';
import { createBox, castShadows } from '../utils';
import { COLORS } from '../constants';

// JUMP: High-Fidelity WIDE Road Construction Barricade OR Cones
export const createJumpObstacle = (models?: Record<string, THREE.Group>, phase?: number, variant?: string) => {
    const group = new THREE.Group();
    
    // --- VARIANT B: 8 TIGHT CONSTRUCTION CONES ---
    if (variant === 'B') {
        const conesGroup = new THREE.Group();
        conesGroup.name = 'ConstructionCones';
        
        const orange = 0xFF5722; // Deep Orange (was Pastel)
        const white = 0xFFFFFF;
        const black = 0x111111;
        const lightYellow = 0xFFC107; // Standard Warning Yellow (was Pastel)
        
        // 8 Cones packed tightly (2 rows of 4)
        const positions = [
            [-4.5, 0], [-1.5, 0], [1.5, 0], [4.5, 0], // Front row
            [-3.0, 0.8], [0, 0.8], [3.0, 0.8], [6.0, 0.8] // Back row
        ];
        
        positions.forEach(([x, z]) => {
            const cone = new THREE.Group();
            cone.position.set(x, 0, z);
            
            // Base (Black Rubber)
            createBox(0.8, 0.1, 0.8, black, 0, 0.05, 0, cone);
            
            // Cone Body
            const coneH = 1.4;
            const coneGeo = new THREE.ConeGeometry(0.35, coneH, 16);
            const coneMat = new THREE.MeshStandardMaterial({ color: orange, roughness: 0.5 });
            const mesh = new THREE.Mesh(coneGeo, coneMat);
            mesh.position.y = 0.1 + coneH/2;
            cone.add(mesh);
            
            // Reflective Stripes (Torus)
            const stripeGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.15, 16, 1, true);
            const stripeMat = new THREE.MeshBasicMaterial({ color: white });
            const s1 = new THREE.Mesh(stripeGeo, stripeMat);
            s1.position.y = 0.5; cone.add(s1);
            
            const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.15, 16, 1, true), stripeMat);
            s2.position.y = 1.0; cone.add(s2);
            
            // Top Light (Yellow Flasher)
            const bulb = createBox(0.15, 0.2, 0.15, lightYellow, 0, coneH + 0.1, 0, cone);
            bulb.name = 'ConeLight';
            (bulb.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(lightYellow);
            (bulb.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;

            conesGroup.add(cone);
        });
        
        group.add(conesGroup);
    } 
    // --- VARIANT A: WIDE BARRICADE (Existing) ---
    else {
        // Single wide barricade spanning most of the road
        const barricade = new THREE.Group();
        barricade.name = 'Barricade';
        barricade.position.set(0, 0, 0); 
        
        const cLeg = 0x333333;   
        const cBoard = 0xFFA000; // Rich Amber (was Pastel Yellow)
        const cStripe = 0x111111; 
        const cLight = 0xFF6F00; // Deep Amber (was Pastel Amber)
        
        // --- 1. A-Frame Supports (3 Legs: Left, Center, Right) ---
        const legH = 1.2;
        const legW = 0.25;
        const legSpread = 0.8;
        
        const createSupport = (lx: number) => {
            const lGroup = new THREE.Group();
            lGroup.position.set(lx, 0, 0);
            
            // Front Leg
            const fLeg = createBox(legW, legH + 0.2, legW, cLeg, 0, legH/2, legSpread/2, lGroup);
            fLeg.rotation.x = -0.25; 
            
            // Back Leg
            const bLeg = createBox(legW, legH + 0.2, legW, cLeg, 0, legH/2, -legSpread/2, lGroup);
            bLeg.rotation.x = 0.25; 
            
            // Top Cap
            createBox(0.3, 0.15, 0.5, cLeg, 0, legH, 0, lGroup);
            
            barricade.add(lGroup);
        };
        
        createSupport(-6.0); // Far Left
        createSupport(0.0);  // Center
        createSupport(6.0);  // Far Right
        
        // --- 2. Wide Horizontal Boards ---
        const boardW = 13.0; // Spans from -6.5 to 6.5
        const boardH = 0.3;
        const boardD = 0.08;
        
        const createWideBoard = (yPos: number) => {
            const bGroup = new THREE.Group();
            bGroup.position.set(0, yPos, 0);
            
            // Base Yellow Board
            createBox(boardW, boardH, boardD, cBoard, 0, 0, 0, bGroup);
            
            // Stripes (Procedural loop)
            const stripeCount = 20;
            const startX = -boardW/2;
            const step = boardW / stripeCount;
            
            for(let i=0; i<stripeCount; i++) {
                const sx = startX + (i * step) + 0.3;
                const stripe = createBox(0.2, boardH + 0.02, boardD + 0.01, cStripe, sx, 0, 0, bGroup);
                stripe.rotation.z = -0.5;
            }
            barricade.add(bGroup);
        };
        
        createWideBoard(0.4);
        createWideBoard(0.9);
        
        // --- 3. Flashing Warning Lights (On top of legs) ---
        [-6.0, 0.0, 6.0].forEach(lx => {
            const lightGroup = new THREE.Group();
            lightGroup.position.set(lx, legH + 0.15, 0);
            
            createBox(0.3, 0.1, 0.2, 0x111111, 0, 0, 0, lightGroup); // Base
            const lens = createBox(0.25, 0.25, 0.1, cLight, 0, 0.15, 0, lightGroup);
            lens.name = 'WarningLightLens';
            (lens.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(cLight);
            
            barricade.add(lightGroup);
        });

        group.add(barricade);
    }
    
    castShadows(group); 
    return group;
};

// CROUCH: High-Fidelity Silver Pipe Arch (Tunnel) OR Industrial Pipe
export const createCrouchObstacle = (heightScale: number, models?: Record<string, THREE.Group>, phase?: number, variant?: string) => {
    const group = new THREE.Group();
    
    // --- VARIANT B: COLORFUL ZOOTOPIA INDUSTRIAL PIPE (Straight) ---
    if (variant === 'B') {
        const pipeObj = new THREE.Group();
        pipeObj.name = 'PipeFan'; 
        
        // UPDATED: MATTE (No Gloss)
        const pipeMat = new THREE.MeshStandardMaterial({ 
            color: 0x1A1A1A, // Darker Grey (was 0x4A4A4A)
            roughness: 1.0,  // Fully Matte
            metalness: 0.0   // No Metal
        });
        
        const supportMat = new THREE.MeshStandardMaterial({ 
            color: 0x2E2E2E, // Very Dark Iron
            roughness: 1.0,
            metalness: 0.0
        });
        
        const jointMat = new THREE.MeshStandardMaterial({ 
            color: 0x3D3D3D, // Dark Joint
            roughness: 1.0,
            metalness: 0.0
        });
        
        // CHANGED: Yellow Orange Band (Matte)
        const bandMat = new THREE.MeshStandardMaterial({ 
            color: 0xFFAB00, // Yellow Orange
            metalness: 0.0, 
            roughness: 1.0 
        });

        const width = 14.0;
        const pipeRadius = 0.9;
        const yPos = 3.8; 

        // Helper to add detail bands
        const addRings = (parent: THREE.Mesh, length: number, count: number) => {
             const rGeo = new THREE.TorusGeometry(pipeRadius + 0.05, 0.05, 8, 32);
             const step = length / (count + 1);
             for(let i=1; i<=count; i++) {
                 const r = new THREE.Mesh(rGeo, bandMat);
                 // Parent Y-axis is the cylinder length
                 r.position.y = -length/2 + i * step;
                 r.rotation.x = Math.PI/2; 
                 parent.add(r);
             }
        };

        // Main Horizontal Pipe
        const mainPipe = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, width, 32), pipeMat);
        mainPipe.rotation.z = Math.PI / 2;
        mainPipe.position.set(0, yPos, 0);
        addRings(mainPipe, width, 8); 
        pipeObj.add(mainPipe);

        // Vertical Supports
        const supportRadius = 0.6;
        const supportL = new THREE.Mesh(new THREE.CylinderGeometry(supportRadius, supportRadius, yPos, 16), supportMat);
        supportL.position.set(-6.0, yPos/2, 0);
        addRings(supportL, yPos, 3); 
        pipeObj.add(supportL);

        const supportR = new THREE.Mesh(new THREE.CylinderGeometry(supportRadius, supportRadius, yPos, 16), supportMat);
        supportR.position.set(6.0, yPos/2, 0);
        addRings(supportR, yPos, 3);
        pipeObj.add(supportR);

        // Joints
        const flangeGeo = new THREE.CylinderGeometry(pipeRadius*1.2, pipeRadius*1.2, 0.4, 32);
        const addFlange = (x: number) => {
            const f = new THREE.Mesh(flangeGeo, jointMat);
            f.rotation.z = Math.PI / 2;
            f.position.set(x, yPos, 0);
            pipeObj.add(f);
        };
        addFlange(-6.0); addFlange(6.0); addFlange(0);

        // Fan (Matte Dark)
        const fanGroup = new THREE.Group();
        fanGroup.name = 'FanBlades'; // Internal name
        fanGroup.position.set(0, yPos, 0.95);
        
        // Fan Housing (Static)
        createBox(1.5, 1.5, 0.2, 0x111111, 0, 0, 0, fanGroup);
        
        // Spinner Group (This is what rotates)
        const spinner = new THREE.Group();
        spinner.name = 'FanSpinner';
        fanGroup.add(spinner);

        const bladeGeo = new THREE.BoxGeometry(0.2, 1.2, 0.05);
        // Dark Matte Blade
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.0, roughness: 1.0 }); 
        for(let i=0; i<4; i++) {
            const b = new THREE.Mesh(bladeGeo, bladeMat);
            b.rotation.z = (i/4) * Math.PI * 2;
            spinner.add(b);
        }
        pipeObj.add(fanGroup);

        group.add(pipeObj);
    } 
    // --- VARIANT A: PIPE ARCH TUNNEL (Existing) ---
    else {
        const arch = new THREE.Group();
        arch.name = 'PipeArch';

        // UPDATED: MATTE (No Gloss)
        const chromeMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.0, roughness: 1.0 }); // Matte Grey
        const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.0, roughness: 1.0 });
        const hazardMat = new THREE.MeshStandardMaterial({ color: 0xFFCA28, roughness: 1.0 }); 
        
        const bandMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1.0 });

        const pipeRadius = 0.7;
        const archWidth = 10.35; 
        const pillarHeight = 3.5; 
        const bendRadius = 2.0;   

        // 1. Vertical Pillars
        const pillarGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, pillarHeight, 32);
        
        const leftPillar = new THREE.Mesh(pillarGeo, chromeMat);
        leftPillar.position.set(-archWidth/2, pillarHeight/2, 0);
        arch.add(leftPillar);

        const rightPillar = new THREE.Mesh(pillarGeo, chromeMat);
        rightPillar.position.set(archWidth/2, pillarHeight/2, 0);
        arch.add(rightPillar);

        // Bases
        const baseGeo = new THREE.CylinderGeometry(pipeRadius * 1.4, pipeRadius * 1.6, 0.4, 32);
        const leftBase = new THREE.Mesh(baseGeo, darkMetalMat); leftBase.position.set(-archWidth/2, 0.2, 0); arch.add(leftBase);
        const rightBase = new THREE.Mesh(baseGeo, darkMetalMat); rightBase.position.set(archWidth/2, 0.2, 0); arch.add(rightBase);

        // 2. Elbow Corners
        const elbowGeo = new THREE.TorusGeometry(bendRadius, pipeRadius, 16, 32, Math.PI / 2);
        const lElbow = new THREE.Mesh(elbowGeo, chromeMat); lElbow.position.set(-archWidth/2 + bendRadius, pillarHeight, 0); lElbow.rotation.z = Math.PI / 2; arch.add(lElbow);
        const rElbow = new THREE.Mesh(elbowGeo, chromeMat); rElbow.position.set(archWidth/2 - bendRadius, pillarHeight, 0); rElbow.rotation.z = 0; arch.add(rElbow);

        // 3. Top Crossbar
        const topBarLen = archWidth - (bendRadius * 2);
        const topBar = new THREE.Mesh(new THREE.CylinderGeometry(pipeRadius, pipeRadius, topBarLen + 0.1, 32), chromeMat);
        topBar.rotation.z = Math.PI / 2;
        topBar.position.set(0, pillarHeight + bendRadius, 0);
        arch.add(topBar);

        // Add Detail Rings
        const addRings = (parentMesh: THREE.Mesh, length: number, count: number, isVertical: boolean) => {
            const ringGeo = new THREE.TorusGeometry(pipeRadius + 0.02, 0.05, 8, 32); 
            const step = length / (count + 1);
            for(let i = 1; i <= count; i++) {
                const ring = new THREE.Mesh(ringGeo, bandMat);
                const offset = -length/2 + i * step;
                if (isVertical) {
                    ring.rotation.x = Math.PI / 2;
                    ring.position.y = offset;
                } else {
                    ring.rotation.x = Math.PI / 2;
                    ring.position.y = offset; 
                }
                parentMesh.add(ring);
            }
        };

        addRings(leftPillar, pillarHeight, 4, true);
        addRings(rightPillar, pillarHeight, 4, true);
        addRings(topBar, topBarLen, 6, false); 

        // 4. Flanges / Joints
        const flangeGeo = new THREE.TorusGeometry(pipeRadius * 1.05, 0.12, 8, 32);
        const flangeMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.0, roughness: 1.0 });
        
        const addFlange = (x: number, y: number, z: number, rotZ: number) => {
            const f = new THREE.Mesh(flangeGeo, flangeMat);
            f.position.set(x, y, z);
            f.rotation.z = rotZ;
            arch.add(f);
        };

        addFlange(-archWidth/2, pillarHeight, 0, Math.PI/2); 
        addFlange(archWidth/2, pillarHeight, 0, Math.PI/2);  
        addFlange(-topBarLen/2, pillarHeight + bendRadius, 0, 0); 
        addFlange(topBarLen/2, pillarHeight + bendRadius, 0, 0);  

        // 5. Hanging Sign
        const signGroup = new THREE.Group();
        signGroup.name = 'HangingSign';
        signGroup.position.set(0, pillarHeight + bendRadius - pipeRadius, 0); 

        // UPDATED: Shorter Chains to Hang Higher (1.6 -> 1.0) -> Raises board ~20%
        const chainLen = 1.0;
        const chainGeo = new THREE.CylinderGeometry(0.04, 0.04, chainLen, 8);
        
        // UPDATED: Spaced out chains for new width (1.8 -> 2.1)
        const chainL = new THREE.Mesh(chainGeo, darkMetalMat); chainL.position.set(-2.1, -chainLen/2, 0); signGroup.add(chainL);
        const chainR = new THREE.Mesh(chainGeo, darkMetalMat); chainR.position.set(2.1, -chainLen/2, 0); signGroup.add(chainR);

        // UPDATED: Wider Board (5.5 -> 6.325)
        const boardW = 6.325; 
        const boardH = 1.0; const boardD = 0.15;
        const board = new THREE.Mesh(new THREE.BoxGeometry(boardW, boardH, boardD), hazardMat);
        board.position.set(0, -chainLen - boardH/2 + 0.1, 0); 
        const stripeGeo = new THREE.BoxGeometry(0.2, boardH + 0.02, boardD + 0.02);
        const blackMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        for(let i=-6; i<=6; i++) {
            const stripe = new THREE.Mesh(stripeGeo, blackMat);
            stripe.position.set(i * 0.4, 0, 0); stripe.rotation.z = 0.4; board.add(stripe);
        }
        const frame = new THREE.Mesh(new THREE.BoxGeometry(boardW + 0.1, boardH + 0.1, boardD - 0.05), darkMetalMat);
        board.add(frame);
        for(let i=-5; i<=5; i++) {
            const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 4), darkMetalMat);
            spike.rotation.z = Math.PI; spike.position.set(i * 0.5, -boardH/2 - 0.15, 0); board.add(spike);
        }

        signGroup.add(board);
        arch.add(signGroup);
        group.add(arch);
    }

    castShadows(group);
    return group;
};

// BIG JUMP: High Fidelity ZPD Heavy Barricade OR Construction Barrier
export const createBigJumpObstacle = (models?: Record<string, THREE.Group>, phase?: number, variant?: string) => {
    const group = new THREE.Group();
    
    // --- VARIANT B: CONSTRUCTION CONCRETE BARRIER (LOWERED 15%) ---
    if (variant === 'B') {
        const barrier = new THREE.Group();
        barrier.name = 'ConstructionBarrier';
        
        const concrete = 0x999999;
        const fenceGrey = 0x555555;
        const width = 14.0;
        
        // HEIGHT REDUCTION 15%
        // Original Base: 1.0 -> 0.85
        // Original Fence: 2.0 -> 1.7
        const baseH = 0.85; 
        const fenceH = 1.7; 
        
        // 1. Jersey Barrier Base
        createBox(width, 0.34, 1.0, concrete, 0, 0.17, 0, barrier); // Bottom
        createBox(width, 0.51, 0.6, concrete, 0, 0.595, 0, barrier); // Middle taper
        
        // 2. Steel Mesh Fence Top
        // Frame Top Rail
        createBox(width, 0.1, 0.1, fenceGrey, 0, baseH + fenceH, 0, barrier); 
        // Posts
        [-6, -3, 0, 3, 6].forEach(x => {
            createBox(0.2, fenceH, 0.2, fenceGrey, x, baseH + fenceH/2, 0, barrier);
        });
        
        // Mesh (Approximated)
        for(let x=-6.8; x<=6.8; x+=0.4) {
            createBox(0.05, fenceH, 0.05, 0x333333, x, baseH + fenceH/2, 0, barrier);
        }
        
        // 3. Danger Sign
        const signGroup = new THREE.Group();
        signGroup.position.set(0, baseH + 0.85, 0.1); // Scaled pos
        barrier.add(signGroup);
        signGroup.name = 'HangingDangerSign';
        
        createBox(2.5, 1.0, 0.1, 0xFFFFFF, 0, 0, 0, signGroup);
        createBox(2.3, 0.8, 0.12, 0xF44336, 0, 0, 0, signGroup); // Red (was Pastel)
        createBox(2.0, 0.2, 0.14, 0xFFFFFF, 0, 0.2, 0, signGroup); 
        createBox(1.5, 0.2, 0.14, 0xFFFFFF, 0, -0.2, 0, signGroup); 
        
        // 4. Rotating Beacon Light
        const beacon = new THREE.Group();
        beacon.position.set(5.0, baseH + fenceH + 0.2, 0);
        createBox(0.4, 0.1, 0.4, 0x111111, 0, 0, 0, beacon);
        const light = createBox(0.3, 0.4, 0.3, 0xFF6F00, 0, 0.25, 0, beacon); // Deep Orange (was Pastel)
        (light.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0xFF6F00);
        beacon.name = 'RotatingBeacon';
        barrier.add(beacon);

        group.add(barrier);
    }
    // --- VARIANT A: HIGH FIDELITY ZPD BARRIER (REWORKED) ---
    else {
        const barrier = new THREE.Group();
        barrier.name = 'ZPDBarrier';
        
        const zpdBlue = 0x001040; // Darker Blue (was 0x0D47A1)
        const zpdGold = 0xFFC107; // Rich Gold (was Pastel)
        const metalDark = 0x333333; // Achromatic Dark Grey
        const metalShiny = 0x8899AA; // Grey-ish
        
        const width = 14.0;
        const height = 2.5; 
        const depth = 1.0;
        
        // 1. Main Reinforced Slab (Complex Geometry)
        // Central Core
        createBox(width, height, 0.6, zpdBlue, 0, height/2, 0, barrier);
        
        // Heavy Metal Footer
        createBox(width + 0.4, 0.6, 1.2, metalDark, 0, 0.3, 0, barrier);
        // Sloped Metal Top Cap
        const cap = createBox(width + 0.2, 0.4, 0.8, metalShiny, 0, height, 0, barrier);
        
        // Vertical Reinforced Columns (4 big ones)
        [-5, -1.6, 1.6, 5].forEach(x => {
            const col = new THREE.Group();
            col.position.set(x, height/2, 0.35);
            // Main vertical beam
            createBox(1.0, height - 0.6, 0.3, metalShiny, 0, 0, 0, col);
            // Bolts
            createBox(0.15, 0.15, 0.1, 0x111111, -0.3, 0.8, 0.15, col);
            createBox(0.15, 0.15, 0.1, 0x111111, 0.3, 0.8, 0.15, col);
            createBox(0.15, 0.15, 0.1, 0x111111, -0.3, -0.8, 0.15, col);
            createBox(0.15, 0.15, 0.1, 0x111111, 0.3, -0.8, 0.15, col);
            barrier.add(col);
        });

        // Horizontal "Police Line" Stripes (Inset)
        const stripeZoneY = height/2;
        createBox(width, 0.8, 0.62, 0x000000, 0, stripeZoneY, 0, barrier); // Black background stripe
        // Chevrons
        const chevCount = 12;
        const chevSpacing = width / chevCount;
        for(let i=0; i<chevCount; i++) {
            const x = -width/2 + i*chevSpacing + chevSpacing/2;
            const chev = createBox(0.4, 0.8, 0.02, zpdGold, x, stripeZoneY, 0.32, barrier);
            chev.rotation.z = -0.5; // Angled stripes
        }

        // 2. High-Res ZPD Shield Logo (3D)
        const logo = new THREE.Group();
        logo.name = 'ZPDLogo';
        logo.position.set(0, 2.6, 0); // Floating above
        
        // Shield Background (Gold)
        const shieldGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 6); // Hexagon-ish
        const shieldMat = new THREE.MeshStandardMaterial({ color: zpdGold, metalness: 0.8, roughness: 0.2 });
        const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        shieldMesh.rotation.x = Math.PI / 2;
        logo.add(shieldMesh);
        
        // Inner Badge (Blue)
        const innerGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.25, 6);
        const innerMat = new THREE.MeshStandardMaterial({ color: zpdBlue });
        const innerMesh = new THREE.Mesh(innerGeo, innerMat);
        innerMesh.rotation.x = Math.PI / 2;
        logo.add(innerMesh);
        
        // Star (5 boxes arranged)
        const star = new THREE.Group();
        star.position.z = 0.15;
        const starC = 0xFFFFFF; // Silver star
        for(let i=0; i<5; i++) {
            const arm = createBox(0.15, 0.5, 0.05, starC, 0, 0.25, 0, star);
            arm.rotation.z = i * (Math.PI * 2 / 5);
            // Center pivot is 0,0, so arms radiate
            const spike = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.05), new THREE.MeshStandardMaterial({ color: starC }));
            spike.position.y = 0.3;
            const pivot = new THREE.Group();
            pivot.add(spike);
            pivot.rotation.z = i * (Math.PI * 2 / 5);
            star.add(pivot);
        }
        logo.add(star);
        
        // Text Placeholder (Blocks)
        createBox(0.6, 0.15, 0.1, 0x000000, 0, -0.4, 0.2, logo); // "ZPD" text strip

        barrier.add(logo);
        
        // 3. Advanced Light Bar (Sirens)
        const lightBarY = height + 0.2;
        createBox(width - 2.0, 0.15, 0.3, 0x222222, 0, lightBarY, 0, barrier); // Rail
        
        const addSirenUnit = (x: number, color: number, name: string) => {
            const s = new THREE.Group();
            s.position.set(x, lightBarY + 0.15, 0);
            
            // Housing
            createBox(0.5, 0.1, 0.4, 0x111111, 0, -0.05, 0, s);
            
            // Glass Dome
            const dome = createBox(0.4, 0.3, 0.3, color, 0, 0.15, 0, s);
            dome.name = name;
            const mat = dome.material as THREE.MeshStandardMaterial;
            mat.transparent = true;
            mat.opacity = 0.8;
            mat.emissive = new THREE.Color(color);
            mat.emissiveIntensity = 0.5;
            
            // Inner Rotator (Fake)
            createBox(0.1, 0.25, 0.2, 0xFFFFFF, 0, 0.15, 0, s);
            
            barrier.add(s);
        };
        
        const darkRed = 0xD32F2F; // Darker Red (was Pastel)
        const darkBlue = 0x1976D2; // Darker Blue (was Pastel)

        addSirenUnit(-4.0, darkRed, 'SirenRed');
        addSirenUnit(-2.0, darkBlue, 'SirenBlue');
        addSirenUnit(2.0, darkRed, 'SirenRed');
        addSirenUnit(4.0, darkBlue, 'SirenBlue');

        group.add(barrier);
    }

    castShadows(group); 
    return group;
};
