# Résolution Problème DNS Supabase

## 🔴 Erreur : `getaddrinfo ENOTFOUND db.qudbecjmgitlkjwucsrt.supabase.co`

Si votre projet Supabase est actif mais que vous avez toujours cette erreur, c'est probablement un problème DNS ou réseau.

## ✅ Solutions

### Solution 1 : Vérifier le Host Exact

1. Dans Supabase, cliquez sur **"Connect"** en haut à droite
2. Dans **"Connection String"** → **"View parameters"**
3. **Copiez exactement** le host (ne le tapez pas)
4. Vérifiez dans `backend/.env` que c'est exactement le même

### Solution 2 : Changer le DNS

Si votre DNS ne peut pas résoudre Supabase, changez temporairement votre DNS :

**Windows** :
1. Ouvrez **Paramètres réseau**
2. Allez dans **Propriétés** de votre connexion
3. Modifiez les paramètres DNS :
   - DNS préféré : `8.8.8.8` (Google DNS)
   - DNS alternatif : `8.8.4.4`
4. Redémarrez votre ordinateur ou reconnectez-vous au réseau

### Solution 3 : Utiliser l'IP au lieu du nom

Si le DNS ne fonctionne pas, vous pouvez utiliser l'IP directement (mais ce n'est pas recommandé car l'IP peut changer).

### Solution 4 : Vérifier le Firewall/Antivirus

Votre firewall ou antivirus peut bloquer la connexion :

1. Désactivez temporairement le firewall Windows
2. Ajoutez une exception pour Node.js dans votre antivirus
3. Testez à nouveau

### Solution 5 : Utiliser un VPN ou Proxy

Si vous êtes derrière un proxy d'entreprise, cela peut bloquer Supabase. Essayez :
- Désactiver le proxy temporairement
- Utiliser un VPN

### Solution 6 : Vérifier la Connexion Internet

Testez si vous pouvez accéder à Supabase via le navigateur :
- Allez sur [https://supabase.com](https://supabase.com)
- Si ça ne charge pas, c'est un problème de connexion internet

## 🔧 Test Rapide

Testez la résolution DNS :

```bash
nslookup db.qudbecjmgitlkjwucsrt.supabase.co
```

Si ça ne fonctionne pas, c'est un problème DNS.

## 💡 Solution Alternative : Utiliser la Base Locale Temporairement

Si Supabase ne fonctionne pas à cause d'un problème réseau, vous pouvez temporairement utiliser votre base locale :

Dans `backend/.env`, changez :
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=espoir_bombeke
DB_PASSWORD=Lisu@2025
```

Puis redémarrez le backend. Une fois que le problème réseau est résolu, remettez les valeurs Supabase.

---

**Note** : Si le problème persiste, cela peut être dû à des restrictions réseau (entreprise, pays, etc.). Dans ce cas, contactez votre administrateur réseau.

