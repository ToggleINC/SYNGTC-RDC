# Variables d'Environnement - SYNGTC-RDC

## 📋 Backend (.env)

Créez un fichier `.env` dans le dossier `backend/` avec les variables suivantes :

```env
# Configuration Base de données Supabase
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_supabase

# JWT Secret (changez-le par un secret fort et unique)
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi_immediatement

# Configuration Serveur
PORT=5000
NODE_ENV=development

# URL Frontend (pour CORS)
FRONTEND_URL=http://localhost:3000
```

### Pour la production

```env
NODE_ENV=production
FRONTEND_URL=https://votre-frontend.vercel.app
```

---

## 📋 Frontend (.env)

Créez un fichier `.env` dans le dossier `frontend/` avec les variables suivantes :

```env
# URL de l'API Backend
REACT_APP_API_URL=http://localhost:5000

# URL du serveur Socket.io (pour les alertes en temps réel)
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Pour la production

```env
REACT_APP_API_URL=https://votre-backend.vercel.app
REACT_APP_SOCKET_URL=https://votre-backend.vercel.app
```

---

## 🔐 Sécurité

⚠️ **IMPORTANT** :
- Ne commitez JAMAIS les fichiers `.env`
- Utilisez des secrets forts pour `JWT_SECRET` (minimum 32 caractères)
- Changez tous les mots de passe par défaut
- Utilisez des variables d'environnement dans Vercel/Railway pour la production

---

## 📝 Où obtenir les valeurs

### Supabase

1. Allez dans **Settings** → **Database**
2. Copiez les informations de connexion (Host, Port, Database, User, Password)

### JWT Secret

Générez un secret fort avec :

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ou en ligne
# https://randomkeygen.com/
```

---

## 🚀 Variables dans Vercel

Dans les paramètres du projet Vercel :

1. **Settings** → **Environment Variables**
2. Ajoutez toutes les variables nécessaires
3. Sélectionnez les environnements (Production, Preview, Development)

---

## 🚀 Variables dans Vercel (Backend)

Dans les paramètres du projet backend Vercel :

1. **Settings** → **Environment Variables**
2. Ajoutez toutes les variables nécessaires
3. Sélectionnez les environnements (Production, Preview, Development)
4. Les variables sont automatiquement disponibles dans l'environnement

