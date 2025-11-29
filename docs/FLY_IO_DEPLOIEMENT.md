# Guide de Déploiement sur Fly.io

## Configuration actuelle

- **Dockerfile** : À la racine du projet
- **fly.toml** : Configuré avec `dockerfile = "Dockerfile"` et `build_context = "."`
- **.dockerignore** : Configuré pour ignorer les fichiers non nécessaires

## Erreur : "app does not have a Dockerfile or buildpacks configured"

### Solution 1 : Vérifier que le Dockerfile est bien présent

```bash
# Vérifier que le Dockerfile existe à la racine
ls -la Dockerfile
# ou sur Windows
dir Dockerfile
```

### Solution 2 : Vérifier la configuration fly.toml

Le fichier `fly.toml` doit contenir :

```toml
[build]
  dockerfile = "Dockerfile"
  build_context = "."
```

### Solution 3 : Vérifier que le Dockerfile n'est pas ignoré

Vérifiez que `Dockerfile` n'est **PAS** dans :
- `.dockerignore`
- `.gitignore`

### Solution 4 : Utiliser --remote-only

Si le problème persiste, utilisez le build distant :

```bash
flyctl deploy --remote-only
```

Cela construira l'image sur les serveurs Fly.io au lieu de localement.

### Solution 5 : Vérifier le contexte de build

Assurez-vous d'être dans le bon répertoire lors du déploiement :

```bash
# Depuis la racine du projet
cd C:\Users\Pc\Desktop\SYNGTC-RDC
flyctl deploy
```

### Solution 6 : Build manuel et push

Si le problème persiste, construisez et poussez l'image manuellement :

```bash
# 1. Authentifiez-vous
flyctl auth docker

# 2. Construisez l'image
docker build -t registry.fly.io/syngtc-rdc:latest .

# 3. Poussez l'image
docker push registry.fly.io/syngtc-rdc:latest

# 4. Déployez
flyctl deploy --image registry.fly.io/syngtc-rdc:latest
```

## Structure du projet

```
SYNGTC-RDC/
├── Dockerfile          ← À la racine (pour Fly.io)
├── fly.toml            ← Configuration Fly.io
├── .dockerignore       ← Fichiers à ignorer lors du build
├── backend/
│   ├── src/
│   ├── package.json
│   └── ...
└── ...
```

## Commandes utiles

### Vérifier la configuration

```bash
# Vérifier la configuration Fly.io
flyctl config validate

# Voir la configuration actuelle
flyctl config show
```

### Déployer

```bash
# Déploiement standard
flyctl deploy

# Déploiement avec build distant uniquement
flyctl deploy --remote-only

# Déploiement avec image spécifique
flyctl deploy --image registry.fly.io/syngtc-rdc:latest
```

### Vérifier les logs

```bash
# Logs en temps réel
flyctl logs

# Logs avec suivi
flyctl logs -a syngtc-rdc
```

## Variables d'environnement

Configurez les variables d'environnement dans Fly.io :

```bash
# Définir une variable
flyctl secrets set SUPABASE_URL=https://qudbecjmgitlkjwucsrt.supabase.co

# Voir les secrets
flyctl secrets list

# Supprimer un secret
flyctl secrets unset VARIABLE_NAME
```

Variables nécessaires :
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `NODE_ENV=production`
- `PORT=8080`

## Dépannage

### Erreur : "Dockerfile not found"

1. Vérifiez que `Dockerfile` existe à la racine
2. Vérifiez que `fly.toml` contient `dockerfile = "Dockerfile"`
3. Essayez `flyctl deploy --remote-only`

### Erreur : "Build failed"

1. Vérifiez les logs : `flyctl logs`
2. Vérifiez que toutes les dépendances sont dans `backend/package.json`
3. Vérifiez que le Dockerfile copie correctement les fichiers

### Erreur : "Port not accessible"

1. Vérifiez que `PORT=8080` est défini dans `fly.toml` et les variables d'environnement
2. Vérifiez que l'application écoute sur le port 8080

## Documentation Fly.io

- [Configuration fly.toml](https://fly.io/docs/reference/configuration/)
- [Dockerfile sur Fly.io](https://fly.io/docs/languages-and-frameworks/dockerfile/)
- [Variables d'environnement](https://fly.io/docs/reference/secrets/)

