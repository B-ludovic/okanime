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

-- Résout les doublons en ajoutant -2, -3, etc. au slug
-- Ex: deux fois "takopi-s-original-sin" → garde l'original + ajoute "-2" au plus récent
WITH duplicates AS (
  SELECT id, slug,
    ROW_NUMBER() OVER (PARTITION BY slug ORDER BY "dateAjout") AS rn
  FROM "animes"
  WHERE slug IN (
    SELECT slug FROM "animes" GROUP BY slug HAVING COUNT(*) > 1
  )
)
UPDATE "animes"
SET slug = d.slug || '-' || d.rn
FROM duplicates d
WHERE "animes".id = d.id AND d.rn > 1;

-- Ajoute la contrainte d'unicité une fois les slugs dédoublonnés
CREATE UNIQUE INDEX "animes_slug_key" ON "animes"("slug");
