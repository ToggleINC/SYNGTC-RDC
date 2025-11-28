# Guide de Sécurité - SYNGTC-RDC

## Mesures de Sécurité Implémentées

### 1. Authentification et Autorisation

- **JWT (JSON Web Tokens)**: Authentification stateless
- **Expiration des tokens**: 24h par défaut (configurable)
- **Hashage des mots de passe**: Bcrypt avec 12 rounds
- **Rôles et permissions**: Système multi-niveaux (agent, superviseur, admin)

### 2. Protection des Données

- **Validation des entrées**: Express-validator sur toutes les routes
- **Sanitization**: Nettoyage des données utilisateur
- **SQL Injection**: Protection via requêtes paramétrées (pg)
- **XSS**: Protection via Helmet.js

### 3. Traçabilité

- **Logs d'actions**: Toutes les actions sont enregistrées
- **Audit trail**: Historique complet des modifications
- **Identification des utilisateurs**: Chaque action est liée à un utilisateur

### 4. Sécurité Réseau

- **CORS**: Configuration stricte des origines autorisées
- **Helmet.js**: Headers de sécurité HTTP
- **Rate limiting**: Recommandé en production (express-rate-limit)

### 5. Gestion des Fichiers

- **Validation des types**: Seulement images, PDF, vidéos autorisés
- **Limite de taille**: 10MB par défaut
- **Stockage sécurisé**: Fichiers hors du répertoire web

## Recommandations de Déploiement

### Production

1. **HTTPS obligatoire**: Toutes les communications chiffrées
2. **Secrets sécurisés**: Variables d'environnement, jamais en code
3. **Base de données**: Accès restreint, firewall
4. **Backup automatique**: Sauvegarde quotidienne
5. **Monitoring**: Surveillance des tentatives d'intrusion

### Variables d'environnement critiques

```env
JWT_SECRET=<secret_très_long_et_aléatoire>
ENCRYPTION_KEY=<clé_32_caractères>
DB_PASSWORD=<mot_de_passe_fort>
```

### Checklist de sécurité

- [ ] HTTPS configuré
- [ ] Secrets changés depuis les valeurs par défaut
- [ ] Firewall configuré
- [ ] Backups automatiques
- [ ] Monitoring actif
- [ ] Logs centralisés
- [ ] Mises à jour de sécurité régulières
- [ ] Tests de pénétration effectués

## Conformité

### Protection des données personnelles

- Accès restreint aux données sensibles
- Logs d'accès aux données personnelles
- Droit à l'oubli (suppression des données)

### Audit et conformité

- Rapports d'audit réguliers
- Conformité aux réglementations locales
- Documentation des procédures de sécurité

