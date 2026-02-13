import { Suspense } from 'react';
import { ArtworkFrame } from './ArtworkFrame';
import { PROJECTS, getAlcovePosition } from '@/data/projects';

const wallMat = { color: '#2a2725', roughness: 0.92, metalness: 0.05 };
const floorMat = { color: '#1a1a1a', roughness: 0.85, metalness: 0.05 };

interface SideRoomProps {
  alcoveIndex: number; // 2 (alcove 3) or 5 (alcove 6)
  artworkIndices: number[]; // indices into PROJECTS for extra display
}

function Archway({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Left post */}
      <mesh position={[-0.6, 1.5, 0]}>
        <boxGeometry args={[0.12, 3, 0.15]} />
        <meshStandardMaterial color="#3a3228" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Right post */}
      <mesh position={[0.6, 1.5, 0]}>
        <boxGeometry args={[0.12, 3, 0.15]} />
        <meshStandardMaterial color="#3a3228" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Top arch */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[1.32, 0.15, 0.15]} />
        <meshStandardMaterial color="#c4a265" roughness={0.35} metalness={0.7} />
      </mesh>
      {/* Keystone */}
      <mesh position={[0, 3.3, 0.02]}>
        <boxGeometry args={[0.2, 0.2, 0.08]} />
        <meshStandardMaterial color="#c4a265" roughness={0.3} metalness={0.75} />
      </mesh>
    </group>
  );
}

export function SideRoom({ alcoveIndex, artworkIndices }: SideRoomProps) {
  const alcove = getAlcovePosition(alcoveIndex);
  const isRight = alcoveIndex % 2 === 0;
  const sideX = isRight ? 1 : -1;

  // Room extends out from the corridor wall
  const roomCenterX = sideX * 7;
  const roomZ = alcove.z;
  const roomWidth = 5;
  const roomDepth = 4;
  const roomHeight = 3.8;

  return (
    <group>
      {/* Archway at corridor wall */}
      <Archway
        position={[sideX * 3.5, 0, roomZ]}
        rotation={[0, isRight ? 0 : Math.PI, 0]}
      />

      {/* Room floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[roomCenterX, 0.01, roomZ]} receiveShadow>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial {...floorMat} />
      </mesh>

      {/* Back wall */}
      <mesh position={[roomCenterX + sideX * roomWidth / 2, roomHeight / 2, roomZ]}>
        <boxGeometry args={[0.12, roomHeight, roomDepth]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>

      {/* Side walls */}
      <mesh position={[roomCenterX, roomHeight / 2, roomZ + roomDepth / 2]}>
        <boxGeometry args={[roomWidth, roomHeight, 0.12]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      <mesh position={[roomCenterX, roomHeight / 2, roomZ - roomDepth / 2]}>
        <boxGeometry args={[roomWidth, roomHeight, 0.12]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[roomCenterX, roomHeight, roomZ]}>
        <boxGeometry args={[roomWidth, 0.1, roomDepth]} />
        <meshStandardMaterial color="#1e1c1a" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Room lighting */}
      <pointLight
        position={[roomCenterX, roomHeight - 0.3, roomZ]}
        color="#f5e6d3"
        intensity={0.5}
        distance={8}
        decay={2}
      />

      {/* Artworks on back wall */}
      {artworkIndices.map((projIdx, i) => {
        const project = PROJECTS[projIdx % PROJECTS.length];
        const spacing = roomDepth / (artworkIndices.length + 1);
        const artZ = roomZ - roomDepth / 2 + spacing * (i + 1);
        const backWallX = roomCenterX + sideX * (roomWidth / 2 - 0.1);
        return (
          <Suspense key={`side-${alcoveIndex}-${i}`} fallback={null}>
            <ArtworkFrame
              project={project}
              index={projIdx}
              position={[backWallX, 1.8, artZ]}
              rotation={[0, isRight ? -Math.PI / 2 : Math.PI / 2, 0]}
            />
          </Suspense>
        );
      })}

      {/* Extra artwork on far side wall */}
      {artworkIndices.length >= 2 && (
        <Suspense fallback={null}>
          <ArtworkFrame
            project={PROJECTS[(artworkIndices[0] + 3) % PROJECTS.length]}
            index={(artworkIndices[0] + 3) % PROJECTS.length}
            position={[roomCenterX, 1.8, roomZ + roomDepth / 2 - 0.1]}
            rotation={[0, Math.PI, 0]}
          />
        </Suspense>
      )}
    </group>
  );
}
