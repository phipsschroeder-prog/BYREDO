// ── Konstanten ────────────────────────────────────────────────
const container      = document.getElementById('scrollContainer');
const cartAnzeige    = document.querySelector('.nav__link--cart');
const dotsContainer  = document.getElementById('dotsContainer');
const toastWrapper   = document.createElement('div');
const menuOverlay    = document.getElementById('menuOverlay');

const HERO_SEITEN = [0, 1, 2, 3];

// ── Mobile-Erkennung ─────────────────────────────────────────
function isMobile() { return window.innerWidth <= 768; }

// ── Burger Menü ───────────────────────────────────────────────
function toggleMenu() {
  const isOpen = menuOverlay.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

menuOverlay.addEventListener('click', (e) => {
  if (e.target === menuOverlay) toggleMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOverlay.classList.contains('open')) toggleMenu();
});

// ── Warenkorb ────────────────────────────────────────────────
let anzahl = 0;

document.querySelectorAll('.product-card button').forEach(btn => {
  btn.addEventListener('click', () => {
    anzahl++;
    cartAnzeige.textContent = `Warenkorb (${anzahl})`;
  });
});

// ── Toast-Daten ───────────────────────────────────────────────
const toastDaten = [
  { img: 'produkt1.png', label: 'Wasser', name: 'Orvosfossen',      price: '9,90 €',  size: 'Größe 500 ml' },
  { img: 'produkt2.png', label: 'Wasser', name: 'Ose',               price: '9,90 €',  size: '500 ml' },
  { img: 'produkt3.png', label: 'Wasser', name: 'Hardangerjøkulen',  price: '10,90 €', size: '500 ml' },
  { img: 'produkt4.png', label: 'Wasser', name: 'Fyresdal',          price: '8,90 €',  size: '500 ml' },
];

// ── Toast aufbauen ────────────────────────────────────────────
toastWrapper.className = 'toast-wrapper';
document.body.appendChild(toastWrapper);

const infoToast = document.createElement('div');
infoToast.className = 'toast-info';
infoToast.innerHTML = `
  <span>Kostenlose Lieferung und Rückgabe</span>
  <div class="toast-info__bar" id="infoBar"></div>
`;
toastWrapper.appendChild(infoToast);

const toast = document.createElement('div');
toast.className = 'toast';
toastWrapper.appendChild(toast);

function aktualisiereToastInhalt(daten) {
  toast.innerHTML = `
    <img class="toast__img" src="${daten.img}" alt="${daten.name}" />
    <div class="toast__body">
      <p class="toast__label">${daten.label}</p>
      <p class="toast__name">${daten.name}</p>
      <p class="toast__price">${daten.price}</p>
      <p class="toast__size">${daten.size}</p>
    </div>
    <button class="toast__cart" aria-label="In den Warenkorb">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    </button>
  `;
  toast.querySelector('.toast__cart').addEventListener('click', () => {
    anzahl++;
    cartAnzeige.textContent = `Warenkorb (${anzahl})`;
  });
}

// ── Seiten-Index ermitteln ────────────────────────────────────
function getSeitenIndex() {
  if (isMobile()) {
    const sections = document.querySelectorAll('.section');
    let closest = 0;
    let minDist = Infinity;
    sections.forEach((sec, i) => {
      const dist = Math.abs(sec.getBoundingClientRect().top);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    return closest;
  }
  return Math.round(container.scrollTop / window.innerHeight);
}

// ── Logo ein-/ausblenden + tauschen ──────────────────────────
function aktualisiereLogo() {
  const index = getSeitenIndex();
  const logoEl = document.querySelector('.nav__logo');
  const logoImg = document.querySelector('.nav__logo img');
  if (!logoEl || !logoImg) return;

  if (index >= 6) {
    // Produkte & Footer: Logo ausblenden
    logoEl.style.opacity = '0';
  } else if (index === 4 || index === 5) {
    // Split-Seiten: logo2.png
    logoEl.style.opacity = '1';
    if (logoImg.getAttribute('src') !== 'logo2.png') {
      logoImg.setAttribute('src', 'logo2.png');
    }
  } else {
    // Hero-Seiten 0–3: logo.png
    logoEl.style.opacity = '1';
    if (logoImg.getAttribute('src') !== 'logo.png') {
      logoImg.setAttribute('src', 'logo.png');
    }
  }
}

function aktualisiereNavFarbe() {
  const index = getSeitenIndex();
  document.body.classList.toggle('nav-dark', index >= 4);
}

// ── Dots ──────────────────────────────────────────────────────
function aktualisiereDots() {
  const index = getSeitenIndex();
  const dots  = document.querySelectorAll('.dot');

  dotsContainer.classList.remove('hidden');
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));

  const dark = index >= 4;
  dots.forEach(dot => {
    dot.style.background = dot.classList.contains('active')
      ? (dark ? '#1a1a1a' : 'white')
      : (dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.4)');
  });
}

// ── Toasts ───────────────────────────────────────────────────
let infoTimer = null;

function verbergeToasts() {
  clearTimeout(infoTimer);
  toast.classList.remove('visible');
  infoToast.classList.remove('visible');
  const bar = document.getElementById('infoBar');
  if (bar) { bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)'; }
}

function zeigeToasts() {
  const index = getSeitenIndex();

  if (!HERO_SEITEN.includes(index)) {
    verbergeToasts();
    toastWrapper.classList.add('hidden');
    return;
  }

  toastWrapper.classList.remove('hidden');

  const dauer = 7000;
  const daten = toastDaten[index] || toastDaten[0];
  aktualisiereToastInhalt(daten);

  const bar = document.getElementById('infoBar');
  if (bar) { bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)'; }

  setTimeout(() => {
    toast.classList.add('visible');
    infoToast.classList.add('visible');

    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (bar) {
        bar.style.transition = `transform ${dauer}ms linear`;
        bar.style.transform  = 'scaleX(1)';
      }
    }));

    infoTimer = setTimeout(() => infoToast.classList.remove('visible'), dauer);
  }, 120);
}

// ── Desktop: Scroll-Snap per Wheel ───────────────────────────
let isScrolling = false;

container.addEventListener('wheel', (e) => {
  if (isMobile()) return;
  e.preventDefault();
  if (isScrolling) return;
  isScrolling = true;

  verbergeToasts();

  const richtung     = e.deltaY > 0 ? 1 : -1;
  const aktuellerIdx = getSeitenIndex();
  const gesamtSeiten = document.querySelectorAll('.section').length;
  const zielIndex    = Math.max(0, Math.min(gesamtSeiten - 1, aktuellerIdx + richtung));

  container.scrollTo({ top: zielIndex * window.innerHeight, behavior: 'smooth' });
  setTimeout(() => { isScrolling = false; }, 800);
}, { passive: false });

// ── Mobile: Touch Snap Scroll ─────────────────────────────────
let touchStartY = 0;
let touchMoved = false;
let isTouchScrolling = false;

container.addEventListener('touchstart', (e) => {
  if (!isMobile()) return;
  touchStartY = e.touches[0].clientY;
  touchMoved = false;
}, { passive: true });

container.addEventListener('touchmove', (e) => {
  if (!isMobile()) return;
  touchMoved = true;
  e.preventDefault();
}, { passive: false });

container.addEventListener('touchend', (e) => {
  if (!isMobile() || isTouchScrolling || !touchMoved) return;
  const delta = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(delta) < 30) return;

  isTouchScrolling = true;
  verbergeToasts();

  const richtung     = delta > 0 ? 1 : -1;
  const aktuellerIdx = getSeitenIndex();
  const gesamtSeiten = document.querySelectorAll('.section').length;
  const zielIndex    = Math.max(0, Math.min(gesamtSeiten - 1, aktuellerIdx + richtung));

  container.scrollTo({ top: zielIndex * window.innerHeight, behavior: 'smooth' });
  setTimeout(() => { isTouchScrolling = false; }, 800);
}, { passive: true });

// ── Scroll-Events ─────────────────────────────────────────────
let scrollEndTimer = null;

container.addEventListener('scroll', () => {
  aktualisiereDots();
  aktualisiereNavFarbe();
  aktualisiereLogo();

  clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(() => {
    zeigeToasts();
  }, 250);
});

// ── Initialisierung ───────────────────────────────────────────
aktualisiereDots();
aktualisiereNavFarbe();
aktualisiereLogo();
setTimeout(zeigeToasts, 1500);