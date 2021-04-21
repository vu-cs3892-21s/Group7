FROM python:latest

WORKDIR /server

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000
ENTRYPOINT python $FLASK_APP
