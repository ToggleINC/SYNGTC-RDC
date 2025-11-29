# Résoudre l'erreur "Generate requirements for build" sur Fly.io

## Problème
L'étape "Generate requirements for build" échoue lors du déploiement sur Fly.io.

## Solutions

### Solution 1 : Vérifier que le Dockerfile est bien dans Git

Le Dockerfile doit être commité et poussé vers GitHub :

```bash
# Vérifier que le Dockerfile est dans Git
git ls-files | grep Dockerfile

# Si le Dockerfile n'est pas dans Git, l'ajouter
git add Dockerfile
git commit -m "feat: Ajouter Dockerfile pour Fly.io"
git push origin main
```

### Solution 2 : Vérifier la configuration fly.toml

Le fichier `fly.toml` doit contenir :

```toml
[build]
  dockerfile = "Dockerfile"
```

**Important** : Utilisez `"Dockerfile"` (sans `./`) car Fly.io cherche le fichier depuis la racine du projet.

### Solution 3 : Vérifier que le Dockerfile n'est pas ignoré

Vérifiez que `Dockerfile` n'est **PAS** dans :
- `.dockerignore`
- `.gitignore`

### Solution 4 : Utiliser le build distant

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

### Solution 6 : Vérifier les logs de build

Consultez les logs détaillés pour voir l'erreur exacte :

```bash
# Voir les logs du dernier déploiement
flyctl logs

# Ou dans l'interface web Fly.io
# Allez dans votre app → Deployments → Cliquez sur le déploiement → Logs
```

### Solution 7 : Build manuel et push

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

## Configuration actuelle

✅ **Dockerfile** : Présent à la racine  
✅ **fly.toml** : `dockerfile = "Dockerfile"`  
✅ **.dockerignore** : Configuré (ne contient pas Dockerfile)  
✅ **Git** : Dockerfile est dans Git

## Vérifications à faire

1. ✅ Le Dockerfile existe à la racine : `Dockerfile`
2. ✅ Le Dockerfile est dans Git : `git ls-files Dockerfile`
3. ✅ fly.toml contient : `dockerfile = "Dockerfile"`
4. ✅ Le Dockerfile n'est pas dans .dockerignore
5. ✅ Le Dockerfile n'est pas dans .gitignore

## Prochaine étape

Essayez de redéployer :

```bash
flyctl deploy --remote-only
```

Ou utilisez le bouton "Retry same commit now" dans l'interface Fly.io.

## Si le problème persiste

1. **Vérifiez les logs détaillés** dans l'interface Fly.io
2. **Vérifiez que le commit est bien poussé** sur GitHub
3. **Essayez un build local** pour vérifier que le Dockerfile fonctionne :
   ```bash
   docker build -t test-build .
   ```

