FROM nikolaik/python-nodejs:python3.8-nodejs12

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN adduser --disabled-login --gecos "" foodbank

WORKDIR /home/foodbank/frontend

COPY frontend/package.json ./
RUN npm install
COPY frontend/public public
COPY frontend/src src
RUN npm run-script build

WORKDIR /home/foodbank/backend

COPY backend/requirements.txt backend/setup.py ./
RUN python -m venv .venv
RUN . .venv/bin/activate && pip install --upgrade pip gunicorn
COPY backend/foodbank_southlondon foodbank_southlondon
RUN . .venv/bin/activate && pip install -e .

EXPOSE 5000
USER foodbank
CMD . .venv/bin/activate && gunicorn -b :5000 --access-logfile - --error-logfile - "foodbank_southlondon.launch:main()"
