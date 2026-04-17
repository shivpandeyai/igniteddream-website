/* =============================================================
   IGNITED DREAM — main.js
   All shared interactivity across pages
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initCounters();
  initFaq();
  initTabs();
  initForm();
  initQuiz();
  setActiveNavLink();
});

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  const navbar  = document.getElementById('navbar');
  const ham     = document.getElementById('hamburger');
  const mMenu   = document.getElementById('mobile-menu');
  const mClose  = document.getElementById('mobile-close');

  if (!navbar) return;

  // Determine if hero page (dark navbar) or inner page (light navbar)
  const hasDarkHero = document.querySelector('.hero, [data-nav="dark"]');
  const setNavType = () => {
    if (hasDarkHero && window.scrollY < 60) {
      navbar.className = 'nav-dark';
      navbar.id = 'navbar';
      updateHamColor('white');
    } else {
      navbar.classList.remove('nav-dark');
      navbar.classList.add('nav-scrolled');
      updateHamColor('var(--charcoal)');
    }
  };

  // Inner pages always light
  if (!hasDarkHero) {
    navbar.classList.add('nav-light');
    updateHamColor('var(--charcoal)');
  }

  window.addEventListener('scroll', setNavType, { passive: true });
  setNavType();

  function updateHamColor(color) {
    document.querySelectorAll('.ham-bar').forEach(b => b.style.background = color);
  }

  // Mobile menu open
  if (ham) {
    ham.addEventListener('click', () => {
      mMenu?.classList.add('open');
      document.body.style.overflow = 'hidden';
      ham.setAttribute('aria-expanded', 'true');
    });
  }
  // Mobile menu close
  if (mClose) {
    mClose.addEventListener('click', closeMobile);
  }
  // Close on background click
  if (mMenu) {
    mMenu.addEventListener('click', e => {
      if (e.target === mMenu) closeMobile();
    });
  }
  // ESC key closes
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobile();
  });

  function closeMobile() {
    mMenu?.classList.remove('open');
    document.body.style.overflow = '';
    ham?.setAttribute('aria-expanded', 'false');
  }
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        animateCount(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.counter').forEach(el => obs.observe(el));
}

function animateCount(el) {
  const target   = parseInt(el.dataset.target || '0');
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const duration = 1800;
  const start    = performance.now();

  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.floor(ease * target).toLocaleString('en-IN') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFaq() {
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.faq-item');
      const content = item.querySelector('.faq-content');
      const isOpen  = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item.active').forEach(open => {
        open.classList.remove('active');
        open.querySelector('.faq-content')?.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('active');
        content?.classList.add('open');
      }
    });
  });
}

/* ============================================================
   RESOURCE TABS
   ============================================================ */
function initTabs() {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabPanels.forEach(p => {
        p.classList.toggle('active', p.dataset.panel === target);
      });
    });
  });
}

/* ============================================================
   CONTACT FORM (Formspree)
   ============================================================ */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Sending…';

    // Simple spinner
    const style = document.createElement('style');
    style.textContent = '.spin { animation: spin-slow 1s linear infinite; }';
    document.head.appendChild(style);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        form.innerHTML = `
          <div style="text-align:center;padding:48px 0;">
            <div style="width:64px;height:64px;border-radius:50%;background:rgba(215,38,56,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D72638" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 class="display-sm font-serif" style="margin-bottom:12px;">Message Received</h3>
            <p class="lead" style="max-width:360px;margin:0 auto;">Thank you for reaching out. Shiv will respond within 24 hours.</p>
          </div>`;
      } else {
        throw new Error('failed');
      }
    } catch {
      btn.disabled = false;
      btn.innerHTML = orig;
      let errEl = form.querySelector('.form-error');
      if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form-error';
        errEl.style.cssText = 'color:var(--red);font-size:.875rem;margin-top:12px;';
        form.appendChild(errEl);
      }
      errEl.textContent = 'There was an issue. Please email directly at hello@igniteddream.com';
    }
  });
}

/* ============================================================
   LEADERSHIP QUIZ
   ============================================================ */
function initQuiz() {
  const quizEl = document.getElementById('quiz');
  if (!quizEl) return;

  const questions = [
    {
      q: 'When your team faces a challenge, your first instinct is to:',
      opts: [
        { text: 'Analyze root cause before deciding',   type: 'analytical'    },
        { text: 'Rally the team and build momentum',    type: 'inspirational' },
        { text: 'Build a clear step-by-step action plan', type: 'structured'  },
        { text: 'Coach each person through it',         type: 'coaching'      },
      ]
    },
    {
      q: 'Your biggest leadership strength is:',
      opts: [
        { text: 'Data-driven, precise decisions',        type: 'analytical'    },
        { text: 'Inspiring people beyond their limits',  type: 'inspirational' },
        { text: 'Creating systems that scale reliably',  type: 'structured'    },
        { text: 'Unlocking individual potential',        type: 'coaching'      },
      ]
    },
    {
      q: 'A team member is consistently underperforming. You:',
      opts: [
        { text: 'Review metrics and present findings',   type: 'analytical'    },
        { text: 'Have an energizing, candid conversation', type: 'inspirational' },
        { text: 'Create a structured improvement plan',  type: 'structured'    },
        { text: 'Conduct a deep one-on-one session',     type: 'coaching'      },
      ]
    },
    {
      q: 'Your team would describe you as:',
      opts: [
        { text: 'Thoughtful and precise',               type: 'analytical'    },
        { text: 'Energetic and visionary',               type: 'inspirational' },
        { text: 'Organized and dependable',              type: 'structured'    },
        { text: 'Empathetic and developmental',          type: 'coaching'      },
      ]
    },
  ];

  const results = {
    analytical: {
      title: 'The Strategic Thinker',
      desc:  'You lead with clarity, data, and precision. Your team trusts your decisions because they are always thought through.',
      prog:  'Leadership Pro',
    },
    inspirational: {
      title: 'The Visionary Leader',
      desc:  'You energize rooms and move people. Your X Factor turns average teams into inspired ones.',
      prog:  'X Factor Pro',
    },
    structured: {
      title: 'The Systems Builder',
      desc:  'You create order from chaos and build things that last. Reliability is your superpower.',
      prog:  'Leadership Pro',
    },
    coaching: {
      title: 'The Growth Catalyst',
      desc:  'You grow people. Your greatest satisfaction is watching someone surpass their own expectations.',
      prog:  'Self Mastery Pro',
    },
  };

  let current = 0;
  let answers  = [];

  function render() {
    const q        = questions[current];
    const progress = (current / questions.length) * 100;
    quizEl.innerHTML = `
      <div class="quiz-progress-bar mb-3">
        <div class="quiz-progress-fill" style="width:${progress}%"></div>
      </div>
      <p style="font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gray);margin-bottom:20px;">
        Question ${current + 1} of ${questions.length}
      </p>
      <p class="font-serif" style="font-size:1.25rem;font-weight:600;color:var(--charcoal);margin-bottom:24px;">${q.q}</p>
      <div>
        ${q.opts.map((o, i) => `
          <button class="quiz-option" data-idx="${i}" data-type="${o.type}">${o.text}</button>
        `).join('')}
      </div>`;

    quizEl.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        answers.push(btn.dataset.type);
        btn.classList.add('selected');
        quizEl.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);
        setTimeout(() => {
          current++;
          if (current < questions.length) render();
          else showResult();
        }, 380);
      });
    });
  }

  function showResult() {
    const counts   = answers.reduce((a, t) => { a[t] = (a[t] || 0) + 1; return a; }, {});
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const r        = results[dominant];

    quizEl.innerHTML = `
      <div style="text-align:center;padding:32px 0 16px;">
        <div class="section-label" style="margin-bottom:12px;">Your Leadership Style</div>
        <h3 class="display-md font-serif" style="margin-bottom:16px;">${r.title}</h3>
        <span class="red-divider red-divider-center"></span>
        <p class="lead" style="max-width:440px;margin:0 auto 24px;">${r.desc}</p>
        <p style="font-size:.875rem;color:var(--gray);margin-bottom:28px;">
          Recommended: <strong style="color:var(--red)">${r.prog}</strong>
        </p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <a href="courses.html" class="btn btn-red">Explore ${r.prog}</a>
          <button onclick="restartQuiz()" class="btn btn-outline-dark">Retake Quiz</button>
        </div>
      </div>`;
  }

  window.restartQuiz = () => { current = 0; answers = []; render(); };
  render();
}

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.style.color = 'var(--red)';
    }
  });
}

/* ============================================================
   SMOOTH ANCHOR SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
