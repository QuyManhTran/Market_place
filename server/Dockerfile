#start
FROM node:20.15.1-alpine as builder

FROM builder as development

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

FROM builder as production

ENV NODE_ENV=production

ENV REDIS_HOST=redis

# ENV DB_HOST=mysql

COPY --from=development /app/build /app/build

WORKDIR /app/build

CMD [ "node", "bin/server.js" ]
