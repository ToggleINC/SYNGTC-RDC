# Guide de Démarrage Rapide - SYNGTC-RDC

## 🚀 Déploiement Rapide

### Étape 1 : Créer la base de données Supabase

1. Allez sur [https://supabase.com](https://supabase.com) et créez un compte
2. Créez un nouveau projet : `syngtc-rdc`
3. Notez les informations de connexion (Host, Password, etc.)
4. Dans **SQL Editor**, exécutez le fichier `database/supabase_migration.sql`

### Étape 2 : Pousser sur GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter le remote
git remote add origin https://github.com/ToggleINC/SYNGTC-RDC.git

# Ajouter et commiter
git add .
git commit -m "Initial commit: SYNGTC-RDC"

# Pousser
git branch -M main
git push -u origin main
```

### Étape 3 : Déployer sur Vercel

1. Allez sur [https://vercel.com/jaspoirs-projects](https://vercel.com/jaspoirs-projects)
2. **Nouveau projet** → Importez `ToggleINC/SYNGTC-RDC`
3. Configurez :
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Ajoutez les variables d'environnement
5. Déployez !

### Étape 4 : Déployer le Backend sur Vercel

1. Allez sur [https://vercel.com/jaspoirs-projects](https://vercel.com/jaspoirs-projects)
2. Créez un **nouveau projet** (différent du frontend)
3. Importez le même dépôt GitHub `ToggleINC/SYNGTC-RDC`
4. Configurez :
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Ajoutez les variables d'environnement (DB_HOST, DB_PASSWORD, JWT_SECRET, etc.)
6. Déployez et notez l'URL du backend

## 📝 Variables d'environnement nécessaires

### Backend (.env)

```env
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_supabase
JWT_SECRET=votre_secret_jwt_tres_securise
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://votre-frontend.vercel.app
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://votre-backend.vercel.app
REACT_APP_SOCKET_URL=https://votre-backend.vercel.app
```

## ✅ Vérification

Une fois déployé :

1. ✅ Frontend accessible sur Vercel
2. ✅ Backend accessible sur Vercel (Serverless Functions)
3. ✅ Base de données Supabase connectée
4. ✅ Authentification fonctionnelle
5. ✅ Toutes les fonctionnalités opérationnelles

## 🆘 Problèmes courants

- **Erreur de connexion DB** : Vérifiez les variables d'environnement
- **CORS errors** : Vérifiez que `FRONTEND_URL` est correct dans le backend
- **Build failed** : Vérifiez les logs dans Vercel/Railway

Pour plus de détails, consultez :
- `docs/SUPABASE_SETUP.md`
- `docs/GITHUB_DEPLOIEMENT.md`
- `docs/VERCEL_DEPLOIEMENT.md`

