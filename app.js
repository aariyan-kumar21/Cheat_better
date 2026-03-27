/* =============================================
   EduLearn — app.js
============================================= */

// ====== REGISTER MODAL ======
function openRegisterModal(e) {
  if (e) e.preventDefault();
  document.getElementById('registerModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeRegisterModal() {
  document.getElementById('registerModal').classList.add('hidden');
  document.body.style.overflow = '';
  // Reset success state
  document.getElementById('registerSuccess').classList.add('hidden');
  document.getElementById('tab-register').classList.remove('hidden');
  document.getElementById('tab-login').classList.add('hidden');
  document.querySelectorAll('.reg-tab').forEach((t,i) => t.classList.toggle('active', i===0));
}
window.openRegisterModal = openRegisterModal;
window.closeRegisterModal = closeRegisterModal;

document.addEventListener('DOMContentLoaded', () => {
  // Close register
  document.getElementById('closeRegister')?.addEventListener('click', closeRegisterModal);
  document.getElementById('registerModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('registerModal')) closeRegisterModal();
  });

  // Register tabs
  document.querySelectorAll('.reg-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.reg-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const which = tab.dataset.tab;
      document.getElementById('tab-register').classList.toggle('hidden', which !== 'register');
      document.getElementById('tab-login').classList.toggle('hidden', which !== 'login');
      document.getElementById('registerSuccess').classList.add('hidden');
    });
  });

  // Register submit
  document.getElementById('regSubmit')?.addEventListener('click', () => {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    const terms = document.getElementById('regTerms').checked;
    if (!name) { shake('regName'); return; }
    if (!email || !email.includes('@')) { shake('regEmail'); return; }
    if (pass.length < 8) { shake('regPass'); return; }
    if (!terms) { alert('Please accept the Terms of Service to continue.'); return; }
    const btn = document.getElementById('regSubmit');
    btn.textContent = 'Creating account...'; btn.style.opacity = '0.7';
    setTimeout(() => {
      document.getElementById('tab-register').classList.add('hidden');
      document.getElementById('registerSuccess').classList.remove('hidden');
      btn.textContent = 'CREATE FREE ACCOUNT'; btn.style.opacity = '1';
    }, 1200);
  });

  // Login submit
  document.getElementById('loginSubmit')?.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;
    if (!email) { shake('loginEmail'); return; }
    if (!pass) { shake('loginPass'); return; }
    const btn = document.getElementById('loginSubmit');
    btn.textContent = 'Logging in...'; btn.style.opacity = '0.7';
    setTimeout(() => {
      document.getElementById('tab-login').classList.add('hidden');
      document.getElementById('registerSuccess').classList.remove('hidden');
      btn.textContent = 'LOG IN'; btn.style.opacity = '1';
    }, 1000);
  });

  // Slider glow update
  document.querySelectorAll('.pomo-slider').forEach(s => {
    function updateGlow() {
      const pct = ((s.value - s.min) / (s.max - s.min)) * 100;
      s.style.setProperty('--slider-pct', pct + '%');
    }
    updateGlow();
    s.addEventListener('input', updateGlow);
  });
});

function shake(id) {
  const el = document.getElementById(id);
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  el.focus();
}

// ====== HERO TYPEWRITER ======
(function() {
  const el = document.getElementById('heroTypewriter');
  if (!el) return;
  const text = "EduLearn brings together shared notes, curated video lessons, and a focus timer — everything a student needs to ace their exams, all in one beautifully designed platform.";
  let i = 0;
  // Wait for hero animation to settle before typing
  setTimeout(function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i < 40 ? 35 : 22);
    }
  }, 900);
})();

// ====== PAGE NAVIGATION ======
function showPage(name) {
  document.querySelectorAll('.page-wrapper').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const map = { home: 0, notes: 1, videos: 2, pomodoro: 3, streak: 4, quiz: 5 };
  const idx = map[name];
  if (idx !== undefined) {
    document.querySelectorAll('.nav-link')[idx]?.classList.add('active');
  }
  // Init page-specific things
  if (name === 'notes') initNotesPage();
  if (name === 'videos') initVideosPage();
  if (name === 'pomodoro') initPomodoroPage();
  if (name === 'streak') initStreakPage();
  if (name === 'quiz') initQuizPage();
}

function scrollToSection(id) {
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.querySelectorAll('#hamburger span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

// ====== NAVBAR ======
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));

// ====== HAMBURGER ======
document.getElementById('hamburger').addEventListener('click', () => {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
  const spans = document.querySelectorAll('#hamburger span');
  if (menu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// ====== REVEAL SCROLL ======
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ====== PARTICLE CANVAS ======
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); initP(); });
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.2 + 0.6;
      this.sx = (Math.random() - 0.5) * 0.6; this.sy = (Math.random() - 0.5) * 0.6;
      this.op = Math.random() * 0.7 + 0.2;
      this.col = Math.random() > 0.35 ? '79,172,254' : '124,110,250';
    }
    update() { this.x += this.sx; this.y += this.sy; if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset(); }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${this.col},${this.op})`; ctx.fill(); }
  }
  function initP() { particles = Array.from({ length: 140 }, () => new Particle()); }
  initP();
  function drawConn() {
    for (let i = 0; i < particles.length; i++)
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(79,172,254,${0.15 * (1 - d / 120)})`; ctx.lineWidth = 0.6; ctx.stroke(); }
      }
  }
  (function animP() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); drawConn(); requestAnimationFrame(animP); })();
}

// ====== CHART BARS ======
const chartBarsEl = document.getElementById('chartBars');
if (chartBarsEl) {
  [40, 65, 50, 80, 60, 90, 55].forEach((h, i) => {
    const b = document.createElement('div');
    b.className = 'chart-bar' + (i === 5 ? ' highlight' : '');
    b.style.height = h + '%'; chartBarsEl.appendChild(b);
  });
}

// ====== GLOBE ======
const globeCanvas = document.getElementById('globeCanvas');
if (globeCanvas) {
  const gc = globeCanvas.getContext('2d');
  let rot = 0;
  function drawGlobe() {
    gc.clearRect(0, 0, 400, 400);
    const g = gc.createRadialGradient(180, 165, 20, 200, 200, 140);
    g.addColorStop(0, 'rgba(124,110,250,0.15)'); g.addColorStop(1, 'rgba(79,172,254,0.03)');
    gc.beginPath(); gc.arc(200, 200, 140, 0, Math.PI * 2); gc.fillStyle = g; gc.fill();
    gc.strokeStyle = 'rgba(124,110,250,0.2)'; gc.lineWidth = 1; gc.stroke();
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = 200 + Math.sin(lat * Math.PI / 180) * 140;
      const r2 = Math.cos(lat * Math.PI / 180) * 140;
      gc.beginPath(); gc.ellipse(200, y, r2, r2 * 0.3, 0, 0, Math.PI * 2);
      gc.strokeStyle = 'rgba(124,110,250,0.1)'; gc.stroke();
    }
    for (let lon = 0; lon < 180; lon += 30) {
      gc.beginPath(); gc.ellipse(200, 200, 140 * Math.abs(Math.cos((lon + rot) * Math.PI / 180)), 140, 0, 0, Math.PI * 2);
      gc.strokeStyle = 'rgba(124,110,250,0.08)'; gc.stroke();
    }
    [[260, 160], [120, 180], [230, 250], [160, 140], [290, 230], [180, 300]].forEach(([x, y]) => {
      gc.beginPath(); gc.arc(x, y, 3, 0, Math.PI * 2); gc.fillStyle = 'rgba(124,110,250,0.8)'; gc.fill();
      gc.beginPath(); gc.arc(x, y, 6, 0, Math.PI * 2); gc.strokeStyle = 'rgba(124,110,250,0.3)'; gc.lineWidth = 1; gc.stroke();
    });
    rot = (rot + 0.2) % 360; requestAnimationFrame(drawGlobe);
  }
  drawGlobe();
}

// ====== PRICING TOGGLE ======
document.querySelectorAll('.ptog').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.ptog').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    const plan = t.dataset.plan;
    document.querySelectorAll('.pc-amt').forEach(el => {
      el.textContent = plan === 'annual' ? el.dataset.annual : el.dataset.monthly;
    });
    document.querySelectorAll('.pc-per').forEach(el => {
      el.textContent = plan === 'annual' ? '/annual' : '/mo';
    });
  });
});

// ====== CONTACT FORM ======
document.getElementById('sendBtn')?.addEventListener('click', () => {
  const btn = document.getElementById('sendBtn');
  btn.textContent = 'SENDING...'; btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = 'SENT ✓'; btn.style.background = 'rgba(74,222,128,0.15)';
    btn.style.color = '#4ade80'; btn.style.border = '1.5px solid rgba(74,222,128,0.3)'; btn.style.opacity = '1';
    document.getElementById('cfSuccess').classList.remove('hidden');
  }, 1500);
});

// =============================================
// NOTES PAGE
// =============================================
const NOTES_DATA = [
  { id:1, title:'Newton\'s Laws of Motion — Full Notes', subject:'Physics', grade:'11', chapter:'Mechanics', uploader:'Aryan M.', date:'2 days ago', downloads:412, rating:5, desc:'Detailed notes covering all three laws with diagrams and solved examples.' },
  { id:2, title:'Quadratic Equations — Concept + Practice', subject:'Math', grade:'10', chapter:'Algebra', uploader:'Priya S.', date:'3 days ago', downloads:380, rating:5, desc:'Formula derivations, discriminant method, and 25 solved practice problems.' },
  { id:3, title:'Organic Chemistry — Reaction Mechanisms', subject:'Chemistry', grade:'12', chapter:'Organic Chem', uploader:'Karan D.', date:'1 week ago', downloads:295, rating:4, desc:'Complete SN1, SN2, elimination reaction notes with color-coded mechanisms.' },
  { id:4, title:'Cell Biology & Mitosis Explained', subject:'Biology', grade:'11', chapter:'Cell Division', uploader:'Sneha R.', date:'5 days ago', downloads:218, rating:5, desc:'NCERT + extra diagrams. Perfect for NEET aspirants.' },
  { id:5, title:'Shakespeare\'s Hamlet — Act-wise Summary', subject:'English', grade:'12', chapter:'Literature', uploader:'Rohan K.', date:'4 days ago', downloads:165, rating:4, desc:'Chapter summaries, key quotes, and character analysis for board exams.' },
  { id:6, title:'French Revolution — Causes & Impact', subject:'History', grade:'9', chapter:'World History', uploader:'Aditya V.', date:'6 days ago', downloads:198, rating:4, desc:'Timeline-based notes from social causes to Napoleon\'s rise.' },
  { id:7, title:'Data Structures: Arrays & Linked Lists', subject:'CS', grade:'12', chapter:'DSA Basics', uploader:'Tanvi S.', date:'Yesterday', downloads:330, rating:5, desc:'Array operations, linked list traversal, with Python and Java code snippets.' },
  { id:8, title:'Electrostatics — Coulomb\'s Law & Fields', subject:'Physics', grade:'12', chapter:'Electricity', uploader:'Vikram P.', date:'2 days ago', downloads:276, rating:5, desc:'JEE-level notes: field lines, Gauss\'s law, capacitor derivations.' },
  { id:9, title:'Triangles & Circles — Geometry Proofs', subject:'Math', grade:'10', chapter:'Geometry', uploader:'Meera B.', date:'3 days ago', downloads:222, rating:4, desc:'All CBSE geometry theorems with clean proof steps and diagram hints.' },
  { id:10, title:'Acids, Bases & Salts — Complete Chapter', subject:'Chemistry', grade:'10', chapter:'Acid-Base', uploader:'Dev J.', date:'1 week ago', downloads:188, rating:4, desc:'Indicators, pH scale, buffer solutions and salt hydrolysis explained.' },
  { id:11, title:'Trigonometry Identities & Applications', subject:'Math', grade:'11', chapter:'Trigonometry', uploader:'Ishaan G.', date:'4 days ago', downloads:298, rating:5, desc:'All standard identities, inverse trig, and JEE solved problems.' },
  { id:12, title:'Genetics & Heredity — Mendel\'s Laws', subject:'Biology', grade:'12', chapter:'Genetics', uploader:'Naina T.', date:'5 days ago', downloads:245, rating:5, desc:'Monohybrid, dihybrid crosses, co-dominance, linkage — NEET focused.' },
];

const SUBJ_COLORS = {
  Physics:   { bg: 'rgba(79,172,254,0.15)',  col: '#4FACFE' },
  Math:      { bg: 'rgba(124,110,250,0.15)', col: '#7C6EFA' },
  Chemistry: { bg: 'rgba(16,185,129,0.15)',  col: '#10B981' },
  Biology:   { bg: 'rgba(236,72,153,0.15)',  col: '#EC4899' },
  English:   { bg: 'rgba(245,158,11,0.15)',  col: '#F59E0B' },
  History:   { bg: 'rgba(239,68,68,0.15)',   col: '#EF4444' },
  CS:        { bg: 'rgba(6,182,212,0.15)',    col: '#06B6D4' },
};

let noteFilters = { grade: 'all', subject: 'all', search: '', sort: 'recent' };
let notesInited = false;

function initNotesPage() {
  if (notesInited) { renderNotes(); return; }
  notesInited = true;

  // Grade pills
  document.getElementById('gradePills').addEventListener('click', e => {
    const btn = e.target.closest('.gpill'); if (!btn) return;
    document.querySelectorAll('.gpill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); noteFilters.grade = btn.dataset.grade; renderNotes();
  });
  // Subject filters
  document.getElementById('subjectFilters').addEventListener('click', e => {
    const btn = e.target.closest('.sfilt'); if (!btn) return;
    document.querySelectorAll('.sfilt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); noteFilters.subject = btn.dataset.subj; renderNotes();
  });
  // Sort
  document.getElementById('noteSort').addEventListener('change', e => { noteFilters.sort = e.target.value; renderNotes(); });
  // Search
  document.getElementById('noteSearch').addEventListener('input', e => { noteFilters.search = e.target.value.toLowerCase(); renderNotes(); });

  // Upload modal
  document.getElementById('uploadNoteBtn').addEventListener('click', () => document.getElementById('uploadModal').classList.remove('hidden'));
  document.getElementById('closeModal').addEventListener('click', closeUploadModal);
  document.getElementById('cancelUpload').addEventListener('click', closeUploadModal);
  document.getElementById('uploadModal').addEventListener('click', e => { if (e.target === document.getElementById('uploadModal')) closeUploadModal(); });
  document.getElementById('browseFile').addEventListener('click', () => document.getElementById('fileInput').click());
  document.getElementById('fileInput').addEventListener('change', e => {
    if (e.target.files[0]) {
      const d = document.getElementById('selectedFile');
      d.style.display = 'block'; d.textContent = '✅ ' + e.target.files[0].name;
    }
  });

  const dz = document.getElementById('dropzone');
  ['dragover','dragenter'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.style.borderColor = 'var(--accent)'; dz.style.background = 'rgba(124,110,250,0.08)'; }));
  ['dragleave','drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.style.borderColor = ''; dz.style.background = ''; }));

  document.getElementById('submitUpload').addEventListener('click', () => {
    const title = document.getElementById('uploadTitle').value.trim();
    const subj = document.getElementById('uploadSubject').value;
    const grade = document.getElementById('uploadGrade').value;
    if (!title || !subj || !grade) { alert('Please fill in the required fields (Title, Subject, Grade)'); return; }
    const prog = document.getElementById('uploadProg');
    const fill = document.getElementById('progFill');
    const progText = document.getElementById('progText');
    prog.classList.remove('hidden');
    let pct = 0;
    const iv = setInterval(() => {
      pct = Math.min(pct + Math.random() * 15, 100);
      fill.style.width = pct + '%';
      progText.textContent = Math.floor(pct) + '%  Uploading...';
      if (pct >= 100) {
        clearInterval(iv);
        prog.classList.add('hidden');
        document.getElementById('uploadOk').classList.remove('hidden');
        // Add note to data
        NOTES_DATA.unshift({ id: Date.now(), title, subject: subj, grade, chapter: document.getElementById('uploadChapter').value || 'General', uploader: 'You', date: 'Just now', downloads: 0, rating: 5, desc: document.getElementById('uploadDesc').value || 'No description.' });
        setTimeout(() => { closeUploadModal(); renderNotes(); }, 1800);
      }
    }, 120);
  });

  renderNotes();
}

function closeUploadModal() {
  document.getElementById('uploadModal').classList.add('hidden');
  document.getElementById('uploadOk').classList.add('hidden');
  document.getElementById('uploadProg').classList.add('hidden');
  document.getElementById('uploadTitle').value = '';
  document.getElementById('progFill').style.width = '0%';
}

function renderNotes() {
  let data = [...NOTES_DATA];
  if (noteFilters.grade !== 'all') data = data.filter(n => n.grade === noteFilters.grade);
  if (noteFilters.subject !== 'all') data = data.filter(n => n.subject === noteFilters.subject);
  if (noteFilters.search) data = data.filter(n => (n.title + n.chapter + n.desc).toLowerCase().includes(noteFilters.search));
  if (noteFilters.sort === 'popular') data.sort((a, b) => b.downloads - a.downloads);
  else if (noteFilters.sort === 'rating') data.sort((a, b) => b.rating - a.rating);

  document.getElementById('notesCount').textContent = `Showing ${data.length} note${data.length !== 1 ? 's' : ''}`;
  const grid = document.getElementById('notesGrid');
  grid.innerHTML = '';

  if (!data.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text3)"><div style="font-size:48px;margin-bottom:12px">📭</div><p>No notes found. Try different filters or <strong>upload your own!</strong></p></div>';
    return;
  }

  data.forEach(n => {
    const sc = SUBJ_COLORS[n.subject] || { bg: 'rgba(124,110,250,0.15)', col: '#7C6EFA' };
    const stars = '★'.repeat(n.rating) + '☆'.repeat(5 - n.rating);
    const card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML = `
      <div>
        <span class="nc-subject" style="background:${sc.bg};color:${sc.col}">${n.subject}</span>
        <span style="float:right;font-size:11px;color:var(--text3);margin-top:4px">Grade ${n.grade}</span>
      </div>
      <div class="nc-title">${n.title}</div>
      <div class="nc-meta">
        <span>📖 ${n.chapter}</span>
        <span style="color:var(--text3);font-size:11px">${n.desc}</span>
      </div>
      <div class="nc-footer">
        <div class="nc-uploader">
          <div class="nc-av">${n.uploader[0]}</div>
          <span>${n.uploader} · ${n.date}</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
          <span style="color:#F59E0B;font-size:11px">${stars}</span>
          <span>⬇ ${n.downloads}</span>
        </div>
      </div>
      <div class="nc-actions">
        <button class="nc-btn" onclick="alert('📄 Opening preview for: ${n.title.replace(/'/g,"\\'")}')">👁 View</button>
        <button class="nc-btn download" onclick="handleDownload(${n.id})">⬇ Download</button>
        <button class="nc-btn nc-bookmark" onclick="toggleBookmark(this)" title="Bookmark">
          <svg class="bk-icon" width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="bk-path" d="M1 1.5C1 1.224 1.224 1 1.5 1H14.5C14.776 1 15 1.224 15 1.5V16.5L8 12.5L1 16.5V1.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `;
    // Click card → scroll to top of notes page and highlight
    card.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON') return; // don't intercept action buttons
      document.querySelectorAll('.note-card').forEach(c => c.classList.remove('note-card--active'));
      this.classList.add('note-card--active');
      const notesPage = document.getElementById('page-notes');
      notesPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    grid.appendChild(card);
  });
}

window.handleDownload = function(id) {
  const note = NOTES_DATA.find(n => n.id === id);
  if (note) { note.downloads++; renderNotes(); showToast('⬇ Download started: ' + note.title); }
};

function showToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:28px;right:28px;background:var(--card);border:1px solid var(--border2);color:var(--text);padding:12px 18px;border-radius:10px;font-size:13px;z-index:999;box-shadow:var(--shadow);animation:slideUp .3s ease;max-width:320px';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// =============================================
// VIDEO LEARNING PAGE
// =============================================
const VIDEO_TREE = {
  '📐 Mathematics': {
    'Algebra': ['Linear Equations', 'Quadratic Equations', 'Polynomials', 'Matrices'],
    'Calculus': ['Limits & Continuity', 'Differentiation', 'Integration', 'Applications'],
    'Geometry': ['Triangles & Proofs', 'Circles', 'Coordinate Geometry'],
    'Statistics': ['Probability Basics', 'Distributions', 'Data Interpretation'],
  },
  '🔬 Physics': {
    'Mechanics': ['Newton\'s Laws', 'Work, Energy & Power', 'Rotational Motion', 'Gravitation'],
    'Thermodynamics': ['Kinetic Theory', 'Laws of Thermodynamics', 'Heat Transfer'],
    'Electricity': ['Coulomb\'s Law', 'Current & Resistance', 'Magnetism', 'Electromagnetic Induction'],
    'Optics': ['Ray Optics', 'Wave Optics', 'Lenses & Mirrors'],
  },
  '🧪 Chemistry': {
    'Physical Chemistry': ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium'],
    'Organic Chemistry': ['Hydrocarbons', 'Reaction Mechanisms', 'Functional Groups'],
    'Inorganic Chemistry': ['Periodic Table', 'p-Block Elements', 'd-Block Elements'],
  },
  '🧬 Biology': {
    'Cell Biology': ['Cell Structure', 'Cell Division', 'Transport Mechanisms'],
    'Genetics': ['Mendel\'s Laws', 'DNA & RNA', 'Gene Expression', 'Mutations'],
    'Human Physiology': ['Digestive System', 'Circulatory System', 'Nervous System'],
    'Ecology': ['Ecosystems', 'Biodiversity', 'Environmental Issues'],
  },
  '💻 Computer Science': {
    'Programming': ['Python Basics', 'Object-Oriented Programming', 'Recursion'],
    'Data Structures': ['Arrays & Lists', 'Stacks & Queues', 'Trees & Graphs'],
    'Algorithms': ['Sorting Algorithms', 'Searching', 'Dynamic Programming'],
  },
};

const QUICK_TOPICS = [
  { icon:'📐', label:'Quadratic Equations', sub:'Math · Grade 10', q:'Quadratic equations class 10 explained' },
  { icon:'🔬', label:'Newton\'s Laws', sub:'Physics · Grade 11', q:'Newton laws of motion class 11' },
  { icon:'🧪', label:'Organic Chemistry', sub:'Chemistry · Grade 12', q:'Organic chemistry reactions class 12' },
  { icon:'🧬', label:'Cell Division', sub:'Biology · Grade 11', q:'Mitosis and meiosis cell division class 11' },
  { icon:'📊', label:'Probability', sub:'Math · Grade 12', q:'Probability class 12 full chapter' },
  { icon:'⚡', label:'Electrostatics', sub:'Physics · Grade 12', q:'Electrostatics class 12 JEE' },
];

let videosInited = false;

function initVideosPage() {
  if (videosInited) return;
  videosInited = true;

  // Build tree
  const tree = document.getElementById('videoTree');
  Object.entries(VIDEO_TREE).forEach(([subject, chapters]) => {
    const wrap = document.createElement('div'); wrap.className = 'vtree-subject';
    const btn = document.createElement('button'); btn.className = 'vtree-subj-btn';
    btn.innerHTML = `<span>${subject}</span><span class="vtree-caret">›</span>`;
    const chaps = document.createElement('div'); chaps.className = 'vtree-chapters';
    Object.entries(chapters).forEach(([chap, topics]) => {
      const chapBtn = document.createElement('button'); chapBtn.className = 'vtree-chapter';
      chapBtn.innerHTML = `<span>›</span> ${chap}`;
      chapBtn.addEventListener('click', () => {
        document.querySelectorAll('.vtree-chapter').forEach(c => c.classList.remove('active'));
        chapBtn.classList.add('active');
        loadVideo(`${chap} ${subject.replace(/[^\w\s]/g,'')} explained for students`, chap);
      });
      chaps.appendChild(chapBtn);
    });
    btn.addEventListener('click', () => {
      const isOpen = chaps.classList.contains('open');
      document.querySelectorAll('.vtree-chapters').forEach(c => c.classList.remove('open'));
      document.querySelectorAll('.vtree-subj-btn').forEach(b => b.classList.remove('open'));
      if (!isOpen) { chaps.classList.add('open'); btn.classList.add('open'); }
      btn.querySelector('.vtree-caret').textContent = chaps.classList.contains('open') ? '˅' : '›';
    });
    wrap.appendChild(btn); wrap.appendChild(chaps); tree.appendChild(wrap);
  });

  // Topic search in sidebar
  document.getElementById('videoTopicSearch').addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.vtree-chapter').forEach(c => {
      c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
    if (q) document.querySelectorAll('.vtree-chapters').forEach(c => c.classList.add('open'));
    else document.querySelectorAll('.vtree-chapters').forEach(c => c.classList.remove('open'));
  });

  // Custom search
  document.getElementById('videoSearchBtn').addEventListener('click', () => {
    const q = document.getElementById('videoCustomSearch').value.trim();
    if (q) loadVideo(q, q);
  });
  document.getElementById('videoCustomSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = e.target.value.trim();
      if (q) loadVideo(q, q);
    }
  });

  // Quick topics
  const qtGrid = document.getElementById('qtGrid');
  QUICK_TOPICS.forEach(t => {
    const card = document.createElement('div'); card.className = 'qt-card';
    card.innerHTML = `<div class="qt-icon">${t.icon}</div><div class="qt-label">${t.label}</div><div class="qt-sub">${t.sub}</div>`;
    card.addEventListener('click', () => loadVideo(t.q, t.label));
    qtGrid.appendChild(card);
  });
}

function loadVideo(query, title) {
  // YouTube search URL via embed — uses search query
  const searchQuery = encodeURIComponent(query + ' tutorial');
  const embedUrl = `https://www.youtube.com/embed?listType=search&list=${searchQuery}&autoplay=0`;

  const placeholder = document.getElementById('videoPlaceholder');
  const embedDiv = document.getElementById('videoEmbed');
  const meta = document.getElementById('videoMeta');
  const quickTopics = document.getElementById('quickTopics');

  placeholder.style.display = 'none';
  embedDiv.classList.remove('hidden');
  embedDiv.innerHTML = `
    <div style="padding:16px 20px;background:var(--bg3);font-size:13px;color:var(--text3)">
      🔍 Loading results for: <strong style="color:var(--text2)">${title}</strong>
    </div>
    <iframe
      src="https://www.youtube.com/embed?listType=search&list=${searchQuery}"
      style="width:100%;height:calc(100% - 48px);border:none"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      title="${title}">
    </iframe>
  `;

  document.getElementById('videoPlayerWrap').style.aspectRatio = '16/9';

  meta.classList.remove('hidden');
  document.getElementById('videoTitle').textContent = title;
  document.getElementById('videoChannel').textContent = '🎬 YouTube Search Results — best matches for: "' + query + '"';

  quickTopics.style.display = 'none';

  // Scroll into view
  document.getElementById('videoPlayerWrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// =============================================
// POMODORO TIMER
// =============================================
const POMO_TIPS = [
  'During your break, step away from the screen. Look at something 20 feet away for 20 seconds.',
  'Write down what you want to accomplish BEFORE you start each Pomodoro session.',
  'Turn off notifications completely during your focus block. Every interruption costs ~23 minutes.',
  'After 4 Pomodoros, take a 15-30 min long break. Your brain needs it!',
  'Use the first minute of each session to recall what you studied in the previous one.',
  'Drink a glass of water before each Pomodoro. Hydration directly impacts cognitive performance.',
  'If a distracting thought pops up, write it on a separate paper and get back to work immediately.',
  'Study the hardest subject in your first 1-2 Pomodoros when your mind is freshest.',
];

let pomoState = {
  running: false, mode: 'focus', seconds: 25 * 60,
  sessionNum: 1, totalSessions: 0, totalMins: 0,
  settings: { focus: 25, short: 5, long: 15 },
  interval: null, completedDots: [],
};
let pomoInited = false;

function initPomodoroPage() {
  if (pomoInited) { updatePomodoroUI(); return; }
  pomoInited = true;

  // Mode tabs
  document.getElementById('pomoModeTabs').addEventListener('click', e => {
    const btn = e.target.closest('.pmode'); if (!btn) return;
    document.querySelectorAll('.pmode').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    pomoState.mode = btn.dataset.mode;
    clearInterval(pomoState.interval); pomoState.running = false;
    document.getElementById('pomoStart').textContent = '▶';
    document.getElementById('pomoStart').classList.remove('running');
    const mins = { focus: pomoState.settings.focus, short: pomoState.settings.short, long: pomoState.settings.long };
    pomoState.seconds = mins[pomoState.mode] * 60;
    updatePomodoroUI();
  });

  // Start/Pause
  document.getElementById('pomoStart').addEventListener('click', () => {
    if (pomoState.running) {
      clearInterval(pomoState.interval); pomoState.running = false;
      document.getElementById('pomoStart').textContent = '▶';
      document.getElementById('pomoStart').classList.remove('running');
    } else {
      pomoState.running = true;
      document.getElementById('pomoStart').textContent = '⏸';
      document.getElementById('pomoStart').classList.add('running');
      pomoState.interval = setInterval(() => {
        pomoState.seconds--;
        if (pomoState.seconds <= 0) {
          clearInterval(pomoState.interval); pomoState.running = false;
          document.getElementById('pomoStart').textContent = '▶';
          document.getElementById('pomoStart').classList.remove('running');
          onPomodoroComplete();
        }
        updatePomodoroUI();
      }, 1000);
    }
  });

  // Reset
  document.getElementById('pomoReset').addEventListener('click', () => {
    clearInterval(pomoState.interval); pomoState.running = false;
    document.getElementById('pomoStart').textContent = '▶';
    document.getElementById('pomoStart').classList.remove('running');
    const mins = { focus: pomoState.settings.focus, short: pomoState.settings.short, long: pomoState.settings.long };
    pomoState.seconds = mins[pomoState.mode] * 60;
    updatePomodoroUI();
  });

  // Skip
  document.getElementById('pomoSkip').addEventListener('click', () => {
    clearInterval(pomoState.interval); pomoState.running = false;
    document.getElementById('pomoStart').textContent = '▶';
    document.getElementById('pomoStart').classList.remove('running');
    switchNextMode();
  });

  // Sliders
  [['focusSlider','focusVal','focus'],['shortSlider','shortVal','short'],['longSlider','longVal','long']].forEach(([id, vid, key]) => {
    document.getElementById(id).addEventListener('input', function() {
      document.getElementById(vid).textContent = this.value;
      pomoState.settings[key] = +this.value;
      if (pomoState.mode === key && !pomoState.running) {
        pomoState.seconds = pomoState.settings[key] * 60; updatePomodoroUI();
      }
    });
  });

  // Random tip
  document.getElementById('pomoTip').textContent = POMO_TIPS[Math.floor(Math.random() * POMO_TIPS.length)];
  setInterval(() => {
    document.getElementById('pomoTip').textContent = POMO_TIPS[Math.floor(Math.random() * POMO_TIPS.length)];
  }, 30000);

  buildSessionDots();
  updatePomodoroUI();
}

function onPomodoroComplete() {
  if (pomoState.mode === 'focus') {
    pomoState.totalSessions++;
    pomoState.totalMins += pomoState.settings.focus;
    pomoState.completedDots.push(pomoState.sessionNum);
    document.getElementById('sessCount').textContent = pomoState.totalSessions;
    document.getElementById('totalTime').textContent = pomoState.totalMins + ' min';
    showToast('🎉 Focus session complete! Great work!');
    buildTodayBars();
    // Auto advance
    if (pomoState.totalSessions % 4 === 0) {
      pomoState.mode = 'long'; pomoState.seconds = pomoState.settings.long * 60;
      pomoState.sessionNum = 1;
    } else {
      pomoState.mode = 'short'; pomoState.seconds = pomoState.settings.short * 60;
      pomoState.sessionNum = (pomoState.sessionNum % 4) + 1;
    }
    document.querySelectorAll('.pmode').forEach(b => b.classList.toggle('active', b.dataset.mode === pomoState.mode));
  } else {
    showToast('☕ Break over! Time to focus!');
    pomoState.mode = 'focus'; pomoState.seconds = pomoState.settings.focus * 60;
    document.querySelectorAll('.pmode').forEach(b => b.classList.toggle('active', b.dataset.mode === 'focus'));
  }
  buildSessionDots(); updatePomodoroUI();
}

function switchNextMode() {
  pomoState.mode = pomoState.mode === 'focus' ? 'short' : 'focus';
  const mins = { focus: pomoState.settings.focus, short: pomoState.settings.short, long: pomoState.settings.long };
  pomoState.seconds = mins[pomoState.mode] * 60;
  document.querySelectorAll('.pmode').forEach(b => b.classList.toggle('active', b.dataset.mode === pomoState.mode));
  updatePomodoroUI();
}

function buildSessionDots() {
  const wrap = document.getElementById('pomoSessionDots');
  wrap.innerHTML = '';
  for (let i = 1; i <= 4; i++) {
    const d = document.createElement('span'); d.className = 'pdot';
    if (pomoState.completedDots.includes(i)) d.classList.add('done');
    else if (i === pomoState.sessionNum && pomoState.mode === 'focus') d.classList.add('active');
    wrap.appendChild(d);
  }
}

function buildTodayBars() {
  const wrap = document.getElementById('todayBars');
  wrap.innerHTML = '';
  const max = 8;
  for (let i = 0; i < max; i++) {
    const b = document.createElement('div'); b.className = 'today-bar' + (i < pomoState.totalSessions ? ' done' : '');
    b.style.height = '24px'; wrap.appendChild(b);
  }
}

function updatePomodoroUI() {
  const m = String(Math.floor(pomoState.seconds / 60)).padStart(2, '0');
  const s = String(pomoState.seconds % 60).padStart(2, '0');
  document.getElementById('pomoTime').textContent = `${m}:${s}`;
  const labels = { focus: '🎯 Focus Session', short: '☕ Short Break', long: '🌿 Long Break' };
  document.getElementById('pomoLabel').textContent = labels[pomoState.mode];
  document.getElementById('pomoSession').textContent = pomoState.mode === 'focus' ? `Session ${pomoState.sessionNum} of 4` : 'Take it easy!';

  // Ring
  const total = { focus: pomoState.settings.focus, short: pomoState.settings.short, long: pomoState.settings.long }[pomoState.mode] * 60;
  const circ = 816.8;
  const offset = circ * (1 - pomoState.seconds / total);
  const ring = document.getElementById('pomoRing');
  ring.style.strokeDashoffset = offset;
  const colors = { focus: '#7C6EFA', short: '#10B981', long: '#4FACFE' };
  ring.style.stroke = colors[pomoState.mode];

  // Page title
  document.title = `${m}:${s} — EduLearn`;
}

// ====== ACTIVE NAV on HOME scroll ======
const homeSections = document.querySelectorAll('#page-home section[id]');
window.addEventListener('scroll', () => {
  if (!document.getElementById('page-home').classList.contains('active')) return;
  let cur = '';
  homeSections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
}, { passive: true });

// Init home page on load
showPage('home');

window.toggleBookmark = function(btn) {
  const isBookmarked = btn.classList.toggle('bookmarked');
  const path = btn.querySelector('.bk-path');
  if (isBookmarked) {
    path.setAttribute('fill', 'currentColor');
    // Show toast with bookmark SVG icon
    const toastEl = document.createElement('div');
    toastEl.style.cssText = 'position:fixed;bottom:28px;right:28px;background:var(--card);border:1px solid var(--border2);color:var(--text);padding:12px 18px;border-radius:10px;font-size:13px;z-index:999;box-shadow:var(--shadow);animation:slideUp .3s ease;max-width:320px;display:flex;align-items:center;gap:10px';
    toastEl.innerHTML = `<svg width="16" height="18" viewBox="0 0 16 18" fill="var(--accent)" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5C1 1.224 1.224 1 1.5 1H14.5C14.776 1 15 1.224 15 1.5V16.5L8 12.5L1 16.5V1.5Z" stroke="var(--accent)" stroke-width="1.8" stroke-linejoin="round"/></svg><span>Note bookmarked!</span>`;
    document.body.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 3000);
  } else {
    path.setAttribute('fill', 'none');
  }
};

// ====== PASSWORD STRENGTH METER ======
function calcPasswordStrength(val) {
  let score = 0;
  if (val.length >= 8) score++;
  if (val.length >= 12) score++;
  if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  // Map to 4 levels: Very Weak(0-1), Weak(2), Good(3), Strong(4-5)
  if (score <= 1) return { level: 1, label: 'Very Weak', color: '#ef4444' };
  if (score === 2) return { level: 2, label: 'Weak', color: '#f97316' };
  if (score === 3) return { level: 3, label: 'Good', color: '#eab308' };
  return { level: 4, label: 'Strong', color: '#22c55e' };
}

function applyPasswordStrength(val, strengthEl, seg1, seg2, seg3, seg4, labelEl) {
  if (!val) { strengthEl.style.display = 'none'; return; }
  strengthEl.style.display = 'flex';
  const { level, label, color } = calcPasswordStrength(val);
  const segs = [seg1, seg2, seg3, seg4];
  segs.forEach((s, i) => {
    s.style.background = i < level ? color : 'var(--bg3)';
  });
  labelEl.textContent = label;
  labelEl.style.color = color;
}

document.addEventListener('DOMContentLoaded', function() {
  // Register password strength
  const regPass = document.getElementById('regPass');
  if (regPass) {
    regPass.addEventListener('input', function() {
      applyPasswordStrength(
        this.value,
        document.getElementById('passStrength'),
        document.getElementById('psSeg1'),
        document.getElementById('psSeg2'),
        document.getElementById('psSeg3'),
        document.getElementById('psSeg4'),
        document.getElementById('psLabel')
      );
    });
  }
  // Login password strength
  const loginPass = document.getElementById('loginPass');
  if (loginPass) {
    loginPass.addEventListener('input', function() {
      applyPasswordStrength(
        this.value,
        document.getElementById('loginPassStrength'),
        document.getElementById('lpSeg1'),
        document.getElementById('lpSeg2'),
        document.getElementById('lpSeg3'),
        document.getElementById('lpSeg4'),
        document.getElementById('lpLabel')
      );
    });
  }
});

// =============================================
// STREAK DASHBOARD
// =============================================

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Generate dummy heatmap data for past ~365 days
function generateHeatmapData() {
  const data = {};
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    // Weighted random: more likely to study on weekdays
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const rand = Math.random();
    let level = 0;
    if (rand > (isWeekend ? 0.6 : 0.35)) {
      if (rand > 0.9) level = 4;
      else if (rand > 0.75) level = 3;
      else if (rand > 0.55) level = 2;
      else level = 1;
    }
    // Spike around "exam season" (Jan, Mar, Oct)
    const m = d.getMonth();
    if ([0,2,9].includes(m) && rand > 0.25) level = Math.min(4, level + 1);
    data[key] = level;
  }
  return data;
}

const HEATMAP_DATA = generateHeatmapData();

// Dummy weekly study hours
const WEEK_HOURS = [2.5, 4, 3, 6, 5.5, 4, 1.5]; // Sun–Sat

// Subject study time this month (hours)
const SUBJECT_HOURS = {
  Physics: 14, Math: 18, Chemistry: 10, Biology: 8, English: 5, CS: 12
};

const BADGES_DATA = [
  { emoji:'🔥', name:'7-Day Streak', unlocked:true },
  { emoji:'⚡', name:'30-Day Streak', unlocked:true },
  { emoji:'🏆', name:'Top Scorer', unlocked:true },
  { emoji:'📚', name:'Note Reader', unlocked:true },
  { emoji:'🌙', name:'Night Owl', unlocked:false },
  { emoji:'💎', name:'100-Day Streak', unlocked:false },
  { emoji:'🎯', name:'Perfect Week', unlocked:true },
  { emoji:'🚀', name:'Speed Learner', unlocked:false },
  { emoji:'🧠', name:'Quiz Master', unlocked:false },
];

function initStreakPage() {
  renderStreakStats();
  renderWeekRow();
  renderHeatmap();
  renderStudyBars();
  renderDonut();
  renderBadges();
}

function renderStreakStats() {
  const el = document.getElementById('streakStatsRow');
  if (!el) return;
  const stats = [
    { icon:'🔥', val:'23', lbl:'Current Streak (days)', color:'#F97316' },
    { icon:'🏅', val:'47', lbl:'Longest Streak (days)', color:'#F59E0B' },
    { icon:'⏱', val:'186', lbl:'Total Hours Studied', color:'#7C6EFA' },
    { icon:'📅', val:'142', lbl:'Days Studied This Year', color:'#10B981' },
  ];
  el.innerHTML = stats.map(s => `
    <div class="streak-stat-card">
      <div class="ssc-icon">${s.icon}</div>
      <div class="ssc-val" style="color:${s.color}">${s.val}</div>
      <div class="ssc-lbl">${s.lbl}</div>
    </div>`).join('');
}

function renderWeekRow() {
  const today = new Date();
  const todayDow = today.getDay(); // 0=Sun
  const el = document.getElementById('weekDaysRow');
  if (!el) return;

  const row = DAYS.map((d, i) => {
    let cls = '';
    const diff = i - todayDow;
    if (diff === 0) cls = 'today';
    else if (diff < 0) {
      // Past days — check heatmap
      const pd = new Date(today);
      pd.setDate(pd.getDate() + diff);
      const key = pd.toISOString().split('T')[0];
      cls = (HEATMAP_DATA[key] || 0) > 0 ? 'studied' : 'missed';
    }
    const content = cls === 'studied' ? '✓' : cls === 'missed' ? '✕' : d[0];
    return `<div class="wday">
      <div class="wday-circle ${cls}">${content}</div>
      <div class="wday-label">${d}</div>
    </div>`;
  });
  el.innerHTML = row.join('');

  // Count studied days this week
  let studiedCount = 0;
  for (let i = 0; i < todayDow; i++) {
    const pd = new Date(today); pd.setDate(pd.getDate() - (todayDow - i));
    const key = pd.toISOString().split('T')[0];
    if ((HEATMAP_DATA[key] || 0) > 0) studiedCount++;
  }
  document.getElementById('weekDaysNum').textContent = studiedCount;
  document.getElementById('currentStreakNum').textContent = '23';

  // Animate ring
  setTimeout(() => {
    const fg = document.getElementById('weekRingFg');
    if (fg) {
      const pct = studiedCount / 7;
      fg.style.strokeDashoffset = 314 * (1 - pct);
    }
  }, 400);
}

function renderHeatmap() {
  const wrap = document.getElementById('heatmapWrap');
  if (!wrap) return;
  const now = new Date();
  // Build 52 weeks
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 363);
  // Align to Sunday
  while (startDate.getDay() !== 0) startDate.setDate(startDate.getDate() - 1);

  // Group by month for labels
  let currentMonth = -1;
  let html = '';
  const dayLabels = ['','Mon','','Wed','','Fri',''];

  // Side labels col
  html += `<div class="hm-week-col" style="margin-right:4px">
    <div style="height:20px"></div>
    ${dayLabels.map(l => `<div style="height:13px;margin-bottom:3px;font-size:10px;color:var(--text3);line-height:13px;width:28px">${l}</div>`).join('')}
  </div>`;

  const cursor = new Date(startDate);
  let weekHtml = '';
  let monthLabel = '';
  let lastMonth = -1;

  for (let w = 0; w < 53; w++) {
    const weekStart = new Date(cursor);
    const m = weekStart.getMonth();
    const label = m !== lastMonth ? MONTHS[m] : '';
    lastMonth = m;

    let cells = '';
    for (let d = 0; d < 7; d++) {
      const key = cursor.toISOString().split('T')[0];
      const level = HEATMAP_DATA[key] || 0;
      const isFuture = cursor > now;
      const cls = isFuture ? '' : `l${level}`;
      const title = `${key}: ${['No study','~30 min','~1 hr','~2 hrs','3+ hrs'][level]}`;
      cells += `<div class="hm-cell ${cls}" title="${title}"></div>`;
      cursor.setDate(cursor.getDate() + 1);
    }
    html += `<div class="hm-month-col">
      <div class="hm-month-label">${label}</div>
      <div class="hm-week-col">${cells}</div>
    </div>`;
  }

  wrap.innerHTML = html;
}

function renderStudyBars() {
  const el = document.getElementById('studyBars');
  if (!el) return;
  const maxH = Math.max(...WEEK_HOURS);
  const today = new Date().getDay();
  el.innerHTML = DAYS.map((d, i) => {
    const pct = WEEK_HOURS[i] / maxH * 100;
    const isToday = i === today;
    const barColor = isToday
      ? 'background:linear-gradient(180deg,#4FACFE,rgba(79,172,254,0.35))'
      : 'background:linear-gradient(180deg,rgba(124,110,250,0.85),rgba(124,110,250,0.25))';
    return `<div class="sb-col">
      <div class="sb-val" style="${isToday ? 'color:var(--accent2);font-weight:700' : ''}">${WEEK_HOURS[i]}h</div>
      <div class="sb-bar-wrap">
        <div class="sb-bar" style="height:${pct}%;${barColor}"></div>
      </div>
      <div class="sb-day" style="${isToday ? 'color:var(--accent2);font-weight:700' : ''}">${d}</div>
    </div>`;
  }).join('');
}

function renderDonut() {
  const canvas = document.getElementById('subjectDonut');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const colors = { Physics:'#4FACFE', Math:'#7C6EFA', Chemistry:'#10B981', Biology:'#EC4899', English:'#F59E0B', CS:'#06B6D4' };
  const entries = Object.entries(SUBJECT_HOURS);
  const total = entries.reduce((a,[,v]) => a+v, 0);
  let angle = -Math.PI/2;
  const cx=80,cy=80,r=60,inner=36;
  ctx.clearRect(0,0,160,160);
  entries.forEach(([subj, hrs]) => {
    const slice = (hrs/total) * Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,angle,angle+slice);
    ctx.closePath();
    ctx.fillStyle = colors[subj]||'#888';
    ctx.fill();
    angle += slice;
  });
  // Hole
  ctx.beginPath();
  ctx.arc(cx,cy,inner,0,Math.PI*2);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--card').trim() || '#0e1120';
  ctx.fill();
  // Legend
  const legend = document.getElementById('donutLegend');
  if (legend) {
    legend.innerHTML = entries.map(([s,h]) => `
      <div class="dl-item">
        <div class="dl-dot" style="background:${colors[s]||'#888'}"></div>
        <span>${s} — ${h}h</span>
      </div>`).join('');
  }
}

function renderBadges() {
  const el = document.getElementById('badgesGrid');
  if (!el) return;
  el.innerHTML = BADGES_DATA.map(b => `
    <div class="badge-item ${b.unlocked?'':'locked'}" title="${b.name}">
      <div class="badge-emoji">${b.emoji}</div>
      <div class="badge-name">${b.name}</div>
    </div>`).join('');
}

// =============================================
// QUIZ PAGE
// =============================================

const QUIZ_BANK = [
  {
    id: 1, subject: 'Physics', title: "Newton's Laws Quick Test", questions: 8, time: 10,
    color: '#4FACFE',
    questions_data: [
      { q: "Which of Newton's Laws states that every action has an equal and opposite reaction?", opts: ["First Law","Second Law","Third Law","Law of Gravitation"], ans: 2 },
      { q: "What is the unit of force in the SI system?", opts: ["Joule","Newton","Pascal","Watt"], ans: 1 },
      { q: "An object at rest stays at rest unless acted upon by an external force. This is:", opts: ["Newton's 2nd Law","Newton's 3rd Law","Newton's 1st Law","Hooke's Law"], ans: 2 },
      { q: "F = ma is the mathematical form of:", opts: ["Newton's 1st Law","Newton's 2nd Law","Newton's 3rd Law","Coulomb's Law"], ans: 1 },
      { q: "If a 5 kg object accelerates at 3 m/s², the net force acting on it is:", opts: ["8 N","2 N","15 N","1.67 N"], ans: 2 },
      { q: "What happens to acceleration if force is doubled but mass stays constant?", opts: ["Halved","Stays same","Quadrupled","Doubled"], ans: 3 },
      { q: "The tendency of an object to resist changes in its motion is called:", opts: ["Momentum","Velocity","Inertia","Friction"], ans: 2 },
      { q: "A rocket accelerates by expelling gas downward. This illustrates:", opts: ["1st Law","2nd Law","3rd Law","Law of Inertia"], ans: 2 },
    ]
  },
  {
    id: 2, subject: 'Math', title: "Quadratic Equations Challenge", questions: 8, time: 12,
    color: '#7C6EFA',
    questions_data: [
      { q: "What is the discriminant of ax² + bx + c = 0?", opts: ["b² - 4ac","b² + 4ac","2b - ac","4ac - b²"], ans: 0 },
      { q: "If discriminant > 0, the roots are:", opts: ["Complex","Equal","Two distinct real","Imaginary"], ans: 2 },
      { q: "Solve: x² - 5x + 6 = 0", opts: ["x=1,6","x=2,3","x=-2,-3","x=3,4"], ans: 1 },
      { q: "The sum of roots of ax² + bx + c = 0 is:", opts: ["c/a","b/a","-b/a","-c/a"], ans: 2 },
      { q: "The product of roots of ax² + bx + c = 0 is:", opts: ["c/a","b/a","-b/a","-c/a"], ans: 0 },
      { q: "Which formula gives roots of a quadratic equation?", opts: ["x = -b ± √(b²-4ac) / 2a","x = b ± √(b²+4ac) / a","x = -b / 2a","x = √(b²-4ac)"], ans: 0 },
      { q: "How many real roots does x² + 4 = 0 have?", opts: ["0","1","2","Infinite"], ans: 0 },
      { q: "x² - 9 = 0 gives roots:", opts: ["x=3 only","x=±3","x=9","x=±9"], ans: 1 },
    ]
  },
  {
    id: 3, subject: 'Chemistry', title: "Organic Reactions Basics", questions: 8, time: 10,
    color: '#10B981',
    questions_data: [
      { q: "SN2 reactions proceed via:", opts: ["Carbocation intermediate","Concerted single step","Two-step mechanism","Free radical"], ans: 1 },
      { q: "Which leaving group makes SN2 faster?", opts: ["F⁻","OH⁻","I⁻","Cl⁻"], ans: 2 },
      { q: "SN1 reactions are favored by:", opts: ["Primary substrates","Tertiary substrates","Methyl substrates","All equally"], ans: 1 },
      { q: "An elimination reaction forms:", opts: ["Alcohol","Ether","Alkene","Alkane"], ans: 2 },
      { q: "Which reagent is used in nucleophilic substitution?", opts: ["H₂SO₄","NaOH","O₂","HNO₃"], ans: 1 },
      { q: "Markovnikov's rule applies to:", opts: ["SN2","Elimination","Electrophilic addition","SN1"], ans: 2 },
      { q: "The hybridisation of carbon in benzene is:", opts: ["sp³","sp²","sp","sp³d"], ans: 1 },
      { q: "IUPAC name of CH₃-CH₂-OH:", opts: ["Methanol","Propanol","Ethanol","Butanol"], ans: 2 },
    ]
  },
  {
    id: 4, subject: 'Biology', title: "Cell Division & Genetics", questions: 8, time: 10,
    color: '#EC4899',
    questions_data: [
      { q: "During which phase of mitosis do chromosomes align at the cell equator?", opts: ["Prophase","Metaphase","Anaphase","Telophase"], ans: 1 },
      { q: "The genotype Aa is called:", opts: ["Homozygous dominant","Homozygous recessive","Heterozygous","Pure breeding"], ans: 2 },
      { q: "DNA replication is:", opts: ["Conservative","Semi-conservative","Dispersive","Random"], ans: 1 },
      { q: "Mendel's law of segregation applies to:", opts: ["Linked genes","Genes on same chromosome","Alleles of a single gene","Polygenic traits"], ans: 2 },
      { q: "How many chromosomes does a human somatic cell have?", opts: ["23","44","46","48"], ans: 2 },
      { q: "Crossing over occurs during:", opts: ["Mitosis","Meiosis I","Meiosis II","Interphase"], ans: 1 },
      { q: "A dominant allele is represented by:", opts: ["Lowercase letter","Number","Uppercase letter","Symbol *"], ans: 2 },
      { q: "The powerhouse of the cell is the:", opts: ["Nucleus","Ribosome","Mitochondria","Golgi apparatus"], ans: 2 },
    ]
  },
  {
    id: 5, subject: 'CS', title: "Data Structures: Arrays & Lists", questions: 8, time: 10,
    color: '#06B6D4',
    questions_data: [
      { q: "The time complexity of accessing an element in an array by index is:", opts: ["O(n)","O(log n)","O(1)","O(n²)"], ans: 2 },
      { q: "Which data structure uses LIFO (Last In First Out)?", opts: ["Queue","Array","Stack","Linked List"], ans: 2 },
      { q: "Inserting at the beginning of a singly linked list is:", opts: ["O(n)","O(1)","O(log n)","O(n²)"], ans: 1 },
      { q: "A doubly linked list node contains:", opts: ["Data + next pointer","Data only","Data + prev + next pointers","Two data fields"], ans: 2 },
      { q: "Which of these is NOT a linear data structure?", opts: ["Array","Stack","Tree","Queue"], ans: 2 },
      { q: "What is the worst-case time complexity of bubble sort?", opts: ["O(n)","O(n log n)","O(n²)","O(log n)"], ans: 2 },
      { q: "In Python, list.append() is:", opts: ["O(n)","O(log n)","O(n²)","O(1) amortized"], ans: 3 },
      { q: "A circular linked list has its last node pointing to:", opts: ["Null","Itself","The first node","The middle node"], ans: 2 },
    ]
  },
  {
    id: 6, subject: 'Math', title: "Trigonometry Identities", questions: 6, time: 8,
    color: '#7C6EFA',
    questions_data: [
      { q: "sin²θ + cos²θ =", opts: ["0","2","1","sinθ·cosθ"], ans: 2 },
      { q: "tan θ is equal to:", opts: ["cosθ/sinθ","sinθ/cosθ","1/sinθ","1/cosθ"], ans: 1 },
      { q: "sin(90° - θ) =", opts: ["sinθ","−cosθ","cosθ","−sinθ"], ans: 2 },
      { q: "The value of sin 30° is:", opts: ["√3/2","1/2","1","0"], ans: 1 },
      { q: "1 + tan²θ =", opts: ["sec²θ","cosec²θ","cot²θ","cos²θ"], ans: 0 },
      { q: "cos 2θ = ?", opts: ["2sin²θ−1","1−2cos²θ","cos²θ−sin²θ","2cosθsinθ"], ans: 2 },
    ]
  },
];

// Dummy past quiz performance data
const PAST_QUIZ_SCORES = [62, 71, 68, 78, 74, 82, 79, 85, 88, 91];
const SUBJECT_ACCURACY = { Physics: 82, Math: 76, Chemistry: 68, Biology: 88, CS: 91, English: 74 };
const QUIZ_STATS = { total: 24, avgScore: 79, bestScore: 96, totalTime: '4h 32m' };

let activeQuiz = null;
let quizState = {};
let quizTimer = null;

function initQuizPage() {
  renderQuizPerf();
  renderScoreTrend();
  renderAccuracyBars();
  renderQuizCards();

  // Search
  document.getElementById('quizSearch')?.addEventListener('input', function() {
    renderQuizCards(this.value.toLowerCase(), document.querySelector('.qfpill.active')?.dataset.filter || 'all');
  });

  // Filter pills
  document.getElementById('quizFilterPills')?.addEventListener('click', e => {
    const btn = e.target.closest('.qfpill'); if (!btn) return;
    document.querySelectorAll('.qfpill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderQuizCards(document.getElementById('quizSearch')?.value.toLowerCase() || '', btn.dataset.filter);
  });
}

function renderQuizPerf() {
  const el = document.getElementById('quizPerfGrid');
  if (!el) return;
  const cards = [
    { icon:'📝', val: QUIZ_STATS.total, lbl:'Quizzes Taken', color:'#7C6EFA' },
    { icon:'⭐', val: QUIZ_STATS.avgScore+'%', lbl:'Average Score', color:'#F59E0B' },
    { icon:'🏆', val: QUIZ_STATS.bestScore+'%', lbl:'Best Score', color:'#10B981' },
    { icon:'⏱', val: QUIZ_STATS.totalTime, lbl:'Total Quiz Time', color:'#4FACFE' },
  ];
  el.innerHTML = cards.map(c => `
    <div class="qpg-card">
      <div class="qpg-icon">${c.icon}</div>
      <div class="qpg-val" style="color:${c.color}">${c.val}</div>
      <div class="qpg-lbl">${c.lbl}</div>
    </div>`).join('');
}

function renderScoreTrend() {
  const svg = document.getElementById('scoreTrendSvg');
  if (!svg) return;
  const w = 500, h = 160, pad = 20;
  const pts = PAST_QUIZ_SCORES;
  const minS = 50, maxS = 100;
  const xStep = (w - pad*2) / (pts.length - 1);
  const coords = pts.map((s, i) => [
    pad + i * xStep,
    pad + (1 - (s - minS)/(maxS - minS)) * (h - pad*2)
  ]);
  const path = coords.map((p,i) => (i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ');
  const area = path + ` L${coords[coords.length-1][0]},${h-pad} L${pad},${h-pad} Z`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#7C6EFA" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#7C6EFA" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${area}" fill="url(#trendGrad)"/>
    <path d="${path}" stroke="#7C6EFA" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${coords.map((p,i) => `
      <circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${i===pts.length-1?'#7C6EFA':'#0e1120'}" stroke="#7C6EFA" stroke-width="2"/>
      <text x="${p[0]}" y="${p[1]-10}" text-anchor="middle" fill="#a8aec4" font-size="10" font-family="Manrope">${pts[i]}%</text>
    `).join('')}
    <text x="${pad}" y="${h-4}" fill="#5a6080" font-size="10" font-family="Manrope">Quiz 1</text>
    <text x="${w-pad}" y="${h-4}" text-anchor="end" fill="#5a6080" font-size="10" font-family="Manrope">Latest</text>
  `;
}

function renderAccuracyBars() {
  const el = document.getElementById('accuracyBars');
  if (!el) return;
  const colors = { Physics:'#4FACFE', Math:'#7C6EFA', Chemistry:'#10B981', Biology:'#EC4899', CS:'#06B6D4', English:'#F59E0B' };
  el.innerHTML = Object.entries(SUBJECT_ACCURACY).map(([s,pct]) => `
    <div class="acb-row">
      <div class="acb-label">${s}</div>
      <div class="acb-track">
        <div class="acb-fill" style="width:0%;background:${colors[s]||'#7C6EFA'}" data-pct="${pct}"></div>
      </div>
      <div class="acb-pct">${pct}%</div>
    </div>`).join('');
  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.acb-fill').forEach(b => {
      b.style.width = b.dataset.pct + '%';
    });
  }, 300);
}

function renderQuizCards(searchQ = '', filterSubj = 'all') {
  const el = document.getElementById('quizCardsGrid');
  if (!el) return;
  let data = QUIZ_BANK;
  if (filterSubj !== 'all') data = data.filter(q => q.subject === filterSubj);
  if (searchQ) data = data.filter(q => q.title.toLowerCase().includes(searchQ) || q.subject.toLowerCase().includes(searchQ));
  const bestScores = { 1:88, 2:76, 3:72, 4:91, 5:84, 6:80 };
  el.innerHTML = data.map(q => {
    const best = bestScores[q.id];
    const gradeColor = best >= 85 ? '#10B981' : best >= 70 ? '#F59E0B' : '#EF4444';
    return `<div class="qz-card" onclick="startQuiz(${q.id})" style="--accent-c:${q.color}22">
      <div class="qz-subj" style="color:${q.color}">${q.subject}</div>
      <div class="qz-title">${q.title}</div>
      <div class="qz-meta">
        <span>📝 ${q.questions_data.length} questions</span>
        <span>⏱ ${q.time} min</span>
      </div>
      ${best ? `<div class="qz-best" style="background:${gradeColor}22;color:${gradeColor}">Best: ${best}%</div>` : ''}
    </div>`;
  }).join('') || '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3)">No quizzes found. Try a different search.</div>';
}

window.startQuiz = function(id) {
  activeQuiz = QUIZ_BANK.find(q => q.id === id);
  if (!activeQuiz) return;
  quizState = {
    current: 0,
    answers: new Array(activeQuiz.questions_data.length).fill(null),
    startTime: Date.now(),
    elapsed: 0,
    submitted: false,
  };
  document.getElementById('quizHome').classList.add('hidden');
  document.getElementById('quizActive').classList.remove('hidden');
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('qaSubject').textContent = activeQuiz.subject;
  renderQuestion();
  startQuizTimer();
};

function renderQuestion() {
  const q = activeQuiz.questions_data[quizState.current];
  const total = activeQuiz.questions_data.length;
  document.getElementById('qaQNum').textContent = `Question ${quizState.current+1} of ${total}`;
  document.getElementById('qaQText').textContent = q.q;
  document.getElementById('qaProgress').textContent = `${quizState.current+1} / ${total}`;
  document.getElementById('qaProgressFill').style.width = ((quizState.current+1)/total*100)+'%';

  const letters = ['A','B','C','D'];
  const opts = document.getElementById('qaOptions');
  opts.innerHTML = q.opts.map((o,i) => {
    let cls = 'qa-opt';
    if (quizState.submitted) {
      if (i === q.ans) cls += ' correct';
      else if (i === quizState.answers[quizState.current] && i !== q.ans) cls += ' wrong';
    } else if (quizState.answers[quizState.current] === i) cls += ' selected';
    return `<button class="${cls}" onclick="selectAnswer(${i})" ${quizState.submitted?'disabled':''}>
      <span class="qa-opt-letter">${letters[i]}</span>${o}
    </button>`;
  }).join('');

  document.getElementById('qaPrev').disabled = quizState.current === 0;
  const isLast = quizState.current === total - 1;
  const nextBtn = document.getElementById('qaNext');
  nextBtn.textContent = isLast ? 'Submit Quiz' : 'Next →';
  nextBtn.onclick = isLast ? submitQuiz : () => quizNav(1);
}

window.selectAnswer = function(i) {
  if (quizState.submitted) return;
  quizState.answers[quizState.current] = i;
  renderQuestion();
};

window.quizNav = function(dir) {
  quizState.current = Math.max(0, Math.min(activeQuiz.questions_data.length-1, quizState.current+dir));
  renderQuestion();
};

function startQuizTimer() {
  clearInterval(quizTimer);
  quizState.elapsed = 0;
  quizTimer = setInterval(() => {
    quizState.elapsed++;
    const m = String(Math.floor(quizState.elapsed/60)).padStart(2,'0');
    const s = String(quizState.elapsed%60).padStart(2,'0');
    const el = document.getElementById('qaTimer');
    if (el) el.textContent = `${m}:${s}`;
  }, 1000);
}

window.submitQuiz = function() {
  clearInterval(quizTimer);
  quizState.submitted = true;
  const qs = activeQuiz.questions_data;
  const correct = qs.filter((q,i) => quizState.answers[i] === q.ans).length;
  const pct = Math.round(correct/qs.length*100);
  const grade = pct>=90?'A+':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';

  document.getElementById('quizActive').classList.add('hidden');
  document.getElementById('quizResult').classList.remove('hidden');
  document.getElementById('qrPercent').textContent = pct+'%';
  document.getElementById('qrGrade').textContent = grade;
  document.getElementById('qrTitle').textContent = pct>=80 ? '🎉 Great job!' : pct>=60 ? '👍 Good effort!' : '📚 Keep practising!';

  const breakdown = document.getElementById('qrBreakdown');
  breakdown.innerHTML = [
    { val: correct, lbl: 'Correct', color: '#22c55e' },
    { val: qs.length - correct, lbl: 'Wrong', color: '#ef4444' },
    { val: qs.filter((_,i) => quizState.answers[i] === null).length, lbl: 'Skipped', color: '#94a3b8' },
  ].map(b => `<div class="qrb-item"><div class="qrb-val" style="color:${b.color}">${b.val}</div><div class="qrb-lbl">${b.lbl}</div></div>`).join('');

  // Animate ring
  setTimeout(() => {
    const fg = document.getElementById('qrRingFg');
    if (fg) fg.style.strokeDashoffset = 314*(1-pct/100);
  }, 200);

  // Review
  const rev = document.getElementById('qrReview');
  rev.innerHTML = '<h4 style="margin-bottom:12px;font-family:var(--font-head);font-size:16px;">Review Answers</h4>' +
    qs.map((q,i) => {
      const userAns = quizState.answers[i];
      const isRight = userAns === q.ans;
      return `<div class="qrr-item">
        <div class="qrr-q">${i+1}. ${q.q}</div>
        <div class="qrr-row">
          <span class="${isRight?'qrr-correct':'qrr-wrong'}">${isRight?'✓ Correct':'✗ Wrong'}</span>
          ${!isRight ? `<span>· Your answer: ${userAns!==null?q.opts[userAns]:'Skipped'}</span>` : ''}
          ${!isRight ? `<span style="color:#22c55e"> · Correct: ${q.opts[q.ans]}</span>` : ''}
        </div>
      </div>`;
    }).join('');
};

window.exitQuiz = function() {
  clearInterval(quizTimer);
  activeQuiz = null;
  quizState = {};
  document.getElementById('quizHome').classList.remove('hidden');
  document.getElementById('quizActive').classList.add('hidden');
  document.getElementById('quizResult').classList.add('hidden');
};

window.retryQuiz = function() {
  const id = activeQuiz.id;
  exitQuiz();
  startQuiz(id);
};
