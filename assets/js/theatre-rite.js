/* ============================================================
   HEBRA × Theatre.js
   ------------------------------------------------------------
   Theatre.js is not part of what visitors download. It is the
   tuning instrument behind the curtain: open the site with
   ?edit in the URL and a live control panel appears, wired
   directly to the WebGL void scene's most cinematic knobs —
   the crystal's ignition flash and its drift into hero orbit.

   Nudge a slider, watch the crystal answer in real time. When
   a take feels right, Theatre's own panel (top-left, project
   menu → "Export") saves a state.json — drop it at
   assets/theatre/hebra-state.json and it becomes the new
   baked default the next time this module runs.

   Regular visitors never load any of this: main.js only calls
   initTheatreRite() when ?edit is present, so the ~2.8MB Studio
   bundle and the editor UI never reach a real visitor.
   ============================================================ */

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`HEBRA: failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function loadBakedState() {
  try {
    const res = await fetch('assets/theatre/hebra-state.json', { cache: 'no-store' });
    if (!res.ok) return undefined;
    return await res.json();
  } catch {
    return undefined;
  }
}

/**
 * @param {{ voidScene: import('./scene-void.js').VoidScene }} deps
 */
export async function initTheatreRite({ voidScene }) {
  // Studio needs `process.env` to exist — it's a bundler-oriented
  // build being loaded via a bare <script> tag, so we shim it.
  if (typeof window.process === 'undefined') {
    window.process = { env: { NODE_ENV: 'production' } };
  }

  const [state] = await Promise.all([
    loadBakedState(),
    loadScript('assets/js/vendor/theatre/core-and-studio.js'),
  ]);

  const Theatre = window.Theatre;
  if (!Theatre) {
    console.warn('HEBRA: Theatre.js did not load — the panel stays dark.');
    return null;
  }

  Theatre.init({ studio: true, persistenceKey: 'hebra:rite' });

  const project = Theatre.getProject('HEBRA', state ? { state } : undefined);
  const sheet = project.sheet('Loading Rite');

  const crystal = sheet.object('Crystal', {
    ignite: Theatre.types.number(voidScene.ignition.value, {
      range: [0, 1],
      nudgeMultiplier: 0.01,
      label: 'Ignition flash',
    }),
    heroShift: Theatre.types.number(voidScene.heroShift.value, {
      range: [0, 1],
      nudgeMultiplier: 0.01,
      label: 'Drift into hero orbit',
    }),
  });

  crystal.onValuesChange((values) => {
    voidScene.ignition.value = values.ignite;
    voidScene.heroShift.value = values.heroShift;
  });

  return { Theatre, project, sheet, crystal };
}
