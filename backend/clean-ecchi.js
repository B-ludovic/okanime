import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanEcchi() {
  console.log('🧹 Nettoyage des contenus adultes...');

  // Chercher tous les genres adultes
  const adultGenres = await prisma.genre.findMany({
    where: {
      nom: {
        in: ['Hentai', 'Erotica', 'Ecchi', 'hentai', 'erotica', 'ecchi'],
        mode: 'insensitive'
      }
    }
  });

  console.log(`📚 Genres adultes trouvés: ${adultGenres.map(g => g.nom).join(', ')}`);

  let totalDeleted = 0;

  for (const genre of adultGenres) {
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

    console.log(`\n⚠️ ${animes.length} anime(s) trouvé(s) avec genre "${genre.nom}"`);
    
    for (const anime of animes) {
      console.log(`⛔ Suppression : ${anime.titreVf} (MAL: ${anime.malId})`);
      await prisma.anime.delete({
        where: { id: anime.id }
      });
      totalDeleted++;
    }
  }

  console.log(`\n✅ Nettoyage terminé ! ${totalDeleted} anime(s) supprimé(s)`);
}

cleanEcchi()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
