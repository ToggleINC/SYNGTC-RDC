# Documentation API - SYNGTC-RDC

## Base URL

```
http://localhost:5000/api
```

## Authentification

Toutes les routes (sauf `/auth/login` et `/auth/register`) nécessitent un token JWT dans le header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentification

#### POST /auth/register
Inscription d'un nouvel agent

**Body:**
```json
{
  "email": "agent@example.com",
  "password": "password123",
  "nom": "Doe",
  "prenom": "John",
  "role": "agent",
  "poste": "Commissariat Kasavubu",
  "region": "Kinshasa"
}
```

#### POST /auth/login
Connexion

**Body:**
```json
{
  "email": "agent@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "agent@example.com",
    "nom": "Doe",
    "prenom": "John",
    "role": "agent"
  }
}
```

### Criminels

#### POST /criminals
Créer un nouveau criminel

**Body:**
```json
{
  "nom": "Doe",
  "prenom": "John",
  "adresse": "123 Avenue",
  "quartier": "Kasavubu",
  "type_infraction": ["kuluna", "braquage"],
  "niveau_dangerosite": "eleve",
  "latitude": -4.3276,
  "longitude": 15.3136
}
```

#### GET /criminals/search
Rechercher des criminels

**Query params:**
- `q`: Terme de recherche
- `type_infraction`: Type d'infraction
- `niveau_dangerosite`: faible|modere|eleve
- `quartier`: Nom du quartier
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre par page (défaut: 20)

#### GET /criminals/:id
Obtenir les détails d'un criminel

#### PUT /criminals/:id
Mettre à jour un criminel

### Cas

#### POST /cases
Créer un nouveau cas

**Body:**
```json
{
  "criminal_id": "uuid",
  "date_arrestation": "2024-01-15T10:00:00Z",
  "lieu_arrestation": "Avenue Victoire",
  "type_infraction": ["kuluna"],
  "latitude": -4.3276,
  "longitude": 15.3136
}
```

#### GET /cases
Liste des cas

**Query params:**
- `criminal_id`: Filtrer par criminel
- `statut_judiciaire`: Filtrer par statut
- `page`: Numéro de page
- `limit`: Nombre par page

#### PATCH /cases/:id/statut
Mettre à jour le statut judiciaire

**Body:**
```json
{
  "statut_judiciaire": "condamne",
  "date_condamnation": "2024-02-01",
  "mandat": "Détails du mandat"
}
```

### Géolocalisation

#### GET /locations/hotspots
Obtenir les zones rouges

**Query params:**
- `region`: Filtrer par région
- `date_debut`: Date de début
- `date_fin`: Date de fin

#### GET /locations/map
Données pour la cartographie

### Alertes

#### GET /alerts
Liste des alertes

#### POST /alerts
Créer une alerte

**Body:**
```json
{
  "type": "dangerous_criminal",
  "titre": "Criminel dangereux détecté",
  "description": "Détails...",
  "priorite": "elevee",
  "criminal_id": "uuid"
}
```

### Dashboard

#### GET /dashboard/stats
Statistiques générales

#### GET /dashboard/charts/timeline
Données pour graphique temporel

## Codes de réponse

- `200`: Succès
- `201`: Créé avec succès
- `400`: Requête invalide
- `401`: Non authentifié
- `403`: Accès refusé
- `404`: Non trouvé
- `500`: Erreur serveur

## WebSocket (Socket.io)

### Événements émis par le serveur

- `new-alert`: Nouvelle alerte créée
- `recidivist-alert`: Récidiviste détecté
- `criminal-released`: Criminel libéré
- `new-dangerous-criminal`: Nouveau criminel dangereux

### Connexion

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('new-alert', (alert) => {
  console.log('Nouvelle alerte:', alert);
});
```

