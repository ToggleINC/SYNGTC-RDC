# Guide de Déploiement sur Vercel

## 📋 Prérequis

- Compte Vercel : [https://vercel.com/jaspoirs-projects](https://vercel.com/jaspoirs-projects)
- Projet déjà poussé sur GitHub : `ToggleINC/SYNGTC-RDC`
- Variables d'environnement préparées

## 🚀 Déploiement du Frontend

### 1. Connecter GitHub à Vercel

1. Allez sur [https://vercel.com/jaspoirs-projects](https://vercel.com/jaspoirs-projects)
2. Cliquez sur **"Add New..."** → **"Project"**
3. Cliquez sur **"Import Git Repository"**
4. Sélectionnez **"ToggleINC/SYNGTC-RDC"**
5. Si c'est la première fois, autorisez Vercel à accéder à votre GitHub

### 2. Configurer le projet Frontend

1. **Framework Preset**: `Create React App`
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. **Install Command**: `npm install`

### 3. Ajouter les variables d'environnement

Dans la section **"Environment Variables"**, ajoutez :

```
REACT_APP_API_URL=https://votre-backend.vercel.app
REACT_APP_SOCKET_URL=https://votre-backend.vercel.app
```

### 4. Déployer

1. Cliquez sur **"Deploy"**
2. Attendez que le déploiement se termine (2-3 minutes)
3. Vercel vous donnera une URL : `https://syngtc-rdc.vercel.app`

## 🔧 Déploiement du Backend sur Vercel

Le backend sera déployé sur Vercel en tant que Serverless Functions.

### 1. Créer un nouveau projet pour le Backend

1. Allez sur [https://vercel.com/jaspoirs-projects](https://vercel.com/jaspoirs-projects)
2. Cliquez sur **"Add New..."** → **"Project"**
3. Importez le même dépôt GitHub `ToggleINC/SYNGTC-RDC`
4. Configurez :
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Configurer pour Vercel Serverless

Le fichier `backend/vercel.json` est déjà configuré pour utiliser `backend/api/index.ts` comme point d'entrée.

### 3. Ajouter les variables d'environnement

Dans **Settings** → **Environment Variables**, ajoutez :

```
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_supabase
JWT_SECRET=votre_secret_jwt_tres_securise
NODE_ENV=production
FRONTEND_URL=https://votre-frontend.vercel.app
```

### 4. Déployer

1. Cliquez sur **"Deploy"**
2. Attendez que le déploiement se termine
3. Notez l'URL du backend : `https://votre-backend.vercel.app`

### 5. Mettre à jour le Frontend

Après le déploiement du backend, mettez à jour la variable `REACT_APP_API_URL` dans le projet frontend avec l'URL du backend Vercel.

## 🔄 Configuration Post-Déploiement

### 1. Mettre à jour les URLs

Après le déploiement :

1. **Frontend** : Mettez à jour `REACT_APP_API_URL` avec l'URL du backend
2. **Backend** : Mettez à jour `FRONTEND_URL` avec l'URL du frontend
3. Redéployez les deux projets

### 2. Configurer les domaines personnalisés (optionnel)

1. Dans Vercel, allez dans **Settings** → **Domains**
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions pour configurer le DNS

### 3. Activer les déploiements automatiques

Par défaut, Vercel redéploie automatiquement à chaque push sur `main`.

Pour configurer :
1. **Settings** → **Git**
2. Vérifiez que **"Production Branch"** est `main`
3. Activez **"Automatic deployments"**

## 📊 Monitoring

### Logs

1. Dans Vercel, allez dans votre projet
2. Cliquez sur l'onglet **"Logs"**
3. Consultez les logs en temps réel

### Analytics

1. **Settings** → **Analytics**
2. Activez **"Web Analytics"** pour suivre les performances

## 🔐 Sécurité

### Variables d'environnement

- ⚠️ Ne jamais commiter les `.env`
- ⚠️ Utilisez uniquement les variables d'environnement de Vercel
- ⚠️ Utilisez des secrets forts pour `JWT_SECRET`

### Headers de sécurité

Vercel ajoute automatiquement :
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 🆘 Dépannage

### Erreur de build

1. Vérifiez les logs dans Vercel
2. Testez le build localement : `npm run build`
3. Vérifiez que toutes les dépendances sont dans `package.json`

### Erreur 404

1. Vérifiez que `package.json` contient bien le script `build`
2. Vérifiez que le dossier `build` est bien créé
3. Vérifiez la configuration dans `vercel.json`

### Erreur de connexion API

1. Vérifiez que `REACT_APP_API_URL` est correctement configuré
2. Vérifiez que le backend est bien déployé
3. Vérifiez les CORS dans le backend

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Guide React sur Vercel](https://vercel.com/docs/frameworks/react)
- [Variables d'environnement](https://vercel.com/docs/environment-variables)

