# Start
FROM node:20.15.1-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Stage
FROM node:20.15.1-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build /app/build

EXPOSE 3000

CMD ["serve", "-s", "build" ]




