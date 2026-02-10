import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMuseumStore } from '@/store/museumStore';
import * as THREE from 'three';

const _scale = new THREE.Vector3();

export function ArtworkFrame() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const onOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const onOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const onClick = useCallback(() => {
    const { cameraState, zoomToArtwork } = useMuseumStore.getState();
    if (cameraState === 'corridor') {
      zoomToArtwork('project-01');
    }
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = hovered ? 1.04 : 1;
    _scale.setScalar(target);
    groupRef.current.scale.lerp(_scale, 0.08);
  });

  return (
    <group
      ref={groupRef}
      position={[2.85, 1.6, -7]}
      rotation={[0, -Math.PI / 2, 0]}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
    >
      {/* Outer frame — brushed brass */}
      <mesh castShadow>
        <boxGeometry args={[1.6, 1.2, 0.08]} />
        <meshStandardMaterial color="#8b7355" roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Inner bevel */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.48, 1.08, 0.04]} />
        <meshStandardMaterial color="#6b5a42" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Canvas / image placeholder */}
      <mesh position={[0, 0, 0.042]}>
        <planeGeometry args={[1.36, 0.96]} />
        <meshStandardMaterial color="#3a3530" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Plaque below frame */}
      <mesh position={[0, -0.78, 0.04]}>
        <boxGeometry args={[0.5, 0.12, 0.02]} />
        <meshStandardMaterial color="#c4a265" roughness={0.4} metalness={0.7} />
      </mesh>
    </group>
  );
}
