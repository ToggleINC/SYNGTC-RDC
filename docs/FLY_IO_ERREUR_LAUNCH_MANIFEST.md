# Résoudre l'erreur "launch manifest was created for a app, but this is a app" sur Fly.io

## Problème
L'erreur `Error: launch manifest was created for a app, but this is a app` apparaît lors de l'étape "Generate requirements for build" sur Fly.io.

## Cause
Cette erreur indique que Fly.io essaie de générer automatiquement un plan de lancement mais échoue à cause d'un conflit dans la détection du type d'application. Cela peut être causé par :
1. La présence de fichiers de configuration pour d'autres plateformes (`Procfile`, `railway.json`, etc.)
2. Un problème avec la détection automatique du type d'application
3. Un conflit entre la détection automatique et la configuration Docker explicite

## Solutions

### Solution 1 : Ajouter `build_context` explicitement (✅ DÉJÀ FAIT)

Le fichier `fly.toml` doit contenir :

```toml
[build]
  dockerfile = "Dockerfile"
  build_context = "."
```

Cela force Fly.io à utiliser le contexte de build actuel et le Dockerfile explicite.

### Solution 2 : Ignorer les fichiers de configuration d'autres plateformes

Ajoutez `Procfile` et `railway.json` au `.dockerignore` pour éviter qu'ils interfèrent :

```dockerignore
# Fichiers de configuration d'autres plateformes
Procfile
railway.json
```

### Solution 3 : Utiliser le build distant avec `--remote-only`

Forcez un build complètement distant pour éviter les problèmes de détection locale :

```bash
flyctl deploy --remote-only
```

### Solution 4 : Vérifier que le Dockerfile est bien détecté

Vérifiez que Fly.io détecte bien le Dockerfile :

```bash
# Vérifier que le Dockerfile est dans Git
git ls-files | grep Dockerfile

# Vérifier que le Dockerfile n'est pas ignoré
cat .dockerignore | grep -v "^#" | grep Dockerfile
cat .gitignore | grep -v "^#" | grep Dockerfile
```

### Solution 5 : Build manuel et push de l'image

Si le problème persiste, construisez et poussez l'image manuellement :

```bash
# 1. Authentifiez-vous
flyctl auth docker

# 2. Construisez l'image localement
docker build -t registry.fly.io/syngtc-rdc:latest .

# 3. Poussez l'image
docker push registry.fly.io/syngtc-rdc:latest

# 4. Déployez avec l'image
flyctl deploy --image registry.fly.io/syngtc-rdc:latest
```

### Solution 6 : Vérifier la configuration de l'application Fly.io

Assurez-vous que l'application Fly.io est correctement configurée :

```bash
# Vérifier la configuration
flyctl config show

# Vérifier le statut de l'application
flyctl status
```

### Solution 7 : Recréer l'application Fly.io (dernier recours)

Si rien ne fonctionne, vous pouvez recréer l'application :

```bash
# Supprimer l'application (ATTENTION : cela supprime tout)
flyctl apps destroy syngtc-rdc

# Recréer l'application
flyctl launch --name syngtc-rdc --region cdg
```

Puis configurez manuellement le `fly.toml` avec le Dockerfile.

## Configuration actuelle

✅ **Dockerfile** : Présent à la racine  
✅ **fly.toml** : `dockerfile = "Dockerfile"` et `build_context = "."`  
✅ **.dockerignore** : Configuré  
✅ **Git** : Dockerfile est dans Git

## Prochaine étape

1. **Redéployez** avec le nouveau `fly.toml` :
   - Dans l'interface Fly.io, cliquez sur "Retry same commit now"
   - Ou utilisez : `flyctl deploy --remote-only`

2. **Si l'erreur persiste**, ajoutez `Procfile` et `railway.json` au `.dockerignore`

3. **Vérifiez les logs détaillés** dans l'interface Fly.io pour voir l'erreur exacte

## Références

- [Documentation Fly.io - Build](https://fly.io/docs/reference/configuration/#the-build-section)
- [Documentation Fly.io - Dockerfile](https://fly.io/docs/languages-and-frameworks/dockerfile/)

