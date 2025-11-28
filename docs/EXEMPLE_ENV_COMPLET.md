# Exemple Complet des Fichiers .env

Ce fichier montre exactement comment remplir vos fichiers `.env` avec les informations de votre projet Supabase.

## 📋 Informations de votre projet Supabase

D'après votre page "Connect to your project" :

- **Host** : `db.qudbecjmgitlkjwucsrt.supabase.co`
- **Port** : `5432`
- **Database** : `postgres`
- **User** : `postgres`
- **Password** : (celui que vous avez créé - non affiché pour sécurité)

---

## 📁 Fichier `backend/.env`

Créez ce fichier dans le dossier `backend/` :

```env
# ============================================
# CONFIGURATION BASE DE DONNÉES SUPABASE
# ============================================
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_supabase_ici

# ============================================
# JWT SECRET (Générez un secret fort)
# ============================================
# Exécutez dans le terminal : 
# cd backend && node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=remplacez_par_un_secret_genere

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

### ⚠️ Actions à faire :

1. **Remplacez `votre_mot_de_passe_supabase_ici`** par le mot de passe que vous avez créé lors de la création du projet Supabase
2. **Générez un JWT_SECRET** :
   ```bash
   cd backend
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copiez le résultat et remplacez `remplacez_par_un_secret_genere`

---

## 📁 Fichier `frontend/.env`

Créez ce fichier dans le dossier `frontend/` :

```env
# ============================================
# URL DE L'API BACKEND
# ============================================
REACT_APP_API_URL=http://localhost:5000

# ============================================
# URL DU SERVEUR SOCKET.IO
# ============================================
REACT_APP_SOCKET_URL=http://localhost:5000
```

**Note** : Ces valeurs sont pour le développement local. Après le déploiement sur Vercel, vous devrez les mettre à jour avec les URLs de production.

---

## ✅ Vérification

### 1. Vérifier que les fichiers existent

```bash
# Vérifier backend/.env
cat backend/.env

# Vérifier frontend/.env
cat frontend/.env
```

### 2. Tester la connexion Backend

```bash
cd backend
npm install
npm run dev
```

Vous devriez voir :
```
✅ Connexion à la base de données établie
🚀 Serveur SYNGTC-RDC démarré sur le port 5000
```

### 3. Tester le Frontend

```bash
cd frontend
npm install
npm start
```

Le navigateur devrait s'ouvrir sur `http://localhost:3000`

---

## 🔐 Sécurité

⚠️ **IMPORTANT** :
- Ne commitez JAMAIS les fichiers `.env` (ils sont déjà dans `.gitignore`)
- Ne partagez JAMAIS votre mot de passe Supabase
- Utilisez un JWT_SECRET fort et unique
- En production, utilisez les variables d'environnement de Vercel

---

## 🆘 Si vous avez oublié le mot de passe Supabase

1. Allez dans Supabase → **Settings** → **Database**
2. Cliquez sur **"Reset database password"**
3. Un nouveau mot de passe sera généré
4. **Notez-le immédiatement** et mettez-le à jour dans `backend/.env`
5. Redémarrez le backend

---

## 📝 Checklist

- [ ] Fichier `backend/.env` créé avec toutes les valeurs
- [ ] Mot de passe Supabase rempli
- [ ] JWT_SECRET généré et rempli
- [ ] Fichier `frontend/.env` créé
- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Connexion à la base de données réussie

---

**🎉 Une fois tout rempli, vous êtes prêt à utiliser votre application !**

