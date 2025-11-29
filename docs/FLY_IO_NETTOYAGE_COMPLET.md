# Guide de Nettoyage Complet pour Fly.io

## Problème
L'erreur "launch manifest was created for an app, but this is a app" persiste même après avoir corrigé les Dockerfiles dupliqués.

## Cause
Fly.io a créé des fichiers parasites lors du premier déploiement qui forcent l'utilisation d'un "launch manifest" automatique au lieu du Dockerfile manuel.

## Solution Complète

### Étape 1 : Vérifier les fichiers parasites dans le repo

Vérifiez que ces fichiers n'existent PAS dans votre repo :

```bash
# Vérifier les fichiers parasites
ls -la .fly/ 2>/dev/null || echo "✅ Pas de .fly/"
ls -la fly-launch.toml 2>/dev/null || echo "✅ Pas de fly-launch.toml"
ls -la fly.toml.bak 2>/dev/null || echo "✅ Pas de fly.toml.bak"
ls -la tmp/manifest.json 2>/dev/null || echo "✅ Pas de tmp/manifest.json"
```

Si ces fichiers existent, **SUPPRIMEZ-LES** :

```bash
rm -rf .fly/
rm -f fly-launch.toml
rm -f fly.toml.bak
rm -rf tmp/
```

### Étape 2 : Vérifier la configuration fly.toml

Votre `fly.toml` doit contenir **UNIQUEMENT** :

```toml
app = "syngtc-rdc"
primary_region = "cdg"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop"
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

**⚠️ IMPORTANT** : 
- Pas de `build_context`
- Pas de `buildpacks`
- Pas de `builder`
- Juste `dockerfile = "Dockerfile"`

### Étape 3 : Vérifier le Dockerfile

Le Dockerfile doit être **UNIQUEMENT** à la racine :

```
SYNGTC-RDC/
├── Dockerfile          ← ✅ SEUL Dockerfile
├── fly.toml
├── .dockerignore
└── backend/
    └── (pas de Dockerfile ici)
```

### Étape 4 : Nettoyer les machines Fly.io

Les machines créées lors du premier mauvais déploiement peuvent causer des problèmes.

```bash
# 1. Lister les applications
flyctl apps list

# 2. Lister les machines de votre app
flyctl machines list -a syngtc-rdc

# 3. Si des machines existent, les supprimer
flyctl machines destroy <machine-id> --force -a syngtc-rdc
```

### Étape 5 : Purger complètement l'application (si nécessaire)

Si le problème persiste, vous pouvez recréer l'application :

```bash
# ⚠️ ATTENTION : Cela supprime TOUT (données, machines, etc.)
flyctl apps destroy syngtc-rdc

# Recréer l'application
flyctl launch --name syngtc-rdc --region cdg --no-deploy

# Puis déployer avec votre Dockerfile
flyctl deploy
```

### Étape 6 : Redéployer proprement

```bash
# Déployer avec logs détaillés
flyctl deploy --verbose --remote-only
```

## Vérifications Finales

✅ **Dockerfile** : Uniquement à la racine  
✅ **fly.toml** : `dockerfile = "Dockerfile"` (sans build_context)  
✅ **Fichiers parasites** : Aucun dans le repo  
✅ **Machines Fly.io** : Nettoyées si nécessaire  
✅ **.gitignore** : Contient les fichiers Fly.io à ignorer

## Si le problème persiste

1. **Vérifiez les logs détaillés** :
   ```bash
   flyctl logs -a syngtc-rdc
   ```

2. **Vérifiez la configuration** :
   ```bash
   flyctl config show -a syngtc-rdc
   ```

3. **Contactez le support Fly.io** via leur forum communautaire

## Références

- [Documentation Fly.io - Build](https://fly.io/docs/reference/configuration/#the-build-section)
- [Documentation Fly.io - Machines](https://fly.io/docs/machines/)

