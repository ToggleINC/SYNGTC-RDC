# Utiliser le Connection Pooler de Supabase

## 🎯 Pourquoi utiliser le Pooler ?

Le Connection Pooler de Supabase :
- ✅ Évite les problèmes IPv6
- ✅ Plus fiable pour les connexions
- ✅ Meilleure gestion des connexions simultanées
- ✅ Recommandé pour la production

## 📋 Étapes pour Configurer le Pooler

### Étape 1 : Obtenir les Informations du Pooler

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet `syngtc-rdc`
3. Cliquez sur **"Connect"** en haut à droite
4. Dans **"Connection String"**, vous verrez plusieurs options :
   - **Direct connection** (ce que vous utilisez actuellement)
   - **Session Pooler** (recommandé pour la plupart des cas)
   - **Transaction Pooler** (pour les transactions courtes)

### Étape 2 : Choisir le Type de Pooler

**Session Pooler** (recommandé) :
- Port : `6543`
- Utilisez ceci pour la plupart des applications
- Meilleur pour les connexions longues

**Transaction Pooler** :
- Port : `5432`
- Utilisez ceci pour les transactions courtes
- Plus rapide pour les requêtes simples

### Étape 3 : Copier les Informations

1. Sélectionnez **"Session Pooler"** (ou "Transaction Pooler")
2. Cliquez sur **"View parameters"**
3. Notez :
   - **Host** : `aws-0-xxxxx.pooler.supabase.com` (ou similaire)
   - **Port** : `6543` (Session) ou `5432` (Transaction)
   - **Database** : `postgres`
   - **User** : `postgres`
   - **Password** : (celui que vous avez créé)

### Étape 4 : Mettre à Jour le Fichier .env

Ouvrez `backend/.env` et remplacez :

```env
# AVANT (Direct connection)
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
DB_PORT=5432

# APRÈS (Session Pooler)
DB_HOST=aws-0-xxxxx.pooler.supabase.com
DB_PORT=6543
```

**Important** : Gardez les autres valeurs identiques :
- `DB_NAME=postgres`
- `DB_USER=postgres`
- `DB_PASSWORD=Lisu@2025`

### Étape 5 : Redémarrer le Backend

```bash
# Arrêtez le backend (Ctrl+C)
# Puis relancez :
cd backend
npm run dev
```

Vous devriez voir :
```
✅ Connexion à la base de données établie
🚀 Serveur SYNGTC-RDC démarré sur le port 5000
```

### Étape 6 : Tester la Connexion

```bash
cd backend
npm run test-supabase
```

Si ça fonctionne, vous verrez :
```
✅ Connexion réussie !
```

## 🔍 Exemple Complet

**Dans Supabase** :
- Host Pooler : `aws-0-eu-central-1.pooler.supabase.com`
- Port : `6543`
- Database : `postgres`
- User : `postgres`
- Password : `Lisu@2025`

**Dans `backend/.env`** :
```env
DB_HOST=aws-0-eu-central-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Lisu@2025
```

## ⚠️ Notes Importantes

1. **Le host du Pooler est différent** du host de la connexion directe
2. **Le port peut être différent** (`6543` pour Session Pooler)
3. **Le mot de passe reste le même**
4. **SSL est toujours nécessaire** (déjà configuré dans le code)

## 🆘 Si ça ne fonctionne toujours pas

1. Vérifiez que vous avez copié le bon host (sans espaces)
2. Vérifiez que le port est correct (`6543` pour Session, `5432` pour Transaction)
3. Testez avec `npm run test-supabase`
4. Vérifiez les logs du backend pour plus de détails

---

**Le Connection Pooler est généralement la meilleure solution pour éviter les problèmes DNS/IPv6 !**

