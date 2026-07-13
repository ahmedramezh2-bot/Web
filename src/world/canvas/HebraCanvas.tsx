'use client';

import { Canvas } from '@react-three/fiber';
import type { WebGLRenderer } from 'three';

import { CameraRigBridge } from '@camera/CameraRigBridge';
import { InteractionBridge } from '@interaction/InteractionBridge';
import { QUALITY_TIER_PROFILES } from '@quality/tiers';
import { useQualityStore } from '@state/qualityStore';

import { FrameMonitorBridge } from './FrameMonitorBridge';
import { WorldSystemsBridge } from './WorldSystemsBridge';
import { configureRenderer } from './renderer';

/**
 * The single persistent R3F Canvas.
 *
 * Per World Bible Part 3: "There is only ONE world. Never unload it,
 * never replace it." This component owns exactly that canvas and
 * nothing else — no scene content, no lighting, no materials, no
 * camera choreography. Those are later milestones. What exists here
 * is the proof that the renderer initializes correctly: color
 * management, tone mapping, and quality-tier-aware pixel ratio, with
 * nothing drawn into it yet.
 */
export function HebraCanvas() {
  const tier = useQualityStore((state) => state.tier);
  const tierProfile = QUALITY_TIER_PROFILES[tier ?? 'balanced'];

  return (
    <Canvas
      style={{ position: 'fixed', inset: 0 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        configureRenderer(gl as WebGLRenderer, tierProfile);
      }}
      dpr={[1, tierProfile.maxPixelRatio]}
    >
      <FrameMonitorBridge tierProfile={tierProfile} />
      <CameraRigBridge />
      <WorldSystemsBridge />
      <InteractionBridge />
    </Canvas>
  );
}
