import { useFrame, useThree } from '@react-three/fiber';
import { useMuseumStore } from '@/store/museumStore';
import { useRef } from 'react';
import * as THREE from 'three';

const ENTRANCE_POS = new THREE.Vector3(0, 1.6, 5);
const ENTRANCE_LOOK = new THREE.Vector3(0, 1.2, 0);
const CORRIDOR_LOOK = new THREE.Vector3(0, 1.4, -14);
const ARTWORK_POS = new THREE.Vector3(1.5, 1.6, -7);
const ARTWORK_LOOK = new THREE.Vector3(2.85, 1.6, -7);

const _corridorPos = new THREE.Vector3();

function getCorridorPos(progress: number): THREE.Vector3 {
  _corridorPos.set(0, 1.6, -1 + progress * -10);
  return _corridorPos;
}

export function CameraController() {
  const { camera } = useThree();
  const currentLook = useRef(ENTRANCE_LOOK.clone());
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const cameraState = useMuseumStore.getState().cameraState;
    const corridorProgress = useMuseumStore.getState().corridorProgress;
    const reducedMotion = useMuseumStore.getState().reducedMotion;

    const speed = reducedMotion ? 8 : 2.5;
    const factor = 1 - Math.exp(-speed * delta);

    if (cameraState === 'entrance') {
      targetPos.current.copy(ENTRANCE_POS);
      targetLook.current.copy(ENTRANCE_LOOK);
    } else if (cameraState === 'corridor') {
      targetPos.current.copy(getCorridorPos(corridorProgress));
      targetLook.current.copy(CORRIDOR_LOOK);
    } else {
      targetPos.current.copy(ARTWORK_POS);
      targetLook.current.copy(ARTWORK_LOOK);
    }

    camera.position.lerp(targetPos.current, factor);
    currentLook.current.lerp(targetLook.current, factor);
    camera.lookAt(currentLook.current);
  });

  return null;
}
