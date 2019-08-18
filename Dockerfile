FROM node:alpine

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

USER node

EXPOSE 3001

CMD ["npm", "start"]