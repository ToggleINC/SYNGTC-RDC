# Dockerfile pour SYNGTC-RDC Backend sur Fly.io
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer toutes les dépendances (y compris dev)
RUN npm ci

# Copier tout le code source
COPY . .

# Compiler TypeScript
RUN npm run build

# --- Stage de production ---
FROM node:18-alpine

WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production

# Copier le code compilé depuis le builder
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 5000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=5000

# Démarrer l'application
CMD ["node", "dist/server.js"]
