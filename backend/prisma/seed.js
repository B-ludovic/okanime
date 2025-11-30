import { PrismaClient, Role, StatutModeration, StatutSaison } from '@prisma/client';
import bcrypt from 'bcrypt';
import { translateToFrench } from '../src/services/translationService.js';

const prisma = new PrismaClient();

// Fonction helper pour attendre (rate limiting Jikan)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction helper pour fetch avec gestion d'erreur
const fetchFromJikan = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de l'appel à ${url}:`, error.message);
    throw error;
  }
};

async function main() {
  console.log('🌱 Début du seeding...');

  // Vérifier si on active la traduction (besoin de la clé DeepL)
  const enableTranslation = !!process.env.DEEPL_API_KEY;
  let totalCharacters = 0; // Compteur de caractères traduits

  if (enableTranslation) {
    console.log('🌍 Traduction activée avec DeepL');
  } else {
    console.log('⚠️  Traduction désactivée (pas de clé DEEPL_API_KEY)');
  }

  // 1. Création de l'utilisateur Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@okanime.com';
  const adminUsername = process.env.ADMIN_USERNAME || 'AdminOkanime';
  // Mot de passe depuis les variables d'environnement (ou défaut temporaire)
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe2024!@#$';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  // Supprimer l'ancien admin par défaut si on change l'email
  if (adminEmail !== 'admin@okanime.com') {
    await prisma.user.deleteMany({
      where: { 
        email: 'admin@okanime.com'
      }
    });
    console.log('🗑️  Ancien admin supprimé');
  }
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      username: adminUsername,
      password: hashedPassword,
      role: Role.ADMIN,
      isSuperAdmin: true,
    },
    create: {
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      isSuperAdmin: true, // Super admin protégé
      avatar: 'https://ui-avatars.com/api/?name=Admin+Okanime&background=7C3AED&color=fff',
    },
  });

  console.log(`👤 Admin créé : ${admin.username} (${admin.email})`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log(`   ⚠️  ATTENTION : Utilisez la variable ADMIN_PASSWORD pour définir un mot de passe sécurisé !`);
  }

  // 2. Récupération des animes populaires via Jikan API
  console.log('📡 Récupération des données depuis Jikan API...');
  
  let animesData = [];
  
  try {
    // Pages 1 à 2 : Top animes de tous les temps (50 animes)
    for (let page = 1; page <= 2; page++) {
      const pageData = await fetchFromJikan(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`);
      animesData = [...animesData, ...pageData.data];
      console.log(`✅ Top classique Page ${page} : ${pageData.data.length} animes récupérés`);
      await sleep(1000);
    }
    
    // Pages 1 à 2 : Animes récents (2020+) avec bonnes notes (50 animes)
    for (let page = 1; page <= 2; page++) {
      const pageData = await fetchFromJikan(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=25&filter=airing&min_score=7.5`);
      animesData = [...animesData, ...pageData.data];
      console.log(`✅ Animes récents Page ${page} : ${pageData.data.length} animes récupérés`);
      if (page < 2) {
        await sleep(1000);
      }
    }
    
    console.log(`📊 Total : ${animesData.length} animes à traiter`);
  } catch (error) {
    console.error("❌ Erreur lors de l'appel à Jikan API:", error.message);
    process.exit(1);
  }

  // 3. Insertion des données en base
  let successCount = 0;
  let errorCount = 0;

  for (const animeData of animesData) {
    try {
      // Filtrer les contenus adultes (Hentai, Erotica uniquement)
      const isAdultContent = animeData.genres?.some(g => {
        const genreName = g.name.toLowerCase();
        return genreName === 'hentai' || 
               genreName === 'erotica';
      }) || animeData.rating?.toLowerCase().includes('rx');

      if (isAdultContent) {
        console.log(`⛔ Ignoré (contenu adulte) : ${animeData.title}`);
        continue;
      }

      const titre = animeData.title_english || animeData.title;
      const annee = animeData.year || (animeData.aired?.from ? new Date(animeData.aired.from).getFullYear() : 2000);
      const studio = animeData.studios?.length > 0 ? animeData.studios[0].name : 'Inconnu';
      const malId = animeData.mal_id;
      
      // Récupérer le synopsis original
      let synopsis = animeData.synopsis || "Pas de synopsis disponible.";

      console.log(`💾 Traitement de : ${titre} (MAL ID: ${malId})`);

      // Traduire le synopsis si la traduction est activée
      if (enableTranslation && synopsis !== "Pas de synopsis disponible.") {
        console.log('   🌍 Traduction du synopsis...');
        const originalLength = synopsis.length;
        synopsis = await translateToFrench(synopsis);
        totalCharacters += originalLength;
        console.log(`   ✅ Synopsis traduit (${originalLength} caractères)`);
        // Petite pause pour ne pas surcharger DeepL
        await sleep(500);
      }

      // A. Vérifier si l'anime existe déjà via malId
      let anime = await prisma.anime.findUnique({
        where: { malId: malId }
      });

      // B. Créer l'anime s'il n'existe pas
      if (!anime) {
        anime = await prisma.anime.create({
          data: {
            malId: malId,
            titreVf: titre,
            synopsis: synopsis, // Synopsis traduit ou original
            anneeDebut: annee,
            studio: studio,
            posterUrl: animeData.images?.jpg?.large_image_url,
            noteMoyenne: animeData.score || 0,
            statutModeration: StatutModeration.VALIDE,
            userIdAjout: admin.id,
          }
        });
      } else {
        console.log(`   ⏭️  Anime déjà existant, passage au suivant`);
      }

      // C. Création de la Saison 1 si elle n'existe pas
      if (anime) {
        const existingSaison = await prisma.saison.findFirst({
          where: {
            animeId: anime.id,
            numeroSaison: 1
          }
        });

        if (!existingSaison) {
          await prisma.saison.create({
            data: {
              animeId: anime.id,
              numeroSaison: 1,
              titreSaison: "Saison 1",
              nombreEpisodes: animeData.episodes || 12,
              annee: annee,
              statut: StatutSaison.TERMINE,
            }
          });
        }

        // D. Gestion des Genres
        if (animeData.genres && animeData.genres.length > 0) {
          for (const genreData of animeData.genres) {
            // 1. Créer ou récupérer le genre
            const genre = await prisma.genre.upsert({
              where: { nom: genreData.name },
              update: {},
              create: { nom: genreData.name },
            });

            // 2. Créer la liaison anime-genre si elle n'existe pas
            await prisma.animeGenre.upsert({
              where: {
                animeId_genreId: {
                  animeId: anime.id,
                  genreId: genre.id,
                }
              },
              update: {},
              create: {
                animeId: anime.id,
                genreId: genre.id,
              },
            });
          }
        }
      }

      successCount++;
    } catch (error) {
      console.error(`❌ Erreur pour "${animeData.title}":`, error.message);
      errorCount++;
    }

    // Petite pause pour ne pas surcharger la DB
    await sleep(100);
  }

  console.log('\n🎉 Seeding terminé !');
  console.log(`✅ ${successCount} animes traités avec succès`);
  if (errorCount > 0) {
    console.log(`❌ ${errorCount} erreurs rencontrées`);
  }
  if (enableTranslation) {
    console.log(`📊 Total de caractères traduits : ${totalCharacters} / 500000 (DeepL gratuit)`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur fatale:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
