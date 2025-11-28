# ✅ Migration vers API REST Supabase - TERMINÉE

## 🎉 Toutes les routes ont été adaptées !

### Routes Adaptées (100%)

1. ✅ **auth.ts** - Authentification complète
2. ✅ **middleware/auth.ts** - Middleware d'authentification
3. ✅ **users.ts** - Gestion des utilisateurs
4. ✅ **alerts.ts** - Gestion des alertes
5. ✅ **dashboard.ts** - Statistiques et graphiques
6. ✅ **cases.ts** - Gestion des cas
7. ✅ **locations.ts** - Cartographie et hotspots
8. ✅ **criminals.ts** - Gestion des criminels (CRUD complet)
9. ✅ **excelExport.ts** - Export Excel pour backups
10. ✅ **files.ts** - Upload de fichiers (pas de DB)
11. ✅ **backup.ts** - Gestion des backups (pas de DB)
12. ✅ **backupScheduler.ts** - Scheduler de backup
13. ✅ **server.ts** - Health check adapté

---

## 📋 Configuration Requise

### Variables d'environnement (`backend/.env`)

```env
# Supabase API REST
SUPABASE_URL=https://qudbecjmgitlkjwucsrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRES_IN=24h

# Serveur
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Où trouver les clés Supabase** :
- Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Sélectionnez votre projet
- **Settings** → **API**
- Copiez **Project URL** et **service_role key**

---

## 🔄 Changements Principaux

### Avant (PostgreSQL direct)
```typescript
const result = await pool.query(
  'SELECT * FROM criminals WHERE id = $1',
  [id]
);
const criminal = result.rows[0];
```

### Après (Supabase API REST)
```typescript
const { data: criminal, error } = await supabase
  .from('criminals')
  .select('*')
  .eq('id', id)
  .single();
```

---

## ⚠️ Points d'Attention

### 1. Champs JSON
Les champs JSON doivent être sérialisés/désérialisés manuellement :
```typescript
// Insertion
type_infraction: JSON.stringify(type_infraction)

// Récupération
type_infraction: safeJsonParse(criminal.type_infraction, [])
```

### 2. Dates
Utiliser `new Date().toISOString()` au lieu de `NOW()` :
```typescript
created_at: new Date().toISOString()
```

### 3. JOINs
Les JOINs se font via la syntaxe Supabase :
```typescript
.select(`
  *,
  users!criminals_created_by_fkey(nom, prenom)
`)
```

### 4. Recherche dans JSON
Pour rechercher dans les champs JSON :
```typescript
.contains('type_infraction', [value])
```

### 5. Pagination
Utiliser `.range()` au lieu de `LIMIT/OFFSET` :
```typescript
.range(offset, offset + limit - 1)
```

---

## 🧪 Tests à Effectuer

1. **Authentification**
   - [ ] Login
   - [ ] Register
   - [ ] Profil utilisateur

2. **Criminels**
   - [ ] Créer un criminel
   - [ ] Rechercher des criminels
   - [ ] Modifier un criminel
   - [ ] Supprimer un criminel
   - [ ] Voir les détails d'un criminel

3. **Cas**
   - [ ] Créer un cas
   - [ ] Lister les cas
   - [ ] Modifier un cas
   - [ ] Supprimer un cas

4. **Cartographie**
   - [ ] Voir la carte
   - [ ] Voir les hotspots
   - [ ] Statistiques par région

5. **Dashboard**
   - [ ] Statistiques globales
   - [ ] Graphiques temporels

6. **Backups**
   - [ ] Génération manuelle
   - [ ] Liste des backups
   - [ ] Téléchargement

---

## 🚀 Démarrage

```bash
cd backend
npm install
npm run dev
```

Vous devriez voir :
```
✅ Connexion Supabase API REST réussie
🚀 Serveur SYNGTC-RDC démarré sur le port 5000
```

---

## 📝 Notes Finales

- Toutes les routes utilisent maintenant l'API REST Supabase
- Le client `pg` n'est plus utilisé (peut être supprimé si souhaité)
- Les erreurs sont gérées avec les codes d'erreur Supabase
- La compatibilité avec l'ancien format JSON est maintenue via `safeJsonParse`

---

**Migration terminée le** : $(date)

