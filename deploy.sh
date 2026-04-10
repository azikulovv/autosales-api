npm i -g pm2

# установка зависимостей
npm ci

# сгенерировать клиент
npx prisma generate

# создать БД и таблицы из schema
npx prisma db push

# сборка
npm run build

# перезапуск проекта
pm2 restart autosales-api

# запуск сервера
# pm2 start dist/server.js --name autosales-api
# pm2 save
# pm2 startup
