# Dockerfile pour SYNGTC-RDC Backend sur Fly.io
# Déploiement sans compilation TypeScript (utilise ts-node en production)
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package depuis backend/
COPY backend/package*.json ./

# Installer TOUTES les dépendances (y compris ts-node)
# Utiliser --production=false pour installer aussi les devDependencies (ts-node)
RUN npm ci --production=false

# Copier tout le code source depuis backend/
COPY backend/. .

# Exposer le port 8080
EXPOSE 8080

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=8080

# Vérifier que ts-node est disponible
RUN npx ts-node --version || (echo "ts-node non trouvé" && exit 1)

# Démarrer l'application directement avec ts-node
CMD ["npx", "ts-node", "src/server.ts"]

