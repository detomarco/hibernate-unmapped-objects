FROM node:16.17.1-alpine3.16 as build

WORKDIR /usr/src/prj

COPY . .

RUN npm ci

RUN npm run package

FROM node:16.17.1-alpine3.16

COPY --from=build /usr/src/prj/dist .

ENTRYPOINT exec node index.js
