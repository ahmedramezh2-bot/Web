/**
 * CameraRig — the conscious observer.
 *
 * The camera travels a hand-placed CatmullRom path through the world,
 * driven by scroll progress with heavy damping (movement through
 * space, never page-jumps). It is never still: breathing on two slow
 * sine pairs, and the visitor's presence leans the gaze with inertia.
 *
 * Theatre.js integration (Phase 2 = architecture only): a `Camera`
 * object on the Journey sheet exposes additive offsets — future
 * cinematic timelines direct the rig by animating these, never by
 * rewriting it.
 */

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { types } from '@theatre/core';
import { getJourneySheet } from '@/story/theatre';
import { ScrollSystem } from '@/systems/scroll/ScrollSystem';
import { PointerSystem } from '@/systems/input/PointerSystem';
import { getQuality } from '@/systems/performance/QualitySystem';
import { damp, clamp } from '@/utils/math';

/** Where the camera rides. Staged so every bend reveals a landmark. */
const PATH = new THREE.CatmullRomCurve3(
  [
    [0, 1.5, 30],     // the void — almost nothing, then the sky
    [2, 2.0, -12],    // dust thickens, first monuments as silhouettes
    [-9, 3.0, -58],   // the Witness Stones pass on the left
    [10, 4.0, -96],   // the Archive looms right; the ring appears
    [0, 2.0, -132],   // through the Sentinel Ring itself
    [-11, 1.0, -172], // descent toward the garden
    [-14, -2.0, -200],// among the crystals
    [-4, 1.0, -238],  // the corridor opens
    [0, 3.0, -268],   // facing the Heart
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  false,
  'centripetal',
);

/** What the camera contemplates, staged slightly ahead and aside. */
const GAZE = new THREE.CatmullRomCurve3(
  [
    [0, 2, -20],
    [-14, 6, -52],   // toward the Witness Stones
    [16, 8, -90],    // toward the Archive
    [0, 3, -132],    // the ring's void center
    [-16, -4, -198], // down into the garden
    [8, 6, -240],    // the Throne, passing
    [0, 4, -300],    // converging on the Heart
    [0, 4, -320],    // the Heart, dead centre — the promise held
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  false,
  'centripetal',
);

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const quality = getQuality();

  const state = useRef({
    progress: 0,
    lookX: 0,
    lookY: 0,
    fovOffset: 0,
    nudge: 0,
  });

  // Theatre's handle on the rig — additive, never authoritative.
  useEffect(() => {
    const obj = getJourneySheet().object('Camera', {
      progressNudge: types.number(0, { range: [-0.1, 0.1] }),
      gazeX: types.number(0, { range: [-1, 1] }),
      gazeY: types.number(0, { range: [-1, 1] }),
      fovOffset: types.number(0, { range: [-12, 12] }),
    });
    const unsub = obj.onValuesChange((v) => {
      state.current.nudge = v.progressNudge;
      state.current.fovOffset = v.fovOffset;
      // Theatre gaze adds on top of presence gaze.
      theatreGaze.current.set(v.gazeX, v.gazeY);
    });
    return () => {
      unsub();
      getJourneySheet().detachObject('Camera');
    };
  }, []);

  const theatreGaze = useRef(new THREE.Vector2(0, 0));
  const pos = useMemo(() => new THREE.Vector3(), []);
  const gaze = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const s = state.current;
    const dt = Math.min(delta, 1 / 20);

    // Scroll → path progress, heavily damped: physical travel.
    const target = clamp(ScrollSystem.current().progress + s.nudge, 0, 1);
    s.progress = damp(s.progress, target, 2.2, dt);

    // Presence → gaze lean, with its own slower inertia.
    const presence = PointerSystem.current();
    const leanScale = quality.finePointer ? 1 : 0.5;
    s.lookX = damp(s.lookX, presence.x * leanScale, 1.6, dt);
    s.lookY = damp(s.lookY, presence.y * leanScale, 1.6, dt);

    // Breathing: two incommensurate sine pairs — never a visible loop.
    const bx = Math.sin(t * 0.11) * 0.22 + Math.sin(t * 0.041) * 0.12;
    const by = Math.cos(t * 0.087) * 0.16 + Math.sin(t * 0.033) * 0.1;
    const bz = Math.sin(t * 0.071) * 0.1;

    PATH.getPointAt(s.progress, pos);
    camera.position.set(pos.x + bx, pos.y + by, pos.z + bz);

    GAZE.getPointAt(s.progress, gaze);
    gaze.x += (s.lookX + theatreGaze.current.x) * 6;
    gaze.y += -(s.lookY + theatreGaze.current.y) * 4;
    camera.up.copy(up);
    camera.lookAt(gaze);

    // A whisper of roll with lateral motion — handheld, not rigid.
    camera.rotation.z += s.lookX * -0.012 + Math.sin(t * 0.05) * 0.004;

    const fov = 42 + s.fovOffset + Math.sin(t * 0.05) * 0.4;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
