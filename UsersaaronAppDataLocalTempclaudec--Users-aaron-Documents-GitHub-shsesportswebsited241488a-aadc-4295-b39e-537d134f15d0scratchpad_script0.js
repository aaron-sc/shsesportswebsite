
/* ── CANVAS: AURORA / NEBULA BACKGROUND ── */
(function() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, pts = [], orbs = [];

  const PARTICLE_COLORS = [
    [192, 132, 252],
    [255, 208,  96],
    [124,  58, 237],
    [168, 85,  247],
  ];

  const ORB_COLORS = [
    [124,  58, 237],
    [192, 132, 252],
    [255, 208,  96],
    [168,  85, 247],
    [100,  20, 180],
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();

    /* aurora orbs */
    orbs = ORB_COLORS.map((c, i) => ({
      x:  (i / ORB_COLORS.length) * W + Math.random() * 200 - 100,
      y:  Math.random() * H * 0.65,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.12,
      r:  Math.random() * 280 + 160,
      c,
      a:  Math.random() * 0.055 + 0.018,
      pa: Math.random() * Math.PI * 2,
      pf: Math.random() * 0.0005 + 0.0003,
    }));

    /* particles */
    pts = [];
    const n = Math.min(Math.floor(W * H / 12000), 65);
    for (let i = 0; i < n; i++) {
      const c = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      pts.push({
        x:  Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r:  Math.random() * 1.3 + 0.3,
        a:  Math.random() * 0.45 + 0.1,
        c,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = performance.now() * 0.001;

    /* aurora blobs */
    orbs.forEach(o => {
      o.pa += o.pf;
      const pulseA = o.a * (0.7 + 0.3 * Math.sin(o.pa));
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `rgba(${o.c[0]},${o.c[1]},${o.c[2]},${pulseA})`);
      g.addColorStop(0.5, `rgba(${o.c[0]},${o.c[1]},${o.c[2]},${pulseA * 0.4})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      o.x += o.vx; o.y += o.vy;
      if (o.x < -o.r)     o.x = W + o.r;
      if (o.x > W + o.r)  o.x = -o.r;
      if (o.y < -o.r)     o.y = H + o.r;
      if (o.y > H + o.r)  o.y = -o.r;
    });

    /* particle network */
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(192,132,252,${0.08 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', init);
  init(); draw();
})();

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ── ACHIEVEMENT COUNTER ANIMATION ── */
(function() {
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(ease * target);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  }

  const achObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        animateCounter(e.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.achievement-num[data-target]').forEach(el => achObs.observe(el));
})();

/* ── TYPEWRITER ON HERO TAG ── */
(function() {
  const el = document.querySelector('.hero-tag');
  const full = el.textContent.trim();
  el.textContent = '';
  el.style.opacity = '1';
  el.style.animation = 'none';
  el.style.transform = 'none';
  let i = 0;
  setTimeout(() => {
    const t = setInterval(() => {
      el.textContent = full.slice(0, ++i);
      if (i >= full.length) clearInterval(t);
    }, 38);
  }, 3600);
})();

/* ── TRADING CARDS: FLIP + PACK OPEN ── */
(function() {

  /* ── FLIP + TILT (attached to grid cards and overlay clones) ── */
  function wireFlip(card) {
    const inner = card.querySelector('.tc-inner');
    if (!inner || card._tcInited) return;
    card._tcInited = true;
    card.addEventListener('click', () => {
      inner.style.transition = '';
      inner.style.transform  = '';
      void inner.offsetWidth;
      inner.style.transition = 'transform 0.65s cubic-bezier(0.4,0,0.2,1)';
      inner.classList.toggle('flipped');
    });
    card.addEventListener('mousemove', e => {
      if (inner.classList.contains('flipped')) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      inner.style.transition = 'transform 0.06s ease';
      inner.style.transform  = `rotateY(${x*14}deg) rotateX(${-y*10}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      if (inner.classList.contains('flipped')) return;
      inner.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      inner.style.transform  = '';
    });
  }
  function initCards() { document.querySelectorAll('.tc').forEach(wireFlip); }

  /* ── PACK ELEMENTS (always present in DOM when script runs) ── */
  const packOuter    = document.getElementById('pack-outer');
  const packStage    = document.getElementById('pack-stage');
  const teamGrid     = document.getElementById('teamGrid');
  const staffDiv     = document.getElementById('staffDivider');
  const coachGrid    = document.getElementById('coachGrid');
  const flash        = document.getElementById('pack-flash');
  const packHint     = document.getElementById('packHint');
  const progressRing = document.getElementById('packRing');
  const halfT        = packOuter && packOuter.querySelector('.pack-half-t');
  const halfB        = packOuter && packOuter.querySelector('.pack-half-b');
  const tearLine     = packOuter && packOuter.querySelector('.pack-tear-line');

  if (!packOuter) { initCards(); return; }

  /* Orbiting sparkles */
  for (let i = 0; i < 12; i++) {
    const s = document.createElement('div');
    s.className = 'pack-spark';
    const ang = (i / 12) * Math.PI * 2;
    const rad = 100 + Math.random() * 65;
    s.style.cssText = `left:${50+Math.cos(ang)*48}%;top:${50+Math.sin(ang)*54}%;`
      + `--dx:${(Math.cos(ang)*rad).toFixed(0)}px;--dy:${(Math.sin(ang)*rad).toFixed(0)}px;`
      + `animation-duration:${2+Math.random()*2.8}s;animation-delay:${(Math.random()*2.8).toFixed(2)}s;`;
    packOuter.appendChild(s);
  }

  /* ════════════════════════════════════════
     SMASH-TO-OPEN mechanic
     Click the pack 3 times. Each hit squash-and-stretches the pack,
     fills 1/3 of the ring, and adds visible crack lines.
     Third hit triggers the tear sequence.
  ════════════════════════════════════════ */
  const RING_DASH  = 1444;
  const PUMP_LIMIT = 3;
  let pumpCount = 0, tearing = false;

  const hintStages = [
    '▮  SMASH TO OPEN  ▮',
    '▮▮  AGAIN!',
    '▮▮▮  ONE MORE!'
  ];

  function doPump() {
    if (tearing || packOuter.classList.contains('opening')) return;
    pumpCount++;

    /* Fill ring segment with a snappy spring transition */
    if (progressRing) {
      progressRing.style.transition = 'stroke-dashoffset 0.38s cubic-bezier(0.34,1.5,0.64,1)';
      progressRing.style.strokeDashoffset = RING_DASH * (1 - pumpCount / PUMP_LIMIT);
    }

    /* Squash-and-stretch punch */
    packOuter.classList.remove('pump');
    void packOuter.offsetWidth;
    packOuter.classList.add('pump');
    setTimeout(() => packOuter.classList.remove('pump'), 420);

    /* Escalate state */
    packOuter.classList.remove('state-1', 'state-2');
    if (pumpCount === 1) {
      packOuter.classList.add('state-1');
      if (packHint) packHint.textContent = hintStages[1];
    } else if (pumpCount === 2) {
      packOuter.classList.add('state-2');
      if (packHint) packHint.textContent = hintStages[2];
    }

    /* Small particle burst at the tear line on each hit */
    const r = packOuter.getBoundingClientRect();
    burstParticles(r.left + r.width / 2, r.top + r.height / 2, 12);

    /* Third hit → tear */
    if (pumpCount >= PUMP_LIMIT) {
      packOuter.style.pointerEvents = 'none';
      setTimeout(runTear, 100);
    }
  }

  packOuter.addEventListener('click', doPump);

  /* Skip button — bypasses pack entirely and fades roster in */
  const packSkipBtn = document.getElementById('packSkipBtn');
  if (packSkipBtn) {
    packSkipBtn.addEventListener('click', e => {
      e.stopPropagation(); /* don't trigger packOuter's click handler */
      if (tearing) return;
      tearing = true; /* prevent pack from being clicked afterwards */
      packStage.style.transition = 'opacity 0.35s ease';
      packStage.style.opacity = '0';
      setTimeout(() => {
        packStage.style.display = 'none';
        [teamGrid, staffDiv, coachGrid].forEach(el => { if (el) el.style.display = ''; });
        dealGrid();
      }, 380);
    });
  }

  /* ════════════════════════════════════════
     TEAR SEQUENCE
  ════════════════════════════════════════ */
  function spawnShockwave() {
    ['rgba(255,208,96,0.9)', 'rgba(192,132,252,0.7)', 'rgba(255,255,255,0.5)'].forEach((c, i) => {
      setTimeout(() => {
        const sw = document.createElement('div');
        sw.className = 'cr-shockwave';
        sw.style.borderColor = c;
        document.body.appendChild(sw);
        setTimeout(() => sw.remove(), 1100);
      }, i * 85);
    });
  }

  function burstParticles(cx, cy, count) {
    const colors = ['#FFD060','#C084FC','#ffffff','#FFD060','#E0A500','#A855F7'];
    for (let i = 0; i < count; i++) {
      const p    = document.createElement('div');
      p.className = 'cr-particle';
      const ang  = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.65;
      const dist = 65 + Math.random() * 195;
      const size = 3 + Math.random() * 8;
      p.style.cssText = [
        `left:${cx}px`, `top:${cy}px`,
        `background:${colors[i % colors.length]}`,
        `width:${size}px`, `height:${size}px`,
        `--px:${(Math.cos(ang)*dist).toFixed(1)}px`,
        `--py:${(Math.sin(ang)*dist).toFixed(1)}px`,
        `animation-duration:${0.6+Math.random()*0.6}s`,
        `animation-delay:${(Math.random()*0.08).toFixed(2)}s`
      ].join(';');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1300);
    }
  }

  /* 7 card silhouettes blast out of the pack when it opens */
  function spawnBurstCards() {
    const r  = packOuter.getBoundingClientRect();
    const cx = r.left + r.width  / 2 - 56;
    const cy = r.top  + r.height / 2 - 80;
    /* Trajectories: 6 fan upward/sideways, 1 falls down */
    const paths = [
      { bx:-320, by:-190, br:-46, d:0  },
      { bx:-190, by:-355, br:-26, d:42 },
      { bx: -42, by:-395, br: -7, d:16 },
      { bx: 125, by:-375, br: 16, d:58 },
      { bx: 260, by:-310, br: 34, d:6  },
      { bx: 355, by:-135, br: 50, d:28 },
      { bx:  65, by: 270, br:-24, d:48 },
    ];
    paths.forEach(({ bx, by, br, d }) => {
      const el = document.createElement('div');
      el.className = 'burst-card';
      el.style.cssText = `left:${cx}px;top:${cy}px;--bx:${bx}px;--by:${by}px;--br:${br}deg;animation-delay:${d}ms;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1050 + d);
    });
  }

  function runTear() {
    tearing = true;
    packOuter.classList.add('opening');
    packOuter.classList.remove('state-1', 'state-2', 'pump');
    /* Clear any inline style overrides */
    packOuter.style.transition = '';
    packOuter.style.transform  = '';
    packOuter.style.filter     = '';
    packOuter.style.animation  = 'none';
    packOuter.style.pointerEvents = 'none';

    /* Brief violent shake burst */
    setTimeout(() => packOuter.classList.add('shake'), 80);

    /* Halves fly apart */
    setTimeout(() => {
      packOuter.classList.remove('shake');
      packOuter.style.transition = '';
      packOuter.classList.add('open');
    }, 530);

    /* Shockwaves + particle burst at tear line */
    setTimeout(() => {
      spawnShockwave();
      const r = packOuter.getBoundingClientRect();
      burstParticles(r.left + r.width/2, r.top + r.height/2, 32);
    }, 550);

    /* Cards BLAST out of the pack */
    setTimeout(spawnBurstCards, 580);

    /* White radial flash */
    setTimeout(() => flash.classList.add('on'),    700);
    setTimeout(() => flash.classList.remove('on'), 940);

    /* Collapse pack stage → grids appear → overlay
       Extended delay so burst cards are visible before overlay darkens everything */
    setTimeout(() => {
      packStage.style.transition = 'opacity 0.4s ease, min-height 0.5s ease';
      packStage.style.opacity    = '0';
      packStage.style.minHeight  = '0';
      packStage.style.overflow   = 'hidden';
      [teamGrid, staffDiv, coachGrid].forEach(el => { if (el) el.style.display = ''; });
      setTimeout(() => {
        packStage.style.display = 'none';
        launchOverlay();
      }, 700);   /* was 480 — extra 220ms lets burst cards finish flying */
    }, 1020);
  }

  /* ════════════════════════════════════════
     CARD REVEAL OVERLAY
     Overlay div (#cr-overlay) lives AFTER this script tag in the HTML,
     so we look it up lazily inside launchOverlay().
  ════════════════════════════════════════ */
  let allCards = [];

  function dealGrid() {
    initCards();
    /* Staggered fade-in — no bounce */
    document.querySelectorAll('.tc').forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transition = `opacity 0.45s ease ${i * 55}ms`;
      requestAnimationFrame(() => requestAnimationFrame(() => { c.style.opacity = '1'; }));
    });
  }

  function launchOverlay() {
    /* Lazy lookup — overlay div is after the script tag in DOM */
    const ov       = document.getElementById('cr-overlay');
    const cardSlot = document.getElementById('crCardSlot');
    const nameEl   = document.getElementById('crName');
    const roleEl   = document.getElementById('crRole');
    const curNumEl = document.getElementById('crCurNum');
    const totNumEl = document.getElementById('crTotNum');
    const nextBtn  = document.getElementById('cr-next');
    const skipBtn  = document.getElementById('cr-skip-all');

    if (!ov || !cardSlot) { dealGrid(); return; }

    allCards = [...document.querySelectorAll('.tc')];
    if (totNumEl) totNumEl.textContent = allCards.length;
    ov.setAttribute('aria-hidden', 'false');
    ov.classList.add('active');

    /* Corner brackets — draw in from each corner with a staggered delay */
    const bracketDelays = {tl:0, tr:90, bl:160, br:250};
    ['tl','tr','bl','br'].forEach(pos => {
      const b = document.createElement('div');
      b.className = `cr-bracket cr-bracket-${pos}`;
      const d = bracketDelays[pos];
      b.style.animation = `bracketDraw 0.5s ${d}ms cubic-bezier(0.34,1.45,0.64,1) both, bracketPulse 2.5s ${d+520}ms ease-in-out infinite`;
      cardSlot.appendChild(b);
    });

    /* Ember emitter — slow ambient drift, not a burst */
    let emberTimer = null;
    const TINTS = {
      'av-v':'rgba(255,208,96,0.2)',  'av-f':'rgba(192,132,252,0.2)',
      'av-n':'rgba(239,68,68,0.2)',   'av-t':'rgba(168,85,247,0.2)',
      'av-r':'rgba(59,130,246,0.2)',  'av-a':'rgba(16,185,129,0.2)',
      'av-tr':'rgba(99,102,241,0.2)'
    };
    const EMBER_COLORS = ['#FFD060','#C084FC','#E0A500','#A855F7'];

    function startEmbers() {
      if (emberTimer) clearInterval(emberTimer);
      emberTimer = setInterval(() => {
        const r  = cardSlot.getBoundingClientRect();
        const e  = document.createElement('div');
        e.className = 'cr-ember';
        /* Spawn from the sides and bottom of the card */
        const side = Math.random() < 0.5 ? 'left' : 'right';
        const x  = side === 'left'
          ? r.left - 5 + Math.random() * (r.width * 0.25)
          : r.right - (r.width * 0.25) + Math.random() * (r.width * 0.25);
        const y  = r.top + r.height * (0.5 + Math.random() * 0.5);
        const dx = (Math.random() - 0.5) * 55;
        const dy = -(50 + Math.random() * 90);
        const sz = 2 + Math.random() * 3;
        e.style.cssText = [
          `left:${x}px`, `top:${y}px`,
          `background:${EMBER_COLORS[Math.floor(Math.random()*EMBER_COLORS.length)]}`,
          `--ex:${dx.toFixed(0)}px`, `--ey:${dy.toFixed(0)}px`,
          `animation-duration:${1.5+Math.random()*1.6}s`,
          `width:${sz}px`, `height:${sz}px`
        ].join(';');
        document.body.appendChild(e);
        setTimeout(() => e.remove(), 3000);
      }, 240); /* slower rate — ambient, not a fireworks show */
    }
    function stopEmbers() { if (emberTimer) { clearInterval(emberTimer); emberTimer = null; } }

    /* Typewriter effect for the player name */
    function typewrite(el, className, text) {
      el.className = className;
      el.innerHTML = '';
      const cursor = document.createElement('span');
      cursor.className = 'cr-cursor';
      el.appendChild(cursor);
      let i = 0;
      const t = setInterval(() => {
        cursor.insertAdjacentText('beforebegin', text[i] || '');
        i++;
        if (i >= text.length) {
          clearInterval(t);
          setTimeout(() => cursor.remove(), 1000);
        }
      }, 42);
    }

    let revIdx = 0;

    function showCard(idx) {
      const card = allCards[idx];
      if (!card) return;
      revIdx = idx + 1;

      /* Dynamic spotlight tint from role colour */
      const av = card.querySelector('.tc-av');
      let tint = 'rgba(124,58,237,0.2)';
      if (av) for (const [cls, col] of Object.entries(TINTS)) {
        if (av.classList.contains(cls)) { tint = col; break; }
      }
      ov.style.setProperty('--cr-tint', tint);

      /* Counter */
      if (curNumEl) {
        curNumEl.classList.remove('cr-counter-pop');
        void curNumEl.offsetWidth;
        curNumEl.textContent = idx + 1;
        curNumEl.classList.add('cr-counter-pop');
      }

      /* Name types itself in; role fades in normally */
      const nm   = card.querySelector('.tc-name');
      const tags = card.querySelectorAll('.tc-tag');
      if (nameEl) typewrite(nameEl, 'cr-name cr-name-anim', nm ? nm.textContent.trim() : '');
      if (roleEl) {
        roleEl.className   = 'cr-role';
        roleEl.textContent = [...tags].map(t => t.textContent.trim()).join('  ·  ');
        void roleEl.offsetWidth;
        roleEl.className   = 'cr-role cr-role-anim';
      }

      /* EXIT old card */
      const prev = cardSlot.querySelector('.tc');
      if (prev) {
        prev.style.animation = 'none'; /* kill float/glow */
        void prev.offsetWidth;
        prev.style.animation = '';
        prev.classList.remove('cr-card-in', 'cr-card-glow');
        prev.classList.add('cr-card-out');
        setTimeout(() => { if (prev.parentNode) prev.remove(); }, 580);
      }

      /* ENTER new card (position:absolute — overlaps with exiting card) */
      const clone = card.cloneNode(true);
      clone._tcInited = false;
      clone.classList.remove('dealing','just-revealed','reveal');
      clone.style.opacity = '';
      clone.classList.add('cr-card-in', 'cr-card-glow');
      cardSlot.appendChild(clone);
      wireFlip(clone);

      /* Two portal rings expand outward when card materializes */
      const ring1 = document.createElement('div');
      ring1.className = 'cr-portal-ring';
      cardSlot.appendChild(ring1);
      setTimeout(() => { if (ring1.parentNode) ring1.remove(); }, 820);

      const ring2 = document.createElement('div');
      ring2.className = 'cr-portal-ring b';
      cardSlot.appendChild(ring2);
      setTimeout(() => { if (ring2.parentNode) ring2.remove(); }, 1050);

      /* Subtle scan line */
      const sweep = document.createElement('div');
      sweep.className = 'cr-scan-sweep';
      clone.appendChild(sweep);
      setTimeout(() => { if (sweep.parentNode) sweep.remove(); }, 1400);

      /* After portal-rise finishes, switch to gentle float */
      setTimeout(() => {
        if (!clone.parentNode) return;
        clone.classList.remove('cr-card-in');
        clone.style.animation = 'crFloat 4.5s ease-in-out infinite, crGlow 2.5s ease-in-out infinite';
        clone.style.borderRadius = '12px';
      }, 900);

      /* Particle burst at the card's midpoint when fully revealed */
      setTimeout(() => {
        const r = cardSlot.getBoundingClientRect();
        burstParticles(r.left + r.width/2, r.top + r.height * 0.5, 14);
      }, 480);

      startEmbers();
      if (nextBtn) nextBtn.textContent = (idx >= allCards.length - 1) ? 'VIEW FULL ROSTER  ✦' : 'NEXT CARD  →';
    }

    function closeOv(cb) {
      stopEmbers();
      ov.style.transition = 'opacity 0.5s ease';
      ov.classList.remove('active');
      ov.setAttribute('aria-hidden', 'true');
      setTimeout(() => { cardSlot.innerHTML = ''; if (cb) cb(); }, 560);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (revIdx < allCards.length) showCard(revIdx);
      else closeOv(dealGrid);
    });
    if (skipBtn) skipBtn.addEventListener('click', () => {
      closeOv(() => {
        initCards();
        document.querySelectorAll('.tc').forEach(c => { c.style.opacity = '1'; });
      });
    });

    showCard(0);
  }

})();

/* ── SCROLL SPY ── */
(function() {
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...links].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('spy-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));
})();

/* ── HERO PARALLAX ON SCROLL ── */
(function() {
  const bg = document.querySelector('.hero-photo-bg');
  if (!bg) return;
  const onScroll = () => {
    const y = window.scrollY;
    bg.style.transform = `translateY(calc(${y * 0.28}px))`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── FLOATING HERO SPARKLES ── */
(function() {
  const hero = document.getElementById('home');
  function spawn() {
    const s = document.createElement('div');
    s.className = 'hero-spark';
    const size = Math.random() * 3 + 1.5;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${10 + Math.random() * 80}%;
      bottom:${10 + Math.random() * 30}%;
      animation-duration:${3.5 + Math.random() * 4}s;
      animation-delay:${Math.random() * 2}s;
      opacity:0;
    `;
    hero.appendChild(s);
    setTimeout(() => s.remove(), 8000);
  }
  setInterval(spawn, 600);
  for (let i = 0; i < 6; i++) spawn();
})();

/* ── INTRO: TACTICAL BRIEF ── */
(function() {
  const sc = document.getElementById('intro-screen');

  /* Skip intro if already seen */
  if (localStorage.getItem('shse_introSeen')) {
    sc.classList.add('gone');
    return;
  }

  document.body.style.overflow = 'hidden';

  const grid = document.getElementById('isGrid');
  const sw   = document.getElementById('isSweep');
  const cns  = ['isCnTL','isCnTR','isCnBL','isCnBR'].map(id => document.getElementById(id));
  const stL  = document.getElementById('isStreamL');
  const stR  = document.getElementById('isStreamR');
  const ret  = document.getElementById('isRet');
  const ring = document.getElementById('isRing');
  const spokes = ['isSp1','isSp2','isSp3','isSp4'].map(id => document.getElementById(id));
  const ticks  = ['isTk1','isTk2','isTk3','isTk4'].map(id => document.getElementById(id));
  const pip  = document.getElementById('isPip');
  const orbL = document.getElementById('isOrbL');
  const orbR = document.getElementById('isOrbR');
  const wm   = document.getElementById('isWm');
  const div  = document.getElementById('isDivider');
  const sub  = document.getElementById('isSub');
  const bar  = document.getElementById('isBar');
  const stat = document.getElementById('isStatus');

  const leftLines  = ['45.860°N','108.530°W','ALT  3209FT','PING   8MS','LOSS  0.0%','TEAM ACTIVE','MTB   100%','LINK SECURE'];
  const rightLines = ['VALORANT','COMP RANK','ROSTER 5/5','ACE  READY','FLEX QUEUE','STRATS LOCK','SOVA  MAIN','JETT  LOCK'];
  const msgs = ['INITIALIZING SYSTEMS','LOADING ROSTER DATA','ESTABLISHING LINK','SYNCING HUD OVERLAY','ALL SYSTEMS NOMINAL','▮ READY TO DEPLOY'];

  function buildStream(el, lines) {
    el.innerHTML = lines.map(l => `<div>${l}</div>`).join('');
  }

  // Rolling status messages
  let mi = 0;
  let msgIv;
  function startMsgs() {
    msgIv = setInterval(() => {
      stat.textContent = msgs[Math.min(++mi, msgs.length - 1)];
      if (mi >= msgs.length - 1) clearInterval(msgIv);
    }, 310);
  }

  // Occasionally flash a "hot" data line in each stream
  function hotFlash(el) {
    const rows = el.querySelectorAll('div');
    if (!rows.length) return;
    const idx = Math.floor(Math.random() * rows.length);
    rows[idx].classList.add('hot');
    setTimeout(() => rows[idx].classList.remove('hot'), 260);
  }

  // T+80ms: grid fades in, sweep starts
  setTimeout(() => {
    grid.classList.add('on');
    sw.classList.add('go');
  }, 80);

  // T+400ms: corners expand, streams appear, bar appears
  setTimeout(() => {
    cns.forEach(c => c.classList.add('on'));
    buildStream(stL, leftLines);
    buildStream(stR, rightLines);
    stL.classList.add('on');
    stR.classList.add('on');
    bar.classList.add('on');
    startMsgs();
    // Periodically flash data lines while reticle draws
    const flashIv = setInterval(() => {
      hotFlash(stL); hotFlash(stR);
    }, 180);
    setTimeout(() => clearInterval(flashIv), 1400);
  }, 400);

  // T+680ms: reticle appears, ring draws
  setTimeout(() => {
    ret.classList.add('on');
    ring.classList.add('draw');
  }, 680);

  // T+1080ms: spokes + ticks + pip + orbit labels draw in
  setTimeout(() => {
    spokes.forEach((s, i) => setTimeout(() => s.classList.add('draw'), i * 55));
    ticks.forEach((t, i)  => setTimeout(() => t.classList.add('on'),  i * 40 + 100));
    pip.classList.add('on');
    orbL.classList.add('on');
    orbR.classList.add('on');
    // Also draw the arc fill
    sc.querySelectorAll('.is-arc').forEach(a => a.classList.add('draw'));
  }, 1080);

  // T+1380ms: wordmark emerges from inside reticle (starts at 0.18× scale)
  setTimeout(() => {
    wm.classList.add('expand', 'bloom');
  }, 1380);

  // T+1750ms: reticle contracts away as logo fills screen
  setTimeout(() => {
    ret.classList.remove('on');
    ret.classList.add('out');
    stL.style.opacity = '0.12';
    stR.style.opacity = '0.12';
  }, 1750);

  // T+1950ms: divider expands
  setTimeout(() => { div.style.width = 'min(340px, 68vw)'; }, 1950);

  // T+2150ms: subtitle fades in
  setTimeout(() => { sub.style.opacity = '1'; }, 2150);

  // T+2250ms: status finalises
  setTimeout(() => { stat.textContent = '▮ READY TO DEPLOY'; }, 2250);

  // T+2550ms: phosphor flash then TV-off crush
  setTimeout(() => {
    const fl = document.createElement('div');
    fl.style.cssText = 'position:absolute;inset:0;background:#fff;opacity:0.12;pointer-events:none;z-index:99;transition:opacity 0.12s ease;';
    sc.appendChild(fl);
    requestAnimationFrame(() => { fl.style.opacity = '0'; });
    setTimeout(() => { sc.classList.add('gone'); }, 140);
  }, 2550);

  // T+2720ms: restore scroll + mark intro as seen
  setTimeout(() => {
    document.body.style.overflow = '';
    localStorage.setItem('shse_introSeen', '1');
  }, 2720);
})();

/* ── FEATURE 2: SCROLL PROGRESS BAR ── */
(function() {
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── FEATURE 3: STATS TICKER DUPLICATE ── */
(function() {
  const track = document.getElementById('tickerTrack');
  if (track) track.innerHTML += track.innerHTML;
})();

/* ── FEATURE 4: MOUSE TRAIL PARTICLES ── */
(function() {
  const COLORS = ['#FFD060','#C084FC','#7C3AED','#A855F7','#F0A500'];
  let last = 0;
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - last < 40) return;
    last = now;
    const p = document.createElement('div');
    const size = Math.random() * 5 + 2;
    p.style.cssText = `
      position:fixed;pointer-events:none;z-index:9997;border-radius:50%;
      width:${size}px;height:${size}px;
      background:${COLORS[Math.floor(Math.random()*COLORS.length)]};
      box-shadow:0 0 ${size*2}px currentColor;
      left:${e.clientX}px;top:${e.clientY}px;
      animation:trail-fade 0.55s ease forwards;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 560);
  });
})();

/* ── FEATURE 5: CLICK RIPPLE ── */
document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.className = 'click-ripple';
  r.style.left = e.clientX + 'px';
  r.style.top  = e.clientY + 'px';
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

/* ── FEATURE 6: SHOOTING STARS IN HERO ── */
(function() {
  const hero = document.getElementById('home');
  function shoot() {
    const s = document.createElement('div');
    s.className = 'shoot-star';
    const angle = 20 + Math.random() * 25;
    s.style.cssText = `
      top:${5 + Math.random() * 55}%;
      left:${Math.random() * 75}%;
      transform:rotate(${angle}deg);
      transform-origin: left center;
      animation-duration:${0.7 + Math.random() * 0.6}s;
    `;
    hero.appendChild(s);
    setTimeout(() => s.remove(), 1400);
  }
  setInterval(shoot, 2200);
  setTimeout(shoot, 1000);
  setTimeout(shoot, 1800);
})();

/* ── FEATURE 7: TAB VISIBILITY TITLE CHANGE ── */
(function() {
  const base = document.title;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = '👾 Come Back! | Sentinel Esports';
    } else {
      document.title = '⚡ Welcome Back! | Sentinel Esports';
      setTimeout(() => { document.title = base; }, 2500);
    }
  });
})();

/* ── FEATURE 8: DISCORD CLIPBOARD + TOAST ── */
(function() {
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 350);
    }, 2800);
  }
  const btn = document.querySelector('.discord-float');
  if (btn) {
    btn.addEventListener('click', (e) => {
      navigator.clipboard.writeText('https://discord.gg/kZgsX6gnEv').catch(() => {});
      showToast('✓ Invite link copied to clipboard!');
    });
  }
})();

/* ── FEATURE 9: KONAMI CODE EASTER EGG ── */
(function() {
  const CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', e => {
    idx = e.key === CODE[idx] ? idx + 1 : 0;
    if (idx === CODE.length) { idx = 0; triggerKonami(); }
  });
  function triggerKonami() {
    const ov = document.createElement('div');
    ov.className = 'konami-overlay';
    ov.innerHTML = '<div class="konami-text">CHEAT CODE ACTIVATED</div><div class="konami-sub">// Sentinel Esports //</div>';
    const COLS = ['#FFD060','#C084FC','#7C3AED','#fff'];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement('div');
      c.className = 'konfetti';
      const w = 4 + Math.random() * 7, h = 4 + Math.random() * 12;
      c.style.cssText = `
        left:${Math.random()*100}vw;width:${w}px;height:${h}px;
        background:${COLS[Math.floor(Math.random()*COLS.length)]};
        border-radius:${Math.random()>.5?'50%':'2px'};
        animation-delay:${Math.random()*.6}s;
        animation-duration:${1.4+Math.random()*1.6}s;
      `;
      ov.appendChild(c);
    }
    document.body.appendChild(ov);
    setTimeout(() => ov.remove(), 4000);
  }
})();

/* ── FEATURE 10: ACHIEVEMENT CARD 3D TILT ── */
(function() {
  document.querySelectorAll('.achievement').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.08s ease, box-shadow 0.3s';
    });
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-5px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease, box-shadow 0.3s';
      card.style.transform = '';
    });
  });
})();

/* ── SCROLL TO TOP ── */
(function() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── DONOR TABS ── */
function showTab(id, btn) {
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + id).classList.add('active');
}

/* ── CONTACT / APPLY FORM ── */
function switchForm(id, btn) {
  document.querySelectorAll('.form-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.custom-form').forEach(f => f.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('form-' + id).classList.add('active');
}

(function() {
  document.querySelectorAll('.custom-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const submit = form.querySelector('.form-submit');
      const orig = submit.dataset.label;
      submit.textContent = '✓ Sent!';
      submit.classList.add('success');
      setTimeout(() => {
        submit.textContent = orig;
        submit.classList.remove('success');
        form.reset();
      }, 3200);
    });
  });
})();

/* ── MOBILE MENU ── */
const ham  = document.getElementById('hamburger');
const menu = document.getElementById('mobileMenu');
ham.addEventListener('click', () => menu.classList.toggle('open'));
function closeMobile() { menu.classList.remove('open'); }

/* ── NEW F1: SECTION TITLE TEXT SCRAMBLE ── */
(function() {
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
  function scrambleEl(el) {
    const finalHTML  = el.innerHTML;
    const plainText  = el.textContent;
    let t0 = null;
    (function frame(ts) {
      if (!t0) t0 = ts;
      const p   = Math.min((ts - t0) / 650, 1);
      const rev = Math.floor(p * plainText.length);
      el.textContent = plainText.split('').map((c, i) =>
        (c === ' ' || i < rev) ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      ).join('');
      if (p < 1) requestAnimationFrame(frame);
      else el.innerHTML = finalHTML;
    })(performance.now());
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.scrambled) {
        e.target.dataset.scrambled = '1';
        scrambleEl(e.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.section-title').forEach(t => obs.observe(t));
})();


/* ── NEW F3: HERO TITLE PERIODIC GLITCH ── */
(function() {
  const wm = document.querySelector('.hero-wordmark-inner');
  if (!wm) return;
  function scheduleGlitch() {
    setTimeout(() => {
      wm.classList.add('glitching');
      setTimeout(() => { wm.classList.remove('glitching'); scheduleGlitch(); }, 420);
    }, 3500 + Math.random() * 5500);
  }
  scheduleGlitch();
})();

/* ── NEW F4: CARD HOVER PARTICLE BURST ── */
(function() {
  function burst(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      const gold = Math.random() > 0.45;
      Object.assign(p.style, {
        position: 'fixed', width: '4px', height: '4px', borderRadius: '50%',
        background: gold ? '#FFD060' : '#C084FC',
        boxShadow: gold ? '0 0 6px #FFD060' : '0 0 6px #C084FC',
        left: (rect.left + Math.random() * rect.width) + 'px',
        top:  (rect.top  + Math.random() * rect.height * 0.4) + 'px',
        pointerEvents: 'none', zIndex: 9000,
        transition: `transform ${0.45 + Math.random() * 0.45}s ease, opacity 0.55s ease`,
      });
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${(Math.random() - 0.5) * 90}px, ${-(25 + Math.random() * 65)}px) scale(0)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 700);
    }
  }
  document.querySelectorAll('.tc, .achievement-card, .sponsor-card').forEach(c => c.addEventListener('mouseenter', burst));
})();

/* ── NEW F5: CURSOR SPOTLIGHT ── */
(function() {
  const lens = document.getElementById('cursor-lens');
  document.addEventListener('mousemove', e => {
    lens.style.background = `radial-gradient(circle 320px at ${e.clientX}px ${e.clientY}px, rgba(192,132,252,0.055) 0%, transparent 100%)`;
    lens.style.opacity = '1';
  }, { passive: true });
  document.addEventListener('mouseleave', () => { lens.style.opacity = '0'; });
})();

/* ── NEW F6: CROSSHAIR CURSOR ON HERO ── */
(function() {
  const ch   = document.getElementById('crosshair');
  const hero = document.getElementById('home');
  document.addEventListener('mousemove', e => {
    ch.style.left = e.clientX + 'px';
    ch.style.top  = e.clientY + 'px';
    const r = hero.getBoundingClientRect();
    const inHero = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    ch.style.opacity = inHero ? '1' : '0';
  }, { passive: true });
})();

/* ── NEW F7: ANIMATED SECTION DIVIDERS ── */
(function() {
  document.querySelectorAll('.content > section, .content > .ticker-wrap').forEach(el => {
    const d = document.createElement('div');
    d.className = 'section-divider';
    d.setAttribute('aria-hidden', 'true');
    el.after(d);
  });
})();

/* ── NEW F8: LIVE MISSOULA MT CLOCK ── */
(function() {
  const el = document.getElementById('live-clock');
  function tick() {
    const now = new Date();
    const opts = { timeZone: 'America/Denver', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    el.innerHTML = `<span style="letter-spacing:.08em;opacity:.5">MISSOULA MT</span><br>${now.toLocaleTimeString('en-US', opts)}`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── NEW F9: NAV SCRAMBLE ON HOVER ── */
(function() {
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const orig = a.textContent;
    let raf = null;
    a.addEventListener('mouseenter', () => {
      let t0 = null;
      cancelAnimationFrame(raf);
      (function frame(ts) {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / 280, 1);
        const rev = Math.floor(p * orig.length);
        a.textContent = orig.split('').map((c, i) =>
          (c === ' ' || i < rev) ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ).join('');
        if (p < 1) raf = requestAnimationFrame(frame);
        else a.textContent = orig;
      })(performance.now());
    });
    a.addEventListener('mouseleave', () => { cancelAnimationFrame(raf); a.textContent = orig; });
  });
})();

/* ── NEW F10: SECTION ENTER FLASH ── */
(function() {
  const flash = document.createElement('div');
  Object.assign(flash.style, {
    position: 'fixed', inset: '0', zIndex: '9996', pointerEvents: 'none',
    opacity: '0', background: 'radial-gradient(ellipse at center, rgba(192,132,252,0.07), transparent 70%)',
    transition: 'opacity 0.25s ease',
  });
  document.body.appendChild(flash);
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > 0.3) {
        flash.style.opacity = '1';
        setTimeout(() => { flash.style.opacity = '0'; }, 350);
      }
    });
  }, { threshold: [0.3] });
  document.querySelectorAll('section').forEach(s => obs.observe(s));
})();

/* ── PHOTO GALLERY ──
   Albums are just folders under images/gallery/ in this repo on GitHub.
   Create a new folder there and drop photos into it — this reads the repo
   listing live via the GitHub API, so no code changes are ever needed.
   Wrapped in DOMContentLoaded because #gallery-lightbox lives after this
   script tag in the HTML (same reason the card-reveal overlay above does). */
document.addEventListener('DOMContentLoaded', function() {
  const REPO = 'aaron-sc/shsesportswebsite';
  const GALLERY_PATH = 'images/gallery';
  const API_BASE = `https://api.github.com/repos/${REPO}/contents/${GALLERY_PATH}`;
  const IMG_RE = /\.(jpe?g|png|gif|webp|avif)$/i;
  const CACHE_KEY = 'sentinel-gallery-cache-v1';
  const CACHE_TTL = 5 * 60 * 1000;

  const grid   = document.getElementById('gallery-grid');
  const status = document.getElementById('gallery-status');
  if (!grid) return;

  async function fetchJSON(url) {
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error('GitHub API ' + res.status);
    return res.json();
  }

  async function loadAlbums() {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { time, albums } = JSON.parse(cached);
        if (Date.now() - time < CACHE_TTL) return albums;
      } catch (e) {}
    }

    const topLevel = await fetchJSON(API_BASE);
    const dirs = topLevel.filter(e => e.type === 'dir');

    const albums = await Promise.all(dirs.map(async dir => {
      const files = await fetchJSON(dir.url);
      const images = files
        .filter(f => f.type === 'file' && IMG_RE.test(f.name))
        .map(f => ({ name: f.name, url: f.download_url }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      return { name: dir.name, images };
    }));

    const populated = albums.filter(a => a.images.length > 0);
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), albums: populated }));
    return populated;
  }

  function prettify(name) {
    return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function render(albums) {
    if (!albums.length) {
      status.textContent = 'No albums yet — add a folder inside images/gallery on GitHub and drop photos into it to create one.';
      status.style.display = 'block';
      return;
    }
    status.style.display = 'none';

    grid.innerHTML = albums.map((a, i) => `
      <div class="album-card reveal" style="transition-delay:${(i % 6) * 0.06}s" data-album="${i}">
        <div class="album-cover" style="background-image:url('${a.images[0].url}')"></div>
        <div class="album-info">
          <div class="album-name">${prettify(a.name)}</div>
          <div class="album-count">${a.images.length} PHOTO${a.images.length === 1 ? '' : 'S'}</div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.album-card').forEach(card => {
      card.addEventListener('click', () => openAlbum(albums[+card.dataset.album]));
    });
    grid.querySelectorAll('.reveal').forEach(el => ro.observe(el));
  }

  loadAlbums()
    .then(render)
    .catch(err => {
      console.error('Gallery load failed:', err);
      status.textContent = 'Gallery unavailable right now — please refresh in a bit.';
      status.style.display = 'block';
    });

  /* ── lightbox ── */
  const lb           = document.getElementById('gallery-lightbox');
  const glTitle       = document.getElementById('gl-album-title');
  const glGrid         = document.getElementById('gl-album-grid');
  const albumView     = document.getElementById('gl-album-view');
  const photoView      = document.getElementById('gl-photo-view');
  const photoImg      = document.getElementById('gl-photo-img');
  const photoCaption  = document.getElementById('gl-photo-caption');
  let currentAlbum = null;
  let currentIndex = 0;

  function openAlbum(album) {
    currentAlbum = album;
    glTitle.textContent = prettify(album.name);
    glGrid.innerHTML = album.images.map((img, i) => `
      <div class="gl-thumb" data-i="${i}" style="background-image:url('${img.url}')"></div>
    `).join('');
    glGrid.querySelectorAll('.gl-thumb').forEach(t => {
      t.addEventListener('click', () => openPhoto(+t.dataset.i));
    });
    albumView.style.display = 'block';
    photoView.style.display = 'none';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function openPhoto(i) {
    currentIndex = i;
    const img = currentAlbum.images[i];
    photoImg.src = img.url;
    photoCaption.textContent = `${prettify(currentAlbum.name)} — ${i + 1} / ${currentAlbum.images.length}`;
    albumView.style.display = 'none';
    photoView.style.display = 'flex';
  }

  function backToAlbum() {
    photoView.style.display = 'none';
    albumView.style.display = 'block';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function step(delta) {
    openPhoto((currentIndex + delta + currentAlbum.images.length) % currentAlbum.images.length);
  }

  document.getElementById('gl-close').addEventListener('click', closeLightbox);
  document.getElementById('gl-back').addEventListener('click', backToAlbum);
  document.getElementById('gl-prev').addEventListener('click', () => step(-1));
  document.getElementById('gl-next').addEventListener('click', () => step(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') {
      if (photoView.style.display === 'flex') backToAlbum();
      else closeLightbox();
    }
    if (photoView.style.display === 'flex') {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    }
  });
});
