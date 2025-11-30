import { HttpInternalServerError } from '../utils/httpErrors.js';

// Service de traduction utilisant l'API DeepL
// Traduit du texte de l'anglais vers le français

// Fonction qui traduit un texte avec DeepL
export const translateToFrench = async (text) => {
  // Si pas de texte ou pas de clé API, retourner le texte original
  if (!text || !process.env.DEEPL_API_KEY) {
    console.log('Traduction ignorée (pas de texte ou clé API manquante)');
    return text;
  }

  try {
    // Appel à l'API DeepL
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: 'FR', // Français
        source_lang: 'EN', // Anglais
      }),
    });

    // Si l'API répond avec une erreur
    if (!response.ok) {
      console.error('Erreur DeepL API:', response.status);
      return text; // Retourner le texte original
    }

    const data = await response.json();
    
    // Récupérer la traduction
    const translatedText = data.translations[0]?.text;
    
    if (translatedText) {
      console.log('Texte traduit avec succès');
      return translatedText;
    }

    // Si pas de traduction, retourner l'original
    return text;

  } catch (error) {
    console.error('Erreur lors de la traduction:', error.message);
    // En cas d'erreur, on retourne le texte original en anglais
    return text;
  }
};
