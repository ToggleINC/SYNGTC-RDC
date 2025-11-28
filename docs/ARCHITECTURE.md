# Architecture Technique - SYNGTC-RDC

## Vue d'ensemble

SYNGTC-RDC est un système modulaire composé de trois applications principales:

1. **Backend API** (Node.js/Express/TypeScript)
2. **Frontend Web** (React/TypeScript)
3. **Application Mobile** (React Native/Expo)

## Architecture Backend

### Structure

```
backend/
├── src/
│   ├── config/          # Configuration (database, etc.)
│   ├── middleware/      # Middleware Express (auth, errors)
│   ├── routes/          # Routes API
│   ├── services/        # Services métier (dangerScore, etc.)
│   └── server.ts        # Point d'entrée
```

### Technologies

- **Express.js**: Framework web
- **PostgreSQL**: Base de données relationnelle
- **JWT**: Authentification
- **Socket.io**: Alertes temps réel
- **Multer**: Upload de fichiers
- **Bcrypt**: Hashage des mots de passe

### API Endpoints

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

#### Criminels
- `POST /api/criminals` - Créer un criminel
- `GET /api/criminals/search` - Rechercher
- `GET /api/criminals/:id` - Détails
- `PUT /api/criminals/:id` - Modifier

#### Cas
- `POST /api/cases` - Créer un cas
- `GET /api/cases` - Liste des cas
- `GET /api/cases/:id` - Détails
- `PATCH /api/cases/:id/statut` - Mettre à jour le statut

#### Géolocalisation
- `GET /api/locations/hotspots` - Zones rouges
- `GET /api/locations/map` - Données cartographiques
- `GET /api/locations/stats/regions` - Statistiques par région

#### Alertes
- `GET /api/alerts` - Liste des alertes
- `POST /api/alerts` - Créer une alerte
- `PATCH /api/alerts/:id/read` - Marquer comme lue

## Architecture Frontend

### Structure

```
frontend/
├── src/
│   ├── components/      # Composants réutilisables
│   ├── context/         # Context React (Auth)
│   ├── pages/           # Pages de l'application
│   ├── theme.ts         # Configuration Material-UI
│   └── App.tsx          # Point d'entrée
```

### Technologies

- **React 18**: Bibliothèque UI
- **TypeScript**: Typage statique
- **Material-UI**: Composants UI
- **React Router**: Navigation
- **Axios**: Client HTTP
- **Leaflet**: Cartographie
- **Chart.js**: Graphiques
- **Socket.io Client**: Alertes temps réel

### Pages principales

1. **Dashboard** - Statistiques et vue d'ensemble
2. **Criminels** - Liste, création, détails
3. **Cas** - Gestion des cas d'arrestation
4. **Cartographie** - Carte interactive avec zones rouges
5. **Alertes** - Notifications en temps réel

## Architecture Mobile

### Structure

```
mobile/
├── src/
│   ├── screens/         # Écrans de l'application
│   ├── context/         # Context React (Auth)
│   └── App.tsx          # Point d'entrée
```

### Technologies

- **React Native**: Framework mobile
- **Expo**: Outils de développement
- **React Navigation**: Navigation
- **Expo Location**: Géolocalisation
- **Expo Camera**: Accès caméra
- **React Native Maps**: Cartes

### Fonctionnalités

1. **Recherche de criminels** - Recherche rapide sur le terrain
2. **Enregistrement de cas** - Création de cas avec GPS
3. **Cartographie** - Visualisation des zones
4. **Authentification** - Connexion sécurisée

## Base de données

### Tables principales

- `users` - Utilisateurs (agents, admins)
- `criminals` - Fichier des criminels
- `cases` - Cas d'arrestation
- `alerts` - Alertes système
- `action_logs` - Traçabilité complète
- `hotspots` - Zones rouges
- `files` - Fichiers (photos, vidéos)
- `sync_logs` - Synchronisation inter-services

### Relations

- Un criminel peut avoir plusieurs cas
- Un cas appartient à un criminel
- Les alertes peuvent être liées à un criminel
- Toutes les actions sont tracées dans `action_logs`

## Sécurité

### Authentification

- JWT avec expiration (24h par défaut)
- Hashage bcrypt pour les mots de passe
- Middleware d'authentification sur toutes les routes protégées

### Autorisation

- Rôles: `agent`, `superviseur`, `admin_pnc`, `admin_anr`, `admin_ministere`
- Middleware `authorize` pour contrôler l'accès par rôle

### Traçabilité

- Toutes les actions sont enregistrées dans `action_logs`
- Chaque enregistrement inclut: utilisateur, action, entité, timestamp, IP

### Cryptage

- Mots de passe hashés avec bcrypt (12 rounds)
- JWT signé avec secret
- HTTPS recommandé en production

## Interconnexion

### Services externes

- **ANR** (Agence Nationale de Renseignements)
- **Ministère de l'Intérieur**
- **Parquets** (système judiciaire)

### Synchronisation

- Table `sync_logs` pour suivre les synchronisations
- Statuts: `pending`, `success`, `failed`
- Retry automatique en cas d'échec

## Déploiement

### Backend

- Serveur Node.js avec PM2 recommandé
- PostgreSQL sur serveur dédié
- Nginx comme reverse proxy
- SSL/TLS obligatoire

### Frontend

- Build de production: `npm run build`
- Servir avec Nginx ou serveur statique
- Configuration CORS pour l'API

### Mobile

- Build Android: `expo build:android`
- Build iOS: `expo build:ios`
- Distribution via Google Play / App Store

## Performance

### Optimisations

- Index sur colonnes fréquemment recherchées
- Pagination sur toutes les listes
- Cache Redis recommandé pour les requêtes fréquentes
- CDN pour les fichiers statiques

### Monitoring

- Logs structurés avec Winston recommandé
- Monitoring avec Prometheus/Grafana
- Alertes sur erreurs critiques

