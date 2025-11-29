# Configuration de la Synchronisation GitHub ↔ Vercel

## Problème
Vercel ne détecte pas automatiquement les pushes vers GitHub, donc les déploiements ne se déclenchent pas automatiquement.

## Solution : Connecter GitHub à Vercel

### Étape 1 : Vérifier la connexion GitHub dans Vercel

1. **Allez sur [vercel.com](https://vercel.com)**
2. **Connectez-vous** avec votre compte
3. **Allez dans Settings → Git** (ou dans votre projet → Settings → Git)

### Étape 2 : Connecter le projet GitHub

#### Option A : Si le projet n'est pas encore connecté

1. Dans votre dashboard Vercel, cliquez sur **"Add New Project"** ou **"Import Project"**
2. Sélectionnez **GitHub** comme source
3. Autorisez Vercel à accéder à votre compte GitHub si demandé
4. Sélectionnez le repository **`ToggleINC/SYNGTC-RDC`**
5. Cliquez sur **"Import"**

#### Option B : Si le projet existe déjà mais n'est pas connecté

1. Allez dans votre projet Vercel
2. Cliquez sur **Settings** (en haut à droite)
3. Allez dans l'onglet **Git**
4. Cliquez sur **"Connect Git Repository"**
5. Sélectionnez **GitHub**
6. Choisissez le repository **`ToggleINC/SYNGTC-RDC`**
7. Sélectionnez la branche **`main`**
8. Cliquez sur **"Connect"**

### Étape 3 : Configurer le déploiement automatique

Une fois le repository connecté :

1. Dans **Settings → Git**, vérifiez que :
   - **Production Branch** : `main`
   - **Auto-deploy** : Activé ✅
   - **Preview Deployments** : Activé (optionnel)

2. Dans **Settings → General**, vérifiez :
   - **Root Directory** : `./` (racine du projet)
   - **Build Command** : (laissé vide, Vercel détecte automatiquement)
   - **Output Directory** : (laissé vide, Vercel détecte automatiquement)

### Étape 4 : Vérifier la configuration du projet

Dans **Settings → General** :

- **Framework Preset** : `Other` (car nous avons un monorepo avec frontend/backend)
- **Root Directory** : `./` (racine)
- **Build Command** : (vide - Vercel utilise `vercel.json`)
- **Output Directory** : (vide - Vercel utilise `vercel.json`)

### Étape 5 : Vérifier les variables d'environnement

Dans **Settings → Environment Variables**, assurez-vous que toutes les variables sont configurées :

```
SUPABASE_URL=https://qudbecjmgitlkjwucsrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role
JWT_SECRET=votre_jwt_secret
NODE_ENV=production
```

⚠️ **Important** : Les variables d'environnement doivent être définies pour **Production**, **Preview**, et **Development**.

### Étape 6 : Déclencher un déploiement manuel (pour tester)

1. Allez dans l'onglet **Deployments**
2. Cliquez sur **"Redeploy"** sur le dernier déploiement
3. Ou cliquez sur **"Deploy"** → **"Deploy Latest Commit"**

### Étape 7 : Vérifier que ça fonctionne

1. Faites un petit changement dans le code
2. Committez et pushez vers GitHub :
   ```bash
   git add .
   git commit -m "test: Test synchronisation GitHub-Vercel"
   git push origin main
   ```
3. Allez sur Vercel → **Deployments**
4. Vous devriez voir un nouveau déploiement se créer automatiquement

## Vérification de la connexion

### Dans Vercel
- Allez dans **Settings → Git**
- Vous devriez voir :
  - ✅ **Connected Repository** : `ToggleINC/SYNGTC-RDC`
  - ✅ **Production Branch** : `main`
  - ✅ **Auto-deploy** : Enabled

### Dans GitHub
- Allez dans votre repository GitHub
- Allez dans **Settings → Webhooks**
- Vous devriez voir un webhook Vercel configuré

## Dépannage

### Si Vercel ne détecte toujours pas les pushes

1. **Vérifiez les permissions GitHub** :
   - Allez dans GitHub → Settings → Applications → Authorized OAuth Apps
   - Vérifiez que Vercel a les permissions nécessaires

2. **Vérifiez le webhook GitHub** :
   - GitHub → Repository → Settings → Webhooks
   - Le webhook Vercel doit être actif et avoir récemment envoyé des événements

3. **Reconnectez le repository** :
   - Vercel → Settings → Git → Disconnect
   - Puis reconnectez-le

4. **Vérifiez la branche** :
   - Assurez-vous que vous poussez vers `main` (ou la branche configurée dans Vercel)

### Si le déploiement échoue

1. Vérifiez les logs de build dans Vercel
2. Vérifiez que toutes les variables d'environnement sont définies
3. Vérifiez que `vercel.json` est correctement configuré

## Configuration recommandée

Une fois connecté, votre configuration devrait ressembler à :

```
✅ Repository: ToggleINC/SYNGTC-RDC
✅ Branch: main
✅ Auto-deploy: Enabled
✅ Framework: Other (monorepo)
✅ Root Directory: ./
✅ Build Command: (auto-détecté via vercel.json)
✅ Output Directory: (auto-détecté via vercel.json)
```

## Commandes utiles

### Vérifier la configuration locale
```bash
# Vérifier que vous êtes sur la bonne branche
git branch

# Vérifier les remotes
git remote -v

# Voir les derniers commits
git log --oneline -5
```

### Forcer un nouveau déploiement
```bash
# Faire un commit vide pour déclencher un déploiement
git commit --allow-empty -m "chore: Trigger Vercel deployment"
git push origin main
```

## Support

Si le problème persiste :
1. Vérifiez les logs dans Vercel → Deployments → [Dernier déploiement] → Build Logs
2. Vérifiez les webhooks dans GitHub → Settings → Webhooks
3. Contactez le support Vercel si nécessaire

