FROM node:12-alpine AS builder

WORKDIR /home/foodbank/frontend

COPY frontend .
RUN npm install && \
    npm run-script build


FROM python:3.8-slim-buster

RUN adduser --disabled-login --gecos "" foodbank

WORKDIR /home/foodbank/backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN python -m venv .venv && \
    .venv/bin/pip install --upgrade pip gunicorn
COPY backend .
RUN .venv/bin/pip install -e .

COPY --from=builder /home/foodbank/frontend /home/foodbank/frontend

EXPOSE 8080
USER foodbank
CMD .venv/bin/gunicorn -b :8080 --access-logfile - --error-logfile - "foodbank_southlondon.launch:main()"
