FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY app ./app
COPY components ./components
COPY services ./services
EXPOSE 3000
CMD ["npm", "run", "dev"]
