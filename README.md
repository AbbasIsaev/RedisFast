# RedisFast

RedisFast - проект для быстрого внедрения Redis в свои проекты. Структура проекта Express + TypeScript + ioRedis +
Docker.

### Установка

```shell
npm install
```

### Запуск

```shell
npm run start
```

Для проверки работоспособности перейти по ссылке http://localhost:3000

### Развертывания проекта в докере

```shell
docker-compose --env-file ./config/docker-compose.env -f docker-compose.yml up -d
```

Для проверки работоспособности перейти по ссылке http://localhost:8080