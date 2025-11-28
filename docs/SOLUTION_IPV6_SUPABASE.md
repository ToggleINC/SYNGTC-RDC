# Solution Problème IPv6 avec Supabase

## 🔍 Diagnostic

Le `nslookup` montre que Supabase résout vers une adresse **IPv6** :
```
Address:  2a05:d018:135e:1632:a0db:3cf1:3515:aaf
```

Le client PostgreSQL de Node.js peut avoir des problèmes avec IPv6 sur certains systèmes Windows.

## ✅ Solutions

### Solution 1 : Forcer IPv4 (Recommandé)

Modifiez `backend/src/config/database.ts` pour forcer IPv4 :

```typescript
export const pool = new Pool({
  // ... autres paramètres
  ...(isSupabase ? {
    ssl: {
      rejectUnauthorized: false,
    },
    family: 4, // Forcer IPv4
  } : {}),
});
```

**Note** : Cette option peut ne pas être disponible dans toutes les versions de `pg`. Si ça ne fonctionne pas, passez à la solution 2.

### Solution 2 : Utiliser le Connection Pooler de Supabase

Supabase offre un "Connection Pooler" qui utilise un port différent et peut mieux fonctionner avec IPv4.

1. Dans Supabase → **"Connect"** → **"Connection String"**
2. Changez **"Method"** de **"Direct connection"** à **"Session Pooler"** ou **"Transaction Pooler"**
3. Notez le nouveau **Host** (généralement différent, comme `aws-0-*.pooler.supabase.com`)
4. Notez le nouveau **Port** (généralement `6543` ou `5432`)
5. Mettez à jour `backend/.env` avec ces nouvelles valeurs

### Solution 3 : Vérifier la Configuration Réseau Windows

1. Ouvrez **Paramètres** → **Réseau et Internet**
2. Allez dans **Propriétés** de votre connexion
3. Désactivez temporairement **IPv6** (si vous n'en avez pas besoin)
4. Redémarrez votre ordinateur
5. Testez à nouveau

### Solution 4 : Utiliser un VPN

Si vous êtes dans un réseau qui bloque IPv6 ou Supabase, essayez :
- Utiliser un VPN
- Changer de réseau (ex: hotspot mobile)

## 🔧 Test Rapide

Testez la connexion avec le script :

```bash
cd backend
npm run test-supabase
```

Cela vous donnera plus de détails sur l'erreur exacte.

## 💡 Solution Alternative : Utiliser la Base Locale Temporairement

Si Supabase ne fonctionne toujours pas à cause d'un problème réseau, vous pouvez temporairement utiliser votre base locale :

Dans `backend/.env` :
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=espoir_bombeke
DB_PASSWORD=Lisu@2025
```

Puis redémarrez le backend. Une fois le problème réseau résolu, remettez les valeurs Supabase.

---

**Note** : Le Connection Pooler de Supabase est généralement plus fiable et recommandé pour les applications en production.

