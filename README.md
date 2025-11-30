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

**Sécurité**
- Express Rate Limit (protection brute force)
- Helmet (headers de sécurité HTTP)
- XSS-Clean (nettoyage des données)
- CORS strict (whitelist d'origines)
- Honeypot (protection anti-bots)
- Validation des tailles de champs

## Installation

### Prérequis
- Node.js 18+
- PostgreSQL

### Variables d'environnement

**Backend** (`.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/okanime"
JWT_SECRET="votre_secret_jwt_complexe_64_caracteres_minimum"
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"
FRONTEND_URL="http://localhost:3001"  # Pour le CORS en production
NODE_ENV="development"
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

**Utilisateur**
- Authentification JWT avec rôles (admin/user)
- Catalogue de 100 animés (seed automatique depuis Jikan API)
- Badges de genres colorés (16 couleurs différentes)
- Gestion de bibliothèque personnelle (À voir, En cours, Terminé, Abandonné, Favoris)
- Optimistic UI pour l'ajout à la bibliothèque
- Système d'avis et de notes
- Upload d'images (Cloudinary)
- Barre de recherche dans le header
- Page profil avec statistiques

**Sécurité**
- Rate limiting sur login (5 tentatives/15min)
- Rate limiting sur register (3 tentatives/heure)
- Rate limiting sur upload (10 tentatives/15min)
- Rate limiting global API (100 requêtes/15min)
- Protection honeypot anti-bots sur login/register
- Headers de sécurité Helmet
- Protection XSS sur toutes les entrées
- CORS strict avec whitelist d'origines
- Limites de taille sur synopsis (5000 car.), commentaires (2000 car.)
- Protection IDOR sur bibliothèque et avis

**Admin**
- Panel d'administration complet
- Gestion des animés (CRUD)
- Gestion des genres
- Gestion des utilisateurs
- Modération des contenus
- Statistiques globales

## Structure du projet

```
okanime/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js          # Script de peuplement (100 animés)
│   │   └── migrations/
│   ├── src/
│   │   ├── config/          # Configuration (Prisma, Cloudinary, Rate limiting, Helmet)
│   │   ├── controllers/     # Logique métier
│   │   ├── middlewares/     # Auth, erreurs, upload, honeypot
│   │   ├── routes/          # Routes API
│   │   ├── services/        # Jikan API, Cloudinary, traduction
│   │   ├── utils/           # JWT, bcrypt, erreurs HTTP
│   │   └── validators/      # Validation Zod
│   └── app.js
└── frontend/
    ├── app/
    │   ├── (auth)/          # Pages login/register
    │   ├── admin/           # Panel d'administration
    │   ├── anime/           # Pages animés
    │   ├── bibliotheque/    # Bibliothèque personnelle
    │   ├── profil/          # Page profil utilisateur
    │   └── lib/             # Utils, API client, constantes
    ├── components/
    │   ├── admin/           # AdminLayout
    │   ├── anime/           # AnimeCard, etc.
    │   ├── bibliotheque/    # BiblioCard, BiblioModal
    │   ├── forms/           # LoginForm, RegisterForm
    │   └── layout/          # Header, Footer
    └── styles/              # CSS Modules
```

## Sécurité

Le projet implémente plusieurs couches de protection :

### Protection contre le brute force
- **Login** : 5 tentatives max par 15 minutes
- **Register** : 3 inscriptions max par heure depuis la même IP
- **Upload** : 10 uploads max par 15 minutes
- **API globale** : 100 requêtes max par 15 minutes

### Protection anti-bots
- Champ honeypot invisible sur login/register
- Les bots qui remplissent ce champ sont automatiquement rejetés

### Headers de sécurité (Helmet)
- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- Protection clickjacking (X-Frame-Options: DENY)
- Protection MIME sniffing (X-Content-Type-Options: nosniff)
- Cache du nom du framework (X-Powered-By supprimé)

### Protection des données
- Nettoyage XSS automatique sur toutes les entrées
- Validation stricte des tailles (synopsis 5000 car., commentaires 2000 car.)
- CORS strict avec whitelist d'origines autorisées
- Protection IDOR : vérification que l'utilisateur ne modifie que ses propres données

## Notes de développement

**Seed de données**
- Le seed récupère automatiquement 100 animés depuis Jikan API
- 50 animés classiques (top de tous les temps)
- 50 animés récents avec bonnes notes (score min 7.5)
- Rate limit de la Jikan API : 1 seconde entre chaque appel
- Temps d'exécution du seed : ~2 minutes

**Code commenté pour dev junior**
- Tous les fichiers de sécurité sont commentés en français
- Explications détaillées sur le fonctionnement de chaque protection
- Vocabulaire technique expliqué simplement

**Architecture**
- Séparation stricte des responsabilités (controllers, services, middlewares)
- Gestion centralisée des erreurs avec `asyncHandler`
- Validation avec Zod pour des messages d'erreur clairs

## Crédits

- **Icônes** : [Flaticon](https://www.flaticon.com)
- **Données animés** : [Jikan API](https://jikan.moe/)

## Auteur

Ludovic - Dev junior
 