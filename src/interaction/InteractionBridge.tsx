'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Raycaster, Vector2 } from 'three';

import { getEngine } from '@lib/engine';
import { useEngineStore } from '@state/engineStore';

import type { InteractionEngineHandle } from './interactionEngine';

/**
 * The raycasting side of interaction — casts from the pointer through
 * the rig-driven camera against exactly the interaction engine's
 * registered targets (never the whole scene: cast cost stays
 * proportional to interactive content, and three-mesh-bvh acceleration
 * is already installed on mesh raycast by the camera system).
 *
 * Listens on window: pointer events bubble up through the scroll-track
 * overlay, so no eventSource redirection is needed for engine-driven
 * casting.
 */

/** Casting every frame is waste when the pointer is still — cast only after movement, at most once per frame. */
export function InteractionBridge() {
  const engineReady = useEngineStore((state) => state.status === 'ready');
  const camera = useThree((state) => state.camera);

  const interaction = useMemo(() => {
    if (!engineReady) {
      return undefined;
    }
    const { registry } = getEngine();
    return registry.has('interaction')
      ? registry.get<InteractionEngineHandle>('interaction')
      : undefined;
  }, [engineReady]);

  const raycaster = useMemo(() => new Raycaster(), []);
  const pointerNdc = useRef(new Vector2());
  const pointerDirty = useRef(false);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      pointerNdc.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
      pointerDirty.current = true;
    };
    const onPointerUp = (event: PointerEvent): void => {
      // A primary-button click / tap on the hovered target is activation.
      if (event.button === 0) {
        interaction?.reportActivation();
      }
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [interaction]);

  useFrame(() => {
    if (!interaction || !pointerDirty.current) {
      return;
    }
    pointerDirty.current = false;

    const targets = interaction.targets();
    if (targets.length === 0) {
      interaction.reportHit(undefined);
      return;
    }

    raycaster.setFromCamera(pointerNdc.current, camera);
    let bestId: string | undefined;
    let bestDistance = Number.POSITIVE_INFINITY;
    let bestPriority = Number.NEGATIVE_INFINITY;

    for (const target of targets) {
      const hits = raycaster.intersectObject(target.object, true);
      const hit = hits[0];
      if (!hit) {
        continue;
      }
      if (
        target.priority > bestPriority ||
        (target.priority === bestPriority && hit.distance < bestDistance)
      ) {
        bestId = target.id;
        bestDistance = hit.distance;
        bestPriority = target.priority;
      }
    }

    interaction.reportHit(bestId);
  });

  return null;
}
