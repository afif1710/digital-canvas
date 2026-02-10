import { useMuseumStore } from '@/store/museumStore';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Lighting() {
  const alcoveLightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!alcoveLightRef.current) return;
    const { corridorProgress, cameraState } = useMuseumStore.getState();
    const proximity = cameraState === 'corridor'
      ? Math.max(0, 1 - Math.abs(corridorProgress - 0.6) * 3)
      : 0.2;
    alcoveLightRef.current.intensity = 0.5 + proximity * 3;
  });

  return (
    <>
      {/* Warm key light — gallery overhead */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={0.6}
        color="#f5e6d3"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Cool rim fill */}
      <pointLight position={[-3, 4, -2]} intensity={0.3} color="#b8c6db" />
      {/* Ambient fill */}
      <ambientLight intensity={0.08} color="#e8e0d8" />
      {/* Alcove accent light — intensifies on approach */}
      <pointLight
        ref={alcoveLightRef}
        position={[2, 2.5, -7]}
        color="#f5e6d3"
        distance={6}
        decay={2}
        intensity={0.5}
      />
    </>
  );
}
