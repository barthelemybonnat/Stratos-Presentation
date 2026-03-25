/* ============================================================
   STRATOS HOSPITALITY — main.js
   ============================================================ */

/* ============================================================
   HERO — word by word reveal on load
   ============================================================ */
const words = document.querySelectorAll('.hero-line .word');
words.forEach((w, i) => {
  setTimeout(() => w.classList.add('visible'), 150 + i * 80);
});
setTimeout(() => {
  document.querySelector('.hero-sub p').classList.add('visible');
  document.querySelector('.hero-sub a').classList.add('visible');
}, 150 + words.length * 80 + 200);

/* ============================================================
   NAV — compact mode on scroll
   ============================================================ */
window.addEventListener('scroll', () => {
  document.querySelector('nav').classList.toggle('compact', scrollY > 80);
}, { passive: true });

/* ============================================================
   SCROLL REVEAL — words light up as you scroll down
   ============================================================ */
const wordObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const w = entry.target;
      w.classList.add(w.classList.contains('gold-target') ? 'gold-lit' : 'lit');
    }
  });
}, { rootMargin: '0px 0px -30% 0px', threshold: 0.1 });

document.querySelectorAll('.reveal-text .rw, .pillars-intro .rw').forEach(w => wordObserver.observe(w));

/* ============================================================
   GEO TYPING SIMULATION
   Simulates an AI response recommending an establishment.
   Replace content here to adapt the demo to a specific client.
   ============================================================ */
const simQ = document.getElementById('simQ');
const simA = document.getElementById('simA');

const question = "Quel est le meilleur restaurant gastronomique près de la place de la Concorde ?";

// answerParts: array of { t: text, c: 1 if "cited" (gold) }
const answerParts = [
  { t: "Pour un dîner gastronomique près de la Concorde, je recommande ", c: 0 },
  { t: "Le Restaurant de l'Hôtel de la Marine", c: 1 },
  { t: " — une table d'exception située au cœur du monument historique. ", c: 0 },
  { t: "\n\nCuisine française contemporaine, produits de saison, cadre somptueux avec vue sur la place. ", c: 0 },
  { t: "Note Google : 4.6/5", c: 1 },
  { t: " (824 avis).", c: 0 },
  { t: "\n\nAutres options : ", c: 0 },
  { t: "Le Crillon", c: 1 },
  { t: " et ", c: 0 },
  { t: "Mimosa", c: 1 },
  { t: ".", c: 0 },
];

let simStarted = false;

function startSim() {
  if (simStarted) return;
  simStarted = true;

  let qi = 0;
  const qInt = setInterval(() => {
    simQ.textContent = question.slice(0, ++qi);
    if (qi >= question.length) {
      clearInterval(qInt);
      setTimeout(typeA, 500);
    }
  }, 28);
}

function typeA() {
  let pi = 0, ci = 0, span = null;
  const cursor = document.createElement('span');
  cursor.className = 'cursor';

  function tick() {
    if (pi >= answerParts.length) {
      if (cursor.parentNode) cursor.remove();
      return;
    }

    const part = answerParts[pi];
    if (ci === 0) {
      span = document.createElement('span');
      if (part.c) span.className = 'cited';
      simA.appendChild(span);
    }

    const ch = part.t[ci];
    if (ch === '\n') simA.appendChild(document.createElement('br'));
    else span.textContent += ch;

    if (cursor.parentNode) cursor.remove();
    simA.appendChild(cursor);

    ci++;
    if (ci >= part.t.length) {
      pi++;
      ci = 0;
    }

    setTimeout(tick, ch === '.' || ch === ',' ? 40 : 10 + Math.random() * 8);
  }

  tick();
}

const simObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) startSim();
}, { threshold: 0.4 });

simObs.observe(document.querySelector('.sim'));

/* ============================================================
   PILLARS — drag to scroll horizontal
   ============================================================ */
const track = document.getElementById('pillarsTrack');
let isDragging = false, startX, scrollLeft;

track.addEventListener('mousedown', e => {
  isDragging = true;
  track.style.cursor = 'grabbing';
  startX = e.pageX - track.offsetLeft;
  scrollLeft = track.parentElement.scrollLeft;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  track.style.cursor = '';
});

track.addEventListener('mousemove', e => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - track.offsetLeft;
  track.parentElement.scrollLeft = scrollLeft - (x - startX);
});

/* ============================================================
   PILLARS INTRO — lignes apparaissent en stagger au scroll
   ============================================================ */
const piLines = document.querySelectorAll('.pi-line');
if (piLines.length) {
  const piObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = document.querySelectorAll('.pi-line');
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('pi-visible'), i * 120);
        });
        piObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });
  piObserver.observe(piLines[0]);
}

/* ============================================================
   FAQ ACCORDION — toggle ouverture / fermeture
   ============================================================ */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;

    // Fermer tous les autres
    document.querySelectorAll('.faq-question').forEach(other => {
      other.setAttribute('aria-expanded', 'false');
      other.nextElementSibling.classList.remove('open');
    });

    // Ouvrir ou fermer celui-ci
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

/* ============================================================
   COUNTERS — animate numbers on scroll
   Modify data-target values in index.html to update metrics.
   ============================================================ */
const counterEls = document.querySelectorAll('.counter-val');
let countersDone = false;

const counterObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersDone) {
    countersDone = true;
    counterEls.forEach(el => {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    });
  }
}, { threshold: 0.3 });

counterObs.observe(document.querySelector('.counters'));
