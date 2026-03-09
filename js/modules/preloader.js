// js/modules/preloader.js
// 3-phase alchemical preloader. Returns a Promise resolved when done.

const PHASES = [
  { word: 'TRANSMUTANDO', duration: 900 },
  { word: 'CALCULANDO',   duration: 900 },
  { word: 'DESTILANDO',   duration: 900 },
];

/**
 * Animates the alchemical SVG symbol appearance.
 * @param {gsap} gsap - GSAP instance from global scope
 */
function animateSymbol(gsap) {
  const outerRing  = document.querySelector('.sym-outer-ring');
  const triangle   = document.querySelector('.sym-triangle');
  const triangleInv = document.querySelector('.sym-triangle-inv');
  const innerCircle = document.querySelector('.sym-inner');

  if (!outerRing) return;

  const tl = gsap.timeline();
  tl.to(outerRing, { opacity: 0.7, duration: 0.6, ease: 'power2.out' })
    .to(triangle, {
      opacity: 0.9,
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    }, '-=0.3')
    .to(triangleInv, {
      opacity: 0.5,
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    }, '-=0.9')
    .to(innerCircle, { opacity: 0.9, duration: 0.5, ease: 'expo.out' }, '-=0.4');
}

/**
 * Runs a single phase: animates in the phase word and counter progression.
 */
function runPhase(gsap, index, totalPhases) {
  return new Promise(resolve => {
    const phaseEl  = document.getElementById('preloader-phase');
    const counterEl = document.getElementById('preloader-pct');
    const lineEl   = document.querySelector('.preloader-line');

    // Update phase word
    if (phaseEl) {
      const span = phaseEl.querySelector('.phase-word');
      if (span) {
        span.textContent = PHASES[index].word;
        gsap.fromTo(span,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );
      }
    }

    // Animate counter from previous percentage to current
    const startPct = Math.round((index / totalPhases) * 100);
    const endPct   = Math.round(((index + 1) / totalPhases) * 100);

    if (counterEl) {
      gsap.to({ val: startPct }, {
        val: endPct,
        duration: PHASES[index].duration / 1000,
        ease: 'none',
        onUpdate: function () {
          counterEl.textContent = Math.round(this.targets()[0].val);
        }
      });
    }

    // Animate line width
    if (lineEl) {
      const targetWidth = ((index + 1) / totalPhases) * 160;
      gsap.to(lineEl, {
        width: targetWidth,
        duration: PHASES[index].duration / 1000,
        ease: 'power2.inOut'
      });
    }

    // Exit phase word before resolving
    setTimeout(() => {
      if (phaseEl) {
        const span = phaseEl.querySelector('.phase-word');
        if (span) {
          gsap.to(span, {
            opacity: 0,
            y: -18,
            duration: 0.35,
            ease: 'power2.in',
            onComplete: resolve
          });
        } else { resolve(); }
      } else { resolve(); }
    }, PHASES[index].duration - 400);
  });
}

/**
 * Full preloader sequence.
 * @returns {Promise<void>} Resolves when the preloader has exited.
 */
export function runPreloader() {
  return new Promise(async (resolve) => {
    const gsap = window.gsap;
    if (!gsap) {
      // GSAP not loaded — skip preloader
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.style.display = 'none';
      resolve();
      return;
    }

    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('preloader-pct');
    const lineEl    = document.querySelector('.preloader-line');

    // Reduced motion: skip immediately
    if (window.__ALQ_SUPPORT && window.__ALQ_SUPPORT.prefersReducedMotion) {
      if (preloader) gsap.set(preloader, { autoAlpha: 0 });
      resolve();
      return;
    }

    // Intro: fade in counter and line
    if (counterEl) gsap.to(counterEl, { opacity: 1, duration: 0.4 });
    if (lineEl)    gsap.set(lineEl, { width: 0 });

    animateSymbol(gsap);

    // Run each phase sequentially
    for (let i = 0; i < PHASES.length; i++) {
      await runPhase(gsap, i, PHASES.length);
    }

    // Brief hold at 100%
    await new Promise(r => setTimeout(r, 280));

    // Exit animation: shrink line + fade out whole preloader
    const exitTL = gsap.timeline({ onComplete: resolve });
    exitTL
      .to(preloader.querySelectorAll('.preloader-symbol, .preloader-phase, .preloader-counter'), {
        opacity: 0,
        y: -20,
        stagger: 0.06,
        duration: 0.4,
        ease: 'power2.in'
      })
      .to(lineEl, { width: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.3')
      .to(preloader, {
        autoAlpha: 0,
        duration: 0.6,
        ease: 'expo.inOut'
      }, '-=0.1');
  });
}
