# Dockerfile pour SYNGTC-RDC Backend sur Fly.io
# Déploiement sans compilation TypeScript (utilise ts-node en production)
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer TOUTES les dépendances (y compris ts-node pour exécuter TypeScript)
RUN npm ci

# Copier tout le code source
COPY . .

# Exposer le port
EXPOSE 5000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=5000

# Démarrer l'application directement avec ts-node (pas de compilation)
CMD ["npx", "ts-node", "src/server.ts"]
