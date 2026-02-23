
import * as THREE from 'three';
import { createBox, castShadows, createVoxelEyes } from '../utils';
import { COLORS } from '../constants';

export const createBossMesh = (type: string) => {
    const group = new THREE.Group();
    if (type === 'boss1') { 
        // TEAM ROCKET (Detailed Voxel)
        const james = new THREE.Group(); james.name='James'; james.position.set(-1.2, 0, 0);
        const jLlegGroup = new THREE.Group(); jLlegGroup.name='L_Leg'; jLlegGroup.position.set(-0.2, 0.85, 0); james.add(jLlegGroup);
        createBox(0.22, 0.5, 0.22, 0xFFFFFF, 0, -0.25, 0, jLlegGroup); createBox(0.25, 0.4, 0.3, 0x111111, 0, -0.65, 0, jLlegGroup);
        const jRlegGroup = new THREE.Group(); jRlegGroup.name='R_Leg'; jRlegGroup.position.set(0.2, 0.85, 0); james.add(jRlegGroup);
        createBox(0.22, 0.5, 0.22, 0xFFFFFF, 0, -0.25, 0, jRlegGroup); createBox(0.25, 0.4, 0.3, 0x111111, 0, -0.65, 0, jRlegGroup);
        
        // James Torso
        const jTorso = new THREE.Group(); jTorso.position.set(0, 1.3, 0); james.add(jTorso);
        createBox(0.65, 0.8, 0.35, 0xFFFFFF, 0, 0, 0, jTorso); 
        // Add R Logo (James)
        const rColor = 0xD32F2F;
        const rZ = 0.18;
        createBox(0.05, 0.25, 0.02, rColor, -0.05, 0.05, rZ, jTorso); 
        createBox(0.15, 0.05, 0.02, rColor, 0.02, 0.15, rZ, jTorso); 
        createBox(0.15, 0.05, 0.02, rColor, 0.02, 0.0, rZ, jTorso); 
        createBox(0.05, 0.1, 0.02, rColor, 0.08, 0.08, rZ, jTorso); 
        createBox(0.05, 0.15, 0.02, rColor, 0.08, -0.1, rZ, jTorso); 

        const jLarm = new THREE.Group(); jLarm.name='L_Arm'; jLarm.position.set(-0.45, 1.6, 0); james.add(jLarm);
        createBox(0.18, 0.4, 0.18, 0xFFFFFF, 0, -0.2, 0, jLarm); createBox(0.2, 0.3, 0.2, 0x111111, 0, -0.55, 0, jLarm);
        const jRarm = new THREE.Group(); jRarm.name='R_Arm'; jRarm.position.set(0.45, 1.6, 0); james.add(jRarm);
        createBox(0.18, 0.4, 0.18, 0xFFFFFF, 0, -0.2, 0, jRarm); createBox(0.2, 0.3, 0.2, 0x111111, 0, -0.55, 0, jRarm);
        const rose = new THREE.Group(); rose.position.set(0, -0.7, 0.1); jRarm.add(rose); createBox(0.02, 0.4, 0.02, 0x006400, 0, 0.2, 0, rose); createBox(0.1, 0.1, 0.1, 0xFF0000, 0, 0.4, 0, rose); 
        
        const jHead = new THREE.Group(); jHead.position.set(0, 1.9, 0); james.add(jHead);
        createBox(0.45, 0.45, 0.45, COLORS.skin, 0, 0, 0, jHead);
        
        createBox(0.14, 0.14, 0.02, 0xFFFFFF, -0.12, 0.05, 0.23, jHead); 
        createBox(0.06, 0.06, 0.03, 0x111111, -0.09, 0.05, 0.235, jHead); 
        createBox(0.14, 0.14, 0.02, 0xFFFFFF, 0.12, 0.05, 0.23, jHead); 
        createBox(0.06, 0.06, 0.03, 0x111111, 0.09, 0.05, 0.235, jHead); 
        createBox(0.1, 0.03, 0.02, 0x8B4513, 0, -0.15, 0.23, jHead); 

        const jHairC = 0x6357B5; 
        createBox(0.15, 0.04, 0.03, jHairC, -0.12, 0.14, 0.24, jHead).rotation.z = -0.2;
        createBox(0.15, 0.04, 0.03, jHairC, 0.12, 0.14, 0.24, jHead).rotation.z = 0.2;

        createBox(0.55, 0.15, 0.5, jHairC, 0, 0.3, 0, jHead); 
        createBox(0.55, 0.4, 0.2, jHairC, 0, 0.1, -0.2, jHead); 
        createBox(0.15, 0.5, 0.45, jHairC, -0.25, 0.1, 0.05, jHead); 
        createBox(0.15, 0.5, 0.45, jHairC, 0.25, 0.1, 0.05, jHead); 
        createBox(0.15, 0.2, 0.1, jHairC, 0, 0.35, 0.25, jHead); 
        
        const jessie = new THREE.Group(); jessie.name='Jessie'; jessie.position.set(0.3, 0, 0);
        const jeLlegGroup = new THREE.Group(); jeLlegGroup.name='L_Leg'; jeLlegGroup.position.set(-0.15, 0.9, 0); jessie.add(jeLlegGroup);
        createBox(0.18, 0.15, 0.18, COLORS.skin, 0, -0.075, 0, jeLlegGroup); createBox(0.2, 0.8, 0.2, 0x111111, 0, -0.55, 0, jeLlegGroup);
        const jeRlegGroup = new THREE.Group(); jeRlegGroup.name='R_Leg'; jeRlegGroup.position.set(0.15, 0.9, 0); jessie.add(jeRlegGroup);
        createBox(0.18, 0.15, 0.18, COLORS.skin, 0, -0.075, 0, jeRlegGroup); createBox(0.2, 0.8, 0.2, 0x111111, 0, -0.55, 0, jeRlegGroup);
        
        const jeTorso = new THREE.Group(); jeTorso.position.set(0, 1.18, 0); jessie.add(jeTorso);
        createBox(0.5, 0.25, 0.3, 0xFFFFFF, 0, -0.15, 0, jeTorso); 
        createBox(0.4, 0.15, 0.25, COLORS.skin, 0, 0.05, 0, jeTorso); 
        createBox(0.5, 0.45, 0.3, 0xFFFFFF, 0, 0.35, 0, jeTorso); 
        
        const jeRZ = 0.16;
        createBox(0.04, 0.2, 0.02, rColor, -0.04, 0.35, jeRZ, jeTorso); 
        createBox(0.12, 0.04, 0.02, rColor, 0.02, 0.43, jeRZ, jeTorso); 
        createBox(0.12, 0.04, 0.02, rColor, 0.02, 0.32, jeRZ, jeTorso); 
        createBox(0.04, 0.08, 0.02, rColor, 0.07, 0.38, jeRZ, jeTorso); 
        createBox(0.04, 0.12, 0.02, rColor, 0.07, 0.25, jeRZ, jeTorso); 

        const jeLarm = new THREE.Group(); jeLarm.name='L_Arm'; jeLarm.position.set(-0.35, 1.6, 0); jessie.add(jeLarm);
        createBox(0.12, 0.2, 0.12, 0xFFFFFF, 0, -0.1, 0, jeLarm); createBox(0.14, 0.5, 0.14, 0x111111, 0, -0.45, 0, jeLarm);
        const jeRarm = new THREE.Group(); jeRarm.name='R_Arm'; jeRarm.position.set(0.35, 1.6, 0); jessie.add(jeRarm);
        createBox(0.12, 0.2, 0.12, 0xFFFFFF, 0, -0.1, 0, jeRarm); createBox(0.14, 0.5, 0.14, 0x111111, 0, -0.45, 0, jeRarm);
        const jeHead = new THREE.Group(); jeHead.position.set(0, 1.95, 0); jessie.add(jeHead);
        createBox(0.4, 0.45, 0.4, COLORS.skin, 0, 0, 0, jeHead); createBox(0.05, 0.05, 0.05, 0x00FF00, -0.22, -0.1, 0, jeHead); createBox(0.05, 0.05, 0.05, 0x00FF00, 0.22, -0.1, 0, jeHead);
        
        createBox(0.14, 0.14, 0.02, 0xFFFFFF, -0.12, 0.05, 0.21, jeHead); 
        createBox(0.06, 0.06, 0.03, 0x111111, -0.09, 0.05, 0.215, jeHead); 
        createBox(0.14, 0.14, 0.02, 0xFFFFFF, 0.12, 0.05, 0.21, jeHead); 
        createBox(0.06, 0.06, 0.03, 0x111111, 0.09, 0.05, 0.215, jeHead); 

        createBox(0.08, 0.03, 0.02, 0xD32F2F, 0, -0.15, 0.21, jeHead);
        const jeHairC = 0xC71585; 
        createBox(0.15, 0.03, 0.03, jeHairC, -0.12, 0.14, 0.22, jeHead).rotation.z = -0.1;
        createBox(0.15, 0.03, 0.03, jeHairC, 0.12, 0.14, 0.22, jeHead).rotation.z = 0.1;

        const hairGroup = new THREE.Group(); hairGroup.name = 'Hair'; jeHead.add(hairGroup);
        createBox(0.5, 0.2, 0.5, jeHairC, 0, 0.3, 0, hairGroup); createBox(0.5, 0.15, 0.2, jeHairC, 0, 0.15, 0.2, hairGroup); createBox(0.4, 0.4, 0.6, jeHairC, 0, 0.1, -0.4, hairGroup); 
        const tail1 = createBox(0.35, 0.35, 0.8, jeHairC, 0, -0.2, -0.8, hairGroup); tail1.rotation.x = -0.3; 
        
        const meowth = new THREE.Group(); meowth.name='Meowth'; meowth.position.set(1.5, 0, 0); const mSkin = 0xF5F5DC; const mBrown = 0x8B4513; const mBlack = 0x111111;
        const mLlegGroup = new THREE.Group(); mLlegGroup.name='L_Leg'; mLlegGroup.position.set(-0.15, 0.35, 0); meowth.add(mLlegGroup); createBox(0.12, 0.3, 0.12, mSkin, 0, -0.15, 0, mLlegGroup); createBox(0.14, 0.05, 0.18, mBrown, 0, -0.3, 0.03, mLlegGroup);
        const mRlegGroup = new THREE.Group(); mRlegGroup.name='R_Leg'; mRlegGroup.position.set(0.15, 0.35, 0); meowth.add(mRlegGroup); createBox(0.12, 0.3, 0.12, mSkin, 0, -0.15, 0, mRlegGroup); createBox(0.14, 0.05, 0.18, mBrown, 0, -0.3, 0.03, mRlegGroup);
        createBox(0.4, 0.5, 0.3, mSkin, 0, 0.55, 0, meowth);
        const mLarmGroup = new THREE.Group(); mLarmGroup.name='L_Arm'; mLarmGroup.position.set(-0.25, 0.7, 0); meowth.add(mLarmGroup); createBox(0.1, 0.35, 0.1, mSkin, 0, -0.175, 0, mLarmGroup); createBox(0.12, 0.12, 0.12, mBrown, 0, -0.35, 0, mLarmGroup);
        const mRarmGroup = new THREE.Group(); mRarmGroup.name='R_Arm'; mRarmGroup.position.set(0.25, 0.7, 0); meowth.add(mRarmGroup); createBox(0.1, 0.35, 0.1, mSkin, 0, -0.175, 0, mRarmGroup); createBox(0.12, 0.12, 0.12, mBrown, 0, -0.35, 0, mRarmGroup);
        const mTail = new THREE.Group(); mTail.name='Tail'; mTail.position.set(0, 0.4, -0.15); meowth.add(mTail); createBox(0.08, 0.08, 0.6, mSkin, 0, 0, -0.3, mTail); createBox(0.12, 0.12, 0.2, mBrown, 0, 0.1, -0.6, mTail);
        const mHead = new THREE.Group(); mHead.position.set(0, 1.0, 0); meowth.add(mHead); 
        createBox(0.65, 0.5, 0.45, mSkin, 0, 0, 0, mHead); 
        createBox(0.25, 0.3, 0.05, 0xFFD700, 0, 0.35, 0.2, mHead);
        const earL = new THREE.Group(); earL.position.set(-0.2, 0.25, 0); mHead.add(earL); createBox(0.15, 0.2, 0.1, mSkin, 0, 0.1, 0, earL); createBox(0.1, 0.15, 0.05, mBrown, 0, 0.1, 0.05, earL);
        const earR = new THREE.Group(); earR.position.set(0.2, 0.25, 0); mHead.add(earR); createBox(0.15, 0.2, 0.1, mSkin, 0, 0.1, 0, earR); createBox(0.1, 0.15, 0.05, mBrown, 0, 0.1, 0.05, earR);
        createBox(0.18, 0.18, 0.02, 0xFFFFFF, -0.15, 0.05, 0.23, mHead); 
        createBox(0.05, 0.12, 0.03, mBlack, -0.15, 0.05, 0.24, mHead); 
        createBox(0.18, 0.18, 0.02, 0xFFFFFF, 0.15, 0.05, 0.23, mHead); 
        createBox(0.05, 0.12, 0.03, mBlack, 0.15, 0.05, 0.24, mHead); 
        createBox(0.35, 0.02, 0.02, mBlack, -0.4, 0, 0.1, mHead); createBox(0.35, 0.02, 0.02, mBlack, -0.4, -0.1, 0.1, mHead);
        createBox(0.35, 0.02, 0.02, mBlack, 0.4, 0, 0.1, mHead); createBox(0.35, 0.02, 0.02, mBlack, 0.4, -0.1, 0.1, mHead);
        createBox(0.2, 0.05, 0.02, mBlack, 0, -0.15, 0.23, mHead); createBox(0.05, 0.05, 0.03, 0xFFFFFF, -0.05, -0.15, 0.24, mHead); createBox(0.05, 0.05, 0.03, 0xFFFFFF, 0.05, -0.15, 0.24, mHead);

        group.add(james); group.add(jessie); group.add(meowth);
    } else if (type === 'boss2') { 
        // BAJUQI & NIDOKING
        const wrapper = new THREE.Group(); wrapper.name = 'BossWrapper';

        const bajuqi = new THREE.Group(); bajuqi.name = 'Bajuqi';
        bajuqi.position.set(1.2, 0, 0.5); 
        
        const black = COLORS.rocketBlack;
        const grey = COLORS.rocketGrey;
        const red = COLORS.rocketRed;
        const skin = COLORS.skin;
        const hair = 0x5D4037;

        const bLleg = new THREE.Group(); bLleg.name='L_Leg'; bLleg.position.set(-0.15, 0.75, 0); bajuqi.add(bLleg);
        createBox(0.18, 0.45, 0.2, black, 0, -0.2, 0, bLleg); 
        createBox(0.2, 0.35, 0.22, grey, 0, -0.6, 0.05, bLleg); 
        
        const bRleg = new THREE.Group(); bRleg.name='R_Leg'; bRleg.position.set(0.15, 0.75, 0); bajuqi.add(bRleg);
        createBox(0.18, 0.45, 0.2, black, 0, -0.2, 0, bRleg); 
        createBox(0.2, 0.35, 0.22, grey, 0, -0.6, 0.05, bRleg); 

        const bTorso = new THREE.Group(); bTorso.position.set(0, 1.15, 0); bajuqi.add(bTorso);
        createBox(0.5, 0.8, 0.3, black, 0, 0, 0, bTorso);
        createBox(0.52, 0.1, 0.32, grey, 0, -0.35, 0, bTorso);
        
        const rZ = 0.16;
        createBox(0.05, 0.3, 0.02, red, -0.08, 0.1, rZ, bTorso); 
        createBox(0.15, 0.05, 0.02, red, 0, 0.225, rZ, bTorso); 
        createBox(0.05, 0.12, 0.02, red, 0.08, 0.16, rZ, bTorso); 
        createBox(0.15, 0.05, 0.02, red, 0, 0.1, rZ, bTorso); 
        createBox(0.05, 0.15, 0.02, red, 0.08, -0.05, rZ, bTorso); 

        const bLarm = new THREE.Group(); bLarm.name='L_Arm'; bLarm.position.set(-0.35, 1.45, 0); bajuqi.add(bLarm);
        createBox(0.15, 0.25, 0.15, black, 0, -0.125, 0, bLarm); 
        createBox(0.14, 0.45, 0.14, grey, 0, -0.5, 0, bLarm); 
        createBox(0.15, 0.15, 0.15, grey, 0, -0.8, 0, bLarm); 

        const bRarm = new THREE.Group(); bRarm.name='R_Arm'; bRarm.position.set(0.35, 1.45, 0); bajuqi.add(bRarm);
        createBox(0.15, 0.25, 0.15, black, 0, -0.125, 0, bRarm); 
        createBox(0.14, 0.45, 0.14, grey, 0, -0.5, 0, bRarm); 
        createBox(0.15, 0.15, 0.15, grey, 0, -0.8, 0, bRarm); 

        const bHead = new THREE.Group(); bHead.name='Head'; bHead.position.set(0, 1.7, 0); bajuqi.add(bHead);
        createBox(0.35, 0.4, 0.4, skin, 0, 0, 0, bHead);
        createBox(0.37, 0.1, 0.42, hair, 0, 0.21, 0, bHead); 
        createBox(0.37, 0.3, 0.1, hair, 0, 0.1, -0.16, bHead);
        createVoxelEyes(bHead, 0.08, 0.05, 0.21, true); 
        createBox(0.1, 0.03, 0.02, 0x552222, 0, -0.12, 0.21, bHead); 

        wrapper.add(bajuqi);

        const nidoking = new THREE.Group(); nidoking.name = 'Nidoking';
        nidoking.position.set(-0.8, 0, 0); 
        const nPurple = COLORS.nidokingPurple;
        const nBelly = COLORS.nidokingBelly;
        const nTeal = COLORS.nidokingTeal;

        const nLleg = new THREE.Group(); nLleg.name='L_Leg'; nLleg.position.set(-0.6, 0.6, 0); nidoking.add(nLleg);
        createBox(0.5, 0.8, 0.6, nPurple, 0, 0, 0, nLleg); 
        createBox(0.15, 0.2, 0.4, 0xFFFFFF, -0.12, -0.5, 0.25, nLleg);
        createBox(0.15, 0.2, 0.4, 0xFFFFFF, 0.12, -0.5, 0.25, nLleg);

        const nRleg = new THREE.Group(); nRleg.name='R_Leg'; nRleg.position.set(0.6, 0.6, 0); nidoking.add(nRleg);
        createBox(0.5, 0.8, 0.6, nPurple, 0, 0, 0, nRleg);
        createBox(0.15, 0.2, 0.4, 0xFFFFFF, -0.12, -0.5, 0.25, nRleg);
        createBox(0.15, 0.2, 0.4, 0xFFFFFF, 0.12, -0.5, 0.25, nRleg);

        const nBody = new THREE.Group(); nBody.position.set(0, 1.3, 0); nidoking.add(nBody);
        createBox(1.4, 1.6, 1.0, nPurple, 0, 0, 0, nBody); 
        createBox(1.0, 1.2, 0.2, nBelly, 0, -0.1, 0.51, nBody); 
        createBox(0.2, 0.6, 0.2, 0xDDDDDD, 0, 0.5, -0.5, nBody).rotation.x = -0.5;
        createBox(0.2, 0.6, 0.2, 0xDDDDDD, 0, 0, -0.6, nBody).rotation.x = -0.8;
        createBox(0.2, 0.6, 0.2, 0xDDDDDD, 0, -0.5, -0.5, nBody).rotation.x = -1.0;

        const nTail = new THREE.Group(); nTail.name='Tail'; nTail.position.set(0, 0.6, -0.5); nidoking.add(nTail);
        createBox(0.6, 0.6, 1.5, nPurple, 0, 0, -0.5, nTail); 
        createBox(0.4, 0.4, 1.2, nPurple, 0, 0.2, -1.6, nTail); 
        createBox(0.3, 0.3, 0.8, nPurple, 0, 0.4, -2.4, nTail);

        const nLarm = new THREE.Group(); nLarm.name='L_Arm'; nLarm.position.set(-0.9, 1.8, 0); nidoking.add(nLarm);
        createBox(0.4, 0.8, 0.4, nPurple, 0, -0.2, 0, nLarm); 
        createBox(0.35, 0.6, 0.35, nPurple, 0, -0.8, 0.2, nLarm); 
        createBox(0.08, 0.2, 0.12, 0xFFFFFF, -0.08, -1.1, 0.3, nLarm); 
        createBox(0.08, 0.2, 0.12, 0xFFFFFF, 0.08, -1.1, 0.3, nLarm);

        const nRarm = new THREE.Group(); nRarm.name='R_Arm'; nRarm.position.set(0.9, 1.8, 0); nidoking.add(nRarm);
        createBox(0.4, 0.8, 0.4, nPurple, 0, -0.2, 0, nRarm);
        createBox(0.35, 0.6, 0.35, nPurple, 0, -0.8, 0.2, nRarm);
        createBox(0.08, 0.2, 0.12, 0xFFFFFF, -0.08, -1.1, 0.3, nRarm);
        createBox(0.08, 0.2, 0.12, 0xFFFFFF, 0.08, -1.1, 0.3, nRarm);

        const nHead = new THREE.Group(); nHead.name='Head'; nHead.position.set(0, 2.3, 0.2); nidoking.add(nHead);
        createBox(0.9, 0.9, 0.9, nPurple, 0, 0, 0, nHead);
        createBox(0.7, 0.4, 0.5, nPurple, 0, -0.2, 0.6, nHead);
        createBox(0.1, 0.15, 0.05, 0xFFFFFF, -0.2, -0.15, 0.86, nHead);
        createBox(0.1, 0.15, 0.05, 0xFFFFFF, 0.2, -0.15, 0.86, nHead);
        
        createBox(0.2, 0.8, 0.2, nPurple, 0, 0.6, 0.3, nHead).rotation.x = -0.3; 
        
        const nLear = new THREE.Group(); 
        nLear.position.set(-0.45, 0.4, 0); 
        nHead.add(nLear);
        createBox(0.25, 0.4, 0.15, nPurple, 0, 0.1, 0, nLear); 
        createBox(0.15, 0.25, 0.06, nTeal, 0, 0.1, 0.05, nLear); 
        nLear.rotation.z = 0.3; nLear.rotation.y = -0.2;

        const nRear = new THREE.Group(); 
        nRear.position.set(0.45, 0.4, 0);
        nHead.add(nRear);
        createBox(0.25, 0.4, 0.15, nPurple, 0, 0.1, 0, nRear);
        createBox(0.15, 0.25, 0.06, nTeal, 0, 0.1, 0.05, nRear);
        nRear.rotation.z = -0.3; nRear.rotation.y = 0.2;

        createBox(0.2, 0.15, 0.05, 0xFFFFFF, -0.25, 0.1, 0.46, nHead);
        createBox(0.08, 0.08, 0.06, 0x111111, -0.25, 0.1, 0.47, nHead);
        createBox(0.2, 0.15, 0.05, 0xFFFFFF, 0.25, 0.1, 0.46, nHead);
        createBox(0.08, 0.08, 0.06, 0x111111, 0.25, 0.1, 0.47, nHead);
        createBox(0.25, 0.05, 0.1, nPurple, -0.25, 0.2, 0.5, nHead).rotation.z = 0.2;
        createBox(0.25, 0.05, 0.1, nPurple, 0.25, 0.2, 0.5, nHead).rotation.z = -0.2;

        wrapper.add(nidoking);
        group.add(wrapper);

    } else if (type === 'boss3') { // MEWTWO
        const mewtwo = new THREE.Group(); mewtwo.name = 'Mewtwo'; const skin = COLORS.mewtwoSkin; const dark = COLORS.mewtwoDark; const eyeC = COLORS.mewtwoEye;
        const torso = new THREE.Group(); torso.position.set(0, 2.0, 0); mewtwo.add(torso); createBox(0.9, 0.7, 0.6, skin, 0, 0.8, 0, torso); createBox(0.7, 0.8, 0.5, dark, 0, 0.1, 0.1, torso); createBox(1.1, 0.6, 0.8, skin, 0, -0.5, 0, torso);
        const lLeg = new THREE.Group(); lLeg.name='L_Leg'; lLeg.position.set(-0.6, 1.5, 0); mewtwo.add(lLeg); createBox(0.5, 0.8, 0.6, skin, 0, -0.3, 0, lLeg); createBox(0.4, 0.8, 0.4, skin, 0, -1.0, -0.2, lLeg); createBox(0.4, 0.3, 0.7, skin, 0, -1.5, 0.2, lLeg); createBox(0.15, 0.15, 0.15, skin, -0.1, -1.5, 0.6, lLeg); createBox(0.15, 0.15, 0.15, skin, 0.1, -1.5, 0.6, lLeg);
        const rLeg = new THREE.Group(); rLeg.name='R_Leg'; rLeg.position.set(0.6, 1.5, 0); mewtwo.add(rLeg); createBox(0.5, 0.8, 0.6, skin, 0, -0.3, 0, rLeg); createBox(0.4, 0.8, 0.4, skin, 0, -1.0, -0.2, rLeg); createBox(0.4, 0.3, 0.7, skin, 0, -1.5, 0.2, rLeg); createBox(0.15, 0.15, 0.15, skin, -0.1, -1.5, 0.6, rLeg); createBox(0.15, 0.15, 0.15, skin, 0.1, -1.5, 0.6, rLeg);
        const tail = new THREE.Group(); tail.name='Tail'; tail.position.set(0, 1.8, -0.4); mewtwo.add(tail); createBox(0.5, 0.5, 1.5, dark, 0, -0.2, -0.5, tail); createBox(0.4, 0.4, 1.5, dark, 0, 0.5, -1.5, tail).rotation.x = -0.5; createBox(0.3, 0.3, 1.5, dark, 0, 1.5, -1.8, tail).rotation.x = -1.2; createBox(0.2, 0.2, 0.8, dark, 0, 2.2, -1.2, tail).rotation.x = -2.0;
        createBox(0.4, 0.4, 0.4, skin, -0.6, 3.0, 0, mewtwo); createBox(0.4, 0.4, 0.4, skin, 0.6, 3.0, 0, mewtwo);
        const lArm = new THREE.Group(); lArm.name='L_Arm'; lArm.position.set(-0.8, 3.0, 0); mewtwo.add(lArm); createBox(0.25, 0.7, 0.25, skin, 0, -0.3, 0, lArm); createBox(0.25, 0.7, 0.25, skin, 0, -0.9, 0.2, lArm).rotation.x = -0.3; const lHand = new THREE.Group(); lHand.position.set(0, -1.3, 0.4); lArm.add(lHand); createBox(0.2, 0.2, 0.2, skin, 0, 0, 0, lHand); createBox(0.1, 0.1, 0.1, skin, -0.1, -0.1, 0.1, lHand); createBox(0.1, 0.1, 0.1, skin, 0.1, -0.1, 0.1, lHand); createBox(0.1, 0.1, 0.1, skin, 0, -0.1, -0.1, lHand);
        const rArm = new THREE.Group(); rArm.name='R_Arm'; rArm.position.set(0.8, 3.0, 0); mewtwo.add(rArm); createBox(0.25, 0.7, 0.25, skin, 0, -0.3, 0, rArm); createBox(0.25, 0.7, 0.25, skin, 0, -0.9, 0.2, rArm).rotation.x = -0.3; const rHand = new THREE.Group(); rHand.position.set(0, -1.3, 0.4); rArm.add(rHand); createBox(0.2, 0.2, 0.2, skin, 0, 0, 0, rHand); createBox(0.1, 0.1, 0.1, skin, -0.1, -0.1, 0.1, rHand); createBox(0.1, 0.1, 0.1, skin, 0.1, -0.1, 0.1, rHand); createBox(0.1, 0.1, 0.1, skin, 0, -0.1, -0.1, rHand);
        const head = new THREE.Group(); head.name='Head'; head.position.set(0, 3.3, 0); mewtwo.add(head); createBox(0.6, 0.6, 0.7, skin, 0, 0, 0, head); createBox(0.3, 0.25, 0.3, skin, 0, -0.15, 0.45, head);
        const lEar = createBox(0.15, 0.4, 0.15, skin, -0.25, 0.4, -0.1, head); lEar.rotation.z = 0.3; lEar.rotation.x = -0.2; const rEar = createBox(0.15, 0.4, 0.15, skin, 0.25, 0.4, -0.1, head); rEar.rotation.z = -0.3; rEar.rotation.x = -0.2;
        const lEye = createBox(0.15, 0.1, 0.05, eyeC, -0.2, 0.05, 0.36, head); lEye.rotation.z = -0.2; (lEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeC); (lEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
        const rEye = createBox(0.15, 0.1, 0.05, eyeC, 0.2, 0.05, 0.36, head); rEye.rotation.z = 0.2; (rEye.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeC); (rEye.material as THREE.MeshStandardMaterial).emissiveIntensity = 2.0;
        createBox(0.15, 0.15, 0.6, skin, 0, 0.2, -0.5, head).rotation.x = -0.5;
        const auraGroup = new THREE.Group(); auraGroup.name='AuraRing'; auraGroup.position.set(0, 2.0, 0); mewtwo.add(auraGroup);
        for(let i=0; i<6; i++) { const angle = (i / 6) * Math.PI * 2; const block = createBox(0.2, 0.2, 0.2, eyeC, Math.cos(angle)*2.0, 0, Math.sin(angle)*2.0, auraGroup); (block.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(eyeC); }
        group.add(mewtwo);
    } else if (type === 'boss4') { // ARCEUS
        const arceus = new THREE.Group(); arceus.name = 'Arceus'; const white = COLORS.arceusWhite; const gold = COLORS.arceusGold; const grey = COLORS.arceusGrey; const green = COLORS.arceusGreen;
        const body = new THREE.Group(); body.position.set(0, 2.0, 0); arceus.add(body); createBox(1.2, 1.4, 2.2, white, 0, 0, 0, body); createBox(1.0, 1.2, 1.0, grey, 0, 0, 0.6, body); createBox(0.8, 1.6, 0.8, white, 0, 0.5, 1.0, body);
        const wheel = new THREE.Group(); wheel.name='Ring'; wheel.position.set(0, 2.2, 0); arceus.add(wheel); createBox(0.4, 0.4, 0.4, gold, 0, 0, 0, wheel); const arcRadius = 1.8;
        createBox(0.3, 0.8, 0.2, gold, 0, arcRadius, 0, wheel); createBox(0.15, 0.3, 0.15, green, 0, arcRadius, 0.1, wheel);
        createBox(0.3, 0.8, 0.2, gold, 0, -arcRadius, 0, wheel); createBox(0.15, 0.3, 0.15, green, 0, -arcRadius, 0.1, wheel);
        createBox(0.8, 0.3, 0.2, gold, -arcRadius, 0, 0, wheel); createBox(0.15, 0.15, 0.15, green, -arcRadius, 0, 0.1, wheel);
        createBox(0.8, 0.3, 0.2, gold, arcRadius, 0, 0, wheel); createBox(0.15, 0.15, 0.15, green, arcRadius, 0, 0.1, wheel);
        const arcThick = 0.2; const arcDepth = 0.15; createBox(0.3, 1.2, arcDepth, gold, 1.0, 1.2, 0, wheel).rotation.z = -0.7; createBox(0.3, 1.2, arcDepth, gold, -1.0, 1.2, 0, wheel).rotation.z = 0.7; createBox(0.3, 1.2, arcDepth, gold, 1.0, -1.2, 0, wheel).rotation.z = 0.7; createBox(0.3, 1.2, arcDepth, gold, -1.0, -1.2, 0, wheel).rotation.z = -0.7;
        const neckGroup = new THREE.Group(); neckGroup.position.set(0, 3.2, 1.0); arceus.add(neckGroup); createBox(0.5, 1.5, 0.6, white, 0, -0.5, 0, neckGroup); createBox(0.3, 1.2, 0.1, grey, 0, -0.6, 0.3, neckGroup);
        const head = new THREE.Group(); head.name='Head'; head.position.set(0, 0.5, 0.3); neckGroup.add(head); createBox(0.5, 0.6, 0.8, white, 0, 0, 0, head); createBox(0.4, 0.4, 0.5, grey, 0, -0.1, 0.6, head);
        createBox(0.15, 0.1, 0.05, green, -0.2, 0, 0.4, head); createBox(0.05, 0.05, 0.06, 0xFF0000, -0.2, 0, 0.41, head); createBox(0.15, 0.1, 0.05, green, 0.2, 0, 0.4, head); createBox(0.05, 0.05, 0.06, 0xFF0000, 0.2, 0, 0.41, head);
        const lEar = createBox(0.1, 0.4, 0.1, gold, -0.3, 0.3, -0.1, head); lEar.rotation.z = 0.3; lEar.rotation.x = -0.3; const rEar = createBox(0.1, 0.4, 0.1, gold, 0.3, 0.3, -0.1, head); rEar.rotation.z = -0.3; rEar.rotation.x = -0.3; createBox(0.2, 0.6, 0.8, white, 0, 0.4, -0.6, head).rotation.x = -0.3;
        const legW = 0.35; const legH = 1.2;
        const flLeg = new THREE.Group(); flLeg.name='L_Arm'; flLeg.position.set(-0.5, 1.8, 0.8); arceus.add(flLeg); createBox(legW, legH, legW, white, 0, -0.6, 0, flLeg); createBox(legW+0.05, 0.3, legW+0.05, gold, 0, -1.2, 0, flLeg);
        const frLeg = new THREE.Group(); frLeg.name='R_Arm'; frLeg.position.set(0.5, 1.8, 0.8); arceus.add(frLeg); createBox(legW, legH, legW, white, 0, -0.6, 0, frLeg); createBox(legW+0.05, 0.3, legW+0.05, gold, 0, -1.2, 0, frLeg);
        const blLeg = new THREE.Group(); blLeg.name='L_Leg'; blLeg.position.set(-0.5, 1.8, -0.8); arceus.add(blLeg); createBox(legW, legH, legW, white, 0, -0.6, 0, blLeg); createBox(legW+0.05, 0.3, legW+0.05, gold, 0, -1.2, 0, blLeg);
        const brLeg = new THREE.Group(); brLeg.name='R_Leg'; brLeg.position.set(0.5, 1.8, -0.8); arceus.add(brLeg); createBox(legW, legH, legW, white, 0, -0.6, 0, brLeg); createBox(legW+0.05, 0.3, legW+0.05, gold, 0, -1.2, 0, brLeg);
        const tail = new THREE.Group(); tail.name='Tail'; tail.position.set(0, 2.2, -1.1); arceus.add(tail); createBox(0.4, 0.4, 0.8, white, 0, 0, -0.4, tail); createBox(0.6, 0.4, 1.2, white, 0, 0.3, -1.0, tail).rotation.x = 0.3; createBox(0.8, 0.3, 1.5, white, 0, 0.6, -1.8, tail).rotation.x = 0.5;
        group.add(arceus);
    }
    castShadows(group); return group;
};
