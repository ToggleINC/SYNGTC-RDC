# Correction des Dépendances Frontend

## Problème
Erreur : `Cannot find module 'ajv/dist/compile/codegen'`

## Solution

### Option 1 : Nettoyage et réinstallation (Recommandé)

Dans le terminal, exécutez ces commandes dans l'ordre :

```bash
cd frontend

# Supprimer node_modules et package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Réinstaller avec legacy-peer-deps pour éviter les conflits
npm install --legacy-peer-deps
```

### Option 2 : Installation de ajv uniquement

```bash
cd frontend
npm install ajv@^8.12.0 --legacy-peer-deps
```

### Option 3 : Réinstallation complète

```bash
cd frontend
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps
```

## Après l'installation

Une fois l'installation terminée, essayez de démarrer le serveur :

```bash
npm start
```

## Note

Le flag `--legacy-peer-deps` permet d'ignorer les conflits de dépendances peer, ce qui est nécessaire avec react-scripts 5.0.1 et certaines versions de dépendances.

