import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAll() {
  const animes = await prisma.anime.findMany({
    include: {
      genres: {
        include: {
          genre: true
        }
      }
    },
    orderBy: {
      dateAjout: 'desc'
    },
    take: 20
  });

  console.log(`📺 ${animes.length} derniers animes ajoutés:\n`);
  animes.forEach((anime, i) => {
    console.log(`${i + 1}. ${anime.titreVf} (MAL: ${anime.malId})`);
    console.log(`   Genres: ${anime.genres.map(g => g.genre.nom).join(', ')}\n`);
  });
}

listAll()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
