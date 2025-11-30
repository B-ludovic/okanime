import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanHentai() {
  console.log('🧹 Nettoyage des contenus adultes...');

  // Trouver le genre "Hentai"
  const hentaiGenre = await prisma.genre.findFirst({
    where: {
      nom: {
        in: ['Hentai', 'Erotica'],
        mode: 'insensitive'
      }
    }
  });

  if (hentaiGenre) {
    // Trouver tous les animes avec ce genre
    const hentaiAnimes = await prisma.animeGenre.findMany({
      where: { genreId: hentaiGenre.id },
      include: { anime: true }
    });

    console.log(`🔍 ${hentaiAnimes.length} animes trouvés avec contenu adulte`);

    // Supprimer chaque anime
    for (const relation of hentaiAnimes) {
      console.log(`⛔ Suppression : ${relation.anime.titreVf}`);
      await prisma.anime.delete({
        where: { id: relation.anime.id }
      });
    }

    console.log('✅ Nettoyage terminé !');
  } else {
    console.log('✅ Aucun contenu adulte trouvé');
  }
}

cleanHentai()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
