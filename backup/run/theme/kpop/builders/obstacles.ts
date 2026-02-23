
import * as THREE from 'three';
import { createBox, castShadows, normalizeModel } from '../utils';
import { COLORS } from '../constants';

// JUMP: Rising Icicles (Level 1/2/4) OR Rising Iron Spikes (Level 3)
export const createJumpObstacle = (models?: Record<string, THREE.Group>, phase?: number) => {
    const group = new THREE.Group();
    group.name = 'RisingCrystals'; // Default name

    // Position logic
    let positions = [-6.0, -3.5, -1.2, 1.2, 3.5, 6.0];

    // --- LEVEL 3: RISING IRON SPIKES (Denser, Lower) ---
    if (phase === 3) {
        group.name = 'RisingIronSpikes'; // Updated name for animator
        // Denser positions (2x count)
        positions = [-6.0, -4.8, -3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6, 4.8, 6.0];
        
        positions.forEach((x) => {
            const spikeGroup = new THREE.Group();
            spikeGroup.name = 'IronSpikeGroup';
            
            // Reduced Height by 30% (2.5 -> 1.75)
            const h = 1.75; 
            const r = 0.35; // Slightly thinner radius
            
            const geo = new THREE.ConeGeometry(r, h, 8);
            const mat = new THREE.MeshStandardMaterial({
                color: 0x555555, // Dark Grey
                roughness: 0.4,
                metalness: 0.8,
            });
            
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(0, h/2, 0);
            
            // Base plate
            createBox(0.9, 0.1, 0.9, 0x222222, 0, 0.05, 0, spikeGroup);
            
            spikeGroup.add(mesh);
            spikeGroup.position.set(x, -h, 0); // Start below ground
            spikeGroup.userData = { targetY: 0 }; 
            group.add(spikeGroup);
        });
    } 
    // --- DEFAULT: ICE CRYSTALS ---
    else {
        const iceColors = [COLORS.iceClear, 0xAADDFF, 0xCCEEFF];
        positions.forEach((x) => {
            const spikeGroup = new THREE.Group();
            spikeGroup.name = 'CrystalShard'; 
            
            const count = 7;
            for(let k=0; k<count; k++) {
                const h = 1.2 + Math.random() * 1.5; 
                const r = 0.15 + Math.random() * 0.15;
                const col = iceColors[Math.floor(Math.random() * iceColors.length)];
                
                const geo = new THREE.ConeGeometry(r, h, 6);
                const mat = new THREE.MeshStandardMaterial({
                    color: col,
                    transparent: true,
                    opacity: 0.9, 
                    roughness: 0.1,
                    metalness: 0.3,
                    emissive: 0x004488,
                    emissiveIntensity: 0.2
                });
                
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set((Math.random()-0.5)*1.5, h/2, (Math.random()-0.5)*1.5);
                mesh.rotation.x = (Math.random()-0.5)*0.4;
                mesh.rotation.z = (Math.random()-0.5)*0.4;
                
                spikeGroup.add(mesh);
            }

            spikeGroup.position.set(x, -2.5, 0); 
            spikeGroup.userData = { targetY: 0 }; 
            group.add(spikeGroup);
        });
    }

    castShadows(group);
    return group;
};

// CROUCH: Ice Tunnel (Default) OR Iron Gate Trap (Level 3)
export const createCrouchObstacle = (heightScale: number, models?: Record<string, THREE.Group>, phase?: number) => {
    const group = new THREE.Group();
    
    // --- LEVEL 3: IRON GATE TRAP (European Style) ---
    if (phase === 3) {
        const gate = new THREE.Group();
        gate.name = 'IronGateTrap';
        
        const darkMetal = 0x222222;
        const gateWidth = 14.0;
        const gateHeight = 6.0;
        const thickness = 1.5;

        // Side Pillars
        createBox(thickness, gateHeight, thickness, darkMetal, -gateWidth/2 + thickness/2, gateHeight/2, 0, gate);
        createBox(thickness, gateHeight, thickness, darkMetal, gateWidth/2 - thickness/2, gateHeight/2, 0, gate);
        
        // Top Lintel (Ornate)
        const lintelY = gateHeight - 0.5;
        createBox(gateWidth, 1.0, 2.0, darkMetal, 0, lintelY, 0, gate);
        // Decorative top
        createBox(gateWidth - 2, 0.5, 1.5, darkMetal, 0, lintelY + 0.75, 0, gate);

        // Falling Spikes (Attached to hidden moving bar)
        const spikeBar = new THREE.Group();
        spikeBar.name = 'FallingSpikeBar';
        
        // ADJUSTMENT: Move Bar Lower to simulate spikes coming down further
        // Lowered by 1.0 from lintelY (5.5 -> 4.5) to make spikes effectively lower
        spikeBar.position.y = lintelY - 1.0; 
        
        const spikeCount = 7;
        const spikeSpacing = gateWidth / (spikeCount + 1);
        const spikeMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
        
        // INCREASED LENGTH: 2.0 -> 2.5 (25% Longer)
        const spikeHeight = 2.5;
        const spikeGeo = new THREE.ConeGeometry(0.3, spikeHeight, 4);
        spikeGeo.rotateX(Math.PI); 
        
        // Offset so the top of the spike (base of cone) is at y=0 relative to bar (which is near lintel)
        spikeGeo.translate(0, -spikeHeight/2, 0); 

        for(let i=1; i<=spikeCount; i++) {
            const x = -gateWidth/2 + i*spikeSpacing;
            const spike = new THREE.Mesh(spikeGeo, spikeMat);
            
            // Adjust local y so the base sits higher up, connected to the lowered bar
            // Since we lowered the bar by 1.0, and lengthened spikes by 0.5, 
            // the tip is now significantly lower (approx 20% reduced clearance).
            spike.position.set(x, 1.0, 0); // Offset up to re-attach to the visual bar if needed
            
            spikeBar.add(spike);
        }
        
        gate.add(spikeBar);
        group.add(gate);
    } 
    // --- DEFAULT: ICE TUNNEL ---
    else {
        const tunnel = new THREE.Group();
        tunnel.name = 'SnowTunnel';
        
        // Icicles (Updated to match Jump Obstacle: Bright Sky Blue)
        const iceMat = new THREE.MeshStandardMaterial({ 
            color: 0xAADDFF, // Bright Sky Blue (Matches Jump Obstacle)
            transparent: true, 
            opacity: 0.9, 
            roughness: 0.1, 
            metalness: 0.3, 
            emissive: 0x004488, // Matches Jump Obstacle
            emissiveIntensity: 0.2, 
            flatShading: false,
            depthWrite: false, 
            side: THREE.DoubleSide
        });

        // Structure (Pillars & Roof) - WHITE
        const structureMat = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.9,
            roughness: 0.3,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        const snowMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 1.0 });

        const tunnelLength = 12.0;
        const width = 14.0;
        const height = 6.0;
        const thickness = 1.9;

        const createRoughPillar = (x: number) => {
            const pillar = new THREE.Group();
            pillar.position.set(x, 0, 0);
            const blocks = 4;
            const blockH = height / blocks;
            for(let i=0; i<blocks; i++) {
                for(let z=-tunnelLength/2; z<tunnelLength/2; z+=3.0) {
                    const w = thickness + (Math.random() - 0.5);
                    const h = blockH + (Math.random() - 0.5);
                    const d = 3.0 + (Math.random() - 0.5);
                    const y = i * blockH + blockH/2;
                    // Assign explicit material to ensure sharing
                    const iceBlock = createBox(w, h, d, 0xFFFFFF, (Math.random() - 0.5) * 0.5, y, z + 1.5 + (Math.random() - 0.5) * 0.5, pillar);
                    iceBlock.material = structureMat; // White Structure
                    
                    if (Math.random() > 0.6) {
                        const snowBlock = createBox(w+0.2, 0.2, d+0.2, 0xFFFFFF, 0, y + h/2, z + 1.5, pillar);
                        snowBlock.material = snowMat;
                    }
                }
            }
            tunnel.add(pillar);
        };
        createRoughPillar(-width/2 + thickness/2);
        createRoughPillar(width/2 - thickness/2);

        const roofY = height - 0.5;
        const roofGroup = new THREE.Group();
        roofGroup.position.y = roofY;
        for(let z=-tunnelLength/2; z<tunnelLength/2; z+=4.0) {
            const slabW = width + 2;
            const iceSlab = createBox(slabW, 1.1, 3.8, 0xFFFFFF, 0, 0, z + 2.0, roofGroup);
            iceSlab.material = structureMat; // White Structure
            
            const snowSlab = createBox(slabW + 0.2, 0.4, 4.0, 0xFFFFFF, 0, 0.75, z + 2.0, roofGroup);
            snowSlab.material = snowMat;
        }
        tunnel.add(roofGroup);

        const icicleRows = 3; const icicleCols = 5;
        for(let r=0; r<icicleRows; r++) {
            const zPos = -tunnelLength/3 + (r * (tunnelLength/3));
            for(let c=0; c<icicleCols; c++) {
                const xPos = -5.0 + (c * 2.5) + (Math.random()-0.5);
                const h = 1.5 + Math.random() * 1.5;
                const geo = new THREE.ConeGeometry(0.3, h, 6); geo.rotateX(Math.PI); geo.translate(0, -h/2, 0); 
                const icicle = new THREE.Mesh(geo, iceMat); icicle.name = 'StabbingIcicle';
                icicle.position.set(xPos, roofY - 0.6, zPos);
                icicle.userData = { phaseOffset: Math.random() * 10 };
                tunnel.add(icicle);
            }
        }
        group.add(tunnel);
    }

    castShadows(group);
    return group;
};

// BIG JUMP: Giant Snowballs (Default) OR Rolling Iron Balls (Level 3)
export const createBigJumpObstacle = (models?: Record<string, THREE.Group>, phase?: number) => {
    const group = new THREE.Group();
    
    // --- LEVEL 3: ROLLING IRON BALLS (Smaller) ---
    if (phase === 3) {
        const container = new THREE.Group();
        container.name = 'RollingIronBalls';
        
        const ironMat = new THREE.MeshStandardMaterial({ 
            color: 0x444444, 
            roughness: 0.4,
            metalness: 0.8
        });
        const rivetMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 });

        // Reduced size by 15% (2.0 -> 1.7)
        const radius = 1.7;

        const createIronBall = (x: number) => {
            const ball = new THREE.Group();
            ball.position.set(x, radius, 0); // Position Y = radius to sit on floor
            
            // Main Sphere
            const geo = new THREE.SphereGeometry(radius, 32, 32); 
            const mesh = new THREE.Mesh(geo, ironMat);
            ball.add(mesh);
            
            // Rivets / Bands for detail (so rotation is visible)
            const bandGeo = new THREE.TorusGeometry(radius, 0.1, 16, 32);
            const band1 = new THREE.Mesh(bandGeo, rivetMat);
            ball.add(band1);
            const band2 = new THREE.Mesh(bandGeo, rivetMat);
            band2.rotation.y = Math.PI/2;
            ball.add(band2);
            
            // Spikes
            for(let i=0; i<12; i++) {
                const sGeo = new THREE.ConeGeometry(0.2, 0.5, 8);
                const sMesh = new THREE.Mesh(sGeo, rivetMat);
                // Random position on sphere
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                sMesh.position.setFromSphericalCoords(radius, phi, theta);
                sMesh.lookAt(ball.position);
                sMesh.rotateX(-Math.PI/2); // Point out
                ball.add(sMesh);
            }

            return ball;
        };

        const leftBall = createIronBall(-2.5); leftBall.name = 'IronBall_L'; container.add(leftBall);
        const rightBall = createIronBall(2.5); rightBall.name = 'IronBall_R'; container.add(rightBall);
        
        group.add(container);
    }
    // --- DEFAULT: SNOWBALLS ---
    else {
        const container = new THREE.Group();
        container.name = 'RollingSnowballs';
        const snowMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9, flatShading: true });

        const createGiantSnowball = (x: number) => {
            const ball = new THREE.Group();
            ball.position.set(x, 2.0, 0);
            const geo = new THREE.IcosahedronGeometry(2.0, 1); 
            const mesh = new THREE.Mesh(geo, snowMat);
            ball.add(mesh);
            for(let i=0; i<18; i++) {
                const size = 0.2 + Math.random() * 0.4;
                const lump = new THREE.Mesh(new THREE.IcosahedronGeometry(size, 0), snowMat);
                const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1); const r = 1.9;
                lump.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
                lump.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
                ball.add(lump);
            }
            return ball;
        };

        const leftBall = createGiantSnowball(-2.5); leftBall.name = 'Snowball_L'; container.add(leftBall);
        const rightBall = createGiantSnowball(2.5); rightBall.name = 'Snowball_R'; container.add(rightBall);
        group.add(container);
    }

    castShadows(group);
    return group;
};
