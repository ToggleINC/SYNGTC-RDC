# Corriger la Configuration Git pour GitHub

## Problème
Les commits sont associés au mauvais compte GitHub (`lisuscraping-sys` au lieu de `toggleinc-7493`).

## Solution : Configurer Git avec le bon compte

### Configuration pour ce projet uniquement

```bash
# Configurer le nom d'utilisateur
git config user.name "toggleinc-7493"

# Configurer l'email
git config user.email "toggleinc.rdc@gmail.com"

# Vérifier la configuration
git config user.name
git config user.email
```

### Configuration globale (pour tous les projets)

Si vous voulez que tous vos projets utilisent ce compte :

```bash
# Configurer globalement
git config --global user.name "toggleinc-7493"
git config --global user.email "toggleinc.rdc@gmail.com"

# Vérifier
git config --global user.name
git config --global user.email
```

## Vérification

### Vérifier la configuration actuelle

```bash
# Configuration locale (ce projet)
git config user.name
git config user.email

# Configuration globale
git config --global user.name
git config --global user.email
```

### Vérifier les derniers commits

```bash
# Voir les auteurs des derniers commits
git log --oneline -5 --format="%h %an <%ae> %s"
```

## Corriger les commits précédents (optionnel)

⚠️ **Attention** : Modifier l'historique Git peut être dangereux. Ne le faites que si nécessaire.

### Si vous voulez corriger les derniers commits

```bash
# Corriger le dernier commit
git commit --amend --author="toggleinc-7493 <toggleinc.rdc@gmail.com>" --no-edit

# Pousser avec force (⚠️ DANGEREUX - à faire seulement si vous êtes sûr)
git push --force origin main
```

### Si vous voulez corriger plusieurs commits

```bash
# Utiliser git filter-branch ou git rebase
# ⚠️ Ceci réécrit l'historique - à utiliser avec précaution
```

## Prochains commits

Une fois la configuration corrigée, tous les **nouveaux commits** seront automatiquement associés au bon compte :

```bash
# Faire un nouveau commit
git add .
git commit -m "chore: Test configuration Git toggleinc-7493"
git push origin main
```

Le commit devrait maintenant apparaître avec l'auteur `toggleinc-7493` sur GitHub.

## Vérification sur GitHub

1. Allez sur [github.com/ToggleINC/SYNGTC-RDC](https://github.com/ToggleINC/SYNGTC-RDC)
2. Vérifiez les commits récents
3. Les nouveaux commits devraient montrer **toggleinc-7493** comme auteur

## Configuration recommandée

Pour ce projet spécifique :
- **user.name** : `toggleinc-7493`
- **user.email** : `toggleinc.rdc@gmail.com`

## Dépannage

### Si les commits montrent toujours le mauvais auteur

1. Vérifiez que vous avez bien configuré Git :
   ```bash
   git config user.name
   git config user.email
   ```

2. Vérifiez que vous êtes connecté au bon compte GitHub dans votre navigateur

3. Vérifiez les credentials Git :
   ```bash
   # Windows - Credential Manager
   # Allez dans : Panneau de configuration → Gestionnaire d'identification
   # Supprimez les anciennes credentials GitHub si nécessaire
   ```

### Si vous avez plusieurs comptes GitHub

Vous pouvez configurer Git différemment pour chaque projet :

```bash
# Pour ce projet
cd C:\Users\Pc\Desktop\SYNGTC-RDC
git config user.name "toggleinc-7493"
git config user.email "toggleinc.rdc@gmail.com"

# Pour un autre projet
cd C:\Users\Pc\Desktop\AutreProjet
git config user.name "autre-compte"
git config user.email "autre@email.com"
```

## Résultat attendu

Après configuration, les nouveaux commits devraient afficher :
- ✅ **Auteur** : `toggleinc-7493`
- ✅ **Email** : `toggleinc.rdc@gmail.com`
- ✅ Sur GitHub : Les commits apparaissent avec le bon compte

