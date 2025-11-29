# Déploiement Simple : Supabase + GitHub + Vercel

## Architecture Simplifiée

✅ **Supabase** : Base de données (PostgreSQL)  
✅ **GitHub** : Code source  
✅ **Vercel** : Frontend React + Backend Node.js (Serverless Functions)

## Configuration

### 1. Variables d'Environnement Vercel

Dans Vercel Dashboard → Settings → Environment Variables, ajoutez :

```
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
JWT_SECRET=votre-jwt-secret
FRONTEND_URL=https://votre-app.vercel.app
NODE_ENV=production
```

### 2. Structure du Projet

```
SYNGTC-RDC/
├── frontend/          # React App
├── backend/
│   ├── api/
│   │   └── index.ts   # Point d'entrée Vercel Serverless
│   └── src/          # Code source backend
├── vercel.json        # Configuration Vercel
└── .env.example       # Exemple de variables d'environnement
```

### 3. Configuration vercel.json

Le fichier `vercel.json` configure :
- **Frontend** : Build React et serve les fichiers statiques
- **Backend** : Fonctions serverless Node.js via `backend/api/index.ts`
- **Routes** : `/api/*` → Backend, tout le reste → Frontend

## Déploiement

### Option 1 : Via GitHub (Recommandé)

1. **Connecter GitHub à Vercel** :
   - Allez sur https://vercel.com/dashboard
   - Cliquez sur "Add New Project"
   - Sélectionnez votre repo GitHub `ToggleINC/SYNGTC-RDC`
   - Configurez les variables d'environnement
   - Cliquez sur "Deploy"

2. **Déploiements automatiques** :
   - Chaque push sur `main` déclenche un nouveau déploiement
   - Vercel build automatiquement le frontend et le backend

### Option 2 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## Avantages de cette Architecture

✅ **Simple** : Un seul service (Vercel) pour frontend + backend  
✅ **Gratuit** : Plan gratuit généreux pour commencer  
✅ **Rapide** : CDN global pour le frontend, fonctions serverless pour le backend  
✅ **Automatique** : Déploiements automatiques depuis GitHub  
✅ **Scalable** : Vercel gère automatiquement la montée en charge  

## Limitations

⚠️ **Fonctions Serverless** :
- Timeout de 10 secondes (plan gratuit) ou 60 secondes (plan Pro)
- Pas de WebSockets (Socket.io) - les alertes en temps réel ne fonctionneront pas
- Cold start possible (première requête peut être lente)

⚠️ **Fichiers Uploads** :
- Les uploads de fichiers doivent être stockés ailleurs (Supabase Storage, Cloudinary, etc.)
- Ne pas stocker dans le système de fichiers Vercel (éphémère)

## Migration depuis Fly.io

1. ✅ **Backend adapté** : `backend/api/index.ts` utilise Supabase
2. ✅ **Configuration Vercel** : `vercel.json` configuré
3. ✅ **Routes** : Toutes les routes `/api/*` pointent vers le backend

## Prochaines Étapes

1. **Configurer les variables d'environnement** dans Vercel
2. **Connecter GitHub** à Vercel
3. **Déployer** et tester
4. **Configurer Supabase Storage** pour les uploads de fichiers (si nécessaire)

## Support

- Documentation Vercel : https://vercel.com/docs
- Documentation Supabase : https://supabase.com/docs

