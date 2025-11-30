/*
  Warnings:

  - A unique constraint covering the columns `[malId]` on the table `animes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "animes" ADD COLUMN     "malId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "animes_malId_key" ON "animes"("malId");
