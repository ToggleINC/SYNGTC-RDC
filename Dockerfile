# Dockerfile pour le backend SYNGTC-RDC
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package du backend
COPY backend/package*.json ./

# Installer TOUTES les dépendances (y compris dev pour le build)
RUN npm ci

# Copier le code source du backend
COPY backend/ ./

# Compiler TypeScript
RUN npm run build

# --- Stage de production ---
FROM node:18-alpine

WORKDIR /app

# Copier package.json
COPY backend/package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production

# Copier le code compilé depuis le builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Exposer le port
EXPOSE 5000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000

# Démarrer l'application
CMD ["node", "dist/server.js"]
