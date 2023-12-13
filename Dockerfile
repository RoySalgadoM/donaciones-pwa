FROM node:latest as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN ls

CMD ["serve", "-d", "dist", "-p", "80"]
