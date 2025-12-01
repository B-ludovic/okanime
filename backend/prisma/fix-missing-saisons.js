// backend/prisma/fix-missing-saisons.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Recherche des animés sans saison...\n');

  // 1. Trouve tous les animés
  const allAnimes = await prisma.anime.findMany({
    include: {
      saisons: true, // Inclut les saisons pour vérifier s'il y en a
    },
  });

  // 2. Filtre ceux qui n'ont aucune saison
  const animesSansSaison = allAnimes.filter((anime) => anime.saisons.length === 0);

  console.log(`📊 Résultats :`);
  console.log(`   Total d'animés : ${allAnimes.length}`);
  console.log(`   Animés sans saison : ${animesSansSaison.length}\n`);

  // 3. Si aucun animé sans saison, on arrête
  if (animesSansSaison.length === 0) {
    console.log('✅ Tous les animés ont déjà une saison !');
    return;
  }

  // 4. Pour chaque animé sans saison, on en crée une par défaut
  console.log('🛠️  Création des saisons par défaut...\n');

  for (const anime of animesSansSaison) {
    try {
      // Crée une saison par défaut pour cet animé
      await prisma.saison.create({
        data: {
          animeId: anime.id,                  // Lie la saison à l'animé
          numeroSaison: 1,                    // Première saison
          titreSaison: 'Saison 1',            // Titre par défaut
          nombreEpisodes: 12,                 // 12 épisodes (standard pour 1 saison)
          annee: anime.anneeDebut,            // Même année que l'animé
          statut: 'EN_COURS',                 // Statut par défaut
        },
      });

      console.log(`   ✓ Saison créée pour "${anime.titreVf}"`);
    } catch (error) {
      // Si erreur, on affiche mais on continue avec les autres
      console.error(`   ✗ Erreur pour "${anime.titreVf}":`, error.message);
    }
  }

  console.log(`\n✅ Migration terminée ! ${animesSansSaison.length} saisons créées.`);
}

// Exécute le script
main()
  .catch((error) => {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1); // Code de sortie 1 = erreur
  })
  .finally(async () => {
    await prisma.$disconnect(); // Ferme la connexion à la base de données
  });
