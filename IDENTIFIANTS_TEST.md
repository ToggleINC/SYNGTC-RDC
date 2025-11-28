# Identifiants de Test - SYNGTC-RDC

## ⚠️ Important
Ces identifiants sont uniquement pour les tests. **Changez tous les mots de passe en production !**

## Comptes Disponibles

Après avoir exécuté `database/seed.sql`, vous pouvez vous connecter avec :

### 1. Administrateur Ministère
- **Email:** `admin@ministere.rdc`
- **Mot de passe:** `password123`
- **Rôle:** Admin Ministère
- **Poste:** Ministère de l'Intérieur

### 2. Superviseur PNC
- **Email:** `superviseur@pnc.rdc`
- **Mot de passe:** `password123`
- **Rôle:** Superviseur
- **Poste:** Direction PNC

### 3. Agent Kasavubu
- **Email:** `agent.kasavubu@pnc.rdc`
- **Mot de passe:** `password123`
- **Rôle:** Agent
- **Poste:** Commissariat Kasavubu

### 4. Agent Kintambo
- **Email:** `agent.kintambo@pnc.rdc`
- **Mot de passe:** `password123`
- **Rôle:** Agent
- **Poste:** CIAT Kintambo

## Créer un Nouveau Compte

Vous pouvez également créer un nouveau compte en cliquant sur **"Pas de compte ? S'inscrire"** sur la page de connexion.

## Note de Sécurité

⚠️ **En production, vous devez :**
1. Changer tous les mots de passe par défaut
2. Utiliser des mots de passe forts (minimum 12 caractères, avec majuscules, minuscules, chiffres et symboles)
3. Désactiver ou supprimer les comptes de test
4. Configurer une authentification à deux facteurs (2FA) si possible

## Hash des Mots de Passe

Les mots de passe dans `seed.sql` sont hashés avec bcrypt (12 rounds). Le mot de passe en clair est `password123` pour tous les comptes de test.

