import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkHentai() {
  // Chercher le genre Hentai
  const genres = await prisma.genre.findMany({
    where: {
      nom: {
        in: ['Hentai', 'Erotica', 'hentai', 'erotica'],
        mode: 'insensitive'
      }
    }
  });

  console.log('📚 Genres adultes trouvés:', genres);

  if (genres.length > 0) {
    for (const genre of genres) {
      const animes = await prisma.anime.findMany({
        where: {
          genres: {
            some: {
              genreId: genre.id
            }
          }
        },
        include: {
          genres: {
            include: {
              genre: true
            }
          }
        }
      });

      console.log(`\n⚠️ Animes avec genre "${genre.nom}": ${animes.length}`);
      animes.forEach(anime => {
        console.log(`  - ${anime.titreVf} (malId: ${anime.malId})`);
        console.log(`    Genres: ${anime.genres.map(g => g.genre.nom).join(', ')}`);
      });
    }
  }
}

checkHentai()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
