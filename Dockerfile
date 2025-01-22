FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --ignore-scripts --no-bin-links --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
