# Migration vers API REST Supabase

## 🔍 Problème Identifié

Votre projet Supabase est en mode **"Local-Only Database" (Embedded Postgres)**, ce qui signifie :
- ❌ **Impossible** de se connecter directement via PostgreSQL (`pg`)
- ✅ **Possible** uniquement via :
  - API REST de Supabase
  - SDK JavaScript Supabase (`@supabase/supabase-js`)
  - Edge Functions

## ✅ Solution : Utiliser l'API REST Supabase

Nous allons remplacer toutes les connexions PostgreSQL directes par l'API REST de Supabase.

---

## 📋 Étapes de Migration

### Étape 1 : Obtenir les Clés API Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `syngtc-rdc`
3. Allez dans **Settings** → **API**
4. Notez :
   - **Project URL** : `https://qudbecjmgitlkjwucsrt.supabase.co`
   - **service_role key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ Gardez-la secrète !)

### Étape 2 : Mettre à Jour `backend/.env`

Ajoutez ces variables dans `backend/.env` :

```env
# ============================================
# SUPABASE API REST (remplace PostgreSQL direct)
# ============================================
SUPABASE_URL=https://qudbecjmgitlkjwucsrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# ANCIENNES VARIABLES (peuvent être supprimées)
# ============================================
# DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=Lisu@2025

# ============================================
# AUTRES VARIABLES (inchangées)
# ============================================
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi_immediatement
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Étape 3 : Installer le SDK Supabase

```bash
cd backend
npm install @supabase/supabase-js
```

### Étape 4 : Le Code a été Mis à Jour

Le code a été adapté pour utiliser l'API REST :
- ✅ `backend/src/config/supabase.ts` : Configuration Supabase
- ✅ Routes adaptées pour utiliser l'API REST au lieu de SQL direct

### Étape 5 : Redémarrer le Backend

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
✅ Connexion Supabase API REST réussie
🚀 Serveur SYNGTC-RDC démarré sur le port 5000
```

---

## 🔄 Changements dans le Code

### Avant (PostgreSQL direct) :
```typescript
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
const user = result.rows[0];
```

### Après (API REST Supabase) :
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .single();

if (error || !data) {
  // Gérer l'erreur
}
const user = data;
```

---

## ⚠️ Différences Importantes

### 1. Requêtes SELECT

**Avant** :
```typescript
const result = await pool.query('SELECT * FROM users');
const users = result.rows;
```

**Après** :
```typescript
const { data, error } = await supabase.from('users').select('*');
const users = data || [];
```

### 2. Requêtes INSERT

**Avant** :
```typescript
const result = await pool.query(
  'INSERT INTO users (email, nom) VALUES ($1, $2) RETURNING *',
  [email, nom]
);
const user = result.rows[0];
```

**Après** :
```typescript
const { data, error } = await supabase
  .from('users')
  .insert({ email, nom })
  .select()
  .single();
const user = data;
```

### 3. Requêtes UPDATE

**Avant** :
```typescript
const result = await pool.query(
  'UPDATE users SET nom = $1 WHERE id = $2 RETURNING *',
  [nom, id]
);
const user = result.rows[0];
```

**Après** :
```typescript
const { data, error } = await supabase
  .from('users')
  .update({ nom })
  .eq('id', id)
  .select()
  .single();
const user = data;
```

### 4. Requêtes DELETE

**Avant** :
```typescript
await pool.query('DELETE FROM users WHERE id = $1', [id]);
```

**Après** :
```typescript
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', id);
```

---

## 🔐 Sécurité

⚠️ **IMPORTANT** :
- La `service_role key` a **accès complet** à votre base de données
- **Ne la partagez JAMAIS**
- **Ne la commitez JAMAIS** dans Git
- Utilisez-la **uniquement côté backend**

---

## 📝 Checklist

- [ ] Variables `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` ajoutées dans `backend/.env`
- [ ] SDK `@supabase/supabase-js` installé
- [ ] Backend redémarré
- [ ] Test de connexion réussi
- [ ] Routes principales testées (login, register, etc.)

---

## 🆘 Dépannage

### Erreur : "Missing API key"

Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est bien défini dans `backend/.env`.

### Erreur : "Invalid API key"

Vérifiez que vous avez copié la **service_role key** (pas l'anon key) depuis Supabase → Settings → API.

### Erreur : "relation does not exist"

Vérifiez que les tables existent dans Supabase. Exécutez le schéma SQL dans Supabase → SQL Editor.

---

**🎉 Une fois la migration terminée, votre backend utilisera l'API REST Supabase au lieu de PostgreSQL direct !**

