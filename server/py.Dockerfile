FROM python:latest

WORKDIR /server

COPY ./requirements.txt .

RUN pip install -r requirements.txt

ENV FLASK_APP=src/main.py
ENV FLASK_RUN_HOST=${HOST:-0.0.0.0}
ENV FLASK_RUN_PORT=${PORT:-5000}
ENV FLASK_ENV=${FLASK_ENV:-production}
ENV DATABASE_URI=${DATABASE_URI:-postgresql+psycopg2://postgres:postgres@35.224.144.168:5432/postgres}
ENV DB_USER=${DB_USER:-postgres}
ENV DB_PASS=${DB_PASS:-postgres}
ENV DB_NAME=${DB_NAME:-postgres}
ENV DB_HOST=${DB_HOST:-35.224.144.168}
ENV DB_PORT=${DB_PORT:-5432}
ENV DB_SOCKET_DIR=${DB_SOCKET_DIR:-cloudsql}
ENV CLOUD_SQL_CONNECTION_NAME=${CLOUD_SQL_CONNECTION_NAME:-seventh-atom-311914:us-central1:postgres-db}
ENV DEPLOYMENT_ENDPOINT=${DEPLOYMENT_ENDPOINT:-localhost}

COPY . .
EXPOSE ${FLASK_RUN_PORT}
ENTRYPOINT python ${FLASK_APP}
