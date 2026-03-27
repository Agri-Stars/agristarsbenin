// js/entrepreneurs.js
const grille = document.getElementById('grille');
const selCom = document.getElementById('filtreCommune');
const selAct = document.getElementById('filtreActivite');
const compteur = document.getElementById('compteur-entrepreneurs');

let data = [];

// ── Badges colorés par activité ──────────────────────────────
function getBadgeClass(activite) {
  if (!activite) return 'badge-default';
  const a = activite.toLowerCase();
  if (a.includes('végétale') || a.includes('vegetale')) return 'badge-production-vegetale';
  if (a.includes('animale') || a.includes('animal'))    return 'badge-production-animale';
  if (a.includes('transformation'))                     return 'badge-transformation';
  if (a.includes('maraîchère') || a.includes('maraichere')) return 'badge-maraichere';
  return 'badge-default';
}

// ── Couleur de fond pour les initiales (fallback photo) ──────
function getInitialsClass(activite) {
  if (!activite) return 'initials-default';
  const a = activite.toLowerCase();
  if (a.includes('végétale') || a.includes('vegetale')) return 'initials-production-vegetale';
  if (a.includes('animale') || a.includes('animal'))    return 'initials-production-animale';
  if (a.includes('transformation'))                     return 'initials-transformation';
  if (a.includes('maraîchère') || a.includes('maraichere')) return 'initials-maraichere';
  return 'initials-default';
}

// ── Générer 2 initiales depuis le nom ────────────────────────
function getInitials(nom) {
  return nom.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// ── Vérifier si c'est la photo placeholder par défaut ────────
function isDefaultPhoto(photo) {
  return !photo
    || photo.includes('Producteur-agriculture-agritars')
    || photo.trim() === '';
}

// ── Créer une carte entrepreneur ─────────────────────────────
function render(liste) {
  grille.innerHTML = '';

  // Mise à jour du compteur
  if (compteur) {
    compteur.textContent =
      `${liste.length} entrepreneur${liste.length > 1 ? 's' : ''} trouvé${liste.length > 1 ? 's' : ''}`;
  }

  if (liste.length === 0) {
    grille.innerHTML = '<p style="text-align:center;padding:2rem;color:#555;">Aucun entrepreneur trouvé avec ces critères.</p>';
    return;
  }

  liste.forEach(e => {
    const badgeClass    = getBadgeClass(e.activite);
    const initialsClass = getInitialsClass(e.activite);
    const initials      = getInitials(e.nom);

    // Photo réelle OU bloc initiales coloré
    const photoHtml = !isDefaultPhoto(e.photo)
      ? `<img src="${e.photo}" alt="${e.nom}, ${e.activite} à ${e.commune} – AgriStars Bénin" width="400" height="300" loading="lazy">`
      : `<div class="initials ${initialsClass}" aria-hidden="true">${initials}</div>`;

    const card = document.createElement('article');
    card.className = 'card fade-in-on-scroll';
    card.innerHTML = `
      ${photoHtml}
      <h3>${e.nom}</h3>
      <span class="badge ${badgeClass}">${e.activite || 'Activité non précisée'}</span>
      <p class="commune">📍 ${e.commune || 'Bénin'}</p>
      <p class="bio line-clamp-2">${e.bio || 'Entrepreneur agricole béninois.'}</p>
      <a href="https://wa.me/${e.whatsapp}"
         target="_blank"
         rel="noopener"
         class="wa"
         aria-label="Contacter ${e.nom} sur WhatsApp">
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Contacter sur WhatsApp
      </a>
    `;
    grille.appendChild(card);
  });

  // Activer les animations scroll sur les nouvelles cartes
  document.querySelectorAll('.fade-in-on-scroll:not(.visible)').forEach(el => {
    scrollObserver.observe(el);
  });
}

// ── Filtres ──────────────────────────────────────────────────
function filtrer() {
  const com = selCom.value;
  const act = selAct.value;
  const filtree = data.filter(e =>
    (!com || e.commune === com) &&
    (!act || e.activite === act)
  );
  render(filtree);
}

selCom.addEventListener('change', filtrer);
selAct.addEventListener('change', filtrer);

// ── Remplir les selects dynamiquement ────────────────────────
function alimenterSelecteurs() {
  const communes = [...new Set(data.map(e => e.commune).filter(Boolean))].sort();
  selCom.innerHTML = '<option value="">Toutes communes</option>';
  communes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    selCom.appendChild(opt);
  });

  const activites = [...new Set(data.map(e => e.activite).filter(Boolean))].sort();
  selAct.innerHTML = '<option value="">Toutes activités</option>';
  activites.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a; opt.textContent = a;
    selAct.appendChild(opt);
  });
}
// ── Afficher les skeletons pendant le chargement ──────────────
function afficherSkeletons(n = 6) {
  grille.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const sk = document.createElement('div');
    sk.className = 'skeleton-card';
    sk.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-line long"></div>
      <div class="skeleton-line long"></div>
      <div class="skeleton-line btn"></div>
    `;
    grille.appendChild(sk);
  }
}
// ── IntersectionObserver pour animations scroll ───────────────
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// ── Chargement initial ────────────────────────────────────────
async function load() {
  afficherSkeletons(6);
  await new Promise(resolve => setTimeout(resolve, 600));
  try {
    const res = await fetch('./data/entrepreneurs.json');
    if (!res.ok) throw new Error('Fichier introuvable');
    data = await res.json();
    alimenterSelecteurs();
    render(data);
  } catch (err) {
    console.error('Erreur chargement entrepreneurs:', err);
    grille.innerHTML = '<p style="text-align:center;padding:2rem;color:red;">Erreur de chargement. Vérifiez votre connexion.</p>';
    if (compteur) compteur.textContent = 'Erreur de chargement';
  }
}

load();