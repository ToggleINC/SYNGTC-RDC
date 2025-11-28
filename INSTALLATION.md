# Guide d'Installation - SYNGTC-RDC

## Prérequis

- Node.js 18+ et npm
- PostgreSQL 14+
- Git

## Installation

### 1. Base de données PostgreSQL

```bash
# Créer la base de données
createdb syngtc_rdc

# Exécuter le schéma
psql -d syngtc_rdc -f database/schema.sql

# (Optionnel) Charger les données de test
psql -d syngtc_rdc -f database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install

# Copier et configurer .env
cp .env.example .env
# Éditer .env avec vos paramètres de base de données

# Démarrer le serveur
npm run dev
```

Le backend sera accessible sur `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

### 4. Application Mobile

```bash
cd mobile
npm install

# Pour Android
npm run android

# Pour iOS
npm run ios
```

**Note:** Configurez l'URL de l'API dans `mobile/src/context/AuthContext.tsx` et `mobile/src/screens/*.tsx`

## Configuration

### Variables d'environnement Backend (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=syngtc_rdc
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt_tres_securise
```

### Permissions Mobile

L'application mobile nécessite:
- Accès à la géolocalisation
- Accès à la caméra (pour photos)
- Accès au stockage (pour fichiers)

## Démarrage rapide

1. Démarrer PostgreSQL
2. Créer la base de données et exécuter le schéma
3. Démarrer le backend: `cd backend && npm run dev`
4. Démarrer le frontend: `cd frontend && npm start`
5. Accéder à `http://localhost:3000`

## Comptes de test

Après avoir exécuté `seed.sql`, vous pouvez vous connecter avec:
- Email: `admin@ministere.rdc`
- Mot de passe: `password123` (à changer en production!)

## Support

Pour toute question, contactez l'équipe de développement.

