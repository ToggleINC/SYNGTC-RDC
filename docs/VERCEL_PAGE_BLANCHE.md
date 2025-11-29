# Résoudre la Page Blanche sur Vercel

## Problème
L'application React s'affiche en page blanche après le déploiement sur Vercel.

## Solutions

### 1. Vérifier les paramètres de build dans Vercel

Allez dans **Vercel → Votre Projet → Settings → General** et vérifiez :

- **Framework Preset** : `Other` (pas Create React App)
- **Root Directory** : `./` (racine du projet)
- **Build Command** : `cd frontend && npm install && npm run build`
- **Output Directory** : `frontend/build`
- **Install Command** : `cd frontend && npm install`

### 2. Vérifier les variables d'environnement

Dans **Settings → Environment Variables**, assurez-vous que :
- Toutes les variables sont définies pour **Production**, **Preview**, et **Development**
- `NODE_ENV=production` est défini

### 3. Vérifier les logs de build

1. Allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. Cliquez sur **Build Logs**
4. Vérifiez s'il y a des erreurs :
   - Erreurs de compilation TypeScript
   - Erreurs de dépendances manquantes
   - Erreurs de build

### 4. Vérifier la console du navigateur

Ouvrez la console du navigateur (F12) et vérifiez :
- **Erreurs JavaScript** : Des erreurs empêchent le rendu
- **Fichiers non chargés** : Les fichiers JS/CSS ne se chargent pas (404)
- **Erreurs CORS** : Problèmes de cross-origin

### 5. Vérifier que les fichiers statiques sont servis

Dans la console du navigateur, vérifiez les requêtes réseau :
- `/static/js/main.xxx.js` doit charger (status 200)
- `/static/css/main.xxx.css` doit charger (status 200)
- `/favicon.ico` peut donner 404 (non bloquant)

### 6. Vérifier le fichier index.html

Le fichier `frontend/build/index.html` après le build doit contenir :
```html
<script src="/static/js/main.xxx.js"></script>
<link href="/static/css/main.xxx.css" rel="stylesheet">
```

### 7. Solution : Forcer un nouveau build

1. Dans Vercel, allez dans **Deployments**
2. Cliquez sur **"Redeploy"** sur le dernier déploiement
3. Ou créez un commit vide :
   ```bash
   git commit --allow-empty -m "chore: Force Vercel rebuild"
   git push origin main
   ```

### 8. Vérifier la configuration vercel.json

Le fichier `vercel.json` doit :
- Avoir les routes pour `/static/*`
- Rediriger toutes les routes vers `index.html`
- Servir les fichiers statiques correctement

### 9. Test local du build

Testez le build localement pour vérifier qu'il fonctionne :

```bash
cd frontend
npm install
npm run build
npm install -g serve
serve -s build
```

Ouvrez `http://localhost:3000` et vérifiez que l'application fonctionne.

### 10. Vérifier les erreurs dans les logs Runtime

1. Dans Vercel, allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. Cliquez sur **Runtime Logs**
4. Vérifiez s'il y a des erreurs au runtime

## Erreurs courantes

### Erreur : "Cannot find module"
- **Cause** : Dépendances manquantes
- **Solution** : Vérifiez que `package.json` contient toutes les dépendances

### Erreur : "Failed to load resource"
- **Cause** : Fichiers statiques non servis
- **Solution** : Vérifiez la configuration `vercel.json` pour les routes `/static/*`

### Erreur : "Uncaught ReferenceError"
- **Cause** : Erreur JavaScript dans le code
- **Solution** : Vérifiez la console du navigateur pour l'erreur exacte

### Page blanche sans erreur
- **Cause** : React ne se monte pas
- **Solution** : Vérifiez que `index.html` contient `<div id="root"></div>` et que `index.tsx` monte React sur cet élément

## Configuration recommandée pour Vercel

### Settings → General
```
Framework Preset: Other
Root Directory: ./
Build Command: cd frontend && npm install && npm run build
Output Directory: frontend/build
Install Command: cd frontend && npm install
```

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "frontend/build/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/build/index.html"
    }
  ]
}
```

## Commandes utiles

### Vérifier le build local
```bash
cd frontend
npm run build
ls -la build/
```

### Vérifier les fichiers générés
```bash
cd frontend/build
ls -la static/js/
ls -la static/css/
```

### Forcer un nouveau déploiement
```bash
git commit --allow-empty -m "chore: Force rebuild"
git push origin main
```

## Si rien ne fonctionne

1. **Vérifiez les logs complets** dans Vercel
2. **Testez le build localement** pour isoler le problème
3. **Vérifiez la console du navigateur** pour les erreurs exactes
4. **Contactez le support Vercel** avec les logs de build

