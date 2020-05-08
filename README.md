# FoodBank - South London

## Contents
* [Overview](#overview)
* [Setup](#setup)
    * [Development](#development)
    * [Production](#production)
    * [Environment Variables](#environment-variables)
* [Contributing](#contributing)

## Overview
This codebase contains the frontend and backend of a simple website. It is designed to simplify the process for tracking the status of food parcels for clients in FoodBank, South London. The website enables users to check status, print various documents & labels and update status information for clients that food parcels are being prepared for / delivered to. The website application is stateless and all data is stored in protected Google Sheets. More information, for those who have access, can be found in the [shared Google Drive](https://drive.google.com/drive/folders/0ABoZT0Wte3WNUk9PVA).

## Setup
The application can be installed and ran locally for development or deployed and ran in a Docker container for production. This application uses [makefiles](https://www.gnu.org/software/make/manual/make.html). If you've done this kind of thing before, type `make` from inside the *root* directory or *backend* or *frontend* directories to see available options and help messages.

### Development
When running locally, you have two options:
1) Run the frontend and/or backend separately - most useful when doing highly iterative development on a particular part.
2) Build the frontend static files and just run the backend - most useful when doing development that affects the integration of the frontend and backend, or for testing.

#### Prerequisites
* Install **Make** - Mac (builtin in *[Xcode](https://developer.apple.com/xcode/)*) | Ubuntu (builtin)
* Install **NodeJS & npmjs** - [Mac](https://nodejs.org/en/download/) | [Ubuntu](https://github.com/nodesource/distributions)
* Install **Python 3.8** - [Mac](https://www.python.org/downloads/mac-osx/) | [Ubuntu](https://launchpad.net/~deadsnakes/+archive/ubuntu/ppa) (*python3.8 python3.8-dev python3.8-venv*)
* Install **Git** - Mac (builtin in *[Xcode](https://developer.apple.com/xcode/)*) | Ubuntu (builtin)
* Clone this repository

#### Installation
To install both the frontend and backend dependencies, run the following command inside the repository root directory:
```
make install
```
*Note: to install dependencies for only the frontend or backend, you can run the same command from inside the frontend or backend directories.*

#### Run
To run both the frontend and backend applications, run the following command from inside the repository root directory:
```
make run
```
*Note: to run just the frontend or backend applications, you can run the same command from inside the frontend or backend directories.*

### Production
To install the application in a production environment, you need a different set of prerequisites and there is no installation step as it is covered as part of the run step.

#### Prerequisites
* Install **Make** - Mac (builtin in *[Xcode](https://developer.apple.com/xcode/)*) | Ubuntu (builtin)
* Install **Docker** [Mac] (https://docs.docker.com/docker-for-mac/install/ | ) [Ubuntu] (https://docs.docker.com/engine/install/ubuntu/)
* Clone this repository

#### Run
To build the docker image and run a container, run the following command from inside the repository root directory:
```
make deploy
```

### Environment Variables
Whether you are running the application in development or production, you will need to have the following environment variables set ahead of running the backend application:
* FLASK_ENV - **development** (**production** is set automatically when make deploy is invoked)

The following two variables can be set as you would normally set environment variables OR you can store them in a file called **development.env** or **production.env** inside the *backend* directory and they will be excluded from source control.
* FBSL_CLIENT_SECRET - the Google Cloud Platform OAuth 2.0 Client Secret that has domain-wide delegation and permission to query the GSuite Admin SDK
* FBSL_SA_KEY - the Google Cloud Platform service account key that has permission to the google sheets data storage


## Contributing
To contribute, please pull from master, work on a feature branch and then raise a pull request to merge into master. The pull request requires an approval before it can be merged.
