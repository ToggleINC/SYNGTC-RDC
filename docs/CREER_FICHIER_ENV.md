# Créer le Fichier .env pour le Backend

## 🔴 Problème : Fichier .env manquant

Si vous avez l'erreur `getaddrinfo ENOTFOUND` ou que le backend ne se connecte pas à Supabase, c'est probablement parce que le fichier `.env` n'existe pas ou est mal configuré.

## ✅ Solution : Créer le fichier .env

### Étape 1 : Créer le fichier

1. Allez dans le dossier `backend/`
2. Créez un nouveau fichier nommé `.env` (sans extension)
3. **Important** : Le fichier doit s'appeler exactement `.env` (pas `.env.txt` ou autre)

### Étape 2 : Copier le contenu

Copiez ce contenu dans le fichier `.env` :

```env
# ============================================
# CONFIGURATION BASE DE DONNÉES SUPABASE
# ============================================
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Lisu@2025

# ============================================
# JWT SECRET
# ============================================
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi_immediatement
JWT_EXPIRES_IN=24h

# ============================================
# CONFIGURATION SERVEUR
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# URL FRONTEND (pour CORS)
# ============================================
FRONTEND_URL=http://localhost:3000
```

### Étape 3 : Vérifier les valeurs Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `syngtc-rdc`
3. Cliquez sur **"Connect"** en haut à droite
4. Dans **"Connection String"** → **"View parameters"**
5. Vérifiez que les valeurs correspondent :
   - **Host** : doit être `db.qudbecjmgitlkjwucsrt.supabase.co`
   - **Port** : `5432`
   - **Database** : `postgres`
   - **User** : `postgres`
   - **Password** : celui que vous avez créé lors de la création du projet

### Étape 4 : Générer un JWT Secret

Générez un secret fort pour JWT :

```bash
cd backend
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copiez le résultat et remplacez `votre_secret_jwt_tres_securise_changez_moi_immediatement` dans le `.env`.

### Étape 5 : Vérifier le format

**⚠️ Important** :
- Pas d'espaces avant/après le `=`
- Pas de guillemets autour des valeurs
- Pas de lignes vides avec des espaces
- Chaque variable sur une seule ligne

**Bon format** :
```env
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
```

**Mauvais format** :
```env
DB_HOST = db.qudbecjmgitlkjwucsrt.supabase.co  ❌ (espaces)
DB_HOST="db.qudbecjmgitlkjwucsrt.supabase.co"  ❌ (guillemets)
```

### Étape 6 : Redémarrer le backend

Après avoir créé/modifié le `.env` :

1. **Arrêtez** le backend (Ctrl+C dans le terminal)
2. **Relancez** le backend :
   ```bash
   cd backend
   npm run dev
   ```

Vous devriez voir :
```
✅ Connexion à la base de données établie
🚀 Serveur SYNGTC-RDC démarré sur le port 5000
```

## 🔍 Vérification

Pour vérifier que le `.env` est bien lu :

```bash
cd backend
npm run test-supabase
```

Si la connexion fonctionne, vous verrez :
```
✅ Connexion réussie !
```

## 📝 Note sur l'API Key Supabase

**Pour une connexion PostgreSQL directe** (ce que nous utilisons), nous n'avons **PAS besoin** de l'API Key Supabase. Nous avons seulement besoin de :
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD

L'API Key Supabase est utilisée pour l'API REST de Supabase, mais nous utilisons une connexion PostgreSQL directe avec le client `pg`.

### ⚠️ Si vous pensez que l'API Key est nécessaire

Si vous avez l'erreur `getaddrinfo ENOTFOUND`, ce n'est **PAS** à cause de l'API Key manquante. C'est un problème de :
1. **Fichier `.env` manquant ou mal configuré**
2. **Problème DNS/réseau**
3. **Projet Supabase en pause**

L'API Key Supabase n'est utilisée que si vous appelez l'API REST de Supabase (endpoints HTTP), pas pour les connexions PostgreSQL directes.

---

**Si le problème persiste**, vérifiez :
1. ✅ Le fichier `.env` existe bien dans `backend/`
2. ✅ Toutes les valeurs sont correctes (sans espaces)
3. ✅ Le mot de passe Supabase est correct
4. ✅ Le backend a été redémarré après modification du `.env`

