#start
FROM node:20.15.1-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY .env ./build
# Change working directory to /app/build
WORKDIR /app/build

# Run npm install in /app/build directory
RUN npm ci --omit="dev"

FROM node:20.15.1-alpine


COPY --from=builder /app/build /app/build

EXPOSE 3333

WORKDIR /app/build

CMD [ "node", "bin/server.js" ]
