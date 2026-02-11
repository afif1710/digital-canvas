import { CORRIDOR_START_Z, CORRIDOR_END_Z } from '@/data/projects';

const wallMat = { color: '#2a2725', roughness: 0.92, metalness: 0.05 };
const floorMat = { color: '#1a1a1a', roughness: 0.85, metalness: 0.05 };
const ceilingMat = { color: '#1e1c1a', roughness: 0.95, metalness: 0.02 };
const trimMat = { color: '#2e2a26', roughness: 0.6, metalness: 0.3 };

const LENGTH = Math.abs(CORRIDOR_END_Z - CORRIDOR_START_Z) + 16;
const CENTER_Z = (CORRIDOR_START_Z + CORRIDOR_END_Z) / 2;
const WALL_HEIGHT = 4.2;
const HALF_HEIGHT = WALL_HEIGHT / 2;
const WALL_X = 3.5;

export function Corridor() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, CENTER_Z]} receiveShadow>
        <planeGeometry args={[WALL_X * 2 + 1, LENGTH]} />
        <meshStandardMaterial {...floorMat} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-WALL_X, HALF_HEIGHT, CENTER_Z]}>
        <boxGeometry args={[0.15, WALL_HEIGHT, LENGTH]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>

      {/* Right wall */}
      <mesh position={[WALL_X, HALF_HEIGHT, CENTER_Z]}>
        <boxGeometry args={[0.15, WALL_HEIGHT, LENGTH]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, WALL_HEIGHT, CENTER_Z]}>
        <boxGeometry args={[WALL_X * 2 + 0.15, 0.12, LENGTH]} />
        <meshStandardMaterial {...ceilingMat} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, HALF_HEIGHT, CORRIDOR_END_Z - 2]}>
        <planeGeometry args={[WALL_X * 2, WALL_HEIGHT]} />
        <meshStandardMaterial color="#1a1816" roughness={0.95} />
      </mesh>

      {/* Baseboards */}
      <mesh position={[-WALL_X + 0.1, 0.06, CENTER_Z]}>
        <boxGeometry args={[0.05, 0.12, LENGTH]} />
        <meshStandardMaterial {...trimMat} />
      </mesh>
      <mesh position={[WALL_X - 0.1, 0.06, CENTER_Z]}>
        <boxGeometry args={[0.05, 0.12, LENGTH]} />
        <meshStandardMaterial {...trimMat} />
      </mesh>
    </group>
  );
}
