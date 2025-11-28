# Résumé Migration vers API REST Supabase

## ✅ Ce qui a été fait

### 1. Installation et Configuration
- ✅ SDK Supabase installé (`@supabase/supabase-js`)
- ✅ Fichier `backend/src/config/supabase.ts` créé
- ✅ Configuration Supabase avec service_role key

### 2. Routes Adaptées
- ✅ `backend/src/routes/auth.ts` - Complètement adapté
- ✅ `backend/src/middleware/auth.ts` - Adapté
- ✅ `backend/src/server.ts` - Health check adapté

### 3. Documentation
- ✅ `docs/MIGRATION_API_REST_SUPABASE.md` - Guide complet
- ✅ `docs/CONFIGURATION_ENV_SUPABASE_API.md` - Configuration .env

---

## ⚠️ Routes Restantes à Adapter

Les routes suivantes utilisent encore `pool` (PostgreSQL direct) et doivent être adaptées :

1. **`backend/src/routes/criminals.ts`** - CRUD des criminels
2. **`backend/src/routes/cases.ts`** - CRUD des cas
3. **`backend/src/routes/users.ts`** - Gestion des utilisateurs
4. **`backend/src/routes/locations.ts`** - Cartographie
5. **`backend/src/routes/dashboard.ts`** - Statistiques
6. **`backend/src/routes/alerts.ts`** - Alertes
7. **`backend/src/routes/files.ts`** - Upload de fichiers
8. **`backend/src/routes/backup.ts`** - Backups
9. **`backend/src/services/backupScheduler.ts`** - Scheduler de backup
10. **`backend/src/services/excelExport.ts`** - Export Excel

---

## 📋 Prochaines Étapes

### Étape 1 : Configurer le .env

Ajoutez dans `backend/.env` :

```env
SUPABASE_URL=https://qudbecjmgitlkjwucsrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Où trouver** : Supabase → Settings → API

### Étape 2 : Tester la Connexion

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
✅ Connexion Supabase API REST réussie
🚀 Serveur SYNGTC-RDC démarré sur le port 5000
```

### Étape 3 : Adapter les Routes Restantes

Chaque route doit être adaptée pour remplacer :
- `pool.query()` → `supabase.from().select()`
- Requêtes SQL → Méthodes Supabase (`.select()`, `.insert()`, `.update()`, `.delete()`)

---

## 🔄 Exemple de Migration

### Avant (PostgreSQL) :
```typescript
const result = await pool.query(
  'SELECT * FROM criminals WHERE id = $1',
  [id]
);
const criminal = result.rows[0];
```

### Après (Supabase API REST) :
```typescript
const { data: criminal, error } = await supabase
  .from('criminals')
  .select('*')
  .eq('id', id)
  .single();
```

---

## ⚠️ Points Importants

1. **Gestion des erreurs** : Toujours vérifier `error` dans les réponses Supabase
2. **Single vs Multiple** : Utiliser `.single()` pour un seul résultat, sinon retourne un array
3. **JSON Fields** : Les champs JSON doivent être sérialisés/désérialisés manuellement
4. **Dates** : Utiliser `new Date().toISOString()` au lieu de `NOW()`

---

## 🆘 Si vous avez des erreurs

1. Vérifiez que `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont corrects
2. Vérifiez que les tables existent dans Supabase
3. Vérifiez les logs du backend pour plus de détails

---

**Note** : Les routes principales (auth) fonctionnent déjà. Les autres routes peuvent être adaptées progressivement.

