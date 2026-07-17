'use client';

import { useEffect, useState } from 'react';

import { announce } from '@components/ui/accessibility';
import { sharedTicker } from '@lib/ticker';
import { useNavigationStore } from '@state/navigationStore';
import { sentenceAtProgress, type ScriptSentence } from '@story/script';

/**
 * The journey's written sentences — the only text inside the world.
 * Renders the active script sentence (story/script.ts, verbatim from
 * Part 1) centered in space, fading on the authored emerge/dissolve
 * curves; the 03:30 whisper renders softer and smaller than the
 * written sentences. Each appearance is announced politely to screen
 * readers — the same story on the parallel channel (UI Integration
 * Bible §10).
 *
 * Reads progress on the shared ticker rather than subscribing the
 * React tree to every progress change — the component re-renders only
 * when the active sentence actually changes.
 */
export function NarrativeSentences() {
  const [active, setActive] = useState<ScriptSentence | undefined>(undefined);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let current: ScriptSentence | undefined;
    const remove = sharedTicker.add(() => {
      const next = sentenceAtProgress(useNavigationStore.getState().progress);
      if (next?.id !== current?.id) {
        current = next;
        if (next) {
          setActive(next);
          setVisible(true);
          announce(next.text);
        } else {
          // Keep the last sentence mounted through its dissolve.
          setVisible(false);
        }
      }
    });
    return remove;
  }, []);

  if (!active) {
    return null;
  }

  const isWhisper = active.register === 'whisper';

  return (
    <div aria-hidden="true" className="hebra-sentence-stage">
      <p
        key={active.id}
        className={`hebra-sentence${isWhisper ? ' hebra-sentence-whisper' : ''}${
          visible ? ' hebra-sentence-visible' : ''
        }`}
      >
        {active.text}
      </p>
    </div>
  );
}
