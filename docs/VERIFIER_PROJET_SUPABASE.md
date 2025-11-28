# Vérifier que le Projet Supabase est Actif

## 🔴 Problème : Erreur `getaddrinfo ENOTFOUND`

Cette erreur signifie que votre ordinateur ne peut pas résoudre le nom d'hôte Supabase. **La cause la plus fréquente** : le projet Supabase est en pause.

## ✅ Solution : Réactiver le Projet Supabase

### Étape 1 : Vérifier l'état du projet

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Connectez-vous à votre compte
3. Regardez votre projet `syngtc-rdc`

### Étape 2 : Si le projet est en pause

Vous verrez un message comme :
- **"Project paused"** ou **"Projet en pause"**
- Un bouton **"Restore"** ou **"Resume"** ou **"Réactiver"**

**Action** : Cliquez sur **"Restore"** ou **"Resume"**

### Étape 3 : Attendre le redémarrage

- Attendez 1-2 minutes que le projet redémarre
- Vous verrez un indicateur de chargement
- Une fois terminé, le projet sera actif

### Étape 4 : Vérifier la connexion

Une fois le projet réactivé :

1. Redémarrez votre backend :
   ```bash
   # Arrêtez le backend (Ctrl+C dans le terminal)
   # Puis relancez :
   cd backend
   npm run dev
   ```

2. Vous devriez voir :
   ```
   ✅ Connexion à la base de données établie
   🚀 Serveur SYNGTC-RDC démarré sur le port 5000
   ```

## 🔍 Autres Causes Possibles

### Problème IPv6

Si `nslookup` montre une adresse IPv6, le client PostgreSQL peut avoir des problèmes. **Solution** : Utilisez le **Connection Pooler** de Supabase (voir ci-dessous).

### Utiliser le Connection Pooler de Supabase

Le Connection Pooler est plus fiable et évite les problèmes IPv6 :

1. Dans Supabase → **"Connect"** → **"Connection String"**
2. Changez **"Method"** de **"Direct connection"** à **"Session Pooler"**
3. Copiez le nouveau **Host** (généralement `aws-0-*.pooler.supabase.com`)
4. Le **Port** sera généralement `6543` ou `5432`
5. Mettez à jour `backend/.env` avec ces valeurs

Si le projet est actif mais que l'erreur persiste :

### 1. Vérifier le Host

Dans Supabase → **"Connect"** → **"Connection String"** → **"View parameters"**

Copiez exactement le host et vérifiez qu'il correspond à celui dans `backend/.env` :
```env
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
```

### 2. Vérifier la Connexion Internet

```bash
ping supabase.com
```

Si ça ne fonctionne pas, vérifiez votre connexion internet.

### 3. Vérifier le Firewall

Votre firewall/antivirus peut bloquer la connexion. Essayez de :
- Désactiver temporairement le firewall
- Ajouter une exception pour Node.js

## 📝 Checklist

- [ ] Le projet Supabase est actif (pas en pause)
- [ ] Le host dans `.env` correspond exactement à celui de Supabase
- [ ] La connexion internet fonctionne
- [ ] Le backend a été redémarré après réactivation

---

**Note** : Les projets Supabase gratuits se mettent automatiquement en pause après 7 jours d'inactivité. Il suffit de cliquer sur "Restore" pour les réactiver.

