# Guide de Déploiement - SYNGTC-RDC

Ce guide vous explique comment déployer le système SYNGTC-RDC sur Supabase, GitHub et Vercel.

## 📋 Table des matières

1. [Configuration Supabase](#1-configuration-supabase)
2. [Déploiement sur GitHub](#2-déploiement-sur-github)
3. [Déploiement sur Vercel](#3-déploiement-sur-vercel)
4. [Configuration des variables d'environnement](#4-configuration-des-variables-denvironnement)

---

## 1. Configuration Supabase

### 1.1. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name**: `syngtc-rdc`
   - **Database Password**: Choisissez un mot de passe fort (notez-le !)
   - **Region**: Choisissez la région la plus proche (ex: `West US` ou `Europe West`)
5. Cliquez sur "Create new project"

### 1.2. Obtenir les informations de connexion

Une fois le projet créé :

1. Allez dans **Settings** → **Database**
2. Notez les informations suivantes :
   - **Host**: `db.xxxxx.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: Le mot de passe que vous avez créé

3. Allez dans **Settings** → **API**
4. Notez :
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (gardez-la secrète !)

### 1.3. Exécuter le schéma SQL

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur "New query"
3. Copiez le contenu du fichier `database/schema.sql`
4. Collez-le dans l'éditeur
5. Cliquez sur "Run" (ou F5)

### 1.4. Insérer les données initiales (optionnel)

1. Dans **SQL Editor**, créez une nouvelle requête
2. Copiez le contenu du fichier `database/seed.sql`
3. Collez-le et exécutez-le

---

## 2. Déploiement sur GitHub

### 2.1. Préparer le dépôt local

```bash
# Initialiser Git si ce n'est pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit: SYNGTC-RDC - Système National de Gestion et de Traçabilité des Criminels"
```

### 2.2. Créer le dépôt sur GitHub

1. Allez sur [https://github.com/ToggleINC](https://github.com/ToggleINC)
2. Cliquez sur "New repository"
3. Remplissez :
   - **Repository name**: `SYNGTC-RDC`
   - **Description**: `Système National de Gestion et de Traçabilité des Criminels en RDC`
   - **Visibility**: Private (recommandé pour un projet gouvernemental)
4. Cliquez sur "Create repository"

### 2.3. Pousser le code

```bash
# Ajouter le remote GitHub
git remote add origin https://github.com/ToggleINC/SYNGTC-RDC.git

# Pousser le code
git branch -M main
git push -u origin main
```

---

## 3. Déploiement sur Vercel

### 3.1. Préparer le projet pour Vercel

Vercel détectera automatiquement React et Node.js. Assurez-vous que :

- `frontend/package.json` contient un script `build`
- `backend/package.json` contient un script `start` pour la production

### 3.2. Déployer le Frontend

1. Allez sur [https://vercel.com/jaspoirs-projects](https://vercel.com/jaspoirs-projects)
2. Cliquez sur "Add New..." → "Project"
3. Importez le dépôt GitHub `ToggleINC/SYNGTC-RDC`
4. Configurez :
   - **Framework Preset**: Next.js (ou React si disponible)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. Ajoutez les variables d'environnement (voir section 4)
6. Cliquez sur "Deploy"

### 3.3. Déployer le Backend sur Vercel

Le backend sera déployé sur Vercel en tant que Serverless Functions.

1. Créez un **nouveau projet** Vercel
2. Importez le même dépôt GitHub `ToggleINC/SYNGTC-RDC`
3. Configurez :
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Le fichier `backend/vercel.json` est déjà configuré pour utiliser `backend/api/index.ts` comme point d'entrée.

5. Ajoutez les variables d'environnement (voir section 4.1)

6. Déployez et notez l'URL du backend

---

## 4. Configuration des variables d'environnement

### 4.1. Variables Backend

Créez un fichier `.env` dans `backend/` avec :

```env
# Base de données Supabase
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_supabase

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise_ici

# Serveur
PORT=5000
NODE_ENV=production

# CORS
FRONTEND_URL=https://votre-app.vercel.app
```

### 4.2. Variables Frontend

Créez un fichier `.env` dans `frontend/` avec :

```env
REACT_APP_API_URL=https://votre-backend.vercel.app
REACT_APP_SOCKET_URL=https://votre-backend.vercel.app
```

### 4.3. Variables dans Vercel

Dans les paramètres du projet Vercel :

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez toutes les variables d'environnement nécessaires
3. Sélectionnez les environnements (Production, Preview, Development)

---

## 5. Configuration Post-Déploiement

### 5.1. Mettre à jour les URLs

Après le déploiement, mettez à jour :

1. **Frontend** : L'URL de l'API backend
2. **Backend** : L'URL du frontend pour CORS
3. **Socket.io** : L'URL du serveur Socket.io

### 5.2. Tester le déploiement

1. Testez la connexion à la base de données
2. Testez l'authentification
3. Testez les fonctionnalités principales
4. Vérifiez les logs dans Vercel

---

## 6. Maintenance et Mises à jour

### 6.1. Mettre à jour le code

```bash
# Faire des modifications
git add .
git commit -m "Description des modifications"
git push origin main
```

Vercel redéploiera automatiquement.

### 6.2. Migrations de base de données

Pour les migrations futures :

1. Créez un fichier SQL dans `database/migrations/`
2. Exécutez-le dans Supabase SQL Editor
3. Documentez les changements

---

## 7. Sécurité

### 7.1. Secrets

- ⚠️ **NE JAMAIS** commiter les fichiers `.env`
- ⚠️ Utilisez les variables d'environnement de Vercel
- ⚠️ Gardez les clés API secrètes

### 7.2. Base de données

- Activez les **Row Level Security (RLS)** dans Supabase si nécessaire
- Configurez les **backups automatiques** dans Supabase
- Limitez l'accès à la base de données

---

## 8. Support

Pour toute question ou problème :
- Consultez la documentation : `docs/`
- Vérifiez les logs dans Vercel
- Vérifiez les logs dans Supabase

---

**Note importante** : Ce système gère des données sensibles. Assurez-vous de respecter toutes les réglementations en vigueur concernant la protection des données personnelles.

