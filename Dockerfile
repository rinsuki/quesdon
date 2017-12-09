FROM node

ENV BACK_PORT 80

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 80

CMD ["node", "/app/dist/server/index.js"]