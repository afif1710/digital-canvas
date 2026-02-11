import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMuseumStore } from '@/store/museumStore';
import { PROJECTS, getAlcovePosition, getAlcoveProgress } from '@/data/projects';
import * as THREE from 'three';

function AlcoveLight({ index }: { index: number }) {
  const ref = useRef<THREE.PointLight>(null);
  const alcove = getAlcovePosition(index);
  const alcoveProgress = getAlcoveProgress(index);

  useFrame(() => {
    if (!ref.current) return;
    const { corridorProgress, cameraState, showcaseLighting } = useMuseumStore.getState();
    const proximity = cameraState === 'corridor'
      ? Math.max(0, 1 - Math.abs(corridorProgress - alcoveProgress) * 6)
      : 0.15;
    const base = showcaseLighting ? 1.8 : 0.7;
    ref.current.intensity = base * proximity + 0.1;
  });

  return (
    <pointLight
      ref={ref}
      position={[alcove.position[0] * 0.7, 3.5, alcove.z]}
      color="#f5e6d3"
      distance={8}
      decay={2}
      intensity={0.1}
    />
  );
}

export function Lighting() {
  return (
    <>
      {/* Hemisphere fill: warm sky, cool ground */}
      <hemisphereLight args={['#f5e6d3', '#1a1a2e', 0.4]} />

      {/* Key warm directional */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.7}
        color="#f5e6d3"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={80}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Cool rim / back lights */}
      <pointLight position={[-4, 5, -30]} intensity={0.3} color="#8ba4c4" />
      <pointLight position={[4, 5, -50]} intensity={0.2} color="#8ba4c4" />

      {/* Ambient base */}
      <ambientLight intensity={0.08} color="#e8e0d8" />

      {/* Per-alcove accent lights */}
      {PROJECTS.map((_, i) => (
        <AlcoveLight key={i} index={i} />
      ))}
    </>
  );
}
