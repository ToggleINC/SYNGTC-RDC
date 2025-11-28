# Configuration .env pour API REST Supabase

## 📋 Variables Requises

Ajoutez ces variables dans `backend/.env` :

```env
# ============================================
# SUPABASE API REST
# ============================================
SUPABASE_URL=https://qudbecjmgitlkjwucsrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

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

## 🔑 Où Trouver les Clés Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `syngtc-rdc`
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (Gardez-la secrète !)

## ⚠️ Important

- La `service_role key` a **accès complet** à votre base de données
- **Ne la partagez JAMAIS**
- **Ne la commitez JAMAIS** dans Git
- Utilisez-la **uniquement côté backend**

## ✅ Vérification

Après avoir ajouté les variables, redémarrez le backend :

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
✅ Connexion Supabase API REST réussie
🚀 Serveur SYNGTC-RDC démarré sur le port 5000
```

