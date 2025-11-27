# 🚀 Guide d'installation O'Kanime

## Prérequis
- Node.js v16 ou supérieur
- PostgreSQL installé et démarré
- Git

## Étape 1 : Cloner le projet
```bash
git clone <votre-url-github>
cd okanime
```

## Étape 2 : Configuration de la base de données PostgreSQL

### Créer la base de données
```bash
# Se connecter à PostgreSQL
psql postgres

# Créer la base de données
CREATE DATABASE okanime;

# Créer un utilisateur (optionnel)
CREATE USER okanime_user WITH PASSWORD 'votre_mot_de_passe';

# Donner les privilèges
GRANT ALL PRIVILEGES ON DATABASE okanime TO okanime_user;

# Quitter
\q
```

## Étape 3 : Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer le fichier .env avec vos informations
# DATABASE_URL="postgresql://okanime_user:votre_mot_de_passe@localhost:5432/okanime?schema=public"
# JWT_SECRET="votre_secret_jwt_unique"

# Générer le client Prisma
npx prisma generate

# Créer les tables dans la base de données
npx prisma migrate dev --name init

# Démarrer le serveur backend
npm run dev
```

Le backend devrait maintenant tourner sur `http://localhost:5000`

## Étape 4 : Configuration du Frontend

```bash
# Depuis la racine du projet
cd frontend

# Installer les dépendances
npm install

# Démarrer l'application React
npm start
```

Le frontend devrait s'ouvrir automatiquement sur `http://localhost:3000`

## ✅ Vérification

- Backend : http://localhost:5000 → Affiche "Bienvenue sur l'API O'Kanime 🎌"
- Frontend : http://localhost:3000 → Affiche la page d'accueil O'Kanime

## 🔧 Commandes utiles

### Prisma
```bash
# Voir la base de données dans le navigateur
npx prisma studio

# Réinitialiser la base de données
npx prisma migrate reset

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration
```

## 🆘 Problèmes courants

### Erreur de connexion PostgreSQL
- Vérifier que PostgreSQL est démarré
- Vérifier les credentials dans `.env`
- Vérifier que la base de données existe

### Port déjà utilisé
- Backend : changer le PORT dans `.env`
- Frontend : il proposera automatiquement un autre port

## 📝 Prochaines étapes

1. Créer les routes d'authentification
2. Créer les routes CRUD pour les animes
3. Développer les composants React
4. Intégrer l'upload d'images
