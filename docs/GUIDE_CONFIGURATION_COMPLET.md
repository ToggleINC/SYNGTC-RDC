# Guide de Configuration Complet - SYNGTC-RDC

Ce guide vous accompagne étape par étape pour configurer Supabase et vos fichiers `.env`.

## 📋 Table des matières

1. [Étape 1 : Obtenir les informations Supabase](#étape-1--obtenir-les-informations-supabase)
2. [Étape 2 : Configurer le fichier .env du Backend](#étape-2--configurer-le-fichier-env-du-backend)
3. [Étape 3 : Configurer le fichier .env du Frontend](#étape-3--configurer-le-fichier-env-du-frontend)
4. [Étape 4 : Exécuter le schéma SQL dans Supabase](#étape-4--exécuter-le-schéma-sql-dans-supabase)
5. [Étape 5 : Tester la connexion](#étape-5--tester-la-connexion)

---

## Étape 1 : Obtenir les informations Supabase

### 1.1. Obtenir les informations de connexion

Il y a **plusieurs façons** d'obtenir les informations de connexion dans Supabase :

#### Méthode 1 : Via le bouton "Connect" (Recommandé)

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `syngtc-rdc`
3. En haut à droite, cliquez sur le bouton **"Connect"**
4. Une page s'ouvre avec le titre **"Connect to your project"**
5. L'onglet **"Connection String"** est sélectionné par défaut
6. Dans la section **"Direct connection"**, cliquez sur **"View parameters"** (déroulez si nécessaire)
7. Vous verrez exactement :
   ```
   host: db.qudbecjmgitlkjwucsrt.supabase.co
   port: 5432
   database: postgres
   user: postgres
   ```
   **Note** : Le mot de passe n'est pas affiché pour des raisons de sécurité. Utilisez celui que vous avez créé lors de la création du projet.

#### Méthode 2 : Via Settings → Database

1. Dans le menu de gauche, cliquez sur **"Settings"** (icône ⚙️)
2. Cliquez sur **"Database"** dans le sous-menu
3. Faites défiler jusqu'à la section **"Connection string"** ou **"Connection info"**
4. Cliquez sur **"Connection string"** pour voir les détails
5. Vous pouvez aussi cliquer sur **"URI"** ou **"JDBC"** pour voir la chaîne complète

#### Méthode 3 : Construire depuis l'URL du projet

Si vous avez l'URL de votre projet (visible dans Settings → API) :
- **Project URL** : `https://qudbecjmgitlkjwucsrt.supabase.co`
- Alors le **Host** sera : `db.qudbecjmgitlkjwucsrt.supabase.co`

Les autres informations sont toujours les mêmes :
- **Port** : `5432`
- **Database** : `postgres`
- **User** : `postgres`
- **Password** : Le mot de passe que vous avez créé lors de la création du projet

**⚠️ Important** : 
- Si vous avez oublié le mot de passe, cliquez sur **"Reset database password"** dans Settings → Database
- Le mot de passe est sensible à la casse (majuscules/minuscules)

### 1.2. Obtenir l'URL du projet et les clés API

1. Dans le menu de gauche, cliquez sur **"Settings"** (icône ⚙️)
2. Cliquez sur **"API"** dans le sous-menu
3. Vous verrez :

   **Project URL** :
   ```
   https://qudbecjmgitlkjwucsrt.supabase.co
   ```
   (Votre URL sera différente, notez-la !)

   **API Key (anon public)** :
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1ZGJlY2ptZ2l0bGtqdnd1Y3NydCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM1ODk2NzQwLCJleHAiOjIwNTE0NzI3NDB9.xxxxx
   ```
   (Notez cette clé, elle commence par `eyJhbGc...`)

4. Pour obtenir la **service_role key** (optionnel, pour le backend) :
   - Faites défiler dans la page API
   - Trouvez la section **"service_role"** (gardez-la secrète !)

### 1.3. Construire le Host depuis l'URL du projet

Si vous avez l'URL du projet depuis Settings → API :
- **Project URL** : `https://qudbecjmgitlkjwucsrt.supabase.co`
- Alors le **Host de la base de données** sera : `db.qudbecjmgitlkjwucsrt.supabase.co`

**Exemple** :
- Si votre Project URL est : `https://qudbecjmgitlkjwucsrt.supabase.co`
- Alors votre DB_HOST sera : `db.qudbecjmgitlkjwucsrt.supabase.co`

---

## Étape 2 : Configurer le fichier .env du Backend

### 2.1. Créer le fichier .env

1. Ouvrez votre projet dans votre éditeur
2. Allez dans le dossier `backend/`
3. Créez un nouveau fichier nommé `.env` (avec le point au début)

### 2.2. Remplir le fichier .env du Backend

Ouvrez `backend/.env` et remplissez-le avec vos informations Supabase :

```env
# ============================================
# CONFIGURATION BASE DE DONNÉES SUPABASE
# ============================================
# Remplacez xxxxx par votre identifiant Supabase
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_supabase_ici

# ============================================
# JWT SECRET (Générez un secret fort)
# ============================================
# Générez un secret avec : node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi_immediatement

# ============================================
# CONFIGURATION SERVEUR
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# URL FRONTEND (pour CORS)
# ============================================
# En développement local
FRONTEND_URL=http://localhost:3000

# En production (à mettre après déploiement)
# FRONTEND_URL=https://votre-frontend.vercel.app
```

### 2.3. Exemple concret avec vos données

D'après votre page "Connect to your project" dans Supabase, vous avez :

- **Host** : `db.qudbecjmgitlkjwucsrt.supabase.co`
- **Port** : `5432`
- **Database** : `postgres`
- **User** : `postgres`
- **Password** : (celui que vous avez créé lors de la création du projet)

Votre `backend/.env` ressemblera à :

```env
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_ici

JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**⚠️ Important** : Remplacez `votre_mot_de_passe_ici` par le mot de passe que vous avez créé lors de la création du projet Supabase. Si vous l'avez oublié, allez dans **Settings → Database** et cliquez sur **"Reset database password"**.

### 2.4. Générer un JWT_SECRET sécurisé

Ouvrez un terminal dans le dossier `backend/` et exécutez :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez le résultat et collez-le dans `JWT_SECRET`.

---

## Étape 3 : Configurer le fichier .env du Frontend

### 3.1. Créer le fichier .env

1. Allez dans le dossier `frontend/`
2. Créez un nouveau fichier nommé `.env` (avec le point au début)

### 3.2. Remplir le fichier .env du Frontend

Ouvrez `frontend/.env` et remplissez-le :

```env
# ============================================
# URL DE L'API BACKEND
# ============================================
# En développement local (backend sur localhost:5000)
REACT_APP_API_URL=http://localhost:5000

# En production (à mettre après déploiement du backend)
# REACT_APP_API_URL=https://votre-backend.vercel.app

# ============================================
# URL DU SERVEUR SOCKET.IO
# ============================================
# En développement local
REACT_APP_SOCKET_URL=http://localhost:5000

# En production (à mettre après déploiement du backend)
# REACT_APP_SOCKET_URL=https://votre-backend.vercel.app
```

### 3.3. Exemple concret

Pour le développement local, votre `frontend/.env` sera :

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

**⚠️ Important** : 
- Les variables dans React doivent commencer par `REACT_APP_`
- Après le déploiement sur Vercel, vous devrez mettre les URLs de production

---

## Étape 4 : Exécuter le schéma SQL dans Supabase

### 4.1. Accéder au SQL Editor

1. Dans Supabase, cliquez sur **"SQL Editor"** dans le menu de gauche (icône `</>`)
2. Cliquez sur **"New query"** (bouton en haut à droite)

### 4.2. Copier le schéma SQL

1. Dans votre projet, ouvrez le fichier `database/supabase_migration.sql`
2. Sélectionnez tout le contenu (Ctrl+A / Cmd+A)
3. Copiez (Ctrl+C / Cmd+C)

### 4.3. Coller et exécuter dans Supabase

1. Dans Supabase SQL Editor, collez le contenu (Ctrl+V / Cmd+V)
2. Cliquez sur **"Run"** (ou appuyez sur F5)
3. Attendez quelques secondes
4. Vous devriez voir : **"Success. No rows returned"** ou un message de succès

### 4.4. Vérifier que les tables sont créées

1. Dans Supabase, cliquez sur **"Table Editor"** dans le menu de gauche (icône de table)
2. Vous devriez voir les tables suivantes :
   - ✅ `users`
   - ✅ `criminals`
   - ✅ `cases`
   - ✅ `alerts`
   - ✅ `action_logs`
   - ✅ `user_sessions`

---

## Étape 5 : Tester la connexion

### 5.1. Tester le Backend

1. Ouvrez un terminal dans le dossier `backend/`
2. Assurez-vous que les dépendances sont installées :
   ```bash
   npm install
   ```
3. Démarrez le serveur :
   ```bash
   npm run dev
   ```
4. Vous devriez voir :
   ```
   ✅ Connexion à la base de données établie
   🚀 Serveur SYNGTC-RDC démarré sur le port 5000
   📊 Environnement: development
   ```

Si vous voyez une erreur de connexion, vérifiez :
- ✅ Que le fichier `.env` existe bien dans `backend/`
- ✅ Que toutes les variables sont remplies (sans espaces avant/après)
- ✅ Que le mot de passe Supabase est correct
- ✅ Que le Host est correct (commence par `db.` et se termine par `.supabase.co`)

### 5.2. Tester le Frontend

1. Ouvrez un **nouveau terminal** dans le dossier `frontend/`
2. Assurez-vous que les dépendances sont installées :
   ```bash
   npm install
   ```
3. Démarrez le serveur de développement :
   ```bash
   npm start
   ```
4. Le navigateur devrait s'ouvrir automatiquement sur `http://localhost:3000`
5. Essayez de vous connecter avec les identifiants de test

### 5.3. Vérifier la connexion à la base de données

Dans Supabase :

1. Allez dans **"Table Editor"**
2. Cliquez sur la table `users`
3. Si vous avez exécuté `database/seed.sql`, vous devriez voir des utilisateurs de test

---

## 🔍 Vérification finale

### Checklist de configuration

- [ ] Fichier `backend/.env` créé et rempli
- [ ] Fichier `frontend/.env` créé et rempli
- [ ] Schéma SQL exécuté dans Supabase
- [ ] Tables créées dans Supabase (vérifiées dans Table Editor)
- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Connexion à la base de données réussie (message dans les logs backend)

---

## 🆘 Problèmes courants

### Erreur : "password authentication failed"

**Solution** : Vérifiez que le mot de passe dans `backend/.env` correspond exactement au mot de passe Supabase (sensible à la casse).

### Erreur : "could not connect to server"

**Solution** : 
- Vérifiez que le `DB_HOST` est correct (commence par `db.`)
- Vérifiez votre connexion internet
- Vérifiez que le projet Supabase est actif (pas en pause)

### Erreur : "relation does not exist"

**Solution** : Le schéma SQL n'a pas été exécuté. Retournez à l'étape 4.

### Frontend ne se connecte pas au backend

**Solution** :
- Vérifiez que le backend est bien démarré sur le port 5000
- Vérifiez que `REACT_APP_API_URL=http://localhost:5000` dans `frontend/.env`
- Redémarrez le serveur frontend après modification du `.env`

---

## 📝 Résumé des fichiers .env

### backend/.env
```env
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### frontend/.env
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🎉 Félicitations !

Si tout fonctionne, vous êtes prêt à :
1. Migrer vos données existantes (voir `docs/MIGRATION_SUPABASE.md`)
2. Déployer sur GitHub et Vercel (voir `docs/DEPLOIEMENT.md`)

Pour toute question, consultez la documentation dans le dossier `docs/`.

