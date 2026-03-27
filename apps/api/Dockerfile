FROM node:20-alpine
WORKDIR /app

COPY package.json ./
COPY apps/api/package.json ./apps/api/package.json
RUN npm install

COPY . .
RUN npm run prisma:generate -w apps/api
RUN npm run build -w apps/api

EXPOSE 3333
CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && npm run db:seed && npm run start"]

