# O'Kanime 🎌

Bibliothèque d'animés pour gérer sa collection, suivre ses visionnages et laisser des avis.

## Stack

**Frontend**
- Next.js 14 (App Router)
- CSS modules
- Lucide React (icônes)

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- Jikan API v4 (données animés)
- Cloudinary (upload d'images)

## Installation

### Prérequis
- Node.js 18+
- PostgreSQL

### Variables d'environnement

**Backend** (`.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/okanime"
JWT_SECRET="votre_secret_jwt"
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"
```

**Frontend** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Lancer le projet

**Backend**
```bash
cd backend
npm install
npx prisma migrate dev
npm run prisma:seed  # Peupler la base avec 100 animés
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Ou les deux en même temps** (depuis la racine)
```bash
npm install
npm run dev
```

Frontend : http://localhost:3000 (ou 3001 si 3000 occupé)  
Backend : http://localhost:5001

### Compte admin par défaut
- Email : `admin@okanime.com`
- Mot de passe : `admin123`

## Fonctionnalités

- Authentification (JWT avec rôles admin/user)
- Catalogue de 100 animés (seed automatique depuis Jikan API)
- Badges de genres colorés (16 couleurs différentes)
- Gestion de bibliothèque personnelle
  - À voir
  - En cours
  - Terminé
  - Abandonné
  - Favoris
- Optimistic UI pour l'ajout à la bibliothèque
- Système d'avis et de notes
- Upload d'images (Cloudinary)
- Barre de recherche dans le header
- 🚧 Page de résultats de recherche (à venir)

## Structure du projet

```
okanime/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js          # Script de peuplement (100 animés)
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/     # Logique métier
│   │   ├── middlewares/     # Auth, erreurs, upload
│   │   ├── routes/          # Routes API
│   │   ├── services/        # Jikan API, Cloudinary
│   │   └── validators/      # Validation des données
│   └── app.js
└── frontend/
    ├── app/
    │   ├── (auth)/          # Pages login/register
    │   ├── anime/           # Pages animés
    │   ├── bibliotheque/    # Bibliothèque personnelle
    │   └── lib/             # Utils, API client
    ├── components/
    │   ├── anime/           # AnimeCard, etc.
    │   ├── bibliotheque/    # BiblioCard, BiblioModal
    │   ├── forms/           # LoginForm, RegisterForm
    │   └── layout/          # Header, Footer
    └── styles/              # CSS Modules
```

## Notes de développement

Le seed récupère automatiquement :
- 50 animés classiques (top de tous les temps)
- 50 animés récents avec bonnes notes (score min 7.5)

Petit tips : la Jikan API a un rate limit d'1 seconde entre les appels, donc le seed prend ~2 minutes à s'exécuter.

## Crédits

- **Icônes** : [Flaticon](https://www.flaticon.com)
- **Données animés** : [Jikan API](https://jikan.moe/)

## Auteur

Ludovic - Dev junior
 