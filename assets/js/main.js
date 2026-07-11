/* ============================================================
   HEBRA — Orchestration
   The rite of entry, the scroll, and every deliberate motion.
   ============================================================ */

import { VoidScene } from './scene-void.js';
import { MindScene } from './scene-mind.js';
import { EyeScene } from './scene-eye.js';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const lowPower = !finePointer || window.innerWidth < 768;
const editMode = new URLSearchParams(window.location.search).has('edit');

// sessionStorage can throw (private modes, file://) — never let it take the site down
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* darkness forgets */ } },
};
const revisiting = store.get('hebra-entered') === '1';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------
   Smooth scroll — Lenis driving GSAP's ticker
   ------------------------------------------------------------ */
let lenis = null;
if (!prefersReducedMotion && typeof window.Lenis === 'function') {
  lenis = new window.Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

const scrollTo = (target) => {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
  else {
    const el = typeof target === 'string' ? $(target) : target;
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }
};

/* ------------------------------------------------------------
   The Void — shared WebGL stage
   ------------------------------------------------------------ */
const stageCanvas = $('#gl-stage');
let voidScene = null;
try {
  voidScene = new VoidScene(stageCanvas, { lowPower, still: prefersReducedMotion });
  if (!prefersReducedMotion) voidScene.start();
} catch (err) {
  document.documentElement.classList.add('no-gl');
  console.warn('HEBRA: WebGL unavailable, the void stays still.', err);
}

if (voidScene) {
  window.addEventListener('pointermove', (e) => {
    voidScene.setMouse(
      (e.clientX / window.innerWidth) * 2 - 1,
      (e.clientY / window.innerHeight) * 2 - 1
    );
  }, { passive: true });

  const onScroll = (y, vel) => {
    voidScene.setScroll(y, vel);
    voidScene.scrollFade.value = Math.min(1, y / (window.innerHeight * 1.15));
  };
  if (lenis) lenis.on('scroll', (e) => onScroll(e.scroll, e.velocity * 100));
  else window.addEventListener('scroll', () => onScroll(window.scrollY, 0), { passive: true });
}

/* ------------------------------------------------------------
   The Rite of Entry — loading sequence
   ------------------------------------------------------------ */
const preloader = $('#preloader');
const counterEl = $('#preloader-counter');
const whisperEl = $('#preloader-whisper');
const whisperLine = $('.preloader__whisper-line', preloader);
const beam = $('#preloader-beam');
const skipBtn = $('#preloader-skip');

const THIN = ' ';
const formatCount = (n) =>
  String(Math.round(n)).padStart(3, '0').split('').join(THIN);

let riteFinished = false;

function finishRite(instant = false) {
  if (riteFinished) return;
  riteFinished = true;
  store.set('hebra-entered', '1');

  const done = () => {
    document.body.dataset.loading = 'false';
    preloader.classList.add('is-done');
    preloader.setAttribute('aria-hidden', 'true');
    stageCanvas.classList.remove('is-front');
    heroIntro(instant);
  };

  if (instant || prefersReducedMotion || !voidScene) {
    if (voidScene) {
      voidScene.progress.value = 1;
      voidScene.heroShift.value = 1;
      if (prefersReducedMotion) voidScene.renderOnce();
    }
    counterEl.textContent = formatCount(100);
    done();
    return;
  }

  const tl = gsap.timeline();
  // the signal — a flash inside the crystal, then a beam of light
  tl.to(voidScene.ignition, { value: 1, duration: 0.45, ease: 'power2.in' })
    .to(whisperEl, { opacity: 0, duration: 0.4 }, '<')
    .set(beam, { opacity: 1 })
    .fromTo(beam, { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: 'power3.inOut' })
    .to(voidScene.ignition, { value: 0.12, duration: 1.4, ease: 'power2.out' }, '-=0.2')
    .to(beam, { scaleX: 60, opacity: 0, duration: 0.9, ease: 'power2.in' }, '-=1.2')
    .to(voidScene.heroShift, { value: 1, duration: 1.8, ease: 'power3.inOut' }, '-=0.9')
    .add(done, '-=1.55');
}

function runRite() {
  if (prefersReducedMotion) {
    finishRite(true);
    return;
  }

  const loaded = Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((res) => {
      if (document.readyState === 'complete') res();
      else window.addEventListener('load', res, { once: true });
    }),
  ]);

  const crawlDur = revisiting ? 1.1 : 3.1;
  const count = { value: 0 };

  gsap.fromTo(whisperLine,
    { opacity: 0, filter: 'blur(6px)' },
    { opacity: 1, filter: 'blur(0px)', duration: revisiting ? 0.6 : 1.6, ease: 'power2.out', delay: 0.25 });

  if (!revisiting) {
    // the second whisper — the signal arrives
    gsap.delayedCall(crawlDur * 0.68, () => {
      if (riteFinished) return;
      gsap.timeline()
        .to(whisperLine, { opacity: 0, filter: 'blur(6px)', duration: 0.5, ease: 'power2.in' })
        .add(() => { whisperLine.textContent = 'Then — a signal.'; })
        .to(whisperLine, { opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' });
    });
  }

  const crawl = gsap.to(count, {
    value: 90,
    duration: crawlDur,
    ease: 'power1.inOut',
    onUpdate: () => {
      counterEl.textContent = formatCount(count.value);
      if (voidScene) voidScene.progress.value = count.value / 100;
    },
  });

  loaded.then(() => {
    crawl.then(() => {
      gsap.to(count, {
        value: 100,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          counterEl.textContent = formatCount(count.value);
          if (voidScene) voidScene.progress.value = count.value / 100;
        },
        onComplete: () => finishRite(false),
      });
    });
  });

  // never hold a visitor hostage — hard cap on the rite
  gsap.delayedCall(9, () => finishRite(false));
}

skipBtn.addEventListener('click', () => finishRite(true));

/* ------------------------------------------------------------
   Hero intro — after the veil lifts
   ------------------------------------------------------------ */
const heroLetters = $$('.origin__title-line b');
const heroSub = $('.origin__sub');
const heroWhisper = $('.origin__whisper');
const heroEmblem = $('#origin-emblem');
const heroFoot = $('.origin__foot');

if (!prefersReducedMotion) {
  gsap.set(heroLetters, { yPercent: 60, opacity: 0 });
  gsap.set([heroSub, heroWhisper, heroFoot], { opacity: 0, y: 18 });
  gsap.set(heroEmblem, { opacity: 0, scale: 0.94 });
}

function heroIntro(instant) {
  if (prefersReducedMotion || instant) {
    gsap.set([heroLetters, heroSub, heroWhisper, heroFoot], { clearProps: 'all' });
    gsap.set(heroEmblem, { clearProps: 'all' });
    return;
  }
  gsap.timeline({ delay: 0.15 })
    .to(heroEmblem, { opacity: 1, scale: 1, duration: 2.2, ease: 'power3.out' })
    .to(heroLetters, {
      yPercent: 0, opacity: 1,
      duration: 1.4, ease: 'power4.out', stagger: 0.07,
    }, '-=1.9')
    .to(heroSub, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.8')
    .to(heroWhisper, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.85')
    .to(heroFoot, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.9');
}

/* ------------------------------------------------------------
   Header — progress hairline, live section label, scrim
   ------------------------------------------------------------ */
const header = $('#header');
const progressBar = $('#scroll-progress');
const sectionLabel = $('#header-section-label');

gsap.to(progressBar, {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
});

ScrollTrigger.create({
  start: 80,
  onUpdate: (self) => header.classList.toggle('is-scrolled', self.scroll() > 80),
});

$$('.section[data-section-label]').forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 45%',
    end: 'bottom 45%',
    onEnter: () => (sectionLabel.textContent = section.dataset.sectionLabel),
    onEnterBack: () => (sectionLabel.textContent = section.dataset.sectionLabel),
  });
});

/* ------------------------------------------------------------
   Fullscreen menu
   ------------------------------------------------------------ */
const menu = $('#menu');
const menuBtn = $('#menu-btn');
const menuLabel = $('.header__menu-label', menuBtn);
let menuOpen = false;

function setMenu(open) {
  menuOpen = open;
  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  menuBtn.setAttribute('aria-expanded', String(open));
  menuLabel.textContent = open ? menuLabel.dataset.closeLabel : menuLabel.dataset.openLabel;
  if (lenis) open ? lenis.stop() : lenis.start();
}

menuBtn.addEventListener('click', () => setMenu(!menuOpen));
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) { setMenu(false); menuBtn.focus(); }
});

$$('.menu__link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    setMenu(false);
    scrollTo(link.getAttribute('href'));
  });
});

// generic in-page anchors ride the smooth scroll too
$$('a[href^="#"]:not(.menu__link)').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = link.getAttribute('href');
    const el = target.length > 1 && $(target);
    if (el) {
      e.preventDefault();
      scrollTo(target);
      // keep keyboard users' focus in step with the scroll (skip link etc.)
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  });
});

/* ------------------------------------------------------------
   Scroll reveals — every element arrives with intention
   ------------------------------------------------------------ */
function reveal(targets, options = {}) {
  const els = typeof targets === 'string' ? $$(targets) : targets;
  if (!els.length) return;
  if (prefersReducedMotion) return;
  els.forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: options.y ?? 44 },
      {
        opacity: 1, y: 0,
        duration: options.duration ?? 1.3,
        ease: 'power3.out',
        delay: (options.stagger ?? 0) * (i % (options.staggerWrap ?? 100)),
        scrollTrigger: {
          trigger: options.trigger ?? el,
          start: options.start ?? 'top 86%',
          once: true,
        },
      });
  });
}

$$('.section').forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    onEnter: () => section.classList.add('is-inview'),
    once: true,
  });
});

reveal('.section-head', { y: 26 });
reveal($$('.manifesto__line'), { trigger: '.manifesto__body', stagger: 0.28, y: 54, duration: 1.6 });
reveal('.manifesto__statement', { y: 40 });
reveal($$('.flagship'), { trigger: '.craft__flagships', stagger: 0.14 });
reveal($$('.catalog__row'), { y: 26, duration: 0.9 });
reveal(['.mind__stage'], { y: 50 });
reveal(['.mind__copy'], { y: 50 });
reveal(['.witness__slit'], { y: 60, duration: 1.6 });
reveal(['.witness__copy'], { y: 40 });
reveal($$('.works__row'), { y: 30, duration: 1 });
reveal(['.works__note'], { y: 20 });
reveal($$('.ritual__step'), { trigger: '.ritual__steps', stagger: 0.12 });
reveal($$('.tier'), { trigger: '.threshold__tiers', stagger: 0.15 });
reveal(['.threshold__note'], { y: 24 });
reveal(['.gateway__emblem', '.gateway__line', '.gateway__hint'], {
  trigger: '.gateway', stagger: 0.22, y: 30, duration: 1.6,
});
reveal(['.transmission__lede', '.transmission__cta', '.transmission__mail'], {
  trigger: '.transmission__body', stagger: 0.16, y: 36,
});

/* ------------------------------------------------------------
   The Question — the answer arrives like a verdict
   ------------------------------------------------------------ */
if (!prefersReducedMotion && $('.question__answer')) {
  reveal(['.question__pre', '.question__ask'], { trigger: '.question__stage', stagger: 0.2, y: 30 });
  gsap.fromTo('.question__answer',
    { scale: 2.4, opacity: 0, filter: 'blur(28px)' },
    {
      scale: 1, opacity: 1, filter: 'blur(0px)',
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.question__answer',
        start: 'top 95%',
        end: 'top 40%',
        scrub: 0.5,
      },
    });
  reveal($$('.question__because p'), { trigger: '.question__because', stagger: 0.18, y: 26 });
}

/* ------------------------------------------------------------
   Catalog — the index of disciplines
   ------------------------------------------------------------ */
$$('.catalog__row').forEach((row) => {
  const head = $('.catalog__head', row);
  head.addEventListener('click', () => {
    const isOpen = row.classList.contains('is-open');
    $$('.catalog__row.is-open').forEach((other) => {
      other.classList.remove('is-open');
      $('.catalog__head', other).setAttribute('aria-expanded', 'false');
    });
    row.classList.toggle('is-open', !isOpen);
    head.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* ------------------------------------------------------------
   Flagship cards — pointer-lit glass
   ------------------------------------------------------------ */
if (finePointer && !prefersReducedMotion) {
  $$('.flagship').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.7, ease: 'power3.out' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.7, ease: 'power3.out' });
    gsap.set(card, { transformPerspective: 900 });

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      rx((0.5 - py) * 4);
      ry((px - 0.5) * 4);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* ------------------------------------------------------------
   Animated loops — play only while watched, drift with the page
   ------------------------------------------------------------ */
const loopVideos = $$('video[data-loop]');
if (loopVideos.length && !prefersReducedMotion) {
  const vio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const v = entry.target;
      v.dataset.inview = entry.isIntersecting ? '1' : '';
      if (entry.isIntersecting && !document.hidden) v.play().catch(() => {});
      else v.pause();
    });
  }, { rootMargin: '120px' });
  loopVideos.forEach((v) => vio.observe(v));
}

// the figure of dust sinks slowly as the manifesto is read
const manifestoFigure = $('.manifesto__figure');
if (manifestoFigure && !prefersReducedMotion) {
  const restOpacity = parseFloat(getComputedStyle(manifestoFigure).opacity) || 0.55;
  gsap.fromTo(manifestoFigure,
    { yPercent: 8, opacity: 0 },
    {
      yPercent: -10, opacity: restOpacity,
      ease: 'none',
      scrollTrigger: { trigger: '#manifesto', start: 'top 85%', end: 'bottom 20%', scrub: 0.6 },
    });
}

/* ------------------------------------------------------------
   The Mind — contour presence, awake only when watched
   ------------------------------------------------------------ */
const mindCanvas = $('#gl-mind');
let mindScene = null;
let mindVisible = false;
if (mindCanvas && !prefersReducedMotion) {
  try {
    mindScene = new MindScene(mindCanvas, { lowPower });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!mindScene) return;
        mindVisible = entry.isIntersecting;
        mindVisible ? mindScene.start() : mindScene.stop();
      });
    }, { rootMargin: '80px' });
    io.observe(mindCanvas);

    const mindVideo = $('#mind-video');
    $('#mind').addEventListener('pointermove', (e) => {
      const r = mindCanvas.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      mindScene.setMouse(nx, ny);
      // the footage beneath leans with the same hand, a touch behind the form
      if (mindVideo && finePointer) {
        mindVideo.style.transform = `perspective(700px) rotateY(${nx * 4}deg) rotateX(${-ny * 3}deg) scale(1.04)`;
      }
    }, { passive: true });
  } catch (err) {
    console.warn('HEBRA: the mind rests.', err);
  }
}

/* ------------------------------------------------------------
   The Witness — the eye that watches back
   ------------------------------------------------------------ */
const eyeCanvas = $('#gl-eye');
let eyeScene = null;
let eyeVisible = false;
if (eyeCanvas && !prefersReducedMotion) {
  try {
    eyeScene = new EyeScene(eyeCanvas, { lowPower });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!eyeScene) return;
        eyeVisible = entry.isIntersecting;
        eyeVisible ? eyeScene.start() : eyeScene.stop();
      });
    }, { rootMargin: '120px' });
    io.observe(eyeCanvas);

    // the eye tracks the hand anywhere on the page while it is awake
    window.addEventListener('pointermove', (e) => {
      if (!eyeVisible) return;
      const r = eyeCanvas.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      eyeScene.setPointer(
        (e.clientX - cx) / (r.width * 0.75),
        -(e.clientY - cy) / (r.height * 0.9)
      );
    }, { passive: true });
  } catch (err) {
    console.warn('HEBRA: the witness sleeps.', err);
  }
}

/* ------------------------------------------------------------
   Works — constructions open to the hand as well as the cursor
   ------------------------------------------------------------ */
$$('.works__row').forEach((row) => {
  row.addEventListener('click', () => row.classList.toggle('is-open'));
  row.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      row.classList.toggle('is-open');
    }
  });
});

/* ------------------------------------------------------------
   Touch — the surface acknowledges the hand
   ------------------------------------------------------------ */
if (!finePointer && !prefersReducedMotion) {
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') return;
    const r = document.createElement('span');
    r.className = 'ripple';
    r.style.left = `${e.clientX}px`;
    r.style.top = `${e.clientY}px`;
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 950);
  }, { passive: true });

  // gyroscope parallax where the platform grants it without ceremony
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null || e.beta == null || !voidScene) return;
    voidScene.setMouse(
      Math.max(-1, Math.min(1, e.gamma / 32)),
      Math.max(-1, Math.min(1, (e.beta - 42) / 36))
    );
  }, { passive: true });
}

/* ------------------------------------------------------------
   Cursor — a quiet companion (fine pointers only)
   ------------------------------------------------------------ */
if (finePointer && !prefersReducedMotion) {
  document.documentElement.classList.add('has-cursor');
  const cursor = $('#cursor');
  const dotX = gsap.quickTo(cursor.querySelector('.cursor__dot'), 'x', { duration: 0.08, ease: 'power2.out' });
  const dotY = gsap.quickTo(cursor.querySelector('.cursor__dot'), 'y', { duration: 0.08, ease: 'power2.out' });
  const ringX = gsap.quickTo(cursor.querySelector('.cursor__ring'), 'x', { duration: 0.45, ease: 'power3.out' });
  const ringY = gsap.quickTo(cursor.querySelector('.cursor__ring'), 'y', { duration: 0.45, ease: 'power3.out' });

  window.addEventListener('pointermove', (e) => {
    dotX(e.clientX); dotY(e.clientY);
    ringX(e.clientX); ringY(e.clientY);
  }, { passive: true });

  const HOT = 'a, button, [data-tilt], .catalog__head';
  document.addEventListener('pointerover', (e) => {
    cursor.classList.toggle('is-active', Boolean(e.target.closest(HOT)));
  });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));
}

/* ------------------------------------------------------------
   Magnetic transmission — the button leans toward the hand
   ------------------------------------------------------------ */
const cta = $('#transmission-cta');
if (cta && finePointer && !prefersReducedMotion) {
  const mx = gsap.quickTo(cta, 'x', { duration: 0.6, ease: 'power3.out' });
  const my = gsap.quickTo(cta, 'y', { duration: 0.6, ease: 'power3.out' });
  cta.addEventListener('pointermove', (e) => {
    const r = cta.getBoundingClientRect();
    mx((e.clientX - (r.left + r.width / 2)) * 0.12);
    my((e.clientY - (r.top + r.height / 2)) * 0.12);
  });
  cta.addEventListener('pointerleave', () => { mx(0); my(0); });
}

/* ------------------------------------------------------------
   Housekeeping — visibility, resize
   ------------------------------------------------------------ */
document.addEventListener('visibilitychange', () => {
  if (prefersReducedMotion) return;
  if (document.hidden) {
    voidScene?.stop();
    mindScene?.stop();
    eyeScene?.stop();
    loopVideos.forEach((v) => v.pause());
  } else {
    voidScene?.start();
    if (mindVisible) mindScene?.start();
    if (eyeVisible) eyeScene?.start();
    loopVideos.forEach((v) => { if (v.dataset.inview) v.play().catch(() => {}); });
    ScrollTrigger.refresh();
  }
});

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    voidScene?.resize();
    mindScene?.resize();
    eyeScene?.resize();
    ScrollTrigger.refresh();
  }, 150);
});

/* ------------------------------------------------------------
   Theatre.js — the tuning instrument, ?edit only
   ------------------------------------------------------------
   Never loaded for a real visitor. Skips straight past the rite
   so the crystal is on stage immediately, then hands its two
   most cinematic parameters to a live Theatre.js panel.
   ------------------------------------------------------------ */
if (editMode && voidScene) {
  document.documentElement.classList.add('theatre-edit-mode');
  finishRite(true);
  import('./theatre-rite.js')
    .then(({ initTheatreRite }) => initTheatreRite({ voidScene }))
    .catch((err) => console.warn('HEBRA: the tuning panel stayed dark.', err));
} else {
  /* ------------------------------------------------------------
     Begin.
     ------------------------------------------------------------ */
  runRite();
}
