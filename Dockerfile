FROM node

ENV BACK_PORT 80

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm build

EXPOSE 80

CMD ["node", "/app/dist/index.js"]