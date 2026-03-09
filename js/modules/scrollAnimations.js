// js/modules/scrollAnimations.js
// Handles ScrollTrigger-based animations including hero parallax.

/**
 * Registers all scroll-based animations.
 * Must be called BEFORE gsap.to(app, { autoAlpha: 1 }) — §6.A.
 */
export function initScroll() {
  const gsap         = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  // ── Hero parallax (scroll-driven) ────────────────────
  initHeroParallax(gsap, ScrollTrigger);

  // ── Scroll-reveal for .scroll-element nodes ───────────
  registerScrollElements(gsap, ScrollTrigger);

  // ── Navbar scroll behavior ────────────────────────────
  initNavbarScroll(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────
// Hero Parallax
// ─────────────────────────────────────────────────────────
function initHeroParallax(gsap, ScrollTrigger) {
  const heroSection = document.getElementById('hero');
  const heroBg      = document.querySelector('.hero-svg-bg');
  const heroContent = document.querySelector('.hero-content');
  const heroOverlay = document.querySelector('#hero .hero-overlay');

  if (!heroBg || !heroSection) return;

  // Background moves slower than scroll (parallax illusion)
  gsap.to(heroBg, {
    yPercent: 25,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Hero content drifts upward and fades
  if (heroContent) {
    gsap.to(heroContent, {
      yPercent: -12,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Overlay deepens on scroll for depth effect
  if (heroOverlay) {
    gsap.to(heroOverlay, {
      opacity: 1.5, // CSS clamps this
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'center top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // ── Features section parallax ─────────────────────────
  const featuresBg = document.querySelector('#features .hero-svg-bg');
  if (featuresBg) {
    gsap.to(featuresBg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '#features',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }
}

// ─────────────────────────────────────────────────────────
// Scroll-element reveal
// ─────────────────────────────────────────────────────────
function registerScrollElements(gsap, ScrollTrigger) {
  const elements = document.querySelectorAll('.scroll-element');

  // Set initial hidden states (§6.A — CSS layer also sets opacity:0)
  elements.forEach(el => {
    gsap.set(el, { opacity: 0, y: 30 });
  });

  elements.forEach(el => {
    const isFooterChild = el.closest('#footer') !== null;
    const triggerStart  = isFooterChild ? 'top 98%' : 'top 88%';

    ScrollTrigger.create({
      trigger: el,
      start: triggerStart,
      end: 'bottom top',          // Element must FULLY exit before hiding §6.I
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      },
      onEnterBack: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      },
      onLeave: isFooterChild ? null : () => {
        gsap.to(el, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          ease: 'power2.in',
          overwrite: 'auto'
        });
      },
      onLeaveBack: () => {
        gsap.to(el, {
          opacity: 0,
          y: 30,
          duration: 0.4,
          ease: 'power2.in',
          overwrite: 'auto'
        });
      }
    });
  });

  // ── Staggered card animations ─────────────────────────
  const aboutCards = document.querySelectorAll('.about-card');
  if (aboutCards.length) {
    gsap.set(aboutCards, { opacity: 0, y: 40 });

    ScrollTrigger.create({
      trigger: '.about-grid',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(aboutCards, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out'
        });
      }
    });
  }

  // ── Tier entries staggered ────────────────────────────
  const tierEntries = document.querySelectorAll('.tier-entry');
  if (tierEntries.length) {
    tierEntries.forEach((entry, i) => {
      gsap.set(entry, { opacity: 0, x: -30 });

      ScrollTrigger.create({
        trigger: entry,
        start: 'top 88%',
        end: 'bottom top',
        onEnter: () => {
          gsap.to(entry, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            delay: i * 0.05,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        },
        onLeaveBack: () => {
          gsap.to(entry, {
            opacity: 0,
            x: -30,
            duration: 0.35,
            ease: 'power2.in',
            overwrite: 'auto'
          });
        }
      });
    });
  }
}

// ─────────────────────────────────────────────────────────
// Navbar scrolled state
// ─────────────────────────────────────────────────────────
function initNavbarScroll(ScrollTrigger) {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  ScrollTrigger.create({
    start: 'top -60px',
    end: 99999,
    onToggle: (self) => {
      navbar.classList.toggle('scrolled', self.isActive);
    }
  });
}
