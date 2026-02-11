import { useRef, useState, useCallback, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useMuseumStore } from '@/store/museumStore';
import { Project } from '@/data/projects';
import * as THREE from 'three';

const _scale = new THREE.Vector3();

interface ArtworkFrameProps {
  project: Project;
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
}

function FrameContent({ project, index, position, rotation }: ArtworkFrameProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const texture = useLoader(THREE.TextureLoader, project.heroImage);
  texture.colorSpace = THREE.SRGBColorSpace;

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
      zoomToArtwork(project.id, index);
    }
  }, [project.id, index]);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = hovered ? 1.04 : 1;
    _scale.setScalar(target);
    groupRef.current.scale.lerp(_scale, 0.08);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
    >
      {/* Outer frame — brushed brass */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 1.35, 0.08]} />
        <meshStandardMaterial color="#8b7355" roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Inner bevel */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.66, 1.21, 0.04]} />
        <meshStandardMaterial color="#6b5a42" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Canvas with texture */}
      <mesh position={[0, 0, 0.042]}>
        <planeGeometry args={[1.52, 1.07]} />
        <meshStandardMaterial map={texture} roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Plaque below frame */}
      <mesh position={[0, -0.86, 0.04]}>
        <boxGeometry args={[0.6, 0.12, 0.02]} />
        <meshStandardMaterial color="#c4a265" roughness={0.4} metalness={0.7} />
      </mesh>
    </group>
  );
}

export function ArtworkFrame(props: ArtworkFrameProps) {
  return (
    <Suspense
      fallback={
        <group position={props.position} rotation={props.rotation}>
          <mesh>
            <boxGeometry args={[1.8, 1.35, 0.08]} />
            <meshStandardMaterial color="#8b7355" roughness={0.35} metalness={0.7} />
          </mesh>
        </group>
      }
    >
      <FrameContent {...props} />
    </Suspense>
  );
}
