import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkGenres() {
  const genres = await prisma.genre.findMany({
    orderBy: { nom: 'asc' }
  });

  console.log(`📚 ${genres.length} genres en base de données:\n`);
  genres.forEach((genre, i) => {
    console.log(`${i + 1}. ${genre.nom} (${genre.id})`);
  });
}

checkGenres()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
