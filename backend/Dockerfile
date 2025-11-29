# Dockerfile pour SYNGTC-RDC Backend sur Fly.io
# Déploiement sans compilation TypeScript (utilise ts-node en production)
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package depuis le dossier backend (contexte racine)
COPY backend/package*.json ./

# Installer TOUTES les dépendances (y compris ts-node)
RUN npm ci

# Copier tout le code source du backend
COPY backend/ .

# Exposer le port
EXPOSE 5000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=5000

# Démarrer l'application directement avec ts-node
CMD ["npx", "ts-node", "src/server.ts"]
