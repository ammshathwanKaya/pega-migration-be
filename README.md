docker-compose up -d

npx prisma migrate dev

npm run dev

npx prisma studio --config ./prisma.config.ts

<!-- after update model -->

npx prisma db push

npx prisma generate
