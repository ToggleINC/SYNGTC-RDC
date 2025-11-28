# Déploiement sur Vercel

## Prérequis
- Compte Vercel connecté à GitHub
- Projet Supabase configuré
- Variables d'environnement prêtes

## Étapes de déploiement

### 1. Connecter GitHub à Vercel

1. Allez sur https://vercel.com/jaspoirs-projects
2. Cliquez sur **"Add New..."** → **"Project"**
3. Sélectionnez **"Import Git Repository"**
4. Choisissez le dépôt **ToggleINC/SYNGTC-RDC**
5. Cliquez sur **"Import"**

### 2. Configuration du projet

#### Framework Preset
- Sélectionnez **"Other"** ou **"Create React App"** pour le frontend

#### Build & Development Settings
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `npm install`

#### Root Directory
- Laissez vide (racine du projet)

### 3. Variables d'environnement

Ajoutez les variables suivantes dans **Settings** → **Environment Variables** :

```
SUPABASE_URL=votre_url_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
SUPABASE_ANON_KEY=votre_anon_key
JWT_SECRET=votre_secret_jwt
NODE_ENV=production
PORT=5000
```

### 4. Déployer

1. Cliquez sur **"Deploy"**
2. Attendez la fin du build
3. Votre application sera disponible sur `https://syngtc-rdc.vercel.app`

## Déploiement via CLI (Alternative)

Si vous préférez utiliser la CLI Vercel :

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

## Notes importantes

- Le backend et le frontend sont déployés ensemble
- Les routes `/api/*` sont redirigées vers le backend
- Les autres routes servent le frontend React
- Socket.io peut nécessiter une configuration supplémentaire sur Vercel

## Troubleshooting

### Erreur de build
- Vérifiez que toutes les dépendances sont dans `package.json`
- Assurez-vous que les variables d'environnement sont correctement configurées

### Erreur 500
- Vérifiez les logs dans Vercel Dashboard
- Assurez-vous que Supabase est accessible depuis Vercel

### Socket.io ne fonctionne pas
- Vercel Serverless Functions ne supportent pas les WebSockets persistants
- Considérez l'utilisation de Vercel Edge Functions ou un service externe pour Socket.io
