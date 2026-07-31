/* ==========================================================================
   NARROW DIGITAL MARKETING — main.js
   --------------------------------------------------------------------------
   Vanilla JS, no dependencies. Four jobs:
     1. Reveal elements on scroll
     2. Mobile menu
     3. Header hairline on scroll
     4. Contact form submit (Web3Forms) — see contact.njk for the API key
   Everything degrades gracefully: with JS off, all content is visible.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. REVEAL ON SCROLL
     Add class="reveal" to any element. Add data-reveal-group to a parent
     to stagger its direct children by 60ms each.
     ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // No IntersectionObserver or reduced motion? Just show everything.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    // Stagger children of any [data-reveal-group]
    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      var kids = group.querySelectorAll(':scope > .reveal');
      kids.forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', (i * 60) + 'ms');
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08
    });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     2. MOBILE MENU
     ------------------------------------------------------------------ */
  function initMenu() {
    var btn = document.querySelector('[data-menu-button]');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });

    // Close if the viewport grows past the desktop breakpoint
    window.matchMedia('(min-width: 860px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------
     3. HEADER HAIRLINE
     ------------------------------------------------------------------ */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    update();
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     4. CONTACT FORM
     Posts to Web3Forms via fetch so the visitor stays on the page.
     The access key lives in the hidden input on /contact/.
     ------------------------------------------------------------------ */
  function initForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;

    var status = form.querySelector('.form__status');
    var submit = form.querySelector('button[type="submit"]');
    var submitText = submit ? submit.textContent : '';

    function say(state, message) {
      if (!status) return;
      status.textContent = message;
      status.setAttribute('data-state', state);
      status.classList.add('is-visible');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var key = form.querySelector('input[name="access_key"]');
      if (!key || !key.value || key.value.indexOf('YOUR-WEB3FORMS') === 0) {
        say('error', 'This form is not connected yet — add your Web3Forms access key in src/contact.njk.');
        return;
      }

      if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }
      say('ok', 'Sending…');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            form.reset();
            say('ok', 'Thanks — your message is through. I’ll get back to you shortly.');
          } else {
            say('error', data.message || 'Something went wrong. Please email me directly.');
          }
        })
        .catch(function () {
          say('error', 'Network error. Please email me directly.');
        })
        .finally(function () {
          if (submit) { submit.disabled = false; submit.textContent = submitText; }
        });
    });
  }

  function init() {
    initReveal();
    initMenu();
    initHeader();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
