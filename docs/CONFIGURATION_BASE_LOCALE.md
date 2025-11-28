# Configuration Base Locale pour Migration

Si vous avez une base de données locale dans pgAdmin4 et que vous voulez migrer vos données vers Supabase, voici comment configurer.

## 📋 Informations de votre Base Locale

D'après vos informations :
- **Host** : `localhost` (ou l'adresse IP de votre serveur PostgreSQL)
- **Port** : `5432`
- **Database** : `postgres`
- **User** : `espoir_bombeke`
- **Password** : `Lisu@2025`

## 🔧 Configuration

### 1. Ajouter dans `backend/.env`

Ajoutez ces lignes dans votre fichier `backend/.env` :

```env
# Base de données locale (pour la migration)
LOCAL_DB_HOST=localhost
LOCAL_DB_PORT=5432
LOCAL_DB_NAME=postgres
LOCAL_DB_USER=espoir_bombeke
LOCAL_DB_PASSWORD=Lisu@2025
```

### 2. Vérifier que PostgreSQL est accessible

Assurez-vous que votre serveur PostgreSQL est en cours d'exécution et accessible sur `localhost:5432`.

### 3. Exécuter le script de migration

```bash
cd backend
npm run migrate-to-supabase
```

Le script va :
1. Se connecter à votre base locale (pgAdmin4)
2. Exporter toutes les données
3. Se connecter à Supabase
4. Importer les données dans Supabase

## ⚠️ Important

**Si vous n'avez pas de données à migrer**, vous pouvez ignorer cette étape et utiliser directement Supabase comme base de données principale.

Votre `backend/.env` doit déjà contenir les informations Supabase :
```env
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Lisu@2025
```

Si le backend démarre correctement avec `npm run dev`, c'est que Supabase fonctionne ! ✅

