# Résolution Erreur Migration Supabase

## 🔍 Diagnostic

L'erreur `getaddrinfo ENOTFOUND db.qudbecjmgitlkjwucsrt.supabase.co` signifie que le DNS ne peut pas résoudre le nom d'hôte.

## ✅ Solution 1 : Vérifier que le Backend Fonctionne

**Le plus important** : Si votre backend démarre correctement avec `npm run dev`, cela signifie que Supabase fonctionne !

Testez :
```bash
cd backend
npm run dev
```

Si vous voyez :
```
✅ Connexion à la base de données établie
🚀 Serveur SYNGTC-RDC démarré sur le port 5000
```

**C'est que Supabase fonctionne !** ✅

Dans ce cas, vous pouvez :
- **Ignorer le script de migration** si vous n'avez pas de données à migrer
- Utiliser directement Supabase comme base de données principale

## 🔧 Solution 2 : Configurer la Base Locale pour Migration

Si vous voulez migrer vos données depuis pgAdmin4, ajoutez dans `backend/.env` :

```env
# Base de données locale (pour la migration)
LOCAL_DB_HOST=localhost
LOCAL_DB_PORT=5432
LOCAL_DB_NAME=postgres
LOCAL_DB_USER=espoir_bombeke
LOCAL_DB_PASSWORD=Lisu@2025
```

## 🆘 Solution 3 : Vérifier le Host Supabase

1. Allez dans Supabase → Cliquez sur **"Connect"** en haut à droite
2. Dans l'onglet **"Connection String"** → **"View parameters"**
3. **Copiez exactement** le host (ne le tapez pas)
4. Vérifiez qu'il n'y a pas d'espaces ou de caractères invisibles

Le host devrait être exactement : `db.qudbecjmgitlkjwucsrt.supabase.co`

## 🔍 Solution 4 : Vérifier la Connexion Internet

L'erreur peut aussi venir d'un problème de connexion internet ou de firewall.

Testez :
```bash
ping supabase.com
```

Si ça ne fonctionne pas, vérifiez :
- Votre connexion internet
- Votre firewall/antivirus
- Votre proxy (si vous en avez un)

## 💡 Recommandation

**Si le backend fonctionne déjà avec Supabase**, vous n'avez pas besoin du script de migration. Vous pouvez :

1. ✅ Utiliser Supabase directement (déjà configuré)
2. ✅ Exécuter le schéma SQL dans Supabase (si pas encore fait)
3. ✅ Tester le frontend
4. ✅ Déployer sur GitHub et Vercel

Le script de migration n'est utile que si vous avez des données existantes dans une base locale à migrer.

---

**Prochaine étape recommandée** : Vérifiez que le backend fonctionne avec `npm run dev`. Si oui, passez à l'exécution du schéma SQL dans Supabase.

