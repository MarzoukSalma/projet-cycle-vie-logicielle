FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx wait-port db:5432 && node index.js"]
