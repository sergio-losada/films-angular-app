FROM node:14-alpine AS build-step
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
 
FROM nginx:1.17.1-alpine
COPY default.conf /etc/nginx/
COPY --from=build-step /usr/src/app/dist/frontend /usr/share/nginx/html
EXPOSE 80