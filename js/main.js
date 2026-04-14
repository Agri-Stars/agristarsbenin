// ===== ENVOI DES LEADS VERS GOOGLE SHEETS (via Apps Script) =====

/**
 * Envoie un lead à Google Sheets via Google Apps Script Web App
 * @param {Object} leadData - Données du lead
 */
function sendLeadToTally(leadData) {
  // URL du Web App Google Apps Script
  const TALLY_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwyQ6ajfSlrOjdgIi2wOX56MWvDVcJKzwGnZAK9iwgryOEMOmZZZ0jlpUCfU3b4sOCD/exec';
  
  // Si l'URL n'est pas configurée, on skip silencieusement
  if (!TALLY_WEBHOOK_URL || TALLY_WEBHOOK_URL.trim() === '') {
    console.warn('Webhook non configuré - leads non enregistrés');
    return;
  }
  
  // APRÈS — contourne le CORS
fetch(TALLY_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(leadData),
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ Lead envoyé à Google Sheets:', leadData.nom_visiteur);
    } else {
      console.error('❌ Erreur envoi Google Sheets:', response.status);
    }
  })
  .catch(error => {
    console.error('❌ Erreur réseau:', error);
  });
}

// Export pour utilisation dans autres fichiers
window.sendLeadToTally = sendLeadToTally;