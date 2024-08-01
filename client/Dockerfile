# Start
FROM node:20.15.1-alpine as builder

FROM builder as development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.27.0-alpine-slim as production

COPY --from=development /app/build /usr/share/nginx/html/react

CMD ["nginx", "-g", "daemon off;"]
