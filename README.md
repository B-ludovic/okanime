# O'Kanime 🎌

Bibliothèque d'animés pour gérer sa collection, suivre ses visionnages et laisser des avis.

## Stack

**Frontend**
- Next.js 14 (App Router)
- CSS modules

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- Jikan API v4 (données animés)

## Installation

### Prérequis
- Node.js 18+
- PostgreSQL

### Lancer le projet

**Backend**
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Frontend : http://localhost:3000
Backend : http://localhost:5001

## Fonctionnalités

- Authentification (JWT)
- Recherche d'animés via Jikan API
- Gestion de bibliothèque personnelle (En cours, Terminé, Abandonné)
- Système d'avis et de notes
- Upload d'images (Cloudinary)

## Auteur

Ludovic - Dev junior
 