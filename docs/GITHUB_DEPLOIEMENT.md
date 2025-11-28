# Guide de Déploiement sur GitHub

## 📋 Prérequis

- Compte GitHub : [https://github.com/ToggleINC](https://github.com/ToggleINC)
- Git installé sur votre machine
- Accès au dépôt `ToggleINC/SYNGTC-RDC`

## 🚀 Étapes de déploiement

### 1. Initialiser Git (si pas déjà fait)

```bash
cd C:\Users\Pc\Desktop\SYNGTC-RDC
git init
```

### 2. Vérifier le .gitignore

Assurez-vous que le fichier `.gitignore` contient :

```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
backups/
```

### 3. Créer le dépôt sur GitHub

1. Allez sur [https://github.com/ToggleINC](https://github.com/ToggleINC)
2. Cliquez sur **"New repository"** (ou le bouton "+" en haut à droite)
3. Remplissez les informations :
   - **Repository name**: `SYNGTC-RDC`
   - **Description**: `Système National de Gestion et de Traçabilité des Criminels en RDC`
   - **Visibility**: 
     - **Private** (recommandé pour un projet gouvernemental)
     - **Public** (si vous voulez le rendre public)
4. **NE COCHEZ PAS** "Initialize this repository with a README" (on a déjà un README)
5. Cliquez sur **"Create repository"**

### 4. Ajouter le remote et pousser

```bash
# Ajouter le remote GitHub
git remote add origin https://github.com/ToggleINC/SYNGTC-RDC.git

# Vérifier que le remote est bien ajouté
git remote -v

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit: SYNGTC-RDC - Système National de Gestion et de Traçabilité des Criminels"

# Renommer la branche principale en 'main' (si nécessaire)
git branch -M main

# Pousser le code sur GitHub
git push -u origin main
```

### 5. Vérifier sur GitHub

1. Allez sur [https://github.com/ToggleINC/SYNGTC-RDC](https://github.com/ToggleINC/SYNGTC-RDC)
2. Vérifiez que tous les fichiers sont présents
3. Vérifiez que le README.md s'affiche correctement

## 📝 Mises à jour futures

Pour mettre à jour le code sur GitHub :

```bash
# Voir les fichiers modifiés
git status

# Ajouter les modifications
git add .

# Faire un commit
git commit -m "Description des modifications"

# Pousser sur GitHub
git push origin main
```

## 🔐 Sécurité

### Secrets à NE JAMAIS commiter

- Fichiers `.env`
- Mots de passe
- Clés API
- Certificats SSL

### Utiliser GitHub Secrets

Pour les variables sensibles dans GitHub Actions :

1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Cliquez sur **"New repository secret"**
3. Ajoutez vos secrets (ex: `VERCEL_TOKEN`, `DB_PASSWORD`)

## 📚 Documentation GitHub

- [GitHub Docs](https://docs.github.com)
- [Git Basics](https://docs.github.com/en/get-started/quickstart/git-and-github-learning-resources)

