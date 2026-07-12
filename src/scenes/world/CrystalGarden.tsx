/**
 * CrystalGarden — the living quarter of the dimension.
 *
 * A grown cluster of crystal spires, each breathing on its own phase
 * through the shared living-crystal material. Placement is grown, not
 * placed: positions follow a golden-angle spiral with noise-broken
 * radii, so the garden reads organic without a single random layout.
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import { getLivingCrystal } from '@/materials';

const SPIRES = 22;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

export function CrystalGarden() {
  const { geometry, transforms } = useMemo(() => {
    const geo = new THREE.ConeGeometry(1, 4, 6, 1);
    geo.translate(0, 2, 0); // grow from the ground plane

    const dummy = new THREE.Object3D();
    const list: THREE.Matrix4[] = [];
    for (let i = 0; i < SPIRES; i++) {
      const angle = i * GOLDEN;
      const radius = 2.5 * Math.sqrt(i + 1) + Math.sin(i * 7.3) * 1.2;
      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(i * 3.7) * 0.8,
        Math.sin(angle) * radius,
      );
      const h = 0.8 + Math.pow(Math.abs(Math.sin(i * 5.1)), 1.5) * 3.4;
      dummy.scale.set(0.5 + Math.abs(Math.sin(i * 2.9)) * 0.8, h, 0.5 + Math.abs(Math.cos(i * 4.3)) * 0.8);
      dummy.rotation.set(Math.sin(i * 1.7) * 0.16, angle, Math.cos(i * 2.3) * 0.16);
      dummy.updateMatrix();
      list.push(dummy.matrix.clone());
    }
    return { geometry: geo, transforms: list };
  }, []);

  return (
    <group position={[-16, -10, -196]} rotation-y={0.6}>
      <instancedMesh
        args={[geometry, getLivingCrystal(), SPIRES]}
        ref={(mesh) => {
          if (!mesh) return;
          transforms.forEach((m, i) => mesh.setMatrixAt(i, m));
          mesh.instanceMatrix.needsUpdate = true;
        }}
      />
      {/* the garden's own cold light, kept local by decay */}
      <pointLight position={[0, 6, 0]} intensity={90} distance={46} decay={2} color="#6f8bdf" />
    </group>
  );
}
