// js/modules/cursor.js — Okich cursor system (gold glow with delay)

/**
 * Initialises the custom cursor with the Okich color system.
 * - Core dot: instant follow
 * - Diffused glow: delayed lerp (cinematic drag effect)
 * - Hover state: cursor expands on interactive elements
 */
export function initCursor() {
  // Skip on touch-only devices
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.__ALQ_SUPPORT && !window.__ALQ_SUPPORT.pointer) return;
  if (window.__ALQ_SUPPORT && window.__ALQ_SUPPORT.prefersReducedMotion) return;

  const gsap      = window.gsap;
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorGlow = document.getElementById('cursor-glow');

  if (!cursorDot || !cursorGlow || !gsap) return;

  // ── State ──────────────────────────────────────────────
  const mouse    = { x: -300, y: -300 };
  const glowPos  = { x: -300, y: -300 };
  let isVisible  = false;
  // Lerp factor for glow — lower = more delay/drag (Okich system)
  const LERP_FACTOR = 0.065;

  // ── Show cursor on first move ──────────────────────────
  document.addEventListener('mousemove', onFirstMove, { once: true });

  function onFirstMove() {
    document.body.classList.add('cursor-ready');
  }

  // ── Mouse position tracking ────────────────────────────
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Core dot follows instantly via GSAP set (zero lag)
    gsap.set(cursorDot, { x: mouse.x, y: mouse.y });
  });

  // ── Glow follows with delay via ticker lerp ────────────
  gsap.ticker.add(() => {
    // Lerp: smooth interpolation creates the Okich "pursuit" delay
    glowPos.x += (mouse.x - glowPos.x) * LERP_FACTOR;
    glowPos.y += (mouse.y - glowPos.y) * LERP_FACTOR;

    gsap.set(cursorGlow, { x: glowPos.x, y: glowPos.y });
  });

  // ── Hover states (enlarge cursor on interactive elements) ─
  const hoverTargets = 'a, button, [role="button"], .about-card, .recipe-tag, .tier-entry, .calc-select, .calc-input, label';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
      gsap.to(cursorGlow, {
        width: 200,
        height: 200,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
      gsap.to(cursorGlow, {
        width: 360,
        height: 360,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  });

  // ── Hide on viewport exit ──────────────────────────────
  document.addEventListener('mouseleave', () => {
    gsap.to([cursorDot, cursorGlow], { opacity: 0, duration: 0.3 });
    document.body.classList.remove('cursor-ready');
  });

  document.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-ready');
  });

  // ── Click pulse effect ─────────────────────────────────
  document.addEventListener('mousedown', () => {
    gsap.to(cursorDot, {
      width: 4,
      height: 4,
      duration: 0.1,
      ease: 'power2.in'
    });
    gsap.to(cursorGlow, {
      scale: 0.7,
      duration: 0.15,
      ease: 'power2.in'
    });
  });

  document.addEventListener('mouseup', () => {
    gsap.to(cursorDot, {
      width: 7,
      height: 7,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)'
    });
    gsap.to(cursorGlow, {
      scale: 1,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)'
    });
  });
}
