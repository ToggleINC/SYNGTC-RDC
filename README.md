# SYNGTC-RDC
## Système National de Gestion et de Traçabilité des Criminels en RDC

Système centralisé pour la gestion, le suivi et la traçabilité des criminels (kuluna, braqueurs, voleurs) sur l'ensemble du territoire congolais.

**Dépôt GitHub**: [https://github.com/ToggleINC/SYNGTC-RDC](https://github.com/ToggleINC/SYNGTC-RDC)

**Déploiement Vercel**: [https://vercel.com/jaspoirs-projects](https://vercel.com/jaspoirs-projects)

## 🎯 Objectifs

- Centraliser tous les cas criminels dans une base de données unique
- Interconnecter PNC, ANR et Ministère de l'Intérieur
- Géolocaliser et cartographier les zones criminelles
- Suivre les récidivistes avec alertes automatiques
- Fournir un module mobile pour les patrouilles
- Calculer un score de dangerosité via IA

## 🏗️ Architecture

```
SYNGTC-RDC/
├── backend/          # API REST (Node.js/Express/TypeScript)
├── frontend/         # Interface web (React/TypeScript)
├── mobile/           # Application mobile (React Native)
├── database/         # Schémas et migrations PostgreSQL
└── docs/             # Documentation technique
```

## 🚀 Technologies

### Backend
- Node.js + Express + TypeScript
- PostgreSQL (base de données)
- JWT (authentification)
- Socket.io (alertes temps réel)
- Multer (upload fichiers)
- Bcrypt (cryptage)

### Frontend
- React + TypeScript
- Leaflet (cartographie)
- Chart.js (statistiques)
- Material-UI (interface)

### Mobile
- React Native
- Expo (développement)
- React Native Maps
- Camera API

## 📦 Installation

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

## 🔐 Sécurité

- Cryptage AES-256 pour les données sensibles
- Authentification multi-niveaux (PNC, ANR, Ministère)
- Traçabilité complète des actions
- Sauvegarde automatique dans 2 centres (Kinshasa + Lubumbashi)

## 📱 Modules Principaux

1. **Enregistrement des criminels** - Tous les postes de police
2. **Géolocalisation** - GPS et cartographie des zones rouges
3. **Fichier récidivistes** - Suivi judiciaire complet
4. **Reconnaissance faciale** - Scan et identification
5. **Base interconnectée** - PNC-ANR-Ministère
6. **Module mobile** - Application pour patrouilles
7. **Score IA** - Calcul de dangerosité
8. **Alertes automatiques** - Notifications temps réel

## 🚀 Déploiement

### Supabase (Base de données)
Consultez le guide : [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

### GitHub
Consultez le guide : [`docs/GITHUB_DEPLOIEMENT.md`](docs/GITHUB_DEPLOIEMENT.md)

### Vercel (Frontend + Backend)
Consultez le guide : [`docs/VERCEL_DEPLOIEMENT.md`](docs/VERCEL_DEPLOIEMENT.md)

### Migration des données
Consultez le guide : [`docs/MIGRATION_SUPABASE.md`](docs/MIGRATION_SUPABASE.md)

### Guide rapide
Consultez : [`docs/QUICK_START.md`](docs/QUICK_START.md)

## 📚 Documentation

- **[`docs/PROCHAINES_ETAPES.md`](docs/PROCHAINES_ETAPES.md)** 🚀 - **Guide des prochaines étapes après configuration**
- **[`docs/GUIDE_CONFIGURATION_COMPLET.md`](docs/GUIDE_CONFIGURATION_COMPLET.md)** ⭐ - **Guide pas à pas pour configurer Supabase et les fichiers .env**
- **[`docs/EXEMPLE_ENV_COMPLET.md`](docs/EXEMPLE_ENV_COMPLET.md)** 📝 - **Exemple complet des fichiers .env avec vos informations**
- **[`docs/TROUVER_INFOS_CONNEXION.md`](docs/TROUVER_INFOS_CONNEXION.md)** 🔍 - **Où trouver les informations de connexion dans Supabase**
- [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md) - Guide complet de déploiement
- [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) - Configuration Supabase
- [`docs/GITHUB_DEPLOIEMENT.md`](docs/GITHUB_DEPLOIEMENT.md) - Déploiement GitHub
- [`docs/VERCEL_DEPLOIEMENT.md`](docs/VERCEL_DEPLOIEMENT.md) - Déploiement Vercel
- [`docs/QUICK_START.md`](docs/QUICK_START.md) - Démarrage rapide
- [`docs/ENV_VARIABLES.md`](docs/ENV_VARIABLES.md) - Variables d'environnement
- [`docs/MIGRATION_SUPABASE.md`](docs/MIGRATION_SUPABASE.md) - Migration des données vers Supabase

## 🔗 Liens

- **GitHub**: [https://github.com/ToggleINC/SYNGTC-RDC](https://github.com/ToggleINC/SYNGTC-RDC)
- **Vercel**: [https://vercel.com/jaspoirs-projects](https://vercel.com/jaspoirs-projects)

## 📄 Licence

Propriété du Ministère de l'Intérieur, Sécurité et Affaires Coutumières - RDC

