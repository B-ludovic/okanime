import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteHentaiGenre() {
  console.log('🗑️ Suppression du genre Hentai...');

  const hentaiGenre = await prisma.genre.findFirst({
    where: {
      nom: {
        equals: 'Hentai',
        mode: 'insensitive'
      }
    }
  });

  if (hentaiGenre) {
    await prisma.genre.delete({
      where: { id: hentaiGenre.id }
    });
    console.log('✅ Genre "Hentai" supprimé avec succès !');
  } else {
    console.log('ℹ️ Le genre "Hentai" n\'existe pas en base');
  }
}

deleteHentaiGenre()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
