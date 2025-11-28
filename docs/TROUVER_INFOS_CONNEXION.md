# Comment Trouver les Informations de Connexion Supabase

Ce guide vous montre exactement où trouver chaque information nécessaire pour configurer votre projet.

## 🎯 Informations dont vous avez besoin

Pour configurer `backend/.env`, vous avez besoin de :
- ✅ **DB_HOST** : `db.xxxxx.supabase.co`
- ✅ **DB_PORT** : `5432` (toujours le même)
- ✅ **DB_NAME** : `postgres` (toujours le même)
- ✅ **DB_USER** : `postgres` (toujours le même)
- ✅ **DB_PASSWORD** : Le mot de passe que vous avez créé

## 📍 Où trouver ces informations

### Méthode 1 : Bouton "Connect" (Le plus simple)

1. Dans votre dashboard Supabase, en haut à droite, cliquez sur **"Connect"**
2. Une fenêtre modale s'ouvre avec plusieurs onglets
3. Cliquez sur l'onglet **"Parameters"** ou **"Connection string"**
4. Vous verrez toutes les informations :
   ```
   Host: db.xxxxx.supabase.co
   Port: 5432
   Database: postgres
   User: postgres
   Password: [masqué - utilisez celui que vous avez créé]
   ```

### Méthode 2 : Construire depuis l'URL du projet

1. Allez dans **Settings** → **API**
2. Notez votre **Project URL** : `https://qudbecjmgitlkjwucsrt.supabase.co`
3. Pour obtenir le **Host** :
   - Prenez l'identifiant de votre projet : `qudbecjmgitlkjwucsrt`
   - Ajoutez `db.` au début et `.supabase.co` à la fin
   - Résultat : `db.qudbecjmgitlkjwucsrt.supabase.co`

4. Les autres valeurs sont toujours les mêmes :
   - **Port** : `5432`
   - **Database** : `postgres`
   - **User** : `postgres`
   - **Password** : Le mot de passe que vous avez créé lors de la création du projet

### Méthode 3 : Via Settings → Database

1. Allez dans **Settings** → **Database**
2. Faites défiler jusqu'à trouver **"Connection string"** ou **"Connection info"**
3. Cliquez dessus pour voir les détails
4. Vous pouvez aussi voir la chaîne de connexion complète dans les onglets **"URI"**, **"JDBC"**, etc.

## 🔑 Le mot de passe

Le mot de passe n'est **jamais affiché** dans Supabase pour des raisons de sécurité.

**Si vous l'avez oublié** :
1. Allez dans **Settings** → **Database**
2. Cliquez sur **"Reset database password"**
3. Un nouveau mot de passe sera généré
4. **⚠️ Important** : Notez-le immédiatement, vous ne pourrez plus le voir après !

## 📝 Exemple concret

Si votre projet Supabase a :
- **Project URL** (dans Settings → API) : `https://qudbecjmgitlkjwucsrt.supabase.co`
- **Password** : `MonMotDePasse123!` (celui que vous avez créé)

Alors votre `backend/.env` sera :

```env
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=MonMotDePasse123!
```

## ✅ Vérification

Pour vérifier que vos informations sont correctes :

1. Testez la connexion avec le backend :
   ```bash
   cd backend
   npm run dev
   ```

2. Si vous voyez :
   ```
   ✅ Connexion à la base de données établie
   ```
   C'est que tout est correct ! 🎉

3. Si vous voyez une erreur :
   - Vérifiez que le Host est correct (commence par `db.` et se termine par `.supabase.co`)
   - Vérifiez que le mot de passe est correct (sensible à la casse)
   - Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs dans le `.env`

## 🆘 Aide supplémentaire

Si vous ne trouvez toujours pas les informations :
1. Cliquez sur **"Connect"** en haut à droite du dashboard
2. Ou consultez la documentation Supabase : [https://supabase.com/docs/guides/database/connecting-to-postgres](https://supabase.com/docs/guides/database/connecting-to-postgres)

