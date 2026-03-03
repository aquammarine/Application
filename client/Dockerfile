FROM node:20-alpine

WORKDIR /app

# Копіюємо файли залежностей та встановлюємо їх
COPY package*.json ./
RUN npm install

# Копіюємо вихідний код
COPY . .

EXPOSE 5173

# Запускаємо Vite з прапорцем --host, щоб він був доступний поза контейнером
CMD ["npm", "run", "dev", "--", "--host"]