# Usa Node.js 20 con Alpine Linux como base
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

COPY package.json package-lock.json ./

npm i --legacy-peer-deps

COPY . .

# Copia todo el código fuente
COPY . .

# Define el puerto que usará la app
EXPOSE 3000

# Construye la aplicación Next.js
RUN npm run build

# Comando para iniciar la aplicación
CMD ["npm", "start"]
