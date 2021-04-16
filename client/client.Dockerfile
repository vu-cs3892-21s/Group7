FROM node:latest

WORKDIR /client

RUN npm install -g serve

# COPY ./package.json .
COPY ./package.json ./package-lock.json ./

RUN npm install

ENV PORT=${PORT:-8000}
ENV HOST=${HOST:-0.0.0.0}
ENV NODE_ENV=${NODE_ENV:-production}
ENV DEPLOYMENT_ENDPOINT=${DEPLOYENT_ENDPOINT:-localhost}

COPY . .

EXPOSE ${PORT}
RUN npm run-script build
ENTRYPOINT serve build -l tcp://${HOST}:${PORT}