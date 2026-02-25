// Génère un slug URL depuis un titre
const generateSlug = (titre) => {
  return titre
    .normalize('NFD')                     // Décompose les lettres accentuées (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '')      // Supprime les accents
    .toLowerCase()                        // Met tout en minuscules
    .replace(/[^a-z0-9]+/g, '-')         // Remplace tout ce qui n'est pas lettre/chiffre par un tiret
    .replace(/^-+|-+$/g, '');            // Supprime les tirets en début et fin
};

export { generateSlug };
