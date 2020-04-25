# FoodBank - South London (Backend)

Clone this repository and ensure you are inside the directory where this `README.md` file is located.

# Prerequisites
* Download and install [python](https://www.python.org/downloads/)3.8 and ensure `python3.8` is on path (if not, you will need to pass an explicit parameter when using make targets - this may also work for a different python version). You also need to ensure that pip and venv (both accessible via _python<version> -m_) are available. If you are on linux, you may need to install the `python3.8-dev` package.
* Install [Make](https://www.gnu.org/software/make/manual/make.html)

# Setup
Create a `.env` file (this is excluded from source control by .gitignore as it contains secret values) and set the following environment variables:

* FBSL_ENVIRONMENT - the name of the environment to load configuration for (dev, prod)

# Installation
Install all dependencies inside a virtual environment (it will be created if it doesn't already exist) with `make install`

# Usage
* Launch the webserver with `make run`
* Visit `http://localhost:5000` for the home page and http://localhost:5000/api/ & http://localhost:5000/bff for swagger definitions.
