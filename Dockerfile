FROM node:15.9
LABEL maintainer="Isaev Abbas"

# Сервер
WORKDIR /usr/src/app/server
COPY ./package*.json ./
RUN npm install
COPY . .

RUN npm run server:build

# Выставляем порт
EXPOSE 3000

# Команда запуска приложения
CMD npm run start:prod