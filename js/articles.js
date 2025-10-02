// js/articles.js
const grille = document.getElementById('grille-articles');
const selCat = document.getElementById('filtreCategorie');

let data = [];

async function load() {
  const res = await fetch('./data/articles.json');
  data = await res.json();
  render(data);
}

function render(liste) {
  grille.innerHTML = '';
  liste.forEach(a => {
    const card = document.createElement('article');
    card.className = 'card article';
    card.innerHTML = `
  <img src="${a.photo}" alt="${a.titre} – Actualité AgriStars Bénin" width="400" height="300">
  <h3>${a.titre}</h3>
  <p class="date">${a.date}</p>
  <p class="resume">${a.resume}</p>
  <span class="tag">${a.categorie}</span>
`;
    grille.appendChild(card);
  });
}

function filtrer() {
  const cat = selCat.value;
  const filtree = data.filter(a => !cat || a.categorie === cat);
  render(filtree);
}

selCat.addEventListener('change', filtrer);

load();