# SYNGTC-RDC - Projet Complet

## 📋 Résumé

Système National de Gestion et de Traçabilité des Criminels en RDC - Un système complet et moderne pour la gestion centralisée des criminels sur l'ensemble du territoire congolais.

## ✅ Fonctionnalités Implémentées

### 1. Enregistrement des Criminels
- ✅ Enregistrement depuis tous les postes de police
- ✅ Identité complète (nom, prénom, adresse, quartier)
- ✅ Photo et empreintes digitales
- ✅ Types d'infractions multiples
- ✅ Niveau de dangerosité
- ✅ Parrainage, bande, gang
- ✅ Armes et objets saisis
- ✅ Géolocalisation GPS

### 2. Base de Données Interconnectée
- ✅ Base de données unique PostgreSQL
- ✅ Structure prête pour interconnexion PNC-ANR-Ministère
- ✅ Tables de synchronisation
- ✅ Traçabilité complète des actions

### 3. Géolocalisation et Cartographie
- ✅ Enregistrement GPS des lieux d'arrestation
- ✅ Cartographie des zones rouges (hotspots)
- ✅ Visualisation interactive (Leaflet)
- ✅ Heatmaps des points chauds
- ✅ Statistiques par région

### 4. Fichier des Récidivistes
- ✅ Détection automatique des récidivistes
- ✅ Historique complet des cas
- ✅ Suivi judiciaire (mandat, condamnation, libération)
- ✅ Alertes automatiques pour récidivistes

### 5. Module Mobile
- ✅ Application React Native
- ✅ Recherche de criminels sur le terrain
- ✅ Enregistrement de cas avec GPS
- ✅ Visualisation cartographique
- ✅ Interface adaptée aux patrouilles

### 6. Score de Dangerosité IA
- ✅ Calcul automatique du score (0-100)
- ✅ Basé sur: niveau, type d'infraction, armes, historique
- ✅ Mise à jour automatique

### 7. Alertes Automatiques
- ✅ Alertes en temps réel (Socket.io)
- ✅ Notifications pour criminels dangereux
- ✅ Alertes pour récidivistes
- ✅ Alertes pour zones rouges
- ✅ Interface de gestion des alertes

### 8. Sécurité
- ✅ Authentification JWT
- ✅ Hashage des mots de passe (bcrypt)
- ✅ Rôles et permissions
- ✅ Traçabilité complète
- ✅ Protection contre injections SQL
- ✅ Headers de sécurité (Helmet)

### 9. Interface Web
- ✅ Dashboard avec statistiques
- ✅ Gestion des criminels (CRUD)
- ✅ Gestion des cas
- ✅ Cartographie interactive
- ✅ Système d'alertes
- ✅ Design moderne (Material-UI)

## 📁 Structure du Projet

```
SYNGTC-RDC/
├── backend/              # API REST (Node.js/Express/TypeScript)
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── middleware/   # Auth, errors
│   │   ├── routes/       # Routes API
│   │   ├── services/     # Services métier
│   │   └── server.ts     # Point d'entrée
│   └── package.json
│
├── frontend/             # Interface Web (React/TypeScript)
│   ├── src/
│   │   ├── components/   # Composants
│   │   ├── context/      # Context React
│   │   ├── pages/        # Pages
│   │   └── App.tsx
│   └── package.json
│
├── mobile/               # App Mobile (React Native/Expo)
│   ├── src/
│   │   ├── screens/      # Écrans
│   │   ├── context/      # Context
│   │   └── App.tsx
│   └── package.json
│
├── database/             # Schémas SQL
│   ├── schema.sql       # Structure complète
│   └── seed.sql         # Données de test
│
└── docs/                 # Documentation
    ├── ARCHITECTURE.md
    ├── API.md
    └── SECURITE.md
```

## 🚀 Démarrage Rapide

### 1. Base de données
```bash
createdb syngtc_rdc
psql -d syngtc_rdc -f database/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer .env
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Mobile
```bash
cd mobile
npm install
npm run android  # ou npm run ios
```

## 🔐 Comptes de Test

Après avoir exécuté `database/seed.sql`:
- Email: `admin@ministere.rdc`
- Mot de passe: `password123`

## 📊 Technologies Utilisées

### Backend
- Node.js 18+
- Express.js
- TypeScript
- PostgreSQL
- Socket.io
- JWT
- Bcrypt

### Frontend
- React 18
- TypeScript
- Material-UI
- Leaflet (cartes)
- Chart.js (graphiques)
- Axios

### Mobile
- React Native
- Expo
- React Navigation
- Expo Location
- React Native Maps

## 📝 Documentation

- **README.md** - Vue d'ensemble
- **INSTALLATION.md** - Guide d'installation détaillé
- **docs/ARCHITECTURE.md** - Architecture technique
- **docs/API.md** - Documentation API
- **docs/SECURITE.md** - Guide de sécurité

## 🎯 Prochaines Étapes (Améliorations Futures)

1. **Reconnaissance Faciale**
   - Intégration de bibliothèques de reconnaissance
   - Scan via caméras de surveillance
   - Matching automatique

2. **Module Communautaire**
   - Application citoyenne pour signalements
   - Alertes anonymisées
   - Interface de reporting

3. **Interconnexion Réelle**
   - API pour ANR
   - API pour Ministère de l'Intérieur
   - Synchronisation automatique

4. **Améliorations IA**
   - Prédiction des zones à risque
   - Analyse comportementale
   - Détection de patterns

5. **Backup Automatique**
   - Synchronisation Kinshasa-Lubumbashi
   - Sauvegarde quotidienne
   - Récupération de données

## 📞 Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement.

---

**SYNGTC-RDC** - Système National de Gestion et de Traçabilité des Criminels
© Ministère de l'Intérieur, Sécurité et Affaires Coutumières - RDC

