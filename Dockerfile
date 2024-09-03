#Dockerfile
FROM node:18

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

CMD ["node", "dist/server.js"]
