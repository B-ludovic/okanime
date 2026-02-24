# O'Kanime 🎌

Bibliothèque d'animés pour gérer sa collection, suivre ses visionnages et laisser des avis.

## 📸 Aperçu

![Page d'accueil](./captures/home.png)
*Page d'accueil avec les animés populaires*

![Page de détail d'un animé](./captures/anime-detail.png)
*Fiche détaillée d'un animé avec avis et notes*

![Bibliothèque personnelle](./captures/bibliotheque.png)
*Gestion de sa bibliothèque avec différents statuts*

![Notre collection](./captures/collection.png)
*Catalogue complet des animés disponibles*

![Notre collection](./captures/formulaire-inscription.png)
*Formulaire d'inscription*

## 📊 Modèle de Données

Le projet utilise **Prisma ORM** avec une architecture relationnelle PostgreSQL composée de **8 entités principales**.

![Modèle Conceptuel de Données](./captures/mcd-okanime.svg)
*Diagramme MCD généré avec Mocodo*

### Relations principales

- **USER** ↔ **ANIME** via **BIBLIOTHEQUE** (Many-to-Many avec attributs)
- **USER** ↔ **ANIME** via **AVIS** (Many-to-Many avec attributs)
- **ANIME** ↔ **GENRE** via **APPARTIENT** (Many-to-Many)
- **ANIME** → **SAISON** (One-to-Many)

📄 Le schéma Prisma complet est disponible dans [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma)

---

## 🛠️ Stack Technique

**Frontend**
- Next.js 16 (App Router, Server Components)
- React 19
- CSS Modules + Variables CSS
- Lucide React (icônes)
- Fetch API (requêtes HTTP)

**Backend**
- Node.js 18+ + Express
- Prisma ORM (PostgreSQL)
- Zod (validation type-safe)
- JWT + bcrypt (authentification)
- Jikan API v4 (import animés depuis MyAnimeList)
- DeepL API (traduction automatique des synopsis)
- Cloudinary (upload et hébergement d'images)
- Resend (envoi d'emails transactionnels)

**Sécurité**
- Express Rate Limit (protection brute force et spam)
- Helmet (headers de sécurité HTTP : CSP, HSTS, X-Frame-Options...)
- XSS-Clean (sanitization des inputs)
- CORS strict avec whitelist
- Honeypot (anti-bots sur formulaires)
- Validation stricte des tailles de champs (Zod)

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

# Email (Resend)
RESEND_API_KEY="re_votre_cle_resend"
RESEND_FROM_EMAIL="noreply@votredomaine.com"

# Optionnel - Traduction automatique des synopsis
ENABLE_TRANSLATION="false"  # Mettre à "true" pour activer DeepL
DEEPL_API_KEY="votre_cle_deepl"  # Si ENABLE_TRANSLATION=true

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
- Email : Défini par `ADMIN_EMAIL` dans `.env`
- Mot de passe : Défini par `ADMIN_PASSWORD` dans `.env` 
- **Note** : Le compte admin est recréé à chaque seed avec les valeurs des variables d'environnement

## ✨ Fonctionnalités

### 👤 Côté Utilisateur

**Authentification & Sécurité**
- Inscription avec vérification email (lien de confirmation Resend)
- Connexion JWT avec rôles (USER / ADMIN)
- Reset password par email (token temporaire 1h)
- Protection honeypot anti-bots sur formulaires

**Contribution**
- Proposition d'un animé par tout utilisateur inscrit (formulaire complet)
- Recherche et pré-remplissage automatique via **Jikan API**
- Soumis en attente de modération admin avant publication

**Gestion de Collection**
- Catalogue de **100+ animés** (seed automatique depuis Jikan API)
- Recherche par titre (temps réel)
- Filtrage par **16 genres** avec badges colorés
- Import automatique depuis MyAnimeList via Jikan API (admin)

**Bibliothèque Personnelle**
- 6 statuts : **À voir**, **En cours**, **Terminé**, **Abandonné**, **En pause**, **Favoris**
- Suivi des épisodes vus avec barre de progression
- Passage automatique à "Terminé" quand tous les épisodes sont marqués
- Statistiques sur le profil (nombre d'animés par statut)

**Système d'Avis**
- Notes de 1 à 5 étoiles avec commentaires
- Modification et suppression de ses propres avis
- Calcul automatique de la note moyenne par animé
- Affichage des avis avec avatar et date

**Autres Fonctionnalités**
- Formulaire de contact (messages sauvegardés en BDD)
- Intégration trailers YouTube (via Jikan API)
- Pages légales complètes (Mentions Légales, RGPD, CGU)
- Système de **modals personnalisés** (remplacement de tous les `alert()`)
- Bandeau de cookies **Axeptio** (conformité RGPD)

**Sécurité**
- Rate limiting adapté (lecture libre, écriture limitée)
- Rate limiting sur login (5 tentatives/15min)
- Rate limiting sur register (3 tentatives/heure)
- Rate limiting sur actions utilisateur (100/15min)
- Protection honeypot anti-bots sur login/register
- Headers de sécurité Helmet
- Protection XSS sur toutes les entrées
- CORS strict avec whitelist d'origines
- Limites de taille sur synopsis (5000 car.), commentaires (2000 car.)
- Protection IDOR sur bibliothèque et avis
- Format d'erreur uniformisé (backend/frontend)

### 👨‍💼 Côté Admin

**Panel d'Administration**
- Interface dédiée avec sidebar persistante et responsive (menu burger < 950px)
- Statistiques globales (nombre d'utilisateurs, animés, avis, messages)
- Navigation avec 7 sections : Tableau de bord, Modération, Tous les animés, Avis, Messages, Utilisateurs, Genres

**Gestion des Animés**
- CRUD complet (Create, Read, Update, Delete)
- Import rapide depuis **Jikan API** (MyAnimeList)
- Traduction automatique des synopsis EN → FR via **DeepL API**
- Upload d'images via **Cloudinary**
- Système de modération (PENDING / APPROVED / REJECTED)

**Gestion des Utilisateurs**
- Création, modification, suppression
- Attribution des rôles (USER / ADMIN)
- Protection du **Super Admin** (badge spécial, impossible à supprimer)

**Gestion des Avis**
- Consultation de tous les avis avec filtres (récents, meilleures/moins bonnes notes)
- Suppression d'avis inappropriés
- Recalcul automatique de la note moyenne

**Gestion des Messages**
- Consultation des messages du formulaire de contact
- Marquage "Traité" / "Non traité"
- Suppression des messages

**Gestion des Genres**
- Ajout, modification, suppression de genres
- Association automatique aux animés

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
│   │   ├── controllers/     # Logique métier (animes, avis, contact, auth, etc.)
│   │   ├── middlewares/     # Auth, erreurs, upload, honeypot
│   │   ├── routes/          # Routes API (animes, avis, contact, auth, admin, etc.)
│   │   ├── services/        # Jikan API, Cloudinary, traduction, emails (Resend)
│   │   ├── utils/           # JWT, bcrypt, erreurs HTTP, templates emails
│   │   └── validators/      # Validation Zod (animes, avis, auth)
│   └── app.js
└── frontend/
    ├── app/
    │   ├── (auth)/          # Pages login/register
    │   ├── admin/           # Panel d'administration
    │   │   ├── avis/        # Gestion des avis
    │   │   ├── messages/    # Gestion des messages de contact
    │   │   ├── animes/      # Modération des animés
    │   │   ├── tous-les-animes/ # CRUD complet des animés
    │   │   ├── genres/      # Gestion des genres
    │   │   └── users/       # Gestion des utilisateurs
    │   ├── anime/           # Pages animés
    │   │   └── [id]/        # Page détail avec section avis
    │   ├── bibliotheque/    # Bibliothèque personnelle
    │   ├── confirm-email/   # Page de confirmation d'email (nouveau)
    │   ├── contact/         # Formulaire de contact (nouveau)
    │   ├── profil/          # Page profil utilisateur
    │   ├── recherche/       # Page de recherche
    │   ├── mentions-legales/     # Mentions légales
    │   ├── politique-confidentialite/  # RGPD
    │   ├── cgu/             # Conditions générales d'utilisation
    │   └── lib/             # Utils, API client, constantes
    ├── components/
    │   ├── admin/           # AdminLayout, AdminSidebar
    │   ├── anime/           # AnimeCard, etc.
    │   ├── avis/            # StarRating, AvisSection, AvisForm
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
- **Actions utilisateur** : 100 actions max par 15 minutes (avis, bibliothèque)
- **Upload** : 10 uploads max par 15 minutes
- **Routes de lecture** : Pas de limite (navigation fluide)

### Protection anti-bots
- Champ honeypot invisible sur login/register
- Les bots qui remplissent ce champ sont automatiquement rejetés

### Headers de sécurité (Helmet)
- Content Security Policy (CSP)

### Protection des données
- Nettoyage XSS automatique sur toutes les entrées
- Validation stricte des tailles (synopsis 5000 car., commentaires 2000 car., avis 1000 car.)
- CORS strict avec whitelist d'origines autorisées
- Protection IDOR : vérification que l'utilisateur ne modifie que ses propres données
- Indexes sur les avis pour optimiser les performances (recherche par anime et par user)

## 📚 Notes Techniques

### 🔐 Système de Super Admin
Le **Super Admin** est un compte spécial créé automatiquement :
- Défini par les variables `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_USERNAME` dans `.env`
- Champ `isSuperAdmin: true` dans la base de données
- **Impossible à supprimer** ou modifier (protection côté backend)
- Badge visuel distinct dans l'interface admin

### 🌐 Traduction Automatique
Utilisation de l'**API DeepL** pour traduire les synopsis EN → FR :
- S'active si `DEEPL_API_KEY` est définie dans `.env`
- Fonctionne lors de :
  - L'import d'animés depuis Jikan API (panel admin)
  - L'exécution du seed (100 animés)
- Traduction **côté backend** avant sauvegarde en BDD
- Quota limité : 500 000 caractères/mois (plan gratuit)
- Si pas de clé API, les synopsis restent en anglais

### 🌱 Seed de Données
Le script `npm run prisma:seed` remplit automatiquement la base :
- **100 animés** récupérés depuis Jikan API (MyAnimeList)
  - 50 classiques (top all-time)
  - 50 récents avec bonnes notes (score ≥ 7.5)
- **16 genres** prédéfinis (Action, Romance, Comédie...)
- **1 Super Admin** avec les credentials du `.env`

### 🏗️ Architecture du Code
**Séparation des responsabilités (MVC)**
- **Models** : Prisma Schema (`schema.prisma`)
- **Controllers** : Logique métier (`controllers/`)
- **Routes** : Endpoints API REST (`routes/`)
- **Services** : Appels APIs externes (Jikan, DeepL, Cloudinary, Resend)
- **Middlewares** : Auth JWT, rate limiting, gestion d'erreurs
- **Validators** : Schémas Zod pour validation type-safe

**Bonnes Pratiques**
- Gestion centralisée des erreurs avec `errorHandler`
- Validation stricte avec **Zod** (messages clairs)
- **Fetch API** natif (pas besoin d'axios)
- CSS Modules pour isolation des styles
- Trust proxy activé (déploiement Render)
- Images animés hébergées sur **MyAnimeList CDN** (pas de stockage local)

### 💡 Système de Modals Personnalisés
Remplacement de tous les `alert()` et `confirm()` natifs :
- **ModalContext** : Provider global avec React Context
- **5 types** : success, error, warning, confirm, info
- **Hooks personnalisés** : `useModal()` avec helpers
- **49 remplacements** effectués dans 14 fichiers
- Animations CSS, fermeture Escape, accessibilité (aria-labels)

### 📄 Pages Légales & RGPD
- **Mentions Légales** : Éditeur, hébergeur, responsable publication
- **Politique de Confidentialité** : Conformité RGPD, gestion des données
- **CGU** : Règles d'utilisation, âge minimum, modération
- **Axeptio** : Bandeau de cookies conforme RGPD

## Déploiement

Le projet est déployé sur Render :
- **Frontend** : https://okanime.live (Vercel)
- **Backend** : API sur Render
- **Base de données** : PostgreSQL sur Render

**Variables d'environnement importantes en production :**
- `NODE_ENV=production`
- `FRONTEND_URL` : URL complète du frontend (pour CORS et liens emails)
- `JWT_SECRET` : Secret complexe (64+ caractères)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_USERNAME` : Credentials sécurisés
- `RESEND_API_KEY` : Clé API Resend pour les emails
- `RESEND_FROM_EMAIL` : Email vérifié sur Resend
- `ENABLE_TRANSLATION=false` (par défaut, pour économiser le quota DeepL)

## Crédits

- **Icônes** : [Flaticon](https://www.flaticon.com)
- **Données animés** : [Jikan API](https://jikan.moe/) (utilise MyAnimeList)
- **Images** : MyAnimeList CDN

## Auteur

Ludovic BATAILLE - Projet étudiant/personnel  
 