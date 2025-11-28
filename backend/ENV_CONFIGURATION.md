# Configuration des Variables d'Environnement

Créez un fichier `.env` dans le dossier `backend/` avec le contenu suivant :

```env
# ============================================
# SYNGTC-RDC - Configuration Backend
# ============================================

# Configuration du Serveur
PORT=5000
NODE_ENV=development

# Configuration de la Base de Données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=syngtc_rdc
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_ici

# Configuration JWT (Authentification)
# ⚠️ IMPORTANT: Changez cette valeur en production avec un secret fort et aléatoire
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire_changez_en_production
JWT_EXPIRES_IN=24h

# Cryptage des Données
# Clé de cryptage de 32 caractères
ENCRYPTION_KEY=votre_cle_32_caracteres_ici

# Configuration Upload de Fichiers
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Configuration Socket.io (Alertes temps réel)
SOCKET_PORT=5001

# URLs des Services Externes (Interconnexion)
ANR_API_URL=http://localhost:5002
MINISTERE_API_URL=http://localhost:5003

# Centres de Sauvegarde
BACKUP_CENTER_KINSHASA=http://backup-kinshasa.local
BACKUP_CENTER_LUBUMBASHI=http://backup-lubumbashi.local

# Configuration Frontend (pour CORS)
FRONTEND_URL=http://localhost:3000
```

## Instructions

1. Créez le fichier `backend/.env` (sans le `.example`)
2. Copiez le contenu ci-dessus
3. Remplacez les valeurs par vos propres configurations :
   - `DB_PASSWORD` : Le mot de passe de votre utilisateur PostgreSQL
   - `JWT_SECRET` : Un secret long et aléatoire (minimum 32 caractères)
   - `ENCRYPTION_KEY` : Une clé de 32 caractères exactement
   - `DB_NAME` : Le nom de votre base de données (par défaut: `syngtc_rdc`)

## Génération de Secrets Sécurisés

Pour générer des secrets sécurisés, vous pouvez utiliser :

```bash
# Sur Linux/Mac
openssl rand -base64 32

# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

