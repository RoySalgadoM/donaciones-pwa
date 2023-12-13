FROM node:latest as builder

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g serve


COPY . .

RUN npm run build
RUN ls

CMD ["serve", "-d", "dist", "-p", "80"]
