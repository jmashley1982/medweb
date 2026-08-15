/* ============================================================
 * demo-mode.js – read-only guard for the static demo build
 * ============================================================
 * Injected into the admin pages of the prerendered site only. The demo
 * has no server behind it, so every form is intercepted: visitors can
 * click through the whole CMS and type into any field, but nothing is
 * ever submitted.
 *
 * The sign-in form is the one exception — it navigates straight to the
 * dashboard so the login screen stays part of the walkthrough without
 * anyone needing credentials.
 */
(function () {
  'use strict';

  var BANNER_TEXT = 'Demo preview — this is a live sample of the admin. Changes aren’t saved.';
  var TOAST_TEXT = 'Demo preview — changes aren’t saved.';

  function injectStyles() {
    var css = [
      '.demo-banner{position:sticky;top:0;z-index:9999;display:flex;align-items:center;justify-content:center;',
      'gap:10px;padding:10px 18px;background:#1B5E44;color:#fff;font-size:.86rem;font-weight:600;',
      'letter-spacing:.2px;text-align:center;line-height:1.35;box-shadow:0 2px 10px rgba(0,0,0,.18);',
      "font-family:'Inter',system-ui,-apple-system,sans-serif}",
      '.demo-banner span.dot{width:8px;height:8px;border-radius:50%;background:#7BE0AE;flex:0 0 auto;',
      'animation:demoPulse 2s ease-in-out infinite}',
      '@keyframes demoPulse{0%,100%{opacity:1}50%{opacity:.35}}',
      '.demo-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(12px);',
      'z-index:10000;background:#1A2E24;color:#fff;padding:13px 22px;border-radius:12px;',
      'font-size:.92rem;font-weight:600;box-shadow:0 10px 34px rgba(0,0,0,.32);opacity:0;',
      'pointer-events:none;transition:opacity .22s ease,transform .22s ease;',
      "font-family:'Inter',system-ui,-apple-system,sans-serif;max-width:calc(100vw - 40px);text-align:center}",
      '.demo-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}',
      '@media print{.demo-banner,.demo-toast{display:none}}'
    ].join('');
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectBanner() {
    var bar = document.createElement('div');
    bar.className = 'demo-banner';
    bar.innerHTML = '<span class="dot"></span>';
    bar.appendChild(document.createTextNode(BANNER_TEXT));
    document.body.insertBefore(bar, document.body.firstChild);
  }

  var toastEl = null;
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'demo-toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    // Force a reflow so the transition replays on repeated clicks.
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 2600);
  }

  function isLoginForm(form) {
    var action = form.getAttribute('action') || '';
    return action.indexOf('/admin/login') !== -1;
  }

  function guardForms() {
    // Capture phase: runs before the element's own inline `onsubmit`, so the
    // dashboard's "Permanently delete?" confirm() never fires either.
    document.addEventListener(
      'submit',
      function (event) {
        var form = event.target;
        if (!form || form.tagName !== 'FORM') return;

        event.preventDefault();
        event.stopPropagation();

        if (isLoginForm(form)) {
          window.location.href = '/admin/dashboard/';
          return;
        }
        toast(TOAST_TEXT);
      },
      true
    );
  }

  function rewriteDeadLinks() {
    // There is no session to end; send "Sign Out" back to the login screen.
    var links = document.querySelectorAll('a[href="/admin/logout"]');
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute('href', '/admin/');
    }
  }

  function init() {
    injectStyles();
    injectBanner();
    guardForms();
    rewriteDeadLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
