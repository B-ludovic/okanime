# 📁 Structure du projet O'Kanime

Arborescence complète du projet avec ce qui existe et ce qui reste à faire.

## 🌳 Arborescence actuelle

```
okanime/
├── README.md                    # Documentation principale
├── SETUP.md                     # Guide d'installation
├── STRUCTURE.md                 # Ce fichier
├── .gitignore                   # Exclusions Git
│
├── backend/                     # API Node.js + Express
│   ├── package.json            # Dépendances (express, prisma, jwt, bcrypt...)
│   ├── server.js               # Serveur Express (port 3001)
│   ├── .env                    # Variables d'environnement (ignoré par Git)
│   │
│   ├── prisma/
│   │   ├── schema.prisma       # Schéma BDD (User, Anime)
│   │   ├── seed.js             # Seed avec 30 animes populaires
│   │   ├── migrations/         # Historique des migrations
│   │   └── backups/            # Sauvegardes SQL (générées par npm run backup)
│   │
│   ├── routes/
│   │   ├── auth.js             # Routes inscription/connexion
│   │   └── anime.js            # Routes CRUD animes (GET public, POST/PUT/DELETE protégées)
│   │
│   ├── middleware/
│   │   └── authMiddleware.js   # Vérification JWT
│   │
│   └── utils/
│       └── jikanApi.js         # Intégration Jikan API (recherche d'images)
│
└── frontend/                    # Application React
    ├── package.json            # Dépendances (react, react-router-dom, axios)
    │
    ├── public/
    │   ├── index.html          # HTML de base
    │   ├── icons/              # Icônes (search, modify, delete, ajouter, japan-flag)
    │   └── images/
    │       └── Banniere.hero.png  # Bannière homepage
    │
    └── src/
        ├── index.js            # Point d'entrée React
        ├── App.js              # Routeur principal (Header + Routes)
        ├── api.js              # Axios configuré (localhost:3001)
        │
        ├── components/
        │   ├── Header.js       # Navigation globale (Accueil, Collection, Vidéothèque)
        │   ├── Hero.js         # Bannière homepage avec CTA
        │   ├── AnimeCard.js    # Carte anime avec résumé/avis/actions
        │   └── AnimeForm.js    # Formulaire ajout/modification
        │
        ├── pages/
        │   ├── Dashboard.js    # Page d'accueil (Hero + tous les animes)
        │   ├── AnimeDetail.js  # Fiche détaillée d'un anime
        │   ├── Login.js        # Page de connexion
        │   └── Register.js     # Page d'inscription
        │
        └── styles/
            ├── Variables.css   # Variables CSS (palette sakura/violet/sky)
            ├── Header.css      # Styles header
            ├── Hero.css        # Styles bannière
            ├── Dashboard.css   # Styles homepage
            ├── AnimeCard.css   # Styles cartes
            ├── AnimeDetail.css # Styles fiche détaillée
            └── Auth.css        # Styles login/register
```

## ✅ Fonctionnalités implémentées

### Backend
- ✅ Serveur Express sur port 3001
- ✅ Base de données PostgreSQL avec Prisma
- ✅ Modèles User et Anime (avec champ `resume`)
- ✅ Authentification JWT + bcrypt
- ✅ Routes auth (register, login)
- ✅ Routes animes (CRUD complet)
- ✅ Middleware de protection
- ✅ GET /animes accessible sans authentification
- ✅ Intégration Jikan API (recherche automatique d'images)
- ✅ Seed avec 30 animes populaires
- ✅ Système de backup BDD

### Frontend
- ✅ Application React 18.2.0
- ✅ React Router pour la navigation
- ✅ Header global avec navigation
- ✅ Bannière hero sur homepage
- ✅ Palette de couleurs sakura/violet/sky (Variables.css)
- ✅ Page Dashboard avec liste des animes
- ✅ AnimeCard avec résumé, avis, boutons d'action
- ✅ AnimeForm pour ajout/modification
- ✅ AnimeDetail pour vue détaillée
- ✅ Pages Login et Register
- ✅ Gestion du token JWT (localStorage)
- ✅ Accès public à la collection (sans connexion)
- ✅ Modification/suppression réservées aux connectés

### Design
- ✅ Thème japonais avec gradients pastels
- ✅ Palette : Sakura (#FFB7D5), Violet (#C9A8E8), Sky (#A8D8EA), Peach (#FFD6A5)
- ✅ Icônes personnalisées (drapeau japonais, actions...)
- ✅ Bannière hero avec image de fond
- ✅ Design responsive

## 🔄 À développer

### Fonctionnalités manquantes
- 🔄 Page Collection séparée (actuellement utilise Dashboard)
- 🔄 Page Ma Vidéothèque séparée (actuellement utilise Dashboard)
- 🔄 Statuts personnels par utilisateur (le `statut` est global pour l'instant)
- 🔄 Filtres par statut (À voir / Déjà vu) - logique existe mais masquée
- 🔄 Recherche par titre
- 🔄 Tri par note, date d'ajout, titre
- 🔄 Upload d'images personnalisées (actuellement uniquement Jikan)
- 🔄 Page de profil utilisateur
- 🔄 Système de favoris
- 🔄 Pagination (si >50 animes)

### Améliorations techniques
- 🔄 Gestion d'erreurs plus fine
- 🔄 Messages de feedback utilisateur (toasts)
- 🔄 Loader pendant les requêtes API
- 🔄 Validation des formulaires côté frontend
- 🔄 Tests unitaires
- 🔄 Mode sombre / clair
- 🔄 Déploiement (Vercel + Railway/Render)

## 🗂️ Organisation du code

### Backend
- **Routes** : Définition des endpoints API
- **Middleware** : Logique de vérification (auth)
- **Prisma** : ORM pour PostgreSQL (schéma, migrations, seed)
- **Utils** : Fonctions réutilisables (jikanApi)

### Frontend
- **Components** : Composants réutilisables (Header, Hero, AnimeCard, AnimeForm)
- **Pages** : Composants de pages complètes (Dashboard, Login, Register, AnimeDetail)
- **Styles** : CSS modulaire par composant + Variables.css global
- **api.js** : Configuration Axios centralisée

## 🎯 Conventions du projet

### Nommage
- Fichiers React : PascalCase (ex: `AnimeCard.js`)
- CSS : PascalCase correspondant (ex: `AnimeCard.css`)
- Routes backend : camelCase (ex: `auth.js`, `anime.js`)
- Variables CSS : kebab-case (ex: `--color-sakura`)

### Code
- Approche "dev junior" : code simple et progressif
- Commentaires en français pour expliquer la logique
- Pas de sur-engineering : solutions directes et lisibles
- Réutilisation des composants quand ça a du sens

## 📊 Base de données

### Modèle User
- id (Int, auto-increment)
- username (String, unique)
- email (String, unique)
- password (String, hashé avec bcrypt)
- createdAt (DateTime)

### Modèle Anime
- id (Int, auto-increment)
- titre (String)
- saisons (Int, nullable)
- episodes (Int, nullable)
- duree (Int, nullable)
- studio (String, nullable)
- pays (String, nullable)
- note (Float, nullable)
- statut (String, "à voir" ou "déjà vu")
- resume (String, nullable) - **Ajouté récemment**
- avis (String, nullable)
- imageUrl (String, nullable)
- createdAt (DateTime)
- updatedAt (DateTime)

## 🚀 Workflow de développement

1. **Backend** : Créer/modifier routes et logique métier
2. **Prisma** : Mettre à jour le schéma si besoin → migration
3. **Frontend** : Créer/modifier composants et pages
4. **Styles** : Utiliser Variables.css pour cohérence visuelle
5. **Test** : Vérifier en local (backend + frontend lancés)
6. **Git** : Commit avec messages clairs
7. **Push** : Partager sur GitHub

## 📝 Notes

- Le projet utilise Create React App (pas Next.js)
- L'authentification est basique (JWT dans localStorage)
- Les images viennent de Jikan API (MyAnimeList)
- Le seed utilise un délai d'1 seconde entre requêtes Jikan (rate limiting)
- La palette de couleurs a été refaite pour matcher la bannière hero
- Accès public = consultation, accès privé = modification
