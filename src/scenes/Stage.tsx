/**
 * Stage — the single continuous universe.
 *
 * One <Canvas>, mounted once, alive for the whole visit. Chapters
 * never own canvases; they mount scene graph inside this stage so
 * the world persists between story beats (Creative Bible: Motion —
 * "Never create isolated 3D scenes").
 *
 * Phase 1 renders the void itself: fog, depth, the post pipeline and
 * the Theatre sheet context — proven alive, awaiting chapters.
 */

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { SheetProvider } from '@theatre/r3f';
import { getJourneySheet } from '@/story/theatre';
import { getQuality } from '@/systems/performance/QualitySystem';
import { PALETTE } from '@/config/constants';
import { World } from '@/scenes/world/World';

function PostPipeline() {
  const quality = getQuality();
  if (!quality.postProcessing) return null;
  return (
    <EffectComposer multisampling={0}>
      {/* Neutral foundation settings: enough to prove the pipeline,
          calm enough to never read as an effect. Chapters retune
          these through Theatre tracks in later phases. */}
      <Bloom intensity={0.55} luminanceThreshold={0.52} luminanceSmoothing={0.35} mipmapBlur />
      <Vignette eskil={false} offset={0.26} darkness={0.68} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.16} />
    </EffectComposer>
  );
}

export function Stage() {
  const quality = getQuality();

  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        dpr={[1, quality.dprMax]}
        camera={{ fov: 42, near: 0.1, far: 200, position: [0, 0, 14] }}
        gl={{
          antialias: quality.tier === 'cinema',
          powerPreference: 'high-performance',
          alpha: false,
        }}
        frameloop={quality.reducedMotion ? 'demand' : 'always'}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(PALETTE.void, 1);
          scene.fog = null; // the World installs its own atmosphere
          // Measurement hook: renderer.info for perf audits, opt-in only.
          // autoReset off + manual reset lets one sample cover a whole
          // frame including every post-processing pass.
          if (new URLSearchParams(window.location.search).has('stats')) {
            gl.info.autoReset = false;
            (window as unknown as { __glSample: unknown }).__glSample = () =>
              new Promise((resolve) => {
                const FRAMES = 10;
                gl.info.reset();
                let n = 0;
                const step = () => {
                  if (++n < FRAMES) return requestAnimationFrame(step);
                  resolve({
                    callsPerFrame: Math.round(gl.info.render.calls / FRAMES),
                    trianglesPerFrame: Math.round(gl.info.render.triangles / FRAMES),
                    pointsPerFrame: Math.round(gl.info.render.points / FRAMES),
                    geometries: gl.info.memory.geometries,
                    textures: gl.info.memory.textures,
                    programs: gl.info.programs?.length ?? 0,
                  });
                };
                requestAnimationFrame(step);
              });
          }
        }}
      >
        <SheetProvider sheet={getJourneySheet()}>
          <World />
          <PostPipeline />
        </SheetProvider>
      </Canvas>
    </div>
  );
}
