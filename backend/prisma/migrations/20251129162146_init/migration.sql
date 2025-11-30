-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VISITEUR', 'USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatutModeration" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REFUSE');

-- CreateEnum
CREATE TYPE "StatutSaison" AS ENUM ('EN_COURS', 'TERMINE');

-- CreateEnum
CREATE TYPE "StatutBibliotheque" AS ENUM ('A_VOIR', 'EN_COURS', 'VU', 'FAVORI');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animes" (
    "id" TEXT NOT NULL,
    "titreVf" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "anneeDebut" INTEGER NOT NULL,
    "studio" TEXT,
    "posterUrl" TEXT,
    "banniereUrl" TEXT,
    "noteMoyenne" DOUBLE PRECISION DEFAULT 0,
    "statutModeration" "StatutModeration" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateAjout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userIdAjout" TEXT NOT NULL,

    CONSTRAINT "animes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saisons" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "numeroSaison" INTEGER NOT NULL,
    "titreSaison" TEXT,
    "resume" TEXT,
    "nombreEpisodes" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "statut" "StatutSaison" NOT NULL DEFAULT 'TERMINE',

    CONSTRAINT "saisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_genres" (
    "animeId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "anime_genres_pkey" PRIMARY KEY ("animeId","genreId")
);

-- CreateTable
CREATE TABLE "bibliotheques" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "saisonId" TEXT NOT NULL,
    "statut" "StatutBibliotheque" NOT NULL DEFAULT 'A_VOIR',
    "progressionEpisodes" INTEGER NOT NULL DEFAULT 0,
    "dateAjout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bibliotheques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "note" INTEGER NOT NULL DEFAULT 0,
    "commentaire" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateModification" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_import_logs" (
    "id" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "sourceApi" TEXT NOT NULL,
    "dateImport" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_import_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "genres_nom_key" ON "genres"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "bibliotheques_userId_saisonId_key" ON "bibliotheques"("userId", "saisonId");

-- CreateIndex
CREATE UNIQUE INDEX "avis_userId_animeId_key" ON "avis"("userId", "animeId");

-- AddForeignKey
ALTER TABLE "animes" ADD CONSTRAINT "animes_userIdAjout_fkey" FOREIGN KEY ("userIdAjout") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saisons" ADD CONSTRAINT "saisons_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genres" ADD CONSTRAINT "anime_genres_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bibliotheques" ADD CONSTRAINT "bibliotheques_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bibliotheques" ADD CONSTRAINT "bibliotheques_saisonId_fkey" FOREIGN KEY ("saisonId") REFERENCES "saisons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avis" ADD CONSTRAINT "avis_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_import_logs" ADD CONSTRAINT "api_import_logs_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "animes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
