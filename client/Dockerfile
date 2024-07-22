# Start
FROM node:20.15.1-alpine as builder

FROM builder as development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Stage using server
# FROM builder as production

# WORKDIR /app

# RUN npm install -g serve

# COPY --from=development /app/build /app/build

# CMD ["serve", "-s", "build" ]

# Stage using nginx

FROM nginx:1.27.0-alpine-slim as production

COPY --from=development /app/build /usr/share/nginx/html/react

COPY nginx.conf /etc/nginx/conf.d/react.conf

# COPY nginx.conf /etc/nginx/sites-available/react

# RUN mkdir -p /etc/nginx/sites-enabled

# RUN ln -s /etc/nginx/sites-available/react /etc/nginx/sites-enabled/

RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
