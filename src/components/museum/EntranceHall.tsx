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
    <group position={[0, 0, 4]}>
      {/* Sculpture — brass torus knot, scaled up */}
      <mesh ref={sculptureRef} position={[0, 1.8, 0]} castShadow>
        <torusKnotGeometry args={[0.7, 0.22, 128, 32]} />
        <meshStandardMaterial color="#c4a265" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Left pillar */}
      <mesh position={[-2.8, 2.1, 1.5]} castShadow>
        <cylinderGeometry args={[0.3, 0.33, 4.2, 16]} />
        <meshStandardMaterial color="#2a2520" roughness={0.7} metalness={0.15} />
      </mesh>

      {/* Right pillar */}
      <mesh position={[2.8, 2.1, 1.5]} castShadow>
        <cylinderGeometry args={[0.3, 0.33, 4.2, 16]} />
        <meshStandardMaterial color="#2a2520" roughness={0.7} metalness={0.15} />
      </mesh>

      {/* Pillar bases */}
      <mesh position={[-2.8, 0.05, 1.5]}>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 16]} />
        <meshStandardMaterial color="#1e1b18" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[2.8, 0.05, 1.5]}>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 16]} />
        <meshStandardMaterial color="#1e1b18" roughness={0.8} metalness={0.1} />
      </mesh>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={8} blur={2.5} far={4} />
    </group>
  );
}
