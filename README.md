# O'Kanime 🎌

Une bibliothèque d'animes partagée où chacun peut consulter et gérer sa propre collection.

## 📋 À propos

O'Kanime est une application web qui permet de découvrir une collection d'animes et de gérer sa propre vidéothèque personnelle. 

**Pour les visiteurs :**
- Consultation de tous les animes de la collection
- Navigation par catégories (À voir / Déjà vu)
- Fiches détaillées pour chaque anime

**Pour les utilisateurs connectés :**
- Ajout de nouveaux animes à la collection
- Modification et suppression
- Marquage personnel "à voir" / "déjà vu"
- Gestion de sa propre vidéothèque

## 🛠️ Stack technique

### Frontend
- React 18.2.0
- React Router DOM
- CSS avec variables (palette pastel sakura/violet/sky)

### Backend
- Node.js + Express
- PostgreSQL 17
- Prisma ORM 5.7.0
- JWT pour l'authentification
- bcrypt pour les mots de passe

### Intégrations
- Jikan API (MyAnimeList) pour récupérer les images automatiquement

## ✨ Fonctionnalités

- 🔐 Authentification sécurisée (JWT + bcrypt)
- 📚 Collection partagée accessible à tous
- 🎨 Interface avec thème japonais (gradients sakura, bannière hero)
- 🖼️ Recherche d'images automatique via Jikan API
- 📝 Informations complètes : titre, saisons, épisodes, durée, studio, pays, note, résumé, avis
- 🏷️ Système de statuts (à voir / déjà vu)
- 💾 Système de backup de base de données
- 🌱 Seed avec 30 animes populaires

## 🚀 Installation

### Prérequis
- Node.js v16+
- PostgreSQL 17
- npm

### 1. Backend

```bash
cd backend
npm install

# Configurer le .env
DATABASE_URL="postgresql://user:password@localhost:5432/okanime"
JWT_SECRET="votre_secret_jwt"
PORT=3001

# Migrations Prisma
npx prisma migrate dev

# Seed (optionnel - ajoute 30 animes populaires)
npm run seed

# Lancer le serveur
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📂 Structure du projet

```
okanime/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── backups/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/
    ├── public/
    │   ├── icons/
    │   └── images/
    └── src/
        ├── components/
        ├── pages/
        └── styles/
```

## 🎨 Palette de couleurs

- **Rose sakura** : #FFB7D5
- **Violet doux** : #C9A8E8
- **Bleu ciel** : #A8D8EA
- **Pêche** : #FFD6A5

## 📝 Crédits

- **Flavicon** : Icônes utilisées dans le projet
- **Jikan API** : Données et images d'animes provenant de MyAnimeList
- **Images** : Bannière hero personnalisée

## 👨‍💻 Auteur

Ludovic - Projet d'apprentissage fullstack React/Node.js


## 📄 Licence

MIT
