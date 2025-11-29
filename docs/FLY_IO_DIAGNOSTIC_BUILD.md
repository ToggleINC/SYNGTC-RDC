# Diagnostic des Erreurs de Build sur Fly.io

## Problème
Le build échoue à l'étape "Build image" sur Fly.io.

## Comment Voir les Logs Détaillés

### Option 1 : Via l'Interface Web Fly.io

1. Allez sur https://fly.io/dashboard
2. Ouvrez votre application `syngtc-rdc`
3. Cliquez sur **"Deployments"** dans le menu de gauche
4. Cliquez sur le déploiement qui a échoué
5. Cliquez sur **"View logs"** ou **"Build logs"**
6. Vous verrez les logs détaillés de l'erreur

### Option 2 : Via la Ligne de Commande

```bash
# Voir les logs du dernier déploiement
flyctl logs -a syngtc-rdc

# Voir les logs de build spécifiquement
flyctl logs -a syngtc-rdc --build
```

## Erreurs Communes et Solutions

### Erreur 1 : "ts-node: command not found"

**Cause** : `ts-node` n'est pas installé car il est dans `devDependencies` et `npm ci --production` ne l'installe pas.

**Solution** : ✅ **DÉJÀ CORRIGÉ** - Le Dockerfile utilise maintenant `npm ci --production=false`

### Erreur 2 : "Cannot find module '...'"

**Cause** : Une dépendance manquante ou un problème avec `node_modules`.

**Solution** :
```dockerfile
# Dans Dockerfile, vérifier que toutes les dépendances sont installées
RUN npm ci --production=false
RUN npm list --depth=0  # Pour vérifier les dépendances installées
```

### Erreur 3 : "ENOENT: no such file or directory"

**Cause** : Un fichier manquant ou un chemin incorrect dans le Dockerfile.

**Solution** : Vérifier que tous les fichiers copiés existent :
```dockerfile
# Vérifier que les fichiers existent avant de les copier
COPY backend/package*.json ./
COPY backend/. .
```

### Erreur 4 : "Port already in use" ou "EADDRINUSE"

**Cause** : Le port est déjà utilisé ou mal configuré.

**Solution** : Vérifier que `PORT=8080` est bien défini dans :
- `Dockerfile` : `ENV PORT=8080`
- `fly.toml` : `[env] PORT = "8080"`
- `fly.toml` : `[http_service] internal_port = 8080`

### Erreur 5 : "Out of memory" ou "Killed"

**Cause** : La machine Fly.io n'a pas assez de mémoire.

**Solution** : Augmenter la mémoire dans `fly.toml` :
```toml
[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 512  # Augmenter de 256 à 512
```

### Erreur 6 : "npm ERR! code ERESOLVE"

**Cause** : Conflit de dépendances dans `package.json`.

**Solution** :
```bash
# Localement, tester le build
cd backend
npm ci --production=false

# Si ça fonctionne localement, le problème vient peut-être de la version de Node
# Vérifier que Dockerfile utilise la bonne version
FROM node:20-alpine  # Utiliser une version LTS
```

## Vérifications à Faire

### 1. Tester le Build Localement

```bash
# Construire l'image Docker localement
docker build -t syngtc-rdc-test .

# Si le build local fonctionne, le problème vient de Fly.io
# Si le build local échoue, corriger le Dockerfile
```

### 2. Vérifier les Variables d'Environnement

Assurez-vous que toutes les variables d'environnement nécessaires sont définies dans Fly.io :

```bash
# Lister les variables d'environnement
flyctl secrets list -a syngtc-rdc

# Ajouter une variable d'environnement
flyctl secrets set KEY=value -a syngtc-rdc
```

Variables nécessaires :
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `PORT=8080` (déjà dans fly.toml)

### 3. Vérifier la Configuration fly.toml

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

## Prochaines Étapes

1. **Voir les logs détaillés** dans l'interface Fly.io
2. **Identifier l'erreur exacte** dans les logs
3. **Appliquer la solution** correspondante
4. **Redéployer** avec "Retry from latest commit (main)"

## Si le Problème Persiste

1. **Tester le build localement** :
   ```bash
   docker build -t test .
   docker run -p 8080:8080 test
   ```

2. **Vérifier les logs complets** :
   ```bash
   flyctl logs -a syngtc-rdc --build --verbose
   ```

3. **Contacter le support Fly.io** via leur forum communautaire avec :
   - Les logs de build complets
   - Le contenu de votre `Dockerfile`
   - Le contenu de votre `fly.toml`
   - Le contenu de votre `backend/package.json`

