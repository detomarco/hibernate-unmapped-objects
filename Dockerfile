FROM node:14.20.1-slim  as build

WORKDIR /usr/src/prj

COPY . .

RUN npm ci

RUN npm run package

FROM node:14.20.1-slim

COPY --from=build /usr/src/prj/dist .

ENTRYPOINT exec node index.js
