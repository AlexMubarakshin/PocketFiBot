FROM node:lts-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./src ./src

CMD ["node", "src/index.js"]