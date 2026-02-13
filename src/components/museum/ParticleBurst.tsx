import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMuseumStore } from '@/store/museumStore';
import * as THREE from 'three';

const COUNT = 60;
const LIFE = 0.9;

export function ParticleBurst() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const t0 = useRef(0);
  const alive = useRef(false);
  const pos0 = useRef(new THREE.Vector3());
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const vels = useMemo(
    () =>
      Array.from({ length: COUNT }, () =>
        new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          Math.random() * 2.5 + 0.5,
          (Math.random() - 0.5) * 4
        )
      ),
    []
  );

  useFrame((state) => {
    const burst = useMuseumStore.getState().particleBurstPosition;
    if (burst) {
      alive.current = true;
      t0.current = state.clock.elapsedTime;
      pos0.current.set(...burst);
      useMuseumStore.getState().clearParticleBurst();
    }

    if (!alive.current || !ref.current) return;

    const dt = state.clock.elapsedTime - t0.current;
    if (dt > LIFE) {
      alive.current = false;
      for (let i = 0; i < COUNT; i++) {
        dummy.position.set(0, -100, 0);
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
      return;
    }

    const progress = dt / LIFE;
    const s = 0.025 * (1 - progress * progress);

    for (let i = 0; i < COUNT; i++) {
      const v = vels[i];
      dummy.position.set(
        pos0.current.x + v.x * progress,
        pos0.current.y + v.y * progress - 3 * progress * progress,
        pos0.current.z + v.z * progress
      );
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#c4a265"
        emissive="#c4a265"
        emissiveIntensity={1}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
