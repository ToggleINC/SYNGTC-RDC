# Configuration Supabase pour SYNGTC-RDC

## 📋 Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur **"New Project"**
4. Remplissez les informations :
   - **Name**: `syngtc-rdc`
   - **Database Password**: Choisissez un mot de passe fort (minimum 12 caractères)
   - **Region**: Choisissez la région la plus proche de la RDC (ex: `Europe West`)
5. Cliquez sur **"Create new project"**
6. Attendez 2-3 minutes que le projet soit créé

### 2. Obtenir les informations de connexion

Une fois le projet créé :

#### Informations de la base de données

1. Allez dans **Settings** → **Database**
2. Notez les informations suivantes :
   ```
   Host: db.xxxxx.supabase.co
   Database name: postgres
   Port: 5432
   User: postgres
   Password: [le mot de passe que vous avez créé]
   ```

#### Informations API

1. Allez dans **Settings** → **API**
2. Notez :
   ```
   Project URL: https://xxxxx.supabase.co
   anon public key: eyJhbGc...
   service_role key: eyJhbGc... (gardez-la secrète !)
   ```

### 3. Exécuter le schéma SQL

1. Dans Supabase, allez dans **SQL Editor** (icône SQL dans la barre latérale)
2. Cliquez sur **"New query"**
3. Ouvrez le fichier `database/schema.sql` de ce projet
4. Copiez tout le contenu
5. Collez-le dans l'éditeur SQL de Supabase
6. Cliquez sur **"Run"** (ou appuyez sur F5)
7. Vérifiez qu'il n'y a pas d'erreurs

### 4. Insérer les données initiales (optionnel)

1. Dans **SQL Editor**, créez une nouvelle requête
2. Ouvrez le fichier `database/seed.sql`
3. Copiez le contenu
4. Collez et exécutez

### 5. Configurer les variables d'environnement

**📖 Guide détaillé** : Consultez [`docs/GUIDE_CONFIGURATION_COMPLET.md`](GUIDE_CONFIGURATION_COMPLET.md) pour un guide pas à pas complet.

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Base de données Supabase
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_supabase

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi

# Serveur
PORT=5000
NODE_ENV=development

# CORS (pour le développement local)
FRONTEND_URL=http://localhost:3000
```

### 6. Tester la connexion

```bash
cd backend
npm run dev
```

Si tout fonctionne, vous devriez voir :
```
✅ Serveur démarré sur le port 5000
✅ Connexion à la base de données réussie
```

### 7. Activer les backups automatiques

1. Dans Supabase, allez dans **Settings** → **Database**
2. Activez **"Point-in-time Recovery"** (PITR)
3. Configurez les **backups automatiques** (quotidien recommandé)

### 8. Sécurité (Important)

1. **Row Level Security (RLS)** : 
   - Dans Supabase, allez dans **Authentication** → **Policies**
   - Configurez les politiques de sécurité selon vos besoins

2. **API Keys** :
   - Ne partagez JAMAIS la `service_role key`
   - Utilisez uniquement la `anon public key` côté frontend si nécessaire

3. **Network Restrictions** :
   - Dans **Settings** → **Database** → **Connection Pooling**
   - Configurez les restrictions IP si nécessaire

---

## 🔧 Migration depuis PostgreSQL local

Si vous avez déjà une base de données PostgreSQL locale :

1. Exportez votre base de données :
   ```bash
   pg_dump -h localhost -U postgres -d syngtc_rdc > backup.sql
   ```

2. Dans Supabase SQL Editor, exécutez le fichier `backup.sql`

---

## 📊 Monitoring

Supabase fournit un dashboard pour :
- **Database**: Statistiques, requêtes lentes, connexions
- **API**: Logs des requêtes, performance
- **Auth**: Utilisateurs, sessions

Accédez-y via le menu latéral dans Supabase.

---

## 🆘 Dépannage

### Erreur de connexion

- Vérifiez que le mot de passe est correct
- Vérifiez que l'IP n'est pas bloquée (Settings → Database → Network Restrictions)
- Vérifiez que le projet Supabase est actif

### Erreur SQL

- Vérifiez que le schéma a été exécuté correctement
- Vérifiez les logs dans Supabase SQL Editor
- Assurez-vous que toutes les extensions sont activées

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide PostgreSQL](https://supabase.com/docs/guides/database)
- [API Reference](https://supabase.com/docs/reference)

