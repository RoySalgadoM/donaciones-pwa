# Primer bloque para construir la aplicación
FROM node:latest as builder

# Configuración del directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración de npm
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Ejecutar el comando de construcción
RUN npm run build
RUN ls
RUN pwd

# Segundo bloque para la imagen final
FROM nginx:alpine

# Configurar el directorio de trabajo
WORKDIR /usr/share/nginx/html

# Copiar los archivos construidos desde el primer bloque
COPY --from=builder /app/dist .

# Exponer el puerto 80
EXPOSE 80

# Comando para ejecutar nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
