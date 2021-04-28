FROM python:latest

WORKDIR /server

COPY ./requirements.txt .

RUN pip install -r requirements.txt

ENV FLASK_APP=src/main.py
ENV FLASK_RUN_HOST=${HOST:-0.0.0.0}
ENV FLASK_RUN_PORT=${PORT:-5000}
ENV FLASK_ENV=${FLASK_ENV:-production}
ENV DATABASE_URI=${DATABASE_URI:-postgresql://postgres:postgres@postgres:5432/postgres}
ENV DEPLOYMENT_ENDPOINT=${DEPLOYMENT_ENDPOINT:-localhost}

COPY . .
EXPOSE ${FLASK_RUN_PORT}
ENTRYPOINT python ${FLASK_APP}
