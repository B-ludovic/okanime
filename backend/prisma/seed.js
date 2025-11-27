const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fonction pour récupérer l'image via Jikan API
async function getAnimeImage(titre) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(titre)}&limit=1`);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      return data.data[0].images.jpg.large_image_url || data.data[0].images.jpg.image_url;
    }
    return null;
  } catch (error) {
    console.error(`⚠️ Erreur image pour "${titre}":`, error.message);
    return null;
  }
}

// Fonction pour le délai (Anti-ban API)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🌱 Début du seed des 30 animes populaires...');

  // 1. Création de l'utilisateur
  let user = await prisma.user.findUnique({
    where: { email: 'ludovic@okanime.com' }
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: { username: 'Ludovic' }
    });
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'ludovic@okanime.com',
        username: 'Ludovic',
        password: '$2b$10$ExempleHashedPassword', 
      },
    });
  }

  console.log(`👤 Utilisateur prêt : ${user.username}`);

  // 2. Les 30 Animes les plus populaires (Données fixes)
  const top30Animes = [
    {
      titre: "L'Attaque des Titans",
      nbSaisons: 4, nbEpisodes: 89, dureeEpisode: 24, studio: 'MAPPA / Wit', paysOrigine: 'Japon', note: 9.8,
      resume: "L'humanité vit entourée de murs pour se protéger des Titans mangeurs d'hommes.",
      statut: 'deja_vu', avis: "Un chef d'oeuvre d'intensité."
    },
    {
      titre: "Death Note",
      nbSaisons: 1, nbEpisodes: 37, dureeEpisode: 23, studio: 'Madhouse', paysOrigine: 'Japon', note: 9.0,
      resume: "Un lycéen trouve un cahier surnaturel qui lui permet de tuer n'importe qui en écrivant son nom.",
      statut: 'deja_vu', avis: "Le duel psychologique est incroyable."
    },
    {
      titre: "Fullmetal Alchemist: Brotherhood",
      nbSaisons: 1, nbEpisodes: 64, dureeEpisode: 24, studio: 'Bones', paysOrigine: 'Japon', note: 9.9,
      resume: "Deux frères alchimistes cherchent la pierre philosophale pour restaurer leurs corps.",
      statut: 'deja_vu', avis: "L'anime parfait de A à Z."
    },
    {
      titre: "One Punch Man",
      nbSaisons: 2, nbEpisodes: 24, dureeEpisode: 24, studio: 'Madhouse', paysOrigine: 'Japon', note: 8.8,
      resume: "Saitama est un héros si puissant qu'il bat tous ses ennemis d'un seul coup de poing.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Sword Art Online",
      nbSaisons: 3, nbEpisodes: 96, dureeEpisode: 24, studio: 'A-1 Pictures', paysOrigine: 'Japon', note: 7.5,
      resume: "Des joueurs se retrouvent piégés dans un MMORPG en réalité virtuelle où la mort est réelle.",
      statut: 'deja_vu', avis: "Le premier arc est légendaire."
    },
    {
      titre: "My Hero Academia",
      nbSaisons: 6, nbEpisodes: 138, dureeEpisode: 24, studio: 'Bones', paysOrigine: 'Japon', note: 8.0,
      resume: "Dans un monde où 80% des gens ont des pouvoirs, un garçon sans alter veut devenir le numéro 1.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Demon Slayer",
      nbSaisons: 3, nbEpisodes: 55, dureeEpisode: 24, studio: 'Ufotable', paysOrigine: 'Japon', note: 9.0,
      resume: "Tanjiro chasse les démons pour venger sa famille et sauver sa sœur Nezuko.",
      statut: 'deja_vu', avis: "L'animation la plus belle jamais vue."
    },
    {
      titre: "Naruto",
      nbSaisons: 1, nbEpisodes: 220, dureeEpisode: 24, studio: 'Pierrot', paysOrigine: 'Japon', note: 8.0,
      resume: "Un jeune ninja rejeté par son village rêve de devenir Hokage pour être reconnu de tous.",
      statut: 'deja_vu', avis: "Toute mon enfance."
    },
    {
      titre: "Tokyo Ghoul",
      nbSaisons: 2, nbEpisodes: 24, dureeEpisode: 24, studio: 'Pierrot', paysOrigine: 'Japon', note: 7.8,
      resume: "Ken Kaneki devient un demi-goule après une opération et doit survivre dans le monde des goules.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Hunter x Hunter (2011)",
      nbSaisons: 1, nbEpisodes: 148, dureeEpisode: 24, studio: 'Madhouse', paysOrigine: 'Japon', note: 9.5,
      resume: "Gon part à l'aventure pour devenir Hunter et retrouver son père.",
      statut: 'deja_vu', avis: "L'arc des ants est sombre et génial."
    },
    {
      titre: "Your Name",
      nbSaisons: 1, nbEpisodes: 1, dureeEpisode: 106, studio: 'CoMix Wave', paysOrigine: 'Japon', note: 9.3,
      resume: "Deux adolescents échangent leurs corps dans leurs rêves, liés par un destin mystérieux.",
      statut: 'deja_vu', avis: "Visuellement magnifique."
    },
    {
      titre: "Steins;Gate",
      nbSaisons: 1, nbEpisodes: 24, dureeEpisode: 24, studio: 'White Fox', paysOrigine: 'Japon', note: 9.1,
      resume: "Un scientifique excentrique découvre un moyen d'envoyer des messages dans le passé.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Jujutsu Kaisen",
      nbSaisons: 2, nbEpisodes: 47, dureeEpisode: 24, studio: 'MAPPA', paysOrigine: 'Japon', note: 8.7,
      resume: "Yuji rejoint une école d'exorcisme pour combattre les fléaux après avoir mangé un doigt maudit.",
      statut: 'deja_vu', avis: "Satoru Gojo est trop stylé."
    },
    {
      titre: "No Game No Life",
      nbSaisons: 1, nbEpisodes: 12, dureeEpisode: 24, studio: 'Madhouse', paysOrigine: 'Japon', note: 8.2,
      resume: "Une fratrie de génies du jeu vidéo est transportée dans un monde où tout se règle par des jeux.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Code Geass",
      nbSaisons: 2, nbEpisodes: 50, dureeEpisode: 24, studio: 'Sunrise', paysOrigine: 'Japon', note: 8.9,
      resume: "Lelouch obtient le pouvoir de soumission absolue et mène une rébellion contre l'empire de Britannia.",
      statut: 'deja_vu', avis: "Une fin d'anthologie."
    },
    {
      titre: "Toradora!",
      nbSaisons: 1, nbEpisodes: 25, dureeEpisode: 24, studio: 'J.C.Staff', paysOrigine: 'Japon', note: 8.2,
      resume: "Une romance scolaire compliquée entre un garçon maniaque et une petite fille colérique.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Noragami",
      nbSaisons: 2, nbEpisodes: 25, dureeEpisode: 24, studio: 'Bones', paysOrigine: 'Japon', note: 7.9,
      resume: "Un dieu mineur sans sanctuaire cherche à gagner des fidèles en exauçant des vœux pour 5 yens.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Re:Zero",
      nbSaisons: 2, nbEpisodes: 50, dureeEpisode: 25, studio: 'White Fox', paysOrigine: 'Japon', note: 8.5,
      resume: "Subaru est transporté dans un autre monde où il revient à la vie à chaque fois qu'il meurt.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "One Piece",
      nbSaisons: 20, nbEpisodes: 1090, dureeEpisode: 24, studio: 'Toei Animation', paysOrigine: 'Japon', note: 9.0,
      resume: "Luffy cherche le One Piece pour devenir le Roi des Pirates.",
      statut: 'a_voir', avis: "Je dois trouver le courage de commencer !"
    },
    {
      titre: "Violet Evergarden",
      nbSaisons: 1, nbEpisodes: 13, dureeEpisode: 24, studio: 'Kyoto Animation', paysOrigine: 'Japon', note: 8.9,
      resume: "Une ex-soldat apprend à comprendre les émotions humaines en écrivant des lettres pour les autres.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Mob Psycho 100",
      nbSaisons: 3, nbEpisodes: 37, dureeEpisode: 24, studio: 'Bones', paysOrigine: 'Japon', note: 8.6,
      resume: "Un collégien aux pouvoirs psychiques surpuissants veut juste vivre une vie normale.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Cowboy Bebop",
      nbSaisons: 1, nbEpisodes: 26, dureeEpisode: 24, studio: 'Sunrise', paysOrigine: 'Japon', note: 8.9,
      resume: "Des chasseurs de primes voyagent dans l'espace à bord du vaisseau Bebop.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Parasyte",
      nbSaisons: 1, nbEpisodes: 24, dureeEpisode: 23, studio: 'Madhouse', paysOrigine: 'Japon', note: 8.4,
      resume: "Un lycéen est infecté par un parasite alien qui prend le contrôle de sa main droite.",
      statut: 'deja_vu', avis: "Glaçant et addictif."
    },
    {
      titre: "The Promised Neverland",
      nbSaisons: 1, nbEpisodes: 12, dureeEpisode: 23, studio: 'CloverWorks', paysOrigine: 'Japon', note: 8.5,
      resume: "Des enfants d'un orphelinat découvrent la terrifiante vérité sur leur refuge.",
      statut: 'deja_vu', avis: "La saison 1 est parfaite."
    },
    {
      titre: "Erased",
      nbSaisons: 1, nbEpisodes: 12, dureeEpisode: 23, studio: 'A-1 Pictures', paysOrigine: 'Japon', note: 8.5,
      resume: "Un homme retourne dans le passé pour empêcher l'enlèvement de ses camarades de classe.",
      statut: 'deja_vu', avis: "Un thriller captivant."
    },
    {
      titre: "Haikyu!!",
      nbSaisons: 4, nbEpisodes: 85, dureeEpisode: 24, studio: 'Production I.G', paysOrigine: 'Japon', note: 8.7,
      resume: "Hinata, un lycéen de petite taille, rêve de devenir un champion de volleyball.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Dr. Stone",
      nbSaisons: 3, nbEpisodes: 58, dureeEpisode: 24, studio: 'TMS Entertainment', paysOrigine: 'Japon', note: 8.3,
      resume: "L'humanité pétrifiée pendant 3700 ans, un génie scientifique doit rebâtir la civilisation.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Made in Abyss",
      nbSaisons: 2, nbEpisodes: 25, dureeEpisode: 25, studio: 'Kinema Citrus', paysOrigine: 'Japon', note: 8.7,
      resume: "Une petite fille descend dans un gouffre mystérieux pour retrouver sa mère.",
      statut: 'a_voir', avis: null
    },
    {
      titre: "Spy x Family",
      nbSaisons: 2, nbEpisodes: 37, dureeEpisode: 24, studio: 'Wit Studio', paysOrigine: 'Japon', note: 8.6,
      resume: "Un espion, une assassin et une télépathe forment une fausse famille pour une mission secrète.",
      statut: 'deja_vu', avis: "Anya est trop mignonne !"
    },
    {
      titre: "Vinland Saga",
      nbSaisons: 2, nbEpisodes: 48, dureeEpisode: 24, studio: 'MAPPA', paysOrigine: 'Japon', note: 8.8,
      resume: "L'épopée viking de Thorfinn, un guerrier en quête de vengeance.",
      statut: 'deja_vu', avis: "Brutal et magnifique."
    }
  ];

  // 3. Boucle d'insertion
  console.log(`📚 Traitement de ${top30Animes.length} animes... (Cela prendra ~35 secondes)`);

  for (const animeData of top30Animes) {
    process.stdout.write(`Traitement : ${animeData.titre}... `);
    
    // Récupération image SEULEMENT
    const imageUrl = await getAnimeImage(animeData.titre);
    
    await prisma.anime.create({
      data: {
        ...animeData,
        imageUrl: imageUrl, 
        userId: user.id,
      },
    });

    console.log(`✅`);
    
    // Pause 1s pour Jikan API
    await delay(1000); 
  }

  console.log('🌱 Seed terminé avec succès ! Les 30 animes sont en base.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });