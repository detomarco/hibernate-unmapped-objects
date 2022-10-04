FROM node:18.10.0-alpine3.16 as build

WORKDIR /usr/src/prj

COPY . .

RUN npm ci

RUN npm run package

FROM node:18.10.0-alpine3.16

COPY --from=build /usr/src/prj/dist .

ENTRYPOINT exec node index.js
