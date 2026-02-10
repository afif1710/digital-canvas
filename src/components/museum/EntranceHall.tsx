import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export function EntranceHall() {
  const sculptureRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sculptureRef.current) {
      sculptureRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group>
      {/* Sculpture — brass torus knot centerpiece */}
      <mesh ref={sculptureRef} position={[0, 1.3, 0]} castShadow>
        <torusKnotGeometry args={[0.55, 0.18, 128, 32]} />
        <meshStandardMaterial
          color="#c4a265"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Left pillar */}
      <mesh position={[-2.2, 1.5, 1]} castShadow>
        <cylinderGeometry args={[0.25, 0.28, 3, 16]} />
        <meshStandardMaterial color="#2a2520" roughness={0.7} metalness={0.15} />
      </mesh>

      {/* Right pillar */}
      <mesh position={[2.2, 1.5, 1]} castShadow>
        <cylinderGeometry args={[0.25, 0.28, 3, 16]} />
        <meshStandardMaterial color="#2a2520" roughness={0.7} metalness={0.15} />
      </mesh>

      {/* Pillar bases */}
      <mesh position={[-2.2, 0.05, 1]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#1e1b18" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[2.2, 0.05, 1]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#1e1b18" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Contact shadow under sculpture */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={6}
        blur={2.5}
        far={3}
      />
    </group>
  );
}
