-- Ajoute la colonne slug (nullable dans un premier temps)
ALTER TABLE "animes" ADD COLUMN "slug" TEXT;

-- Génère un slug depuis le titreVf pour tous les animes existants
-- Ex: "Fire Force" → "fire-force", "Re:Zero" → "re-zero"
UPDATE "animes"
SET "slug" = trim(both '-' from regexp_replace(
  lower(translate(
    "titreVf",
    'àáâãäåçèéêëìíîïñòóôõöùúûüýÿ',
    'aaaaaaceeeeiiiinooooouuuuyy'
  )),
  '[^a-z0-9]+', '-', 'g'
));

-- Ajoute la contrainte d'unicité une fois les slugs générés
CREATE UNIQUE INDEX "animes_slug_key" ON "animes"("slug");
