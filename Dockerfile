FROM node:current-alpine3.13

WORKDIR /usr/src/app

COPY package*.json .
COPY tsconfig.json .
RUN npm install

COPY src .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]