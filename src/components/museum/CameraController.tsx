import { useFrame, useThree } from '@react-three/fiber';
import { useMuseumStore } from '@/store/museumStore';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { CORRIDOR_START_Z, CORRIDOR_END_Z, CAMERA_Y, getAlcovePosition, getAlcoveProgress } from '@/data/projects';

const ENTRANCE_POS = new THREE.Vector3(0, CAMERA_Y, 8);
const ENTRANCE_LOOK = new THREE.Vector3(0, 1.6, 0);

const MAX_YAW = (6 * Math.PI) / 180;
const MAX_PITCH = (4 * Math.PI) / 180;

const _corridorPos = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _finalLook = new THREE.Vector3();

const FIRST_ALCOVE_PROGRESS = getAlcoveProgress(0);

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getCorridorPos(progress: number): THREE.Vector3 {
  const z = CORRIDOR_START_Z + progress * (CORRIDOR_END_Z - CORRIDOR_START_Z);
  _corridorPos.set(0, CAMERA_Y, z);
  return _corridorPos;
}

export function CameraController() {
  const { camera } = useThree();
  const currentLook = useRef(ENTRANCE_LOOK.clone());
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const smoothTilt = useRef({ x: 0, y: 0 });
  const isTouchDevice = useRef(false);
  const tiltIntensity = useRef(0.7);

  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window;
    const v = getComputedStyle(document.documentElement).getPropertyValue('--camera-tilt-intensity');
    tiltIntensity.current = parseFloat(v) || 0.7;
  }, []);

  // Watch for CSS variable changes (HUD slider)
  useEffect(() => {
    const interval = setInterval(() => {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--camera-tilt-intensity');
      tiltIntensity.current = parseFloat(v) || 0.7;
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    const store = useMuseumStore.getState();
    const { cameraState, corridorProgress, reducedMotion, activeArtworkIndex, showCaseStudy, glideActive, glideStartTime, glideFrom, glideDuration } = store;
    let { glideTo } = store;

    // Handle auto-glide
    if (glideActive && cameraState === 'corridor') {
      if (glideTo < 0) glideTo = FIRST_ALCOVE_PROGRESS; // sentinel replacement
      const now = performance.now() / 1000;
      const elapsed = now - glideStartTime;
      const t = Math.min(1, elapsed / glideDuration);
      const eased = easeInOutCubic(t);
      const p = glideFrom + (glideTo - glideFrom) * eased;
      store.setCorridorProgress(p);

      // Sync scroll position (flag as programmatic so scroll handler doesn't kill glide)
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) {
        store.setProgrammaticScroll(true);
        window.scrollTo({ top: p * max, behavior: 'auto' });
        requestAnimationFrame(() => store.setProgrammaticScroll(false));
      }

      if (t >= 1) {
        store.stopGlide();
      }
    }

    const speed = reducedMotion ? 8 : (glideActive ? 10 : 2.5);
    const factor = 1 - Math.exp(-speed * delta);

    if (cameraState === 'entrance') {
      targetPos.current.copy(ENTRANCE_POS);
      targetLook.current.copy(ENTRANCE_LOOK);
    } else if (cameraState === 'corridor') {
      const cPos = getCorridorPos(corridorProgress);
      targetPos.current.copy(cPos);
      _lookTarget.set(0, CAMERA_Y - 0.2, cPos.z - 10);
      targetLook.current.copy(_lookTarget);
    } else {
      // Zoomed to artwork
      const alcove = getAlcovePosition(activeArtworkIndex);
      const isRight = activeArtworkIndex % 2 === 0;
      targetPos.current.set(isRight ? 1.2 : -1.2, CAMERA_Y, alcove.z);
      targetLook.current.set(alcove.position[0], alcove.position[1], alcove.z);
    }

    camera.position.lerp(targetPos.current, factor);
    currentLook.current.lerp(targetLook.current, factor);

    // Pointer tilt (desktop only, not in modal, not reduced motion)
    const enableTilt = !reducedMotion && !isTouchDevice.current && !showCaseStudy && cameraState === 'corridor' && !glideActive;
    if (enableTilt) {
      const intensity = tiltIntensity.current;
      const tX = state.pointer.y * MAX_PITCH * intensity;
      const tY = -state.pointer.x * MAX_YAW * intensity;
      smoothTilt.current.x += (tX - smoothTilt.current.x) * 0.04;
      smoothTilt.current.y += (tY - smoothTilt.current.y) * 0.04;
    } else {
      smoothTilt.current.x *= 0.92;
      smoothTilt.current.y *= 0.92;
    }

    _finalLook.copy(currentLook.current);
    _finalLook.x += smoothTilt.current.y * 3;
    _finalLook.y += smoothTilt.current.x * 2;
    camera.lookAt(_finalLook);
  });

  return null;
}
