// js/modules/menu.js — Fullscreen split-halves menu
// Implements all §4.A, §6.B, §6.C rules from ia.md

export function initMenu() {
  const gsap    = window.gsap;
  if (!gsap) return;

  const toggle  = document.getElementById('menu-toggle');
  const overlay = document.getElementById('menu-overlay');
  if (!toggle || !overlay) return;

  const menuLeft    = overlay.querySelector('.menu-half.menu-left');
  const menuRight   = overlay.querySelector('.menu-half.menu-right');
  const menuContent = overlay.querySelector('.menu-content');
  const menuLinks   = overlay.querySelectorAll('.menu-link');
  const menuFooter  = overlay.querySelector('.menu-footer-info');

  // ── Ambient cursor glow inside menu (§7.E) ─────────────
  const menuGlow = document.createElement('div');
  menuGlow.className = 'menu-glow';
  overlay.appendChild(menuGlow);

  overlay.addEventListener('mousemove', (e) => {
    menuGlow.style.left = e.clientX + 'px';
    menuGlow.style.top  = e.clientY + 'px';
  });

  // ── State ───────────────────────────────────────────────
  let isOpen      = false;
  let isAnimating = false;
  let pendingScrollTarget = null;

  // ── Build GSAP timeline with .fromTo() everywhere (§6.C) ─
  const menuTL = gsap.timeline({
    paused: true,
    onReverseComplete: () => {
      overlay.style.pointerEvents = 'none';
      overlay.style.visibility    = 'hidden';
      menuContent.style.pointerEvents = 'none';
      menuTL.pause().progress(0).timeScale(1); // hard reset §6.C rule 4
      isAnimating = false;
      isOpen = false;

      // Hide menu glow
      gsap.set(menuGlow, { opacity: 0 });

      // Execute pending scroll navigation (§6.C rule 6)
      if (pendingScrollTarget) {
        const target = document.querySelector(pendingScrollTarget);
        pendingScrollTarget = null;
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    },
    onComplete: () => {
      isAnimating = false;
      isOpen = true;

      // Show menu glow
      gsap.to(menuGlow, { opacity: 1, duration: 0.6, delay: 0.3 });
    }
  });

  // Halves slide in from top
  menuTL.fromTo(
    [menuLeft, menuRight],
    { yPercent: -100 },
    { yPercent: 0, duration: 0.75, ease: 'expo.inOut', stagger: 0.05 }
  );

  // Links appear with stagger
  menuTL.fromTo(
    menuLinks,
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
    '-=0.3'
  );

  // Footer info fades in
  if (menuFooter) {
    menuTL.fromTo(
      menuFooter,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );
  }

  // ── Open menu ───────────────────────────────────────────
  function openMenu() {
    if (isAnimating) return;
    isAnimating = true; // Set BEFORE play() — §6.C rule 1

    overlay.style.visibility    = 'visible';
    overlay.style.pointerEvents = 'all';
    menuContent.style.pointerEvents = 'all';
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');

    menuTL.invalidate().restart(); // §6.C rule 5
  }

  // ── Close menu ──────────────────────────────────────────
  function closeMenu() {
    if (isAnimating || !isOpen) return;
    isAnimating = true; // Set BEFORE reverse() — §6.C rule 1

    document.body.style.overflow = 'auto';
    toggle.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    menuContent.style.pointerEvents = 'none';

    gsap.to(menuGlow, { opacity: 0, duration: 0.15 });
    menuTL.reverse();
  }

  // ── Toggle ──────────────────────────────────────────────
  toggle.addEventListener('click', () => {
    if (isOpen) closeMenu();
    else openMenu();
  });

  // ── Nav link clicks (close → then scroll) ──────────────
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        pendingScrollTarget = href; // §6.C rule 6
      }
      closeMenu();
    });
  });

  // ── Close on Escape key ────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // ── Magnetic toggle effect on desktop (§6.D) ──────────
  initMagneticToggle(gsap, toggle);
}

// ─────────────────────────────────────────────────────────
// Magnetic toggle (desktop only §6.D)
// ─────────────────────────────────────────────────────────
function initMagneticToggle(gsap, toggle) {
  if (window.innerWidth < 768) return;

  const RADIUS   = 120;
  const STRENGTH = 0.35;

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;

    const rect = toggle.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = e.clientX - cx;
    const dy   = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < RADIUS) {
      const intensity = 1 - dist / RADIUS;
      gsap.to(toggle, {
        x: dx * STRENGTH * intensity,
        y: dy * STRENGTH * intensity,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    } else {
      gsap.to(toggle, {
        x: 0, y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto'
      });
    }
  });

  document.addEventListener('mouseleave', () => {
    gsap.to(toggle, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
}
