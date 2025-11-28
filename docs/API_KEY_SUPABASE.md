# API Key Supabase : Est-elle nécessaire ?

## 🔍 Question : L'API Key Supabase est-elle nécessaire ?

**Réponse courte** : **NON**, pour une connexion PostgreSQL directe.

## 📋 Explication

### Connexion PostgreSQL Directe (ce que nous utilisons)

Notre backend utilise le client PostgreSQL (`pg`) pour se connecter **directement** à la base de données Supabase. Pour cela, nous avons besoin de :

```env
DB_HOST=db.qudbecjmgitlkjwucsrt.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
```

**Nous n'avons PAS besoin de l'API Key** pour cette connexion.

### API REST de Supabase (non utilisé dans notre cas)

L'API Key Supabase (`anon public key` ou `service_role key`) est utilisée uniquement si vous appelez l'**API REST de Supabase** via HTTP, par exemple :

```javascript
// Exemple d'utilisation de l'API REST (nous ne l'utilisons pas)
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://xxxxx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // API Key
);
```

**Nous n'utilisons pas cette méthode** dans notre backend.

## ✅ Ce dont nous avons besoin

Pour que le backend se connecte à Supabase, il faut seulement :

1. ✅ **Fichier `backend/.env`** avec :
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`

2. ✅ **JWT_SECRET** (pour l'authentification de notre API)

3. ✅ **Projet Supabase actif** (pas en pause)

## 🔴 Si vous avez l'erreur `getaddrinfo ENOTFOUND`

Cette erreur n'est **PAS** causée par l'API Key manquante. C'est un problème de :

1. **Fichier `.env` manquant ou mal configuré**
   - Vérifiez que le fichier existe dans `backend/`
   - Vérifiez que toutes les valeurs sont correctes (sans espaces)

2. **Problème DNS/réseau**
   - Le DNS ne peut pas résoudre le nom d'hôte Supabase
   - Vérifiez votre connexion internet
   - Essayez de changer votre DNS (8.8.8.8 pour Google DNS)

3. **Projet Supabase en pause**
   - Les projets gratuits se mettent en pause après 7 jours d'inactivité
   - Allez dans Supabase → Cliquez sur "Restore"

## 📝 Quand utiliser l'API Key Supabase ?

Vous auriez besoin de l'API Key Supabase si :

- Vous utilisez l'API REST de Supabase (endpoints HTTP)
- Vous utilisez le SDK JavaScript de Supabase (`@supabase/supabase-js`)
- Vous voulez utiliser les fonctionnalités Supabase comme Auth, Storage, etc. via l'API REST

**Dans notre cas**, nous utilisons une connexion PostgreSQL directe, donc **l'API Key n'est pas nécessaire**.

## ✅ Vérification

Pour vérifier que votre configuration est correcte :

```bash
cd backend
npm run test-supabase
```

Si la connexion fonctionne, vous verrez :
```
✅ Connexion réussie !
```

Si ça ne fonctionne pas, vérifiez :
1. Le fichier `.env` existe et contient les bonnes valeurs
2. Le mot de passe Supabase est correct
3. Le projet Supabase est actif

---

**En résumé** : L'API Key Supabase n'est **PAS** nécessaire pour la connexion PostgreSQL directe. Si vous avez des erreurs de connexion, vérifiez plutôt le fichier `.env` et l'état du projet Supabase.

