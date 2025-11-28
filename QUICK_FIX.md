# Solution Rapide - Erreurs 404 et 401

## 🔴 Erreur 404 : "Failed to load resource: the server responded with a status of 404"

**Cause :** Le backend n'est pas démarré ou le proxy ne fonctionne pas.

### Solution immédiate :

1. **Démarrer le backend :**
   ```cmd
   cd backend
   npm run dev
   ```
   ✅ Vous devez voir : `🚀 Serveur SYNGTC-RDC démarré sur le port 5000`

2. **Installer la dépendance proxy :**
   ```cmd
   cd frontend
   npm install http-proxy-middleware --save
   ```

3. **Redémarrer le frontend :**
   - Arrêtez le serveur (Ctrl+C)
   - Redémarrez : `npm start`

4. **Tester l'API directement :**
   - Ouvrez : `http://localhost:5000/health`
   - ✅ Doit afficher : `{"status":"OK","database":"connected"}`

---

## 🔴 Erreur 401 : "Failed to load resource: the server responded with a status of 401 (Unauthorized)"

**Cause :** Identifiants incorrects ou base de données non initialisée.

### Solution immédiate :

1. **Vérifier que la base de données contient des utilisateurs :**
   ```sql
   -- Dans pgAdmin ou psql
   SELECT email, nom, prenom FROM users;
   ```

2. **Si la table est vide, exécutez seed.sql :**
   ```sql
   -- Dans pgAdmin, ouvrez database/seed.sql et exécutez-le
   ```

3. **Utiliser les identifiants de test :**
   - **Email :** `admin@ministere.rdc`
   - **Mot de passe :** `password123`

4. **Ou créer un nouveau compte :**
   - Allez sur : `http://localhost:3000/register`
   - Créez un compte avec vos propres identifiants

---

## ✅ Checklist Complète

- [ ] Backend démarré sur le port 5000
- [ ] Base de données PostgreSQL accessible
- [ ] Table `users` contient au moins un utilisateur
- [ ] Frontend démarré sur le port 3000
- [ ] `http-proxy-middleware` installé
- [ ] Fichier `setupProxy.js` créé dans `frontend/src/`

---

## 🚀 Commandes Rapides

```cmd
REM Terminal 1 - Backend
cd backend
npm run dev

REM Terminal 2 - Frontend
cd frontend
npm install http-proxy-middleware --save
npm start
```

---

## 📝 Identifiants de Test

Après avoir exécuté `database/seed.sql` :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@ministere.rdc` | `password123` | Admin Ministère |
| `superviseur@pnc.rdc` | `password123` | Superviseur |
| `agent.kasavubu@pnc.rdc` | `password123` | Agent |
| `agent.kintambo@pnc.rdc` | `password123` | Agent |

---

Si le problème persiste, consultez `TROUBLESHOOTING.md` pour plus de détails.

