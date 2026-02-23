
import * as THREE from 'three';
import { createBox, castShadows, createToiletShape, createHead } from '../utils';
import { COLORS } from '../constants';

// Jump: Rising Grinder Blades (6 Units to fill road)
export const createJumpObstacle = () => {
    const group = new THREE.Group();
    group.name = 'GrinderTrap'; 

    // 6 Blades to cover the full 14m width
    // Spacing: -6.25, -3.75, -1.25, 1.25, 3.75, 6.25
    const bladePositions = [-6.25, -3.75, -1.25, 1.25, 3.75, 6.25];
    
    bladePositions.forEach(x => {
        const bladeGroup = new THREE.Group();
        bladeGroup.name = 'Blade'; // Identifier for animation
        bladeGroup.position.set(x, 0, 0);

        // Blade Disc (Grey Metal)
        const bladeGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.1, 16);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.3 });
        const disc = new THREE.Mesh(bladeGeo, bladeMat);
        disc.rotation.x = Math.PI / 2; // Stand up
        bladeGroup.add(disc);

        // Center Cap
        createBox(0.4, 0.4, 0.2, 0x333333, 0, 0, 0, bladeGroup);

        // Teeth (Sharp bits on rim - Increased count for menacing look)
        for(let i=0; i<12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const tooth = createBox(0.2, 0.4, 0.05, 0xCCCCCC, Math.cos(angle)*1.0, Math.sin(angle)*1.0, 0, bladeGroup);
            tooth.rotation.z = angle;
        }
        
        // Axle/Mount
        createBox(0.2, 0.6, 0.6, 0x222222, x, 0, 0, group);

        group.add(bladeGroup);
    });

    castShadows(group); 
    return group;
};

// Crouch: High-Tech Hydraulic Death Tunnel (Industrial Detail Upgrade)
export const createCrouchObstacle = (heightScale: number) => {
    const group = new THREE.Group();
    const tunnel = new THREE.Group();
    tunnel.name = 'TunnelTrap'; 
    
    const darkMetal = 0x222222;
    const rustyMetal = COLORS.bufferL1; 
    const hazardYellow = 0xFFD700;
    const hazardBlack = 0x111111;
    const dangerRed = 0xFF0000;

    // SCENE BUILDER LIFTS THIS GROUP BY 2.5 Y.
    // TO TOUCH GROUND (0), OBJECTS MUST EXTEND TO Y = -2.5 LOCALLY.

    // 1. Vertical Support Towers (Static) - Extended to floor
    const createTower = (x: number) => {
        const t = new THREE.Group();
        t.position.set(x, 0, 0);
        
        // Extended Steel Column (Floor to ceiling height)
        // Range: -2.5 (Floor) to 10.0 (Top) = Height 12.5
        // Center Y = (-2.5 + 10) / 2 = 3.75
        createBox(1.5, 12.5, 1.5, darkMetal, 0, 3.75, 0, t);
        
        // Inner Guide Rails for ceiling
        // Range: -2.5 to 9.0 = Height 11.5
        // Center Y = (-2.5 + 9.0) / 2 = 3.25
        const dir = x > 0 ? -1 : 1;
        createBox(0.5, 11.5, 0.5, 0x666666, dir * 0.8, 3.25, 0, t);
        
        // Warning Beacon on top
        const beacon = createBox(0.5, 0.5, 0.5, dangerRed, 0, 10.25, 0, t);
        (beacon.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(dangerRed);
        (beacon.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
        beacon.name = 'TowerBeacon'; 

        // Removed rusty truss supports (the "wooden sticks") as requested

        return t;
    };

    tunnel.add(createTower(-7.5));
    tunnel.add(createTower(7.5));

    // 3. Dynamic Ceiling Assembly (Moves Up/Down)
    const ceiling = new THREE.Group();
    ceiling.name = 'TunnelCeiling';
    // Initial position high, animator will oscillate it
    ceiling.position.y = 5.0; 

    // Main Carriage Beam (Heavy Duty)
    createBox(16.0, 1.2, 2.0, darkMetal, 0, 0, 0, ceiling);
    
    // Hazard Stripes (Construction style)
    for(let x=-7; x<=7; x+=2.0) {
        // Yellow block segment
        createBox(1.0, 1.25, 2.05, hazardYellow, x, 0, 0, ceiling);
        // Black angled stripe overlay
        const stripe = createBox(0.4, 1.3, 2.1, hazardBlack, x, 0, 0, ceiling);
        stripe.rotation.z = 0.5; 
    }

    // Underside Mechanics (Pipes/Cables)
    createBox(14.0, 0.3, 0.3, 0x555555, 0, -0.6, 0.5, ceiling);
    createBox(14.0, 0.3, 0.3, 0x555555, 0, -0.6, -0.5, ceiling);

    // 4. The Shredders (4 High-Detail Units)
    const grinderX = [-4.5, -1.5, 1.5, 4.5];
    grinderX.forEach(x => {
        const unit = new THREE.Group();
        unit.position.set(x, -0.6, 0);

        // Suspension/Motor Housing
        createBox(1.2, 0.8, 1.2, rustyMetal, 0, -0.4, 0, unit); // Motor box
        createBox(1.3, 0.1, 1.3, 0x333333, 0, -0.2, 0, unit); // Mounting Flange
        
        // Drive Shaft
        createBox(0.4, 0.6, 0.4, 0x888888, 0, -1.0, 0, unit);

        // Spinning Head Group
        const spinner = new THREE.Group();
        spinner.name = 'CeilingGrinder'; // For rotation animation
        spinner.position.set(0, -1.3, 0); // Pivot point for blade

        // Central Hub
        createBox(0.8, 0.2, 0.8, darkMetal, 0, 0, 0, spinner);
        
        // SAW BLADES (Cross pattern for volume)
        const bladeColor = 0xCCCCCC;
        const bladeEdge = 0xFF4400; // Hot glowing edge

        // Blade 1 (Wide)
        createBox(2.2, 0.1, 0.6, bladeColor, 0, 0, 0, spinner);
        // Blade 2 (Cross)
        createBox(0.6, 0.1, 2.2, bladeColor, 0, 0, 0, spinner);
        
        // Glowing Tips/Teeth (Emissive)
        const addTooth = (px: number, pz: number, rot: number) => {
            const t = createBox(0.3, 0.15, 0.1, bladeEdge, px, 0, pz, spinner);
            (t.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(bladeEdge);
            (t.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
            if(rot) t.rotation.y = rot;
        };
        
        // 4 Main Directions
        addTooth(1.2, 0, 0); addTooth(-1.2, 0, 0);
        addTooth(0, 1.2, 1.57); addTooth(0, -1.2, 1.57);
        // 4 Diagonals
        addTooth(0.8, 0.8, 0.78); addTooth(-0.8, -0.8, 0.78);
        addTooth(-0.8, 0.8, -0.78); addTooth(0.8, -0.8, -0.78);

        // Lower Spike (Drill tip)
        createBox(0.2, 0.5, 0.2, 0x555555, 0, -0.3, 0, spinner).rotation.x = Math.PI; 

        unit.add(spinner);
        ceiling.add(unit);
    });

    tunnel.add(ceiling);
    group.add(tunnel);
    castShadows(group); 
    return group;
};

// Big Jump: Fortified High Barrier (Detailed)
export const createBigJumpObstacle = () => {
    const group = new THREE.Group();
    const barrier = new THREE.Group();
    barrier.name = 'FortifiedBarrier';

    const baseColor = 0x333333; // Dark Concrete
    const metalColor = 0x555555;
    const stripeColor = COLORS.laserYellow;
    
    // 1. Concrete Base (Heavy Footer) - STATIC
    // Height 1.0m
    createBox(14.0, 1.0, 2.0, baseColor, 0, 0.5, 0, barrier);
    createBox(14.2, 0.2, 1.8, 0x222222, 0, 0.5, 0, barrier); 

    // 2. Moving Upper Part (Everything else)
    const movingPart = new THREE.Group();
    movingPart.name = 'MovingBarrierPart';
    movingPart.position.y = 0; // Will be animated
    barrier.add(movingPart);

    // Vertical Supports
    [-5, -2, 2, 5].forEach(x => {
        createBox(0.6, 3.0, 0.6, metalColor, x, 1.5, 0, movingPart);
        // Bolts
        createBox(0.7, 0.1, 0.7, 0x111111, x, 1.0, 0, movingPart);
        createBox(0.7, 0.1, 0.7, 0x111111, x, 2.5, 0, movingPart);
    });

    // Main Steel Panel
    const panelH = 1.8;
    const panelY = 1.0 + panelH/2;
    createBox(13.0, panelH, 0.4, 0x222222, 0, panelY, 0, movingPart);

    // Cross Bracing
    const braceColor = 0x444444;
    [-3.5, 0, 3.5].forEach(xOffset => {
        const brace = new THREE.Group();
        brace.position.set(xOffset, panelY, 0.3);
        const bar1 = createBox(0.2, 2.2, 0.1, braceColor, 0, 0, 0, brace);
        bar1.rotation.z = 0.6;
        const bar2 = createBox(0.2, 2.2, 0.1, braceColor, 0, 0, 0, brace);
        bar2.rotation.z = -0.6;
        movingPart.add(brace);
    });

    // Top Rail & Hazard Stripes
    const railY = 1.0 + panelH; // ~2.8m
    createBox(14.0, 0.3, 0.6, 0x111111, 0, railY, 0, movingPart);
    for(let x=-6.5; x<=6.5; x+=1.0) {
        createBox(0.5, 0.35, 0.65, stripeColor, x, railY, 0, movingPart);
    }

    // Top Spikes
    for(let x=-6.5; x<=6.5; x+=0.8) {
        const spike = new THREE.Mesh(
            new THREE.ConeGeometry(0.15, 0.6, 8),
            new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 })
        );
        spike.position.set(x, railY + 0.3, 0);
        movingPart.add(spike);
    }

    // Warning Lights
    const lightY = railY - 0.5;
    [-4, 0, 4].forEach(x => {
        const light = createBox(0.4, 0.4, 0.2, 0xFF0000, x, lightY, 0.3, movingPart);
        light.name = 'WarningLight';
        (light.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0xFF0000);
    });

    group.add(barrier);
    castShadows(group);
    return group;
};

// NEW: Pass-Through Wall (Image + Video Overlay)
export const createPassThroughWall = (width: number, height: number, texture: THREE.Texture, videoTexture?: THREE.Texture) => {
    const group = new THREE.Group();
    
    // 1. The Image Plane (Base Content) - Normal Blending (No Glow/Transparency Add)
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false, 
        blending: THREE.NormalBlending, // Normal Blending for clear image
        opacity: 1.0
    });
    
    const wall = new THREE.Mesh(geometry, material);
    wall.position.y = height / 2;
    group.add(wall);

    // 2. The Video Overlay (Mirror Effect) - Additive Blending (Glow)
    if (videoTexture) {
        const overlayMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending, // Additive for the glitch/holo effect
            opacity: 0.5 // Semi-transparent overlay
        });
        
        const overlay = new THREE.Mesh(geometry, overlayMaterial);
        overlay.position.y = height / 2;
        overlay.position.z = 0.05; // Slightly in front to prevent z-fighting
        group.add(overlay);
    }

    return group;
};
