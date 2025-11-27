# 📁 Structure du projet O'Kanime

```
okanime/
├── README.md                    # Documentation principale
├── SETUP.md                     # Guide d'installation détaillé
├── .gitignore                   # Fichiers à ignorer par Git
│
├── backend/                     # Backend Node.js + Express
│   ├── package.json            # Dépendances backend
│   ├── server.js               # Serveur Express principal
│   ├── .env.example            # Template de configuration
│   ├── prisma/
│   │   └── schema.prisma       # Schéma de base de données
│   │
│   └── À créer :
│       ├── routes/             # Routes API
│       │   ├── auth.js        # Authentification
│       │   └── anime.js       # CRUD animes
│       └── middleware/         # Middlewares
│           └── auth.js        # Protection des routes
│
└── frontend/                    # Frontend React
    ├── package.json            # Dépendances frontend
    ├── public/
    │   └── index.html          # HTML principal
    │
    └── src/
        ├── index.js            # Point d'entrée React
        ├── App.js              # Composant principal
        ├── styles/
        │   └── App.css         # Styles globaux
        │
        └── À créer :
            ├── components/     # Composants réutilisables
            │   ├── Navbar.js
            │   ├── AnimeCard.js
            │   └── AnimeForm.js
            │
            └── pages/          # Pages de l'application
                ├── Login.js
                ├── Register.js
                └── Dashboard.js
```

## 🎯 Fichiers créés jusqu'à présent

### Backend
- ✅ package.json (Express, Prisma, JWT, bcrypt)
- ✅ server.js (serveur Express de base)
- ✅ .env.example (template de configuration)
- ✅ schema.prisma (modèles User et Anime)

### Frontend
- ✅ package.json (React, axios)
- ✅ public/index.html
- ✅ src/index.js
- ✅ src/App.js
- ✅ src/styles/App.css (gradients pastels)

### Documentation
- ✅ README.md
- ✅ SETUP.md
- ✅ .gitignore

## 📋 Prochaines étapes

1. **Installer les dépendances** (npm install dans backend et frontend)
2. **Configurer PostgreSQL** (créer la base de données)
3. **Créer les routes backend** (auth + animes)
4. **Créer les composants React**
5. **Connecter frontend et backend**
6. **Intégrer l'upload d'images**
7. **Tests et déploiement**
