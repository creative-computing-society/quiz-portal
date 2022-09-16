FROM node:18-buster-slim

WORKDIR /app

COPY package.json .

RUN npm install

COPY . /app

CMD ["npm", "start"]