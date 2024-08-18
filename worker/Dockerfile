FROM node:20-alpine

WORKDIR /usr/src/worker

COPY package*.json ./

RUN npm install

COPY . .

ENV DEBUG=*

CMD ["node", "index.js"]