# Prochaines Étapes - SYNGTC-RDC

Maintenant que vous avez configuré vos fichiers `.env`, voici les étapes suivantes :

## ✅ Étape 1 : Exécuter le schéma SQL dans Supabase

### 1.1. Accéder au SQL Editor

1. Dans Supabase, cliquez sur **"SQL Editor"** dans le menu de gauche (icône `</>`)
2. Cliquez sur **"New query"** (bouton en haut à droite)

### 1.2. Copier et exécuter le schéma

1. Dans votre projet, ouvrez le fichier `database/supabase_migration.sql`
2. Sélectionnez tout le contenu (Ctrl+A / Cmd+A)
3. Copiez (Ctrl+C / Cmd+C)
4. Dans Supabase SQL Editor, collez le contenu (Ctrl+V / Cmd+V)
5. Cliquez sur **"Run"** (ou appuyez sur F5)
6. Attendez quelques secondes
7. Vous devriez voir : **"Success. No rows returned"** ou un message de succès

### 1.3. Vérifier que les tables sont créées

1. Dans Supabase, cliquez sur **"Table Editor"** dans le menu de gauche (icône de table)
2. Vous devriez voir les tables suivantes :
   - ✅ `users`
   - ✅ `criminals`
   - ✅ `cases`
   - ✅ `alerts`
   - ✅ `action_logs`
   - ✅ `user_sessions`

---

## ✅ Étape 2 : Tester la connexion Backend

### 2.1. Installer les dépendances

```bash
cd backend
npm install
```

### 2.2. Démarrer le serveur

```bash
npm run dev
```

### 2.3. Vérifier les messages

Vous devriez voir :
```
✅ Connexion à la base de données établie
🚀 Serveur SYNGTC-RDC démarré sur le port 5000
📊 Environnement: development
```

**Si vous voyez une erreur** :
- Vérifiez que le fichier `backend/.env` existe et est correctement rempli
- Vérifiez que le mot de passe Supabase est correct
- Vérifiez que le Host est correct (commence par `db.` et se termine par `.supabase.co`)

---

## ✅ Étape 3 : Tester le Frontend

### 3.1. Ouvrir un nouveau terminal

Laissez le backend tourner et ouvrez un **nouveau terminal**.

### 3.2. Installer les dépendances

```bash
cd frontend
npm install
```

### 3.3. Démarrer le serveur de développement

```bash
npm start
```

### 3.4. Vérifier

- Le navigateur devrait s'ouvrir automatiquement sur `http://localhost:3000`
- Vous devriez voir la page de connexion
- Essayez de vous connecter avec les identifiants de test

---

## ✅ Étape 4 : Migrer vos données existantes (si nécessaire)

Si vous avez déjà des données dans votre base PostgreSQL locale :

### 4.1. Configurer les variables de migration

Dans `backend/.env`, ajoutez (si vous avez une base locale) :

```env
# Base de données locale (pour la migration)
LOCAL_DB_HOST=localhost
LOCAL_DB_PORT=5432
LOCAL_DB_NAME=syngtc_rdc
LOCAL_DB_USER=postgres
LOCAL_DB_PASSWORD=votre_mot_de_passe_local
```

### 4.2. Exécuter le script de migration

```bash
cd backend
npm run migrate-to-supabase
```

Le script vous guidera interactivement pour migrer vos données.

**📖 Guide détaillé** : Consultez [`docs/MIGRATION_SUPABASE.md`](MIGRATION_SUPABASE.md)

---

## ✅ Étape 5 : Pousser sur GitHub

### 5.1. Initialiser Git (si pas déjà fait)

```bash
git init
```

### 5.2. Ajouter le remote GitHub

```bash
git remote add origin https://github.com/ToggleINC/SYNGTC-RDC.git
```

### 5.3. Faire le premier commit

```bash
git add .
git commit -m "Initial commit: SYNGTC-RDC - Configuration Supabase complète"
```

### 5.4. Pousser sur GitHub

```bash
git branch -M main
git push -u origin main
```

**📖 Guide détaillé** : Consultez [`docs/GITHUB_DEPLOIEMENT.md`](GITHUB_DEPLOIEMENT.md)

---

## ✅ Étape 6 : Déployer sur Vercel

### 6.1. Déployer le Frontend

1. Allez sur [https://vercel.com/jaspoirs-projects](https://vercel.com/jaspoirs-projects)
2. Cliquez sur **"Add New..."** → **"Project"**
3. Importez le dépôt GitHub `ToggleINC/SYNGTC-RDC`
4. Configurez :
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Ajoutez les variables d'environnement :
   ```
   REACT_APP_API_URL=https://votre-backend.vercel.app
   REACT_APP_SOCKET_URL=https://votre-backend.vercel.app
   ```
6. Cliquez sur **"Deploy"**

### 6.2. Déployer le Backend

1. Créez un **nouveau projet** Vercel (différent du frontend)
2. Importez le même dépôt GitHub
3. Configurez :
   - **Framework Preset**: `Other`
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Ajoutez les variables d'environnement :
   ```
   DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=votre_mot_de_passe_supabase
   JWT_SECRET=votre_secret_jwt
   NODE_ENV=production
   FRONTEND_URL=https://votre-frontend.vercel.app
   ```
5. Cliquez sur **"Deploy"**

### 6.3. Mettre à jour les URLs

Après le déploiement :
1. **Frontend** : Mettez à jour `REACT_APP_API_URL` avec l'URL du backend Vercel
2. **Backend** : Mettez à jour `FRONTEND_URL` avec l'URL du frontend Vercel
3. Redéployez les deux projets

**📖 Guide détaillé** : Consultez [`docs/VERCEL_DEPLOIEMENT.md`](VERCEL_DEPLOIEMENT.md)

---

## 📋 Checklist Complète

### Configuration locale
- [ ] Fichier `backend/.env` créé et rempli
- [ ] Fichier `frontend/.env` créé et rempli
- [ ] Schéma SQL exécuté dans Supabase
- [ ] Tables créées dans Supabase (vérifiées)
- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Connexion à la base de données réussie
- [ ] Application fonctionne localement

### Migration (si nécessaire)
- [ ] Données migrées vers Supabase
- [ ] Vérification des données dans Supabase

### Déploiement
- [ ] Code poussé sur GitHub
- [ ] Frontend déployé sur Vercel
- [ ] Backend déployé sur Vercel
- [ ] Variables d'environnement configurées dans Vercel
- [ ] URLs mises à jour après déploiement
- [ ] Application fonctionne en production

---

## 🎉 Félicitations !

Une fois toutes ces étapes terminées, votre application SYNGTC-RDC sera :
- ✅ Configurée avec Supabase
- ✅ Fonctionnelle en local
- ✅ Déployée sur GitHub
- ✅ Déployée sur Vercel
- ✅ Accessible en production

---

## 🆘 Besoin d'aide ?

- **Problème de connexion** : Consultez [`docs/ERREUR_CONNEXION.md`](ERREUR_CONNEXION.md)
- **Problème de déploiement** : Consultez [`docs/DEPLOIEMENT.md`](DEPLOIEMENT.md)
- **Questions sur les variables** : Consultez [`docs/ENV_VARIABLES.md`](ENV_VARIABLES.md)

---

**Prochaine étape recommandée** : Commencez par l'**Étape 1** (Exécuter le schéma SQL dans Supabase) si vous ne l'avez pas encore fait.

