# Dockerfile pour le backend SYNGTC-RDC
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package
COPY backend/package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY backend/ ./

# Compiler TypeScript
RUN npm run build

# Exposer le port
EXPOSE 5000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000

# Démarrer l'application
CMD ["npm", "start"]
