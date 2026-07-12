/**
 * SentinelRing — the colossal broken ring the journey passes through.
 *
 * A three-quarter torus of liquid metal, tilted with the weight of
 * ages, turning so slowly the motion is felt rather than seen. Where
 * the ring broke, a field of obsidian shards hangs frozen mid-drift —
 * one InstancedMesh, every shard unique through per-instance transform.
 */

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getLiquidMetal, getVeinedObsidian } from '@/materials';

const SHARDS = 90;

export function SentinelRing() {
  const ring = useRef<THREE.Group>(null);

  const shards = useMemo(() => {
    const dummy = new THREE.Object3D();
    const transforms: THREE.Matrix4[] = [];
    for (let i = 0; i < SHARDS; i++) {
      // Shards cluster around the missing quarter of the ring.
      const angle = -0.4 + Math.random() * 1.6; // the broken arc
      const radius = 30 + (Math.random() * 2 - 1) * 6;
      dummy.position.set(
        Math.cos(angle) * radius + (Math.random() * 2 - 1) * 4,
        Math.sin(angle) * radius + (Math.random() * 2 - 1) * 4,
        (Math.random() * 2 - 1) * 5,
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      const s = 0.4 + Math.pow(Math.random(), 2) * 2.6;
      dummy.scale.set(s, s * (0.5 + Math.random()), s * 0.6);
      dummy.updateMatrix();
      transforms.push(dummy.matrix.clone());
    }
    return transforms;
  }, []);

  const shardGeometry = useMemo(() => new THREE.TetrahedronGeometry(1, 0), []);

  useFrame((_, delta) => {
    if (ring.current) {
      // One revolution in ~20 minutes: confidence, not display.
      ring.current.rotation.z += delta * 0.005;
    }
  });

  return (
    <group position={[0, 2, -132]} rotation={[0.32, 0.15, 0.1]}>
      <group ref={ring}>
        <mesh material={getLiquidMetal()}>
          {/* three-quarter arc: the missing quarter is its history */}
          <torusGeometry args={[30, 2.6, 24, 120, Math.PI * 1.55]} />
        </mesh>
        <instancedMesh
          args={[shardGeometry, getVeinedObsidian(), SHARDS]}
          ref={(mesh) => {
            if (!mesh) return;
            shards.forEach((m, i) => mesh.setMatrixAt(i, m));
            mesh.instanceMatrix.needsUpdate = true;
          }}
        />
      </group>
    </group>
  );
}
