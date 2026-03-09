/**
 * js/support.js — Legacy browser support & polyfills
 * Loaded synchronously BEFORE any ES modules or CSS.
 * Does NOT use ES6 module syntax — must be IE11-compatible.
 */

(function () {
  'use strict';

  // ── 1. CSS Custom Properties detection ──────────────────
  var supportsCSSVars = window.CSS && window.CSS.supports &&
                        window.CSS.supports('color', 'var(--test)');

  if (!supportsCSSVars) {
    // Inject a <style> block with hardcoded values as fallback
    var style = document.createElement('style');
    style.textContent = [
      'body{background:#0B0906;color:#EDD9A3;font-family:Georgia,serif}',
      '.btn-primary{background:#D4A843;color:#0B0906}',
      '#navbar{background:rgba(11,9,6,.9)}',
      '.section-label{color:#D4A843}',
      '.accent-primary{color:#D4A843}',
    ].join('');
    document.head.appendChild(style);
    document.documentElement.setAttribute('data-no-css-vars', 'true');
  }

  // ── 2. CSS Grid detection ────────────────────────────────
  var supportsGrid = window.CSS && window.CSS.supports &&
                     window.CSS.supports('display', 'grid');

  if (!supportsGrid) {
    document.documentElement.setAttribute('data-no-grid', 'true');
  }

  // ── 3. Element.closest polyfill ────────────────────────
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector) {
      var el = this;
      while (el && el.nodeType === 1) {
        if (el.matches(selector)) return el;
        el = el.parentElement || el.parentNode;
      }
      return null;
    };
  }

  // ── 4. Element.matches polyfill ────────────────────────
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }

  // ── 5. Object.assign polyfill ──────────────────────────
  if (typeof Object.assign !== 'function') {
    Object.defineProperty(Object, 'assign', {
      value: function assign(target) {
        if (target == null) throw new TypeError('Cannot convert undefined or null to object');
        var to = Object(target);
        for (var i = 1; i < arguments.length; i++) {
          var src = arguments[i];
          if (src != null) {
            for (var k in src) {
              if (Object.prototype.hasOwnProperty.call(src, k)) {
                to[k] = src[k];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }

  // ── 6. Array.from polyfill ─────────────────────────────
  if (!Array.from) {
    Array.from = function (arrayLike) {
      return [].slice.call(arrayLike);
    };
  }

  // ── 7. CustomEvent constructor polyfill (IE11) ─────────
  if (typeof window.CustomEvent !== 'function') {
    function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }

  // ── 8. requestAnimationFrame polyfill ──────────────────
  var lastTime = 0;
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
    window.cancelAnimationFrame = function (id) { clearTimeout(id); };
  }

  // ── 9. IntersectionObserver fallback ──────────────────
  // If not supported, mark elements as immediately visible so content isn't hidden.
  if (!window.IntersectionObserver) {
    // Will be detected in scrollAnimations.js to skip observer-based logic
    document.documentElement.setAttribute('data-no-intersection-observer', 'true');
  }

  // ── 10. ES Modules support check ──────────────────────
  // Browsers that don't support ES modules won't execute type="module" scripts.
  // We provide a nomodule fallback note in HTML.
  // This flag helps support.js signal to inline scripts if needed.
  try {
    new Function('import("")');
    document.documentElement.setAttribute('data-esm', 'true');
  } catch (e) {
    document.documentElement.setAttribute('data-no-esm', 'true');
    // Inject graceful degradation message for truly old browsers
    window.addEventListener('DOMContentLoaded', function () {
      var preloader = document.getElementById('preloader');
      if (preloader) {
        var notice = document.createElement('p');
        notice.style.cssText = 'color:#D4A843;font-family:serif;font-size:14px;letter-spacing:.1em;margin-top:1em;text-align:center;';
        notice.textContent = 'Para una experiencia completa, actualiza tu navegador.';
        preloader.appendChild(notice);
      }
    });
  }

  // ── 11. Pointer events check ─────────────────────────
  // Hide custom cursor entirely on touch-only devices
  var hasPointer = window.matchMedia('(pointer: fine)').matches;
  if (!hasPointer) {
    document.documentElement.setAttribute('data-touch', 'true');
    // Inject style to ensure default cursor on touch
    var touchStyle = document.createElement('style');
    touchStyle.textContent = '#cursor-glow,#cursor-dot{display:none!important}html,body{cursor:auto!important}';
    document.head.appendChild(touchStyle);
  }

  // ── 12. Expose support flags globally ─────────────────
  window.__ALQ_SUPPORT = {
    cssVars: !!supportsCSSVars,
    grid: !!supportsGrid,
    pointer: hasPointer,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

})();
