/**
 * App — composition root.
 *
 * Boots the systems exactly once, mounts the one continuous Stage,
 * and provides the DOM surface that chapters and interface layers
 * will inhabit in later phases. Deliberately empty of content:
 * Phase 1 is architecture.
 */

import { useEffect, useState } from 'react';
import { Stage } from '@/scenes/Stage';
import { ScrollSystem } from '@/systems/scroll/ScrollSystem';
import { PointerSystem } from '@/systems/input/PointerSystem';
import { getQuality } from '@/systems/performance/QualitySystem';
import { mountStudioIfInvited } from '@/story/theatre';
import { registerMotionLanguage } from '@/animations/motion';
import { chapterAt } from '@/story/chapters';
import { useExperience } from '@/state/experience';

function DevHud() {
  const [line, setLine] = useState('');
  const chapter = useExperience((s) => s.chapter);

  useEffect(() => {
    const quality = getQuality();
    const update = () => {
      const s = ScrollSystem.current();
      const p = PointerSystem.current();
      setLine(
        `HEBRA foundation online\n` +
          `quality   ${quality.tier} (dpr≤${quality.dprMax}, post:${quality.postProcessing ? 'on' : 'off'})\n` +
          `scroll    ${s.progress.toFixed(3)} @ ${s.velocity.toFixed(1)}\n` +
          `presence  ${p.mode} ${p.x.toFixed(2)}, ${p.y.toFixed(2)}\n` +
          `chapter   ${chapter.id} (${chapter.emotion})`,
      );
    };
    const id = setInterval(update, 250);
    return () => clearInterval(id);
  }, [chapter]);

  return <div className="dev-hud">{line}</div>;
}

export default function App() {
  const setChapter = useExperience((s) => s.setChapter);

  useEffect(() => {
    registerMotionLanguage();
    ScrollSystem.start();
    PointerSystem.start();
    void mountStudioIfInvited();

    // The chapter map is live from day one: scroll drives the story
    // pointer even before any scene exists to hear it.
    return ScrollSystem.subscribe((signal) => {
      const next = chapterAt(signal.progress);
      if (next.id !== useExperience.getState().chapter.id) setChapter(next);
    });
  }, [setChapter]);

  return (
    <>
      <Stage />
      <main className="surface" id="journey" aria-label="HEBRA">
        {/* The journey runway: scroll distance = travel distance
            through the world. Chapters' DOM counterparts mount here
            in later phases. */}
        <div style={{ height: '900vh' }} aria-hidden="true" />
      </main>
      {import.meta.env.DEV && <DevHud />}
    </>
  );
}
