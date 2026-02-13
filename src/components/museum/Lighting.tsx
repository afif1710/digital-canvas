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

/* Wall sconce: emissive sphere + small warm point light */
function WallSconce({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Sconce bracket */}
      <mesh>
        <boxGeometry args={[0.08, 0.12, 0.06]} />
        <meshStandardMaterial color="#6b5a42" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Emissive bulb */}
      <mesh position={[0, 0.1, 0.04]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#f5e0b8" emissive="#f5e0b8" emissiveIntensity={2} />
      </mesh>
      {/* Light */}
      <pointLight position={[0, 0.12, 0.06]} color="#f5e0b8" intensity={0.3} distance={4} decay={2} />
    </group>
  );
}

/* Simple bench */
function Bench({ position, rotation = [0, 0, 0] as [number, number, number] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.06, 0.4]} />
        <meshStandardMaterial color="#3a3228" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Legs */}
      {[[-0.5, 0.2, 0.15], [0.5, 0.2, 0.15], [-0.5, 0.2, -0.15], [0.5, 0.2, -0.15]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#2e2a26" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* Ceiling emissive panel */
function CeilingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.03, 0.3]} />
        <meshStandardMaterial color="#e8dfd5" emissive="#f5e6d3" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[0, -0.2, 0]} color="#f5e6d3" intensity={0.2} distance={6} decay={2} />
    </group>
  );
}

export function Lighting() {
  return (
    <>
      {/* Hemisphere fill: warm sky, cool ground */}
      <hemisphereLight args={['#f5e6d3', '#1a1a2e', 0.4]} />

      {/* Key warm directional — soft sunlight from top-left */}
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

      {/* Secondary warm directional from above — skylight feel */}
      <directionalLight
        position={[-2, 12, -20]}
        intensity={0.25}
        color="#f0e4d0"
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

      {/* Wall sconces between alcoves */}
      <WallSconce position={[-3.35, 2.5, -6]} />
      <WallSconce position={[3.35, 2.5, -13]} />
      <WallSconce position={[-3.35, 2.5, -24]} />
      <WallSconce position={[3.35, 2.5, -37]} />
      <WallSconce position={[-3.35, 2.5, -48]} />

      {/* Ceiling lights spaced along corridor */}
      <CeilingLight position={[0, 4.1, -5]} />
      <CeilingLight position={[0, 4.1, -17]} />
      <CeilingLight position={[0, 4.1, -29]} />
      <CeilingLight position={[0, 4.1, -41]} />
      <CeilingLight position={[0, 4.1, -53]} />

      {/* Benches along corridor */}
      <Bench position={[0, 0, -8]} />
      <Bench position={[0, 0, -20]} rotation={[0, Math.PI * 0.05, 0]} />
      <Bench position={[0, 0, -32]} />
      <Bench position={[0, 0, -44]} />
    </>
  );
}
