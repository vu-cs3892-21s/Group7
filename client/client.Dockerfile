FROM node:latest

WORKDIR /client

# COPY ./package.json .
COPY ./package.json ./package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 8000
ENTRYPOINT npm run-script start