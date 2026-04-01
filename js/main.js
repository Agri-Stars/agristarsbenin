// ===== ENVOI DES LEADS VERS TALLY.SO =====

/**
 * Envoie un lead à Tally.so (Google Sheets)
 * @param {Object} leadData - Données du lead
 */
function sendLeadToTally(leadData) {
  // URL du webhook Tally (À REMPLACER par la vôtre)
  const TALLY_WEBHOOK_URL = 'https://tally.so/r/obdeyO';
  
  // Si l'URL n'est pas configurée, on skip silencieusement
  if (!TALLY_WEBHOOK_URL || TALLY_WEBHOOK_URL.includes('obdeyO')) {
    console.warn('Webhook Tally non configuré - leads non enregistrés');
    return;
  }
  
  // Envoyer les données via fetch
  fetch(TALLY_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  })
  .then(response => {
    if (response.ok) {
      console.log('✅ Lead envoyé à Tally:', leadData.nom_visiteur);
    } else {
      console.error('❌ Erreur envoi Tally:', response.status);
    }
  })
  .catch(error => {
    console.error('❌ Erreur réseau Tally:', error);
  });
}

// Export pour utilisation dans autres fichiers
window.sendLeadToTally = sendLeadToTally;