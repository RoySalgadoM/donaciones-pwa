FROM node:latest as builder

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g serve


COPY . .

RUN npm run build
RUN ls dist

CMD ["serve", "-d", "dist", "-p", "8082"]

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]
