# 🚀 Guide d'installation O'Kanime

Guide pas à pas pour installer et lancer le projet localement.

## Prérequis
- Node.js v16+
- PostgreSQL 17
- Git
- Un terminal (ou invite de commandes)

## Étape 1 : Cloner le projet
```bash
git clone https://github.com/B-ludovic/okanime.git
cd okanime
```

## Étape 2 : Configuration de PostgreSQL

### Créer la base de données
```bash
# Se connecter à PostgreSQL
psql postgres

# Créer la base de données
CREATE DATABASE okanime;

# Optionnel : créer un utilisateur dédié
CREATE USER okanime_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE okanime TO okanime_user;

# Quitter
\q
```

## Étape 3 : Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
touch .env
```

Éditer le `.env` avec vos informations :
```
DATABASE_URL="postgresql://user:password@localhost:5432/okanime?schema=public"
JWT_SECRET="votre_secret_jwt_unique_et_complexe"
PORT=3001
```

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Optionnel : peupler avec 30 animes
npm run seed

# Lancer le serveur
npm run dev
```

Le backend tourne maintenant sur `http://localhost:3001`

## Étape 4 : Frontend

Dans un nouveau terminal :

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer l'application React
npm start
```

Le navigateur devrait s'ouvrir automatiquement sur `http://localhost:3000`

## ✅ Vérifications

- Backend : `http://localhost:3001` → Message de bienvenue API
- Frontend : `http://localhost:3000` → Page d'accueil avec bannière hero
- Navigation : Les liens Accueil / Notre Collection / Ma Vidéothèque fonctionnent
- Collection visible sans connexion
- Connexion/Inscription pour gérer la collection

## 🔧 Commandes utiles

### Prisma
```bash
# Interface visuelle de la BDD
npx prisma studio

# Réinitialiser la BDD (⚠️ supprime les données)
npx prisma migrate reset

# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Backup de la BDD
npm run backup
```

### Développement
```bash
# Relancer le seed
cd backend
npm run seed

# Relancer le backend
npm run dev

# Relancer le frontend
cd frontend
npm start
```

## 🆘 Problèmes courants

### PostgreSQL ne démarre pas
- macOS : `brew services start postgresql@17`
- Linux : `sudo systemctl start postgresql`
- Windows : Vérifier le service dans les Services Windows

### Erreur de connexion BDD
- Vérifier que PostgreSQL tourne
- Vérifier le `DATABASE_URL` dans `.env`
- Vérifier que la base `okanime` existe

### Port 3000 ou 3001 déjà utilisé
- Backend : modifier `PORT` dans `.env`
- Frontend : React proposera automatiquement un autre port

### Erreur Prisma après migration
```bash
npx prisma generate
npx prisma migrate reset
```

### Images ne s'affichent pas
- Vérifier que les chemins sont corrects (`/public/images/`, `/public/icons/`)
- Vérifier la console du navigateur pour erreurs 404

## 🎨 Bonus : Personnalisation

### Changer la palette de couleurs
Éditer `frontend/src/styles/Variables.css` :
```css
--color-sakura: #FFB7D5;
--color-violet: #C9A8E8;
--color-sky: #A8D8EA;
/* etc. */
```

### Modifier le seed
Éditer `backend/prisma/seed.js` pour ajouter vos animes préférés.

## 📝 Prochaines étapes

1. ✅ Authentification fonctionnelle
2. ✅ CRUD animes complet
3. ✅ Intégration Jikan API
4. ✅ Design sakura/violet
5. 🔄 Pages Collection et Vidéothèque séparées
6. 🔄 Statuts personnels par utilisateur
7. 🚀 Déploiement
