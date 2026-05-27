/**
 * ============================================================
 * InformaticaUmanistica — App Core
 * ============================================================
 * Logica principale dell'applicazione:
 * - Navigazione SPA e scroll
 * - Tema chiaro/scuro
 * - Scroll animations (Intersection Observer)
 * - Lab tab switching
 * - Mobile menu
 * - Toast notifications
 * - Quote rotation
 * ============================================================
 */

// === NAVIGATION & SCROLL ===

/**
 * Handle navbar style on scroll
 */
function initNavScroll() {
  const nav = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Scroll to top button
    if (window.scrollY > 600) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }

    // Update active nav link
    updateActiveNavLink();
  }, { passive: true });
}

/**
 * Update active nav link based on scroll position
 */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const scrollPos = window.scrollY + 150;

  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === currentSection) {
      link.classList.add('active');
    }
  });
}

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
    const targetPos = section.offsetTop - navHeight;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  }
}

/**
 * Scroll to top
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// === THEME TOGGLE ===

/**
 * Initialize theme from localStorage or system preference
 */
function initTheme() {
  const savedTheme = localStorage.getItem('iu-theme');
  const toggle = document.getElementById('theme-toggle');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  updateThemeIcon();

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('iu-theme', next);
    updateThemeIcon();
  });
}

function updateThemeIcon() {
  const toggle = document.getElementById('theme-toggle');
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  toggle.textContent = isDark ? '🌙' : '☀️';
}

// === MOBILE MENU ===

function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', !isOpen);
    toggle.textContent = isOpen ? '☰' : '✕';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('mobile-toggle');
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = '☰';
}

// === SCROLL ANIMATIONS (Intersection Observer) ===

function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// === LAB TAB SWITCHING ===

function initLabTabs() {
  const tabs = document.querySelectorAll('.lab-tab');
  const panels = document.querySelectorAll('.lab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      // Update tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(`panel-${target}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// === TOAST NOTIFICATIONS ===

function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// === LITERARY QUOTE ROTATION ===

const LITERARY_QUOTES = [
  {
    text: 'Nel mezzo del cammin di nostra vita / mi ritrovai per una selva oscura, / ché la diritta via era smarrita.',
    author: '— Dante Alighieri, Inferno, Canto I'
  },
  {
    text: 'Chiare, fresche et dolci acque, / ove le belle membra / pose colei che sola a me par donna.',
    author: '— Francesco Petrarca, Canzoniere, CXXVI'
  },
  {
    text: 'Ei fu. Siccome immobile, / dato il mortal sospiro, / stette la spoglia immemore / orba di tanto spiro.',
    author: '— Alessandro Manzoni, Il Cinque Maggio'
  },
  {
    text: 'Sempre caro mi fu quest\'ermo colle, / e questa siepe, che da tanta parte / dell\'ultimo orizzonte il guardo esclude.',
    author: '— Giacomo Leopardi, L\'Infinito'
  },
  {
    text: 'M\'illumino d\'immenso.',
    author: '— Giuseppe Ungaretti, Mattina'
  },
  {
    text: 'Spesso il male di vivere ho incontrato: / era il rivo strozzato che gorgoglia, / era l\'incartocciarsi della foglia.',
    author: '— Eugenio Montale, Ossi di seppia'
  },
  {
    text: 'Si sta come / d\'autunno / sugli alberi / le foglie.',
    author: '— Giuseppe Ungaretti, Soldati'
  },
  {
    text: 'Quel ramo del lago di Como, che volge a mezzogiorno, tra due catene non interrotte di monti...',
    author: '— Alessandro Manzoni, I Promessi Sposi'
  },
];

function initQuoteRotation() {
  let currentQuote = 0;
  const textEl = document.getElementById('literary-quote-text');
  const authorEl = document.getElementById('literary-quote-author');

  if (!textEl || !authorEl) return;

  setInterval(() => {
    currentQuote = (currentQuote + 1) % LITERARY_QUOTES.length;
    const quote = LITERARY_QUOTES[currentQuote];

    textEl.style.opacity = '0';
    authorEl.style.opacity = '0';

    setTimeout(() => {
      textEl.textContent = quote.text;
      authorEl.textContent = quote.author;
      textEl.style.opacity = '1';
      authorEl.style.opacity = '1';
    }, 500);
  }, 8000);

  // Add transition
  textEl.style.transition = 'opacity 0.5s ease';
  authorEl.style.transition = 'opacity 0.5s ease';
}

// === SMOOTH SCROLL FOR ANCHOR LINKS ===

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      if (target && target !== '#') {
        e.preventDefault();
        const sectionId = target.substring(1);
        scrollToSection(sectionId);
      }
    });
  });
}

// === COUNTER ANIMATION ===

function animateCounter(el, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// === AUTH MODE TOGGLE ===

function toggleAuthMode(e) {
  if (e) e.preventDefault();

  const loginContainer = document.getElementById('auth-login-container');
  const registerContainer = document.getElementById('auth-register-container');

  if (loginContainer.style.display === 'none') {
    loginContainer.style.display = 'block';
    registerContainer.style.display = 'none';
  } else {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
  }
}

// === KEYBOARD NAVIGATION ===

function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    // Escape closes mobile menu
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

// === INITIALIZATION ===

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavScroll();
  initMobileMenu();
  initScrollAnimations();
  initLabTabs();
  initSmoothScroll();
  initQuoteRotation();
  initKeyboardNav();

  // Log initialization
  console.log(
    '%c🏫 InformaticaUmanistica %cv1.0.0',
    'color: #8b5cf6; font-weight: bold; font-size: 16px;',
    'color: #06d6a0; font-weight: normal; font-size: 14px;'
  );
  console.log(
    '%cPiattaforma didattica — Digital Humanities, AI & Letteratura',
    'color: #94a3b8; font-size: 12px;'
  );
});
