# Corriger le Compte GitHub dans Vercel

## Problème
Le déploiement Vercel montre "Created by lisuscraping-sys" au lieu de "toggleinc-7493". Cela signifie que Vercel est connecté au mauvais compte GitHub.

## Solution : Reconnecter avec le bon compte GitHub

### Étape 1 : Vérifier les comptes GitHub connectés

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur votre **avatar** (en haut à droite)
3. Allez dans **Settings**
4. Dans le menu de gauche, cliquez sur **Git**
5. Vous verrez la liste des comptes GitHub connectés

### Étape 2 : Déconnecter le mauvais compte (si nécessaire)

1. Dans **Settings → Git**
2. Trouvez le compte **lisuscraping-sys** (ou le compte incorrect)
3. Cliquez sur **"Disconnect"** à côté de ce compte
4. Confirmez la déconnexion

### Étape 3 : Connecter le bon compte GitHub

1. Dans **Settings → Git**
2. Cliquez sur **"Connect GitHub"** ou **"Add Git Provider"**
3. Sélectionnez **GitHub**
4. **Important** : Assurez-vous d'être connecté au bon compte GitHub dans votre navigateur
   - Si vous êtes connecté au mauvais compte GitHub, déconnectez-vous d'abord
   - Allez sur [github.com](https://github.com) et déconnectez-vous
   - Reconnectez-vous avec le compte **toggleinc-7493** (ou l'organisation **ToggleINC**)
5. Autorisez Vercel à accéder au compte GitHub **ToggleINC**
6. Sélectionnez les permissions nécessaires :
   - ✅ Accès aux repositories
   - ✅ Accès aux webhooks (pour les déploiements automatiques)

### Étape 4 : Reconnecter le projet au repository

1. Allez dans votre projet Vercel : **syngtc-rdc**
2. Allez dans **Settings → Git**
3. Si le repository est déjà connecté mais avec le mauvais compte :
   - Cliquez sur **"Disconnect Git Repository"**
   - Puis cliquez sur **"Connect Git Repository"**
4. Sélectionnez **GitHub**
5. **Assurez-vous** que le compte affiché est **ToggleINC** (pas lisuscraping-sys)
6. Sélectionnez le repository **`ToggleINC/SYNGTC-RDC`**
7. Sélectionnez la branche **`main`**
8. Cliquez sur **"Connect"**

### Étape 5 : Vérifier la connexion

1. Allez dans **Settings → Git** de votre projet
2. Vous devriez voir :
   - ✅ **Connected Repository** : `ToggleINC/SYNGTC-RDC`
   - ✅ **Production Branch** : `main`
   - ✅ **Git Provider** : GitHub (ToggleINC)

### Étape 6 : Déclencher un nouveau déploiement

Pour vérifier que ça fonctionne avec le bon compte :

```bash
# Faire un petit changement
echo "" >> README.md
git add README.md
git commit -m "chore: Test connexion GitHub ToggleINC"
git push origin main
```

Ensuite, allez sur Vercel → **Deployments**. Le nouveau déploiement devrait montrer :
- **Created by toggleinc-7493** (ou le nom de l'utilisateur GitHub correct)

## Vérification dans GitHub

1. Allez sur [github.com/ToggleINC/SYNGTC-RDC](https://github.com/ToggleINC/SYNGTC-RDC)
2. Allez dans **Settings → Webhooks**
3. Vous devriez voir un webhook Vercel configuré
4. Vérifiez que l'URL du webhook pointe vers Vercel

## Si vous avez plusieurs comptes GitHub

### Option A : Utiliser l'organisation ToggleINC

Si le repository appartient à l'organisation **ToggleINC** :
1. Assurez-vous que votre compte GitHub est membre de l'organisation **ToggleINC**
2. Connectez Vercel à l'organisation **ToggleINC** (pas à votre compte personnel)
3. Dans Vercel, lors de la connexion, sélectionnez **"ToggleINC"** comme organisation

### Option B : Utiliser un compte personnel

Si vous devez utiliser le compte **toggleinc-7493** :
1. Assurez-vous d'être connecté à ce compte sur GitHub
2. Déconnectez-vous de tous les autres comptes GitHub dans votre navigateur
3. Reconnectez Vercel en étant connecté au bon compte

## Dépannage

### Si vous ne voyez pas le bon compte dans la liste

1. **Déconnectez-vous complètement de GitHub** dans votre navigateur
2. **Reconnectez-vous** avec le compte **ToggleINC** ou **toggleinc-7493**
3. Dans Vercel, **déconnectez** toutes les connexions GitHub existantes
4. **Reconnectez** GitHub en étant connecté au bon compte

### Si Vercel ne détecte pas le repository

1. Vérifiez que vous avez les **permissions** sur le repository `ToggleINC/SYNGTC-RDC`
2. Vérifiez que le repository est **bien visible** pour votre compte
3. Essayez de **reconnecter** le repository dans Vercel

### Si les déploiements ne se déclenchent toujours pas

1. Vérifiez les **webhooks** dans GitHub → Settings → Webhooks
2. Vérifiez que le webhook Vercel est **actif** et a récemment envoyé des événements
3. Si nécessaire, **supprimez** et **recréez** le webhook

## Commandes utiles

### Vérifier le compte GitHub actuel
```bash
# Vérifier la configuration Git locale
git config user.name
git config user.email

# Vérifier le remote
git remote -v
```

### Forcer un nouveau déploiement
```bash
# Commit vide pour déclencher un déploiement
git commit --allow-empty -m "chore: Test compte GitHub ToggleINC"
git push origin main
```

## Résultat attendu

Après correction, les nouveaux déploiements devraient afficher :
- ✅ **Created by toggleinc-7493** (ou le nom correct)
- ✅ **Source** : `main` branch from `ToggleINC/SYNGTC-RDC`
- ✅ **Auto-deploy** : Activé

