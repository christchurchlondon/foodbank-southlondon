FROM python:3.8-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN adduser --disabled-login --gecos "" foodbank

WORKDIR /home/foodbank/

COPY backend/requirements.txt backend/setup.py backend/
RUN python -m venv .venv
RUN . .venv/bin/activate && pip install --upgrade pip gunicorn

COPY backend/foodbank_southlondon backend/foodbank_southlondon
RUN . .venv/bin/activate && pip install -e backend

COPY frontend/build frontend/build

USER foodbank
EXPOSE 5000
CMD . .venv/bin/activate && gunicorn -b :5000 --access-logfile - --error-logfile - "foodbank_southlondon.launch:main()"
