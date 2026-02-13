import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraController } from './CameraController';
import { Lighting } from './Lighting';
import { EntranceHall } from './EntranceHall';
import { Corridor } from './Corridor';
import { ArtworkFrame } from './ArtworkFrame';
import { ParticleBurst } from './ParticleBurst';
import { SideRoom } from './SideRoom';
import { useMuseumStore } from '@/store/museumStore';
import { PROJECTS, getAlcovePosition } from '@/data/projects';

export default function MuseumScene() {
  const setIsLoaded = useMuseumStore((s) => s.setIsLoaded);
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.9;
  }, [gl]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 600);
    return () => clearTimeout(t);
  }, [setIsLoaded]);

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 14, 50]} />
      <CameraController />
      <Lighting />
      <EntranceHall />
      <Corridor />
      {PROJECTS.map((project, i) => {
        const alcove = getAlcovePosition(i);
        return (
          <ArtworkFrame
            key={project.id}
            project={project}
            index={i}
            position={alcove.position}
            rotation={alcove.rotation}
          />
        );
      })}
      <ParticleBurst />
      {/* Side rooms at alcoves 3 and 6 (indices 2 and 5) */}
      <SideRoom alcoveIndex={2} artworkIndices={[0, 4]} />
      <SideRoom alcoveIndex={5} artworkIndices={[3, 7]} />
    </>
  );
}
