FROM node:20-alpine


WORKDIR /app

COPY package*.json ./
COPY entrypoint.sh /entrypoint.sh

RUN npm install
COPY . .

RUN npm run build && \
    chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]