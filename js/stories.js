// js/stories.js
const grille = document.getElementById('grille-stories');

async function load() {
  const res = await fetch('./data/stories.json');
  const data = await res.json();
  render(data);
}

function render(liste) {
  grille.innerHTML = '';
  liste.forEach(s => {
    const card = document.createElement('article');
    card.className = 'card story';
    card.innerHTML = `
  <img src="${s.photo}" alt="${s.titre} – Success Story AgriStars Bénin" width="400" height="300">
  <h3>${s.titre}</h3>
  <p class="resume">${s.resume}</p>
  <p class="histoire">${s.histoire}</p>
`;
    grille.appendChild(card);
  });
}

load();