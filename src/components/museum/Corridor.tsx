import * as THREE from 'three';

const wallMaterial = { color: '#252220', roughness: 0.92, metalness: 0.05 };
const floorMaterial = { color: '#1a1a1a', roughness: 0.85, metalness: 0.05 };
const ceilingMaterial = { color: '#1e1c1a', roughness: 0.95, metalness: 0.02 };

export function Corridor() {
  return (
    <group>
      {/* Floor — extends through foyer and corridor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]} receiveShadow>
        <planeGeometry args={[20, 24]} />
        <meshStandardMaterial {...floorMaterial} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-3, 1.5, -8]}>
        <boxGeometry args={[0.15, 3, 14]} />
        <meshStandardMaterial {...wallMaterial} />
      </mesh>

      {/* Right wall */}
      <mesh position={[3, 1.5, -8]}>
        <boxGeometry args={[0.15, 3, 14]} />
        <meshStandardMaterial {...wallMaterial} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 3, -8]}>
        <boxGeometry args={[6.15, 0.12, 14]} />
        <meshStandardMaterial {...ceilingMaterial} />
      </mesh>

      {/* Back wall — end of corridor */}
      <mesh position={[0, 1.5, -15]} rotation={[0, 0, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#1a1816" roughness={0.95} />
      </mesh>

      {/* Subtle baseboard trim left */}
      <mesh position={[-2.9, 0.06, -8]}>
        <boxGeometry args={[0.05, 0.12, 14]} />
        <meshStandardMaterial color="#2e2a26" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Subtle baseboard trim right */}
      <mesh position={[2.9, 0.06, -8]}>
        <boxGeometry args={[0.05, 0.12, 14]} />
        <meshStandardMaterial color="#2e2a26" roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  );
}
