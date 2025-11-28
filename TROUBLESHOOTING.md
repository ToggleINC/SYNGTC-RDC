# Guide de Dépannage - SYNGTC-RDC

## Erreur 404 (Not Found) sur /api/auth/login

### Causes possibles

1. **Le backend n'est pas démarré**
   - Vérifiez que le serveur backend tourne sur le port 5000
   - Ouvrez un terminal et exécutez : `cd backend && npm run dev`

2. **Le proxy ne fonctionne pas**
   - Le fichier `setupProxy.js` a été créé pour gérer le proxy
   - Redémarrez le serveur frontend après l'installation de `http-proxy-middleware`

### Solution

1. **Installer la dépendance manquante :**
   ```cmd
   cd frontend
   npm install http-proxy-middleware --save
   ```

2. **Vérifier que le backend est démarré :**
   ```cmd
   cd backend
   npm run dev
   ```
   Vous devriez voir : `🚀 Serveur SYNGTC-RDC démarré sur le port 5000`

3. **Redémarrer le frontend :**
   - Arrêtez le serveur frontend (Ctrl+C)
   - Redémarrez : `npm start`

4. **Vérifier la connexion :**
   - Ouvrez votre navigateur sur `http://localhost:5000/health`
   - Vous devriez voir : `{"status":"OK","database":"connected",...}`

## Erreur 401 (Unauthorized)

### Causes possibles

1. **Identifiants incorrects**
   - Vérifiez que vous utilisez les bons identifiants
   - Voir `IDENTIFIANTS_TEST.md` pour les comptes de test

2. **Base de données non initialisée**
   - Les utilisateurs de test n'existent pas encore
   - Exécutez `database/seed.sql` dans PostgreSQL

3. **Problème de hashage des mots de passe**
   - Les mots de passe dans seed.sql sont hashés avec bcrypt
   - Le mot de passe en clair est `password123`

### Solution

1. **Vérifier que la base de données est créée :**
   ```sql
   -- Dans pgAdmin ou psql
   SELECT * FROM users;
   ```
   Si la table est vide, exécutez `database/seed.sql`

2. **Vérifier les identifiants :**
   - Email : `admin@ministere.rdc`
   - Mot de passe : `password123`

3. **Créer un nouveau compte :**
   - Utilisez la page d'inscription (`/register`)
   - Créez un compte avec vos propres identifiants

## Vérification Complète

### Étape 1 : Backend
```cmd
cd backend
npm run dev
```
✅ Doit afficher : `🚀 Serveur SYNGTC-RDC démarré sur le port 5000`

### Étape 2 : Base de données
```sql
-- Dans pgAdmin
SELECT COUNT(*) FROM users;
```
✅ Doit retourner au moins 4 utilisateurs (si seed.sql a été exécuté)

### Étape 3 : Test de l'API
Ouvrez dans le navigateur : `http://localhost:5000/health`
✅ Doit retourner : `{"status":"OK","database":"connected"}`

### Étape 4 : Frontend
```cmd
cd frontend
npm start
```
✅ Doit démarrer sur `http://localhost:3000`

### Étape 5 : Test de connexion
1. Allez sur `http://localhost:3000/login`
2. Utilisez : `admin@ministere.rdc` / `password123`
3. ✅ Doit vous connecter et rediriger vers le dashboard

## Erreurs Courantes

### "Cannot find module 'http-proxy-middleware'"
```cmd
cd frontend
npm install http-proxy-middleware --save
```

### "Port 5000 already in use"
- Arrêtez l'autre processus utilisant le port 5000
- Ou changez le port dans `backend/.env` : `PORT=5001`

### "Database connection error"
- Vérifiez que PostgreSQL est démarré
- Vérifiez les identifiants dans `backend/.env`
- Testez la connexion : `psql -U postgres -d syngtc_rdc`

### "CORS error"
- Le backend doit avoir CORS configuré pour `http://localhost:3000`
- Vérifiez `backend/src/server.ts` ligne 37-40

## Support

Si le problème persiste :
1. Vérifiez les logs du backend dans le terminal
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que tous les services sont démarrés
4. Consultez les fichiers de log

