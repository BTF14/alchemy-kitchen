// js/modules/contact.js — Email copy + button glow effects (§7.C)

export function initContact() {
  initEmailCopy();
  initButtonGlow();
}

// ─────────────────────────────────────────────────────────
// Email clipboard copy (desktop) / mailto (mobile) §4.C
// ─────────────────────────────────────────────────────────
function initEmailCopy() {
  const emailBtn = document.getElementById('email-btn');
  if (!emailBtn) return;

  const emailAddress = emailBtn.getAttribute('data-email') ||
                       emailBtn.querySelector('.email-text')?.textContent?.trim() ||
                       'alquimia.cocina@albion.gg';

  emailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      showCopiedFeedback(emailBtn);
    } catch {
      // Fallback: select email text
      window.location.href = `mailto:${emailAddress}`;
    }
  });
}

function showCopiedFeedback(btn) {
  btn.classList.add('copied');
  setTimeout(() => btn.classList.remove('copied'), 2200);
}

// ─────────────────────────────────────────────────────────
// Button glow (Windows 10 Calendar-style) §7.C
// Applies to all .btn-primary elements
// ─────────────────────────────────────────────────────────
function initButtonGlow() {
  const gsap = window.gsap;
  if (!gsap) return;

  const buttons = document.querySelectorAll('.btn-primary');

  buttons.forEach(btn => {
    // Find or create the glow span (HTML may already have it)
    let glow = btn.querySelector('.btn-glow');
    if (!glow) {
      glow = document.createElement('span');
      glow.className = 'btn-glow';
      btn.appendChild(glow);
    }

    // Ensure text span has z-index above glow (§7.C)
    const textSpan = btn.querySelector('span:not(.btn-glow)');
    if (textSpan) {
      textSpan.style.position = 'relative';
      textSpan.style.zIndex   = '2';
    }

    // Glow position: inline left/top — zero lag (§7.C rule 2)
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      glow.style.left = (e.clientX - rect.left) + 'px';
      glow.style.top  = (e.clientY - rect.top)  + 'px';
    });

    // Fade glow in on enter
    btn.addEventListener('mouseenter', () => {
      gsap.to(glow, { opacity: 1, duration: 0.25, ease: 'power2.out' });
    });

    // Fade glow out on leave
    btn.addEventListener('mouseleave', () => {
      gsap.to(glow, { opacity: 0, duration: 0.35, ease: 'power2.in' });
    });
  });
}
