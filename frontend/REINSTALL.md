# Instructions pour Corriger l'Erreur ajv

## Problème
Erreur : `Cannot find module 'ajv/dist/compile/codegen'`

Cela indique que les dépendances ne sont pas correctement installées.

## Solution : Nettoyage et Réinstallation

### Étape 1 : Supprimer les dépendances existantes

Dans le terminal, naviguez vers le dossier frontend et exécutez :

```cmd
cd C:\Users\Pc\Desktop\SYNGTC-RDC\frontend

REM Supprimer node_modules
rmdir /s /q node_modules

REM Supprimer package-lock.json
del package-lock.json
```

### Étape 2 : Réinstaller avec legacy-peer-deps

```cmd
npm install --legacy-peer-deps
```

Le flag `--legacy-peer-deps` permet d'ignorer les conflits de dépendances peer, ce qui est nécessaire avec react-scripts 5.0.1.

### Étape 3 : Démarrer le serveur

```cmd
npm start
```

## Alternative : Si ça ne fonctionne toujours pas

Si l'erreur persiste, essayez :

```cmd
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps
npm start
```

## Explication

L'erreur se produit car :
- `react-scripts` utilise `ajv-keywords` qui dépend d'une version spécifique d'`ajv`
- Les dépendances peer ne sont pas correctement résolues
- La solution est d'utiliser `--legacy-peer-deps` pour forcer l'installation

