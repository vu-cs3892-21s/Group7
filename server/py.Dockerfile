FROM python:latest

WORKDIR /server

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .
EXPOSE 8081
ENTRYPOINT flask run --host=0.0.0.0 --port 8081