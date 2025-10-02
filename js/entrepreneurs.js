// js/entrepreneurs.js
const grille = document.getElementById('grille');
const selCom = document.getElementById('filtreCommune');
const selAct = document.getElementById('filtreActivite');

let data = [];

async function load() {
  const res = await fetch('./data/entrepreneurs.json');
  data = await res.json();
  alimenterSelecteurs();
  render(data);
}
function render(liste) {
  grille.innerHTML = '';
  liste.forEach(e => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
  <img src="${e.photo}" alt="${e.nom}, ${e.activite} à ${e.commune}, Bénin – AgriStars" width="400" height="300">
  <h3>${e.nom}</h3>
  <p class="act">${e.activite} – <span>${e.commune}</span></p>
  <p class="bio">${e.bio}</p>
  <a href="https://wa.me/${e.whatsapp}" target="_blank" class="btn wa">WhatsApp</a>
`;
    grille.appendChild(card);
  });
}
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
function alimenterSelecteurs() {
  // Communes
  const communes = [...new Set(data.map(e => e.commune))].sort();
  selCom.innerHTML = '<option value="">Toutes communes</option>';
  communes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    selCom.appendChild(opt);
  });

  // Activités
  const activites = [...new Set(data.map(e => e.activite))].sort();
  selAct.innerHTML = '<option value="">Toutes activités</option>';
  activites.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a;
    opt.textContent = a;
    selAct.appendChild(opt);
  });
}
load();