# Usa una imagen base ligera de Node.js
FROM node:20-alpine AS base

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración necesarios
COPY package*.json ./

# Instala las dependencias (usa flags para compatibilidad si es necesario)
RUN npm install --legacy-peer-deps

# Copia el esquema de Prisma y genera los tipos antes de compilar
COPY prisma ./prisma
RUN npx prisma generate

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación
RUN npm run build

# Expone el puerto de la aplicación
EXPOSE 3000

# Define el comando de inicio
CMD ["npm", "start"]
