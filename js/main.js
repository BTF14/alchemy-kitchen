// js/main.js — The Orchestrator (§2.B pattern)
// Controls boot sequence: preloader → subsystems → reveal

import { runPreloader }      from './modules/preloader.js';
import { initScroll }        from './modules/scrollAnimations.js';
import { initMenu }          from './modules/menu.js';
import { initContact }       from './modules/contact.js';
import { initCursor }        from './modules/cursor.js';
import { initCalculator }    from './modules/calculator.js';
import { initI18n }          from './modules/i18n.js';

const orchestrator = async () => {
  try {
    const gsap = window.gsap;

    // Skip animations if reduced motion is preferred
    if (window.__ALQ_SUPPORT && window.__ALQ_SUPPORT.prefersReducedMotion) {
      const app = document.getElementById('app-content');
      if (app) {
        app.style.visibility = 'visible';
        app.style.opacity    = '1';
      }
      document.body.style.overflow = 'auto';
      initI18n();
      initCalculator();
      initContact();
      return;
    }

    // ── Phase 1: Preloader ──────────────────────────────
    await runPreloader();

    // ── Phase 2: Boot all subsystems BEFORE reveal (§6.A) ─
    // ORDER MATTERS: initScroll() sets opacity:0 on .scroll-elements
    // before app-content becomes visible — prevents flash
    initScroll();           // Must be FIRST
    initMenu();
    initContact();
    initCursor();
    initI18n();
    initCalculator();

    // ── Phase 3: Reveal the page ────────────────────────
    const app = document.getElementById('app-content');
    if (gsap && app) {
      gsap.to(app, {
        autoAlpha: 1,
        duration: 1.2,
        ease: 'expo.inOut'
      });
    } else if (app) {
      app.style.visibility = 'visible';
      app.style.opacity    = '1';
    }

    // ── Phase 4: Enable scrolling ───────────────────────
    document.body.style.overflow = 'auto';

  } catch (error) {
    // Critical boot error: show content regardless
    console.error('[AlquimiaCocina] Critical Boot Error:', error);
    const app = document.getElementById('app-content');
    if (app) {
      app.style.visibility = 'visible';
      app.style.opacity    = '1';
    }
    document.body.style.overflow = 'auto';
    // Still try to init calculator even if animations fail
    try {
      initI18n();
      initCalculator();
      initContact();
    } catch (e) {
      console.error('[AlquimiaCocina] Fallback init failed:', e);
    }
  }
};

// Boot on DOM ready
window.addEventListener('DOMContentLoaded', orchestrator);
