/**
 * World — the one persistent universe.
 *
 * Composition of every environmental system: sky, stars, dust,
 * monuments, the ring, the garden, the heart, and the energy that
 * connects them. Mounted once inside Stage; future chapters occupy
 * locations *within* this world — nothing here is ever unmounted.
 *
 * This component also owns the single material heartbeat: one
 * useFrame advances every living shader's clock.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Sky } from './Sky';
import { Starfield } from './Starfield';
import { CosmicDust } from './CosmicDust';
import { EnergyStream } from './EnergyStream';
import { Monuments } from './Monuments';
import { SentinelRing } from './SentinelRing';
import { CrystalGarden } from './CrystalGarden';
import { DistantHeart } from './DistantHeart';
import { CameraRig } from '@/systems/camera/CameraRig';
import { installWorldEnvironment } from '@/systems/environment/worldEnvironment';
import { tickMaterials } from '@/materials/registry';
import { AudioSystem } from '@/systems/audio/AudioSystem';
import { PALETTE } from '@/config/constants';

/** Streams of living information travelling between the landmarks. */
const STREAMS: [number, number, number][][] = [
  // Witness Stones → Archive → the ring's center
  [
    [-30, 12, -50],
    [-8, 20, -64],
    [34, 14, -78],
    [16, 10, -110],
    [0, 4, -132],
  ],
  // The Gate → the garden
  [
    [36, 16, -150],
    [10, 8, -170],
    [-14, -4, -194],
  ],
  // The garden → the Heart
  [
    [-14, -6, -200],
    [-6, 2, -250],
    [0, 4, -318],
  ],
];

function Atmosphere() {
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    // Exponential fog: distance becomes silhouette becomes mystery —
    // tuned so landmarks resolve while the far corridor stays unknown.
    scene.fog = new THREE.FogExp2(PALETTE.void, 0.005);
    installWorldEnvironment(gl, scene);
    // Spatial audio rides the same camera that travels the world.
    AudioSystem.prepareSpatial(() => ({
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    }));
    return () => {
      scene.fog = null;
    };
  }, [scene, gl, camera]);

  return (
    <>
      {/* The dark is never black-empty: a floor of ambient presence. */}
      <ambientLight intensity={0.28} color="#2a3050" />
      {/* Cold fill from above-left: the sky's own contribution. */}
      <hemisphereLight intensity={0.35} color="#39406b" groundColor="#05050a" />
    </>
  );
}

/** Light reveals objects: a soft lantern riding just above the camera,
    letting nearby surfaces resolve while distance stays silhouette. */
function TravelerLight() {
  const camera = useThree((s) => s.camera);
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    light.current?.position.set(
      camera.position.x + 2,
      camera.position.y + 4,
      camera.position.z + 2,
    );
  });
  return <pointLight ref={light} intensity={140} distance={60} decay={2} color="#8d9ac4" />;
}

function Heartbeat() {
  useFrame(({ clock }) => tickMaterials(clock.getElapsedTime()));
  return null;
}

export function World() {
  return (
    <group>
      <Heartbeat />
      <Atmosphere />
      <CameraRig />
      <TravelerLight />

      <Sky />
      <Starfield />
      <CosmicDust />

      <Monuments />
      <SentinelRing />
      <CrystalGarden />
      <DistantHeart />

      {STREAMS.map((points, i) => (
        <EnergyStream key={i} points={points} speed={0.014 + i * 0.004} />
      ))}
    </group>
  );
}
