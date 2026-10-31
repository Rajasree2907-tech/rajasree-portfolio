/**
 * RAJASREE M - PORTFOLIO INTERACTIONS
 * Vanilla JavaScript: navigation, theme, scrollspy, reveal, modals, contact form (Web3Forms).
 */
document.addEventListener('DOMContentLoaded', () => {
  initDynamicYear();
  initNavigation();
  initThemeToggle();
  initScrollspy();
  initScrollReveal();
  initBackToTop();
  initModals();
  initContactForm();
  initCopyEmail();
});

function safeStorage(action, key, value) {
  try {
    return action === 'get' ? localStorage.getItem(key) : localStorage.setItem(key, value);
  } catch (e) { return null; }
}

function initDynamicYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

function initNavigation() {
  const header = document.getElementById('navbar');
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('navMenu');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (!btn || !menu) return;
  const closeMenu = () => { btn.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); };

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
  links.forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); btn.focus(); }
  });
}

function initThemeToggle() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  if (safeStorage('get', 'rm-theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      safeStorage('set', 'rm-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      safeStorage('set', 'rm-theme', 'dark');
    }
  });
}

function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
  sections.forEach(s => observer.observe(s));
}

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-on-scroll');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
}

function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/** Modals: any [data-open-modal="id"] opens #id; [data-close-modal] closes its parent modal. */
function initModals() {
  const modals = document.querySelectorAll('.modal-backdrop');
  let lastTrigger = null;

  function openModal(modal, trigger) {
    if (!modal) return;
    lastTrigger = trigger || null;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const close = modal.querySelector('.modal-close-btn');
    if (close) close.focus();
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(document.getElementById(btn.dataset.openModal), btn));
  });
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-backdrop')));
  });
  modals.forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModal(m); }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modals.forEach(m => m.classList.contains('open') && closeModal(m));
  });
}

/** Contact form: client-side validation, then POST to Web3Forms (delivers to your Gmail). */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');
  if (!form || !alertBox) return;

  const fields = {
    name: { input: document.getElementById('contactName'), group: document.getElementById('nameGroup'), valid: v => v.length > 0 },
    email: { input: document.getElementById('contactEmail'), group: document.getElementById('emailGroup'), valid: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    subject: { input: document.getElementById('contactSubject'), group: document.getElementById('subjectGroup'), valid: v => v.length > 0 },
    message: { input: document.getElementById('contactMessage'), group: document.getElementById('messageGroup'), valid: v => v.length >= 10 }
  };

  function check(f) {
    const ok = f.valid(f.input.value.trim());
    f.group.classList.toggle('has-error', !ok);
    f.input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  Object.values(fields).forEach(f => {
    f.input.addEventListener('input', () => {
      if (f.group.classList.contains('has-error')) check(f);
    });
    f.input.addEventListener('blur', () => { if (f.input.value.trim()) check(f); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const results = Object.values(fields).map(check);
    if (results.includes(false)) {
      alertBox.className = 'form-alert info';
      alertBox.innerHTML = '<strong>Please fix the highlighted fields</strong> and try again.';
      const firstBad = Object.values(fields).find(f => f.group.classList.contains('has-error'));
      if (firstBad) firstBad.input.focus();
      return;
    }

    const keyInput = form.querySelector('[name="access_key"]');
    if (!keyInput || keyInput.value === 'YOUR_ACCESS_KEY_HERE') {
      alertBox.className = 'form-alert error';
      alertBox.innerHTML = '<strong>Form not connected yet.</strong> Add your Web3Forms access key in index.html.';
      return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('submitBtnText');
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');

      alertBox.className = 'form-alert success';
      alertBox.innerHTML = '<strong>Message sent!</strong><br>Thank you, ' + escapeHTML(fields.name.input.value.trim()) + '. I will get back to you soon.';
      form.reset();
    } catch (err) {
      console.error('Contact form error:', err);
      const reason = err instanceof TypeError
        ? 'Could not reach the form service (check your internet connection, ad blocker, or open the site through Live Server / the live link).'
        : escapeHTML(err.message || 'Unknown error');
      alertBox.className = 'form-alert error';
      alertBox.innerHTML = '<strong>Message not sent.</strong><br>Reason: ' + reason + '<br>You can also email me directly at rajasree2907@gmail.com.';
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

function initCopyEmail() {
  const btn = document.getElementById('copyEmailBtn');
  const display = document.getElementById('emailDisplayValue');
  if (!btn || !display) return;

  btn.addEventListener('click', async () => {
    const text = display.textContent.trim();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const tmp = document.createElement('input');
        tmp.value = text;
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
      }
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = original; }, 2000);
    } catch (err) {
      btn.textContent = 'Press Ctrl+C';
    }
  });
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}