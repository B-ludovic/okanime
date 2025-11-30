import { PrismaClient, Role, StatutModeration, StatutSaison } from '@prisma/client';
import bcrypt from 'bcrypt';

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

  // 1. Création de l'utilisateur Admin
  const adminEmail = 'admin@okanime.com';
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      username: 'AdminOkanime',
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      avatar: 'https://ui-avatars.com/api/?name=Admin+Okanime&background=7C3AED&color=fff',
    },
  });

  console.log(`👤 Admin créé : ${admin.username} (${admin.email})`);
  console.log(`   🔑 Mot de passe : admin123`);

  // 2. Récupération des animes populaires via Jikan API
  console.log('📡 Récupération des données depuis Jikan API...');
  
  let animesData = [];
  
  try {
    // Page 1
    const page1 = await fetchFromJikan('https://api.jikan.moe/v4/top/anime?page=1&limit=25');
    animesData = page1.data;
    console.log(`✅ Page 1 : ${page1.data.length} animes récupérés`);
    
    // Attente de 1 seconde (rate limit Jikan)
    await sleep(1000);
    
    // Page 2
    const page2 = await fetchFromJikan('https://api.jikan.moe/v4/top/anime?page=2&limit=25');
    animesData = [...animesData, ...page2.data];
    console.log(`✅ Page 2 : ${page2.data.length} animes récupérés`);
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
      const titre = animeData.title_english || animeData.title;
      const annee = animeData.year || (animeData.aired?.from ? new Date(animeData.aired.from).getFullYear() : 2000);
      const studio = animeData.studios?.length > 0 ? animeData.studios[0].name : 'Inconnu';
      const malId = animeData.mal_id;

      console.log(`💾 Traitement de : ${titre} (MAL ID: ${malId})`);

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
            synopsis: animeData.synopsis || "Pas de synopsis disponible.",
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
}

main()
  .catch((e) => {
    console.error('❌ Erreur fatale:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
