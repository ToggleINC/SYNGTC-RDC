# Comment Redéployer sur Vercel

## Méthode 1 : Via l'Interface Vercel (Le Plus Simple)

### Étape 1 : Aller sur le Dashboard Vercel
1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet `syngtc-rdc`

### Étape 2 : Redéployer le Dernier Commit
1. Dans l'onglet **"Deployments"**, vous verrez la liste de tous les déploiements
2. Trouvez le déploiement avec le commit `66c3775` (le dernier avec la nouvelle architecture)
3. Cliquez sur les **3 points** (⋯) à droite du déploiement
4. Cliquez sur **"Redeploy"**
5. Vercel va redéployer avec la même configuration

### Étape 3 : Ou Déclencher un Nouveau Déploiement
1. Dans l'onglet **"Deployments"**
2. Cliquez sur le bouton **"Redeploy"** en haut à droite
3. Sélectionnez la branche `main`
4. Cliquez sur **"Redeploy"**

## Méthode 2 : Via un Nouveau Push GitHub (Recommandé)

### Étape 1 : Faire un Petit Changement
```bash
# Créer un fichier vide pour déclencher un nouveau déploiement
echo "" >> .vercel-deploy-trigger
git add .vercel-deploy-trigger
git commit -m "chore: Trigger Vercel redeploy"
git push origin main
```

### Étape 2 : Vercel Déploie Automatiquement
- Vercel détecte automatiquement le nouveau push
- Un nouveau déploiement commence automatiquement
- Vous pouvez suivre le progrès dans le Dashboard Vercel

## Méthode 3 : Via Vercel CLI

### Étape 1 : Installer Vercel CLI
```bash
npm install -g vercel
```

### Étape 2 : Se Connecter
```bash
vercel login
```

### Étape 3 : Déployer
```bash
# Depuis la racine du projet
vercel --prod
```

## Vérifier les Variables d'Environnement

Avant de redéployer, assurez-vous que toutes les variables d'environnement sont configurées :

1. Allez dans **Settings** → **Environment Variables**
2. Vérifiez que ces variables existent :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL` (optionnel, sera automatiquement défini)
   - `NODE_ENV=production`

## Résoudre l'Erreur "NOT_FOUND"

Si vous voyez toujours "NOT_FOUND" après le redéploiement :

### 1. Vérifier les Logs de Build
1. Dans le Dashboard Vercel, cliquez sur le déploiement
2. Cliquez sur **"Build Logs"**
3. Vérifiez s'il y a des erreurs lors du build du frontend

### 2. Vérifier les Logs Runtime
1. Cliquez sur **"Runtime Logs"**
2. Vérifiez s'il y a des erreurs lors de l'exécution

### 3. Vérifier la Configuration
- Le fichier `vercel.json` doit être à la racine
- Le dossier `frontend/` doit contenir `package.json` avec le script `build`
- Le dossier `backend/api/` doit contenir `index.ts`

## Structure Attendue

```
SYNGTC-RDC/
├── vercel.json          ← Configuration Vercel
├── frontend/
│   ├── package.json     ← Avec script "build"
│   └── src/
├── backend/
│   └── api/
│       └── index.ts     ← Point d'entrée backend
```

## Après le Redéploiement

1. Attendez que le build se termine (2-5 minutes)
2. Cliquez sur le domaine `syngtc-rdc.vercel.app`
3. Testez l'application :
   - Page d'accueil : `/`
   - API Health : `/api/health`
   - Login : `/login`

## Support

Si le problème persiste :
1. Consultez les **Build Logs** pour voir les erreurs exactes
2. Vérifiez que tous les fichiers sont bien commités sur GitHub
3. Contactez le support Vercel si nécessaire

