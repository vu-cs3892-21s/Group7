FROM python:latest

WORKDIR /server

COPY ./requirements.txt .

RUN pip install -r requirements.txt

ENV FLASK_APP=src/main.py
ENV FLASK_RUN_HOST=${HOST:-0.0.0.0}
ENV FLASK_RUN_PORT=${PORT:-5000}
ENV FLASK_ENV=${FLASK_ENV:-production}
ENV DATABASE_URI=${DATABASE_URI:-postgresql://postgres:postgres@35.224.144.168/postgres?host=/cloudsql/seventh-atom-311914:us-central1:postgres-db}
ENV DB_USER=${DB_USER:-postgres}
ENV DB_PASS=${DB_PASS:-postgres}
ENV DB_NAME=${DB_NAME:-postgres}
ENV DB_SOCKET_DIR=${DB_SOCKET_DIR:-cloudsql}
ENV CLOUD_SQL_CONNECTION_NAME=${CLOUD_SQL_CONNECTION_NAME:-seventh-atom-311914:us-central1:postgres-db}
ENV DEPLOYMENT_ENDPOINT=${DEPLOYMENT_ENDPOINT:-localhost}

COPY . .
EXPOSE ${FLASK_RUN_PORT}
ENTRYPOINT python ${FLASK_APP}
