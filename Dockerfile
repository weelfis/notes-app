# Этап сборки
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и yarn.lock, устанавливаем зависимости
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Копируем весь проект
COPY . .

# Генерируем статический сайт
RUN yarn generate

# Финальный этап
FROM node:20-alpine

WORKDIR /app

# Устанавливаем только необходимые зависимости для продакшн окружения
COPY --from=builder /app/.output ./

# Устанавливаем пакет для сервировки статических файлов
RUN yarn global add serve

# Открываем порт 3000 для контейнера
EXPOSE 3000

# Запускаем serve для обслуживания сгенерированных статических файлов
CMD ["serve", "-s", ".", "-l", "3000"]