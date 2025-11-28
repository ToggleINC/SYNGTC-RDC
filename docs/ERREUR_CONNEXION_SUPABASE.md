# Résolution Erreur Connexion Supabase

## 🔴 Erreur : `getaddrinfo ENOTFOUND db.qudbecjmgitlkjwucsrt.supabase.co`

Cette erreur signifie que votre ordinateur ne peut pas résoudre le nom d'hôte Supabase.

## 🔍 Causes Possibles

1. **Problème de connexion internet**
2. **Le projet Supabase est en pause** (projets gratuits se mettent en pause après inactivité)
3. **Problème DNS**
4. **Firewall/Antivirus bloque la connexion**
5. **Le host est incorrect**

## ✅ Solutions

### Solution 1 : Vérifier que le projet Supabase est actif

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Vérifiez que votre projet `syngtc-rdc` est **actif** (pas en pause)
3. Si le projet est en pause, cliquez sur **"Restore"** ou **"Resume"**

### Solution 2 : Vérifier le Host dans Supabase

1. Dans Supabase, cliquez sur **"Connect"** en haut à droite
2. Dans **"Connection String"** → **"View parameters"**
3. **Copiez exactement** le host (ne le tapez pas manuellement)
4. Vérifiez qu'il n'y a pas d'espaces avant/après

### Solution 3 : Vérifier le fichier .env

Ouvrez `backend/.env` et vérifiez :

```env
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Lisu@2025
```

**Important** :
- Pas d'espaces avant/après les valeurs
- Pas de guillemets
- Le host doit être exactement comme dans Supabase

### Solution 4 : Tester la connexion internet

```bash
ping supabase.com
```

Si ça ne fonctionne pas, vérifiez :
- Votre connexion internet
- Votre firewall/antivirus
- Votre proxy (si vous en avez un)

### Solution 5 : Vérifier le DNS

Essayez de résoudre le nom d'hôte :

```bash
nslookup db.qudbecjmgitlkjwucsrt.supabase.co
```

Si ça ne fonctionne pas, essayez de changer votre DNS (par exemple, utilisez Google DNS : 8.8.8.8)

### Solution 6 : Redémarrer le backend

Après avoir modifié le `.env`, redémarrez le backend :

```bash
# Arrêtez le backend (Ctrl+C)
# Puis relancez :
cd backend
npm run dev
```

## 🔧 Configuration Alternative

Si le problème persiste, essayez d'utiliser l'URL de connexion complète dans Supabase :

1. Dans Supabase → **"Connect"** → **"Connection String"**
2. Copiez l'URI complète (format : `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
3. Utilisez cette URI dans votre code (nécessite une modification du code)

## ⚠️ Important

**Si votre projet Supabase est en pause**, vous devez le réactiver avant de pouvoir vous connecter.

Pour vérifier :
1. Allez sur le dashboard Supabase
2. Si vous voyez un message "Project paused", cliquez sur **"Restore"**

## 📝 Checklist de Vérification

- [ ] Le projet Supabase est actif (pas en pause)
- [ ] Le host dans `.env` correspond exactement à celui de Supabase
- [ ] Pas d'espaces dans le `.env`
- [ ] Le mot de passe est correct
- [ ] La connexion internet fonctionne
- [ ] Le backend a été redémarré après modification du `.env`

---

**Si le problème persiste**, vérifiez les logs du backend pour plus de détails sur l'erreur.

