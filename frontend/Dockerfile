FROM node:22-alpine

# Dossier de travail dans le conteneur
WORKDIR /app

# On copie seulement les fichiers de config d'abord
COPY package*.json ./


# On installe les dépendances (React, Vite, etc.)
RUN npm install

# On copie tout le code du frontend
COPY . .

# Vite tourne par défaut sur le port 5173 à l'intérieur du conteneur
EXPOSE 5173

# Lancer le serveur Vite en mode dev, accessible depuis l'extérieur
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
