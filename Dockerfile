FROM node:12-alpine AS builder

WORKDIR /home/foodbank/frontend

COPY frontend .
RUN npm install && \
    npm run build


FROM python:3.8-slim-buster

RUN adduser --disabled-login --gecos "" foodbank

WORKDIR /home/foodbank/backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && \
    apt-get install -y libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0 libffi-dev && \
    apt-get autoremove

RUN python -m venv .venv && \
    .venv/bin/pip install --upgrade pip gunicorn
COPY backend .
RUN .venv/bin/pip install -e .

COPY --from=builder /home/foodbank/frontend /home/foodbank/frontend

EXPOSE $PORT
USER foodbank
CMD .venv/bin/gunicorn -b :$PORT --access-logfile - --error-logfile - --workers 3 "foodbank_southlondon.launch:main()"