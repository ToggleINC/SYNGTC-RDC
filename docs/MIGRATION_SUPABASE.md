# Migration des Données vers Supabase

Ce guide vous explique comment migrer vos données existantes de votre base PostgreSQL locale vers Supabase.

## 📋 Prérequis

- Base de données PostgreSQL locale avec des données
- Projet Supabase créé et configuré
- Schéma SQL exécuté dans Supabase (voir `docs/SUPABASE_SETUP.md`)
- Node.js installé

## 🚀 Méthode 1 : Script de Migration Automatique

### Étape 1 : Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` avec les informations de votre base locale :

```env
# Base de données locale (source)
LOCAL_DB_HOST=localhost
LOCAL_DB_PORT=5432
LOCAL_DB_NAME=syngtc_rdc
LOCAL_DB_USER=postgres
LOCAL_DB_PASSWORD=votre_mot_de_passe_local
```

### Étape 2 : Exécuter le script de migration

```bash
cd backend
npm run migrate-to-supabase
```

Le script va :
1. Vous demander les informations de connexion Supabase
2. Tester les connexions aux deux bases
3. Exporter toutes les données de la base locale
4. Importer les données dans Supabase (en évitant les doublons)

### Étape 3 : Suivre les instructions

Le script est interactif et vous guidera à travers :
- La saisie des informations Supabase
- La confirmation avant l'import
- L'affichage du progrès de la migration
- La vérification finale

## 🔧 Méthode 2 : Migration Manuelle avec pg_dump

### Étape 1 : Exporter les données

```bash
# Exporter uniquement les données (sans le schéma)
pg_dump -h localhost -U postgres -d syngtc_rdc \
  --data-only \
  --column-inserts \
  --file=backup_data.sql
```

### Étape 2 : Nettoyer le fichier SQL

Ouvrez `backup_data.sql` et :
1. Supprimez les commandes `SET` et `SELECT pg_catalog.setval`
2. Vérifiez que les `INSERT` sont corrects
3. Adaptez les références si nécessaire

### Étape 3 : Importer dans Supabase

1. Allez dans Supabase → **SQL Editor**
2. Créez une nouvelle requête
3. Copiez le contenu de `backup_data.sql`
4. Exécutez la requête

⚠️ **Attention** : Assurez-vous que le schéma existe déjà dans Supabase avant d'importer les données.

## 📊 Tables migrées

Le script migre automatiquement :
- ✅ `users` - Tous les utilisateurs
- ✅ `criminals` - Tous les criminels
- ✅ `cases` - Tous les cas
- ✅ `alerts` - Toutes les alertes
- ✅ `action_logs` - Tous les logs d'actions

## 🔍 Vérification Post-Migration

### Dans Supabase SQL Editor

```sql
-- Vérifier le nombre d'enregistrements
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'criminals', COUNT(*) FROM criminals
UNION ALL
SELECT 'cases', COUNT(*) FROM cases
UNION ALL
SELECT 'alerts', COUNT(*) FROM alerts
UNION ALL
SELECT 'action_logs', COUNT(*) FROM action_logs;
```

### Vérifier les relations

```sql
-- Vérifier que les cas sont liés aux criminels
SELECT c.numero_cas, cr.nom, cr.prenom
FROM cases c
LEFT JOIN criminals cr ON c.criminal_id = cr.id
LIMIT 10;
```

## ⚠️ Notes importantes

1. **Doublons** : Le script utilise `ON CONFLICT DO NOTHING` pour éviter les doublons basés sur les clés primaires.

2. **Ordre d'import** : Les tables sont importées dans l'ordre des dépendances :
   - `users` (première)
   - `criminals` (dépend de `users`)
   - `cases` (dépend de `criminals` et `users`)
   - `alerts` (dépend de `criminals` et `cases`)
   - `action_logs` (dépend de `users`)

3. **UUIDs** : Les UUIDs existants sont préservés pour maintenir les relations.

4. **Timestamps** : Les dates de création sont préservées.

## 🆘 Dépannage

### Erreur de connexion

- Vérifiez que votre base locale est accessible
- Vérifiez les informations Supabase (Host, Password)
- Pour Supabase, assurez-vous que SSL est activé

### Erreur de contrainte

- Vérifiez que le schéma SQL a été exécuté dans Supabase
- Vérifiez que les tables existent
- Vérifiez les relations entre les tables

### Données manquantes

- Vérifiez les logs du script
- Vérifiez que toutes les tables ont été exportées
- Vérifiez les contraintes de clés étrangères

## 📝 Exemple de sortie

```
🚀 Script de migration vers Supabase

==================================================

📋 Configuration Supabase

Host Supabase (ex: db.xxxxx.supabase.co): db.abc123.supabase.co
Port (défaut: 5432): 
Database (défaut: postgres): 
User (défaut: postgres): 
Password: ********

🔌 Test des connexions

✅ Connexion à Base locale réussie
✅ Connexion à Supabase réussie

⚠️  ATTENTION: Cette opération va importer les données dans Supabase.
   Les doublons seront ignorés (ON CONFLICT DO NOTHING).

Continuer ? (oui/non): oui

📤 Export des données depuis la base locale

--------------------------------------------------
  ✓ users: 5 enregistrements
  ✓ criminals: 12 enregistrements
  ✓ cases: 8 enregistrements
  ✓ alerts: 3 enregistrements
  ✓ action_logs: 45 enregistrements

📊 Résumé de l'export:
   - Users: 5
   - Criminals: 12
   - Cases: 8
   - Alerts: 3
   - Action Logs: 45

📥 Import des données dans Supabase

--------------------------------------------------
  ✓ users: 5/5 importés
  ✓ criminals: 12/12 importés
  ✓ cases: 8/8 importés
  ✓ alerts: 3/3 importés
  ✓ action_logs: 45/45 importés

✅ Migration terminée !

📊 Vérification dans Supabase:
   - Users: 5
   - Criminals: 12
   - Cases: 8

✨ Migration réussie !
```

## 🔄 Migration Incrémentale

Si vous avez déjà migré et que vous voulez ajouter de nouvelles données :

1. Le script détectera automatiquement les doublons
2. Seules les nouvelles données seront importées
3. Les données existantes ne seront pas modifiées

---

**Note** : Après la migration, mettez à jour les variables d'environnement du backend pour pointer vers Supabase au lieu de la base locale.

