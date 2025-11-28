# Test de Connexion Supabase

Si vous avez des erreurs de connexion à Supabase, voici comment tester et résoudre le problème.

## 🔍 Test Rapide de Connexion

### Méthode 1 : Via le Backend

Le backend utilise déjà Supabase. Si le backend démarre sans erreur, la connexion fonctionne !

```bash
cd backend
npm run dev
```

Si vous voyez :
```
✅ Connexion à la base de données établie
🚀 Serveur SYNGTC-RDC démarré sur le port 5000
```

C'est que la connexion Supabase fonctionne ! ✅

### Méthode 2 : Test Direct avec Node.js

```bash
cd backend
node -e "const { Pool } = require('pg'); const pool = new Pool({ host: 'db.qudbecjmgitlkjwucsrt.supabase.co', port: 5432, database: 'postgres', user: 'postgres', password: 'Lisu@2025', ssl: { rejectUnauthorized: false } }); pool.query('SELECT 1').then(() => { console.log('✅ Connexion réussie'); process.exit(0); }).catch(err => { console.error('❌ Erreur:', err.message); process.exit(1); });"
```

## 🆘 Problèmes Courants

### Erreur : "getaddrinfo ENOTFOUND"

**Causes possibles** :
1. Le host est incorrect
2. Problème de connexion internet
3. Le projet Supabase est en pause
4. DNS ne peut pas résoudre le nom

**Solutions** :

1. **Vérifier le host dans Supabase** :
   - Allez dans Supabase → **Settings** → **Database**
   - Ou cliquez sur **"Connect"** en haut à droite
   - Vérifiez que le host est exactement : `db.qudbecjmgitlkjwucsrt.supabase.co`
   - Copiez-le directement depuis Supabase (ne le tapez pas manuellement)

2. **Vérifier que le projet est actif** :
   - Dans Supabase, vérifiez que le projet n'est pas en pause
   - Si c'est un projet gratuit, il peut se mettre en pause après inactivité

3. **Tester la connexion internet** :
   ```bash
   ping db.qudbecjmgitlkjwucsrt.supabase.co
   ```

4. **Vérifier le fichier .env** :
   - Assurez-vous que `DB_HOST` dans `backend/.env` est exactement :
     ```
     DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
     ```
   - Pas d'espaces avant/après
   - Pas de guillemets

### Erreur : "password authentication failed"

**Solution** :
- Vérifiez que le mot de passe dans `backend/.env` correspond exactement à celui de Supabase
- Le mot de passe est sensible à la casse
- Si vous avez oublié le mot de passe, réinitialisez-le dans Supabase → Settings → Database

## ✅ Si le Backend Fonctionne

Si votre backend démarre correctement avec `npm run dev`, cela signifie que :
- ✅ La connexion Supabase fonctionne
- ✅ Les variables d'environnement sont correctes
- ✅ Vous pouvez ignorer le script de migration si vous n'avez pas de données à migrer

## 📝 Configuration Base Locale (pour Migration)

Si vous voulez migrer vos données depuis pgAdmin4, ajoutez dans `backend/.env` :

```env
# Base de données locale (pour la migration)
LOCAL_DB_HOST=localhost
LOCAL_DB_PORT=5432
LOCAL_DB_NAME=postgres
LOCAL_DB_USER=espoir_bombeke
LOCAL_DB_PASSWORD=Lisu@2025
```

Puis relancez le script de migration.

---

**Note** : Si le backend fonctionne, vous n'avez pas besoin de migrer. Vous pouvez directement utiliser Supabase comme base de données principale.

