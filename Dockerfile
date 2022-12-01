FROM node:19.2.0-alpine3.16 as build

WORKDIR /usr/src/prj

COPY . .

RUN npm ci

RUN npm run package

FROM node:19.2.0-alpine3.16

CMD ["mkdir", "~/config"]

ENV CONFIG_FILE=${CONFIG_FILE}
COPY --from=build /usr/src/prj/dist .

ENTRYPOINT ["exec", "node", "index.js", "configFile=${CONFIG_FILE}"]
