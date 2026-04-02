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
  <button type="button"
              class="btn wa btn-commander-produit"
              data-id="${p.id || ''}"
              data-nom="${p.nom}"
              data-prix="${p.prix || ''}"
              data-producteur="${p.producteur || ''}"
              data-whatsapp="${p.whatsapp}"
              data-categorie="${p.categorie || ''}">
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Commander via WhatsApp
      </button>
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
// ===== GESTION DU MODAL DE CAPTURE LEADS PRODUITS =====

// Fonction pour ouvrir le modal en toute sécurité
function openLeadModal(produit) {
  const modal = document.getElementById('lead-modal');
  if (!modal) {
    console.error('Modal non trouvé dans le HTML');
    return;
  }
  
  // Pré-remplir les champs cachés (avec vérification)
  const idField = document.getElementById('lead-produit-id');
  const nomField = document.getElementById('lead-produit-nom');
  const prodField = document.getElementById('lead-producteur-nom');
  const whatsField = document.getElementById('lead-producteur-whatsapp');
  
  if (idField) idField.value = produit.id || '';
  if (nomField) nomField.value = produit.nom || '';
  if (prodField) prodField.value = produit.producteur || '';
  if (whatsField) whatsField.value = produit.whatsapp || '';
  
  // Afficher le modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Focus sur le premier champ
  setTimeout(() => {
    const nomInput = document.getElementById('lead-nom');
    if (nomInput) nomInput.focus();
  }, 100);
}

// Fonction pour fermer le modal
function closeLeadModal() {
  const modal = document.getElementById('lead-modal');
  if (!modal) return;
  
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  
  const form = document.getElementById('lead-form');
  if (form) form.reset();
}

// Ouvrir le modal au clic sur "Commander"
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn-commander-produit');
  if (!btn) return;
  
  e.preventDefault();
  
  const produit = {
    id: btn.dataset.id,
    nom: btn.dataset.nom,
    prix: btn.dataset.prix,
    producteur: btn.dataset.producteur,
    whatsapp: btn.dataset.whatsapp,
    categorie: btn.dataset.categorie
  };
  
  openLeadModal(produit);
});

// ── CORRECTION : suppression du wrapper DOMContentLoaded ──────
// Raison : ce script est chargé en type="module" (différé automatiquement
// par le navigateur). Le DOM est donc déjà prêt à l'exécution du module.
// Dans certains navigateurs, DOMContentLoaded a déjà été déclenché avant
// que le listener ne soit enregistré → le submit n'était jamais attaché.

const modal = document.getElementById('lead-modal');
if (!modal) {
  console.warn('Modal non trouvé - assurez-vous qu\'il est dans produits.html');
} else {

  // Fermer au clic sur la croix
  const closeBtn = document.getElementById('modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLeadModal);
  }
  
  // Fermer au clic sur l'overlay
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeLeadModal);
  }
  
  // Fermer avec Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeLeadModal();
    }
  });
  
  // Gestion de la soumission
  const form = document.getElementById('lead-form');
  if (!form) {
    console.error('Formulaire non trouvé');
  } else {

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Récupérer les valeurs (avec vérification)
      const nomEl = document.getElementById('lead-nom');
      const contactEl = document.getElementById('lead-contact');
      const typeEl = document.getElementById('lead-type');
      const quantiteEl = document.getElementById('lead-quantite');
      const messageEl = document.getElementById('lead-message');
      const produitNomEl = document.getElementById('lead-produit-nom');
      const producteurNomEl = document.getElementById('lead-producteur-nom');
      const producteurWhatsappEl = document.getElementById('lead-producteur-whatsapp');
      
      console.log('🔍 lead-nom:', nomEl);
console.log('🔍 lead-contact:', contactEl);
console.log('🔍 lead-type:', typeEl);
console.log('🔍 lead-produit-nom:', produitNomEl);
console.log('🔍 lead-producteur-nom:', producteurNomEl);
console.log('🔍 lead-producteur-whatsapp:', producteurWhatsappEl);

if (!nomEl || !contactEl || !typeEl || !produitNomEl || !producteurNomEl || !producteurWhatsappEl) {
  console.error('Champs du formulaire manquants');
  return;
}
      
      const nom = nomEl.value;
      const contact = contactEl.value;
      const type = typeEl.value;
      const quantite = quantiteEl ? quantiteEl.value : '';
      const message = messageEl ? messageEl.value : '';
      const produitNom = produitNomEl.value;
      const producteurNom = producteurNomEl.value;
      const producteurWhatsapp = producteurWhatsappEl.value;
      
      // Tracker GA4
      if (typeof gtag === 'function') {
        gtag('event', 'product_lead_submit', {
          'event_category': 'conversion',
          'event_label': produitNom,
          'product_name': produitNom,
          'producer_name': producteurNom,
          'visitor_type': type,
          'quantity': quantite,
          'value': 1
        });
      }
      // 2. Envoyer le lead à Tally.so (Google Sheets)
      const leadData = {
        date: new Date().toISOString(),
        type_lead: 'Produit',
        nom_visiteur: nom,
        contact_visiteur: contact,
        type_demande: type,
        cible_nom: producteurNom,
        cible_whatsapp: producteurWhatsapp,
        quantite: quantite,
        message: message,
        source: document.referrer || 'Direct',
        consentement: true
      };

      if (typeof window.sendLeadToTally === 'function') window.sendLeadToTally(leadData);

      // 3. Construire le message WhatsApp...
      // Construire le message WhatsApp
      const whatsappMessage = 
        `Bonjour ${producteurNom},%0A%0A` +
        `Je vous contacte depuis AgriStars Bénin pour votre produit.%0A%0A` +
        `🛒 Produit : ${produitNom}%0A` +
        `👤 Nom : ${nom}%0A` +
        `📞 Contact : ${contact}%0A` +
        `🎯 Type : ${type}%0A` +
        `📦 Quantité : ${quantite || 'Non précisée'}%0A` +
        `💬 Message : ${message || 'Aucun'}%0A%0A` +
        `--%0A` +
        `Ce contact provient de la plateforme AgriStars Bénin%0A` +
        `https://agri-stars.github.io/agristarsbenin`;
      
      // Ouvrir WhatsApp
      const whatsappUrl = `https://wa.me/${producteurWhatsapp}?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank', 'noopener');
      
      // Fermer le modal
      closeLeadModal();
      
      // Confirmation
      alert('✅ Redirection vers WhatsApp...');
    });

  } // fin if form
} // fin if modal