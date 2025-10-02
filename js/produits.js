// js/produits.js
const grille = document.getElementById('grille-produits');
const selCat = document.getElementById('filtreCategorie');

let data = [];

async function load() {
  const res = await fetch('./data/produits.json');
  data = await res.json();
  render(data);
}

function render(liste) {
  grille.innerHTML = '';
  liste.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
  <img src="${p.photo}" alt="${p.nom}, ${p.categorie}, ${p.producteur}, Bénin – AgriStars" width="400" height="300">
  <h3>${p.nom}</h3>
  <p class="prix">${p.prix}</p>
  <p class="cat">${p.categorie}</p>
  <p class="prod">Produit par <strong>${p.producteur}</strong></p>
  <a href="https://wa.me/${p.whatsapp}" target="_blank" class="btn wa">Commander via WhatsApp</a>
`;
    grille.appendChild(card);
  });
}

function filtrer() {
  const cat = selCat.value;
  const filtree = data.filter(p => !cat || p.categorie === cat);
  render(filtree);
}

selCat.addEventListener('change', filtrer);

load();