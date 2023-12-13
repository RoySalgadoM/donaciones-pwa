FROM node:latest as builder
WORKDIR /app/web
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
CMD ["ls"]
CMD ["pwd"]
COPY --from=builder /app/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
