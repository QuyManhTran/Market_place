# Start
FROM node:20.15.1-alpine as builder

FROM builder as development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Stage
FROM builder as production

WORKDIR /app

RUN npm install -g serve

COPY --from=development /app/build /app/build

CMD ["serve", "-s", "build" ]




