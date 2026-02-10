import { useEffect } from 'react';
import { CameraController } from './CameraController';
import { Lighting } from './Lighting';
import { EntranceHall } from './EntranceHall';
import { Corridor } from './Corridor';
import { ArtworkFrame } from './ArtworkFrame';
import { useMuseumStore } from '@/store/museumStore';

export default function MuseumScene() {
  const setIsLoaded = useMuseumStore((s) => s.setIsLoaded);

  useEffect(() => {
    // Small delay so loading screen is visible
    const t = setTimeout(() => setIsLoaded(true), 600);
    return () => clearTimeout(t);
  }, [setIsLoaded]);

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 10, 22]} />
      <CameraController />
      <Lighting />
      <EntranceHall />
      <Corridor />
      <ArtworkFrame />
    </>
  );
}
