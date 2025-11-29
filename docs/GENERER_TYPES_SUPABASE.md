# Générer les Types Supabase

## Pourquoi générer les types ?

Les types Supabase permettent d'avoir :
- ✅ Autocomplétion dans votre IDE
- ✅ Vérification de types à la compilation
- ✅ Plus d'erreurs `Type 'string' is not assignable to type 'number | StringValue'`
- ✅ Types corrects pour `uuid`, `timestamp`, `jsonb`, etc.

## Méthode 1 : Via Supabase CLI (Recommandé)

### Étape 1 : Installer Supabase CLI

```bash
npm install -g supabase
```

### Étape 2 : Trouver votre Project ID

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. L'**Project ID** se trouve dans l'URL ou dans les paramètres
   - Exemple d'URL : `https://supabase.com/dashboard/project/abcdefghijklmnop`
   - Le Project ID est : `abcdefghijklmnop`

### Étape 3 : Générer les types

Depuis le dossier `backend/` :

```bash
cd backend
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

**Remplacez `YOUR_PROJECT_ID` par votre vrai Project ID.**

### Exemple complet

```bash
cd backend
npx supabase gen types typescript --project-id qudbecjmgitlkjwucsrt > src/types/supabase.ts
```

## Méthode 2 : Via l'API Supabase (Alternative)

Si la CLI ne fonctionne pas, vous pouvez utiliser l'API directement :

```bash
cd backend
curl "https://YOUR_PROJECT_ID.supabase.co/rest/v1/" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  | jq . > src/types/supabase.ts
```

## Vérification

Après génération, vérifiez que le fichier existe :

```bash
ls -la backend/src/types/supabase.ts
```

Le fichier devrait contenir :
- `export interface Database { ... }`
- Les types pour toutes vos tables (`users`, `criminals`, `cases`, etc.)

## Mise à jour des types

**Important** : Régénérez les types après chaque modification du schéma Supabase :

```bash
cd backend
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

## Résolution des problèmes

### Erreur : "Project not found"

- Vérifiez que le Project ID est correct
- Vérifiez que vous êtes connecté : `supabase login`

### Erreur : "Permission denied"

- Utilisez votre **Service Role Key** (pas l'anon key)
- Vérifiez que vous avez les permissions nécessaires

### Les types ne sont pas à jour

- Supprimez l'ancien fichier : `rm backend/src/types/supabase.ts`
- Régénérez les types
- Redémarrez votre serveur TypeScript

## Fichier de types de base

Si vous ne pouvez pas générer les types maintenant, un fichier de base a été créé dans `backend/src/types/supabase.ts` avec les tables principales. Vous pouvez l'utiliser temporairement, mais il est recommandé de générer les types complets depuis Supabase.

