default: help

# PARAMETERS
PYTHON3 ?= python3.8
VENV_NAME ?= .venv

# INTERNAL
_VENV_ACTIVATE = $(VENV_NAME)/bin/activate

.PHONY: help
help: ## display this help message
	@echo "Please use \`make <target>\` where <target> is one of:"
	@grep -h '^[a-zA-Z]' $(MAKEFILE_LIST) | sort | awk -F ':.*?## ' 'NF==2 {printf "\033[36m%-15s\033[0m%s\n", $$1, $$2}'

.PHONY: clean
clean: ## clean up temp & local build files
	rm -rf __pycache__
	rm -rf *.egg-info
	rm -rf .mypy_cache/

.PHONY: install
install: venv ## install the flask application including all development dependencies locally
	. $(_VENV_ACTIVATE) && \
	pip install -e .[dev]; \

.PHONY: lint
lint: ## run flake8 and mypy
	. $(_VENV_ACTIVATE) && \
	flake8 && \
	mypy -p foodbank_southlondon

.PHONY: run
run: install ## run the flask locally using the builtin flask webserver [DEV]
	export FLASK_APP=foodbank_southlondon.launch:main FLASK_ENV=production && \
	. $(_VENV_ACTIVATE) && \
	flask run --eager-loading

.PHONY: venv
venv: $(_VENV_ACTIVATE) ## create a virtual env if it doesn't exist

$(_VENV_ACTIVATE):
	`which $(PYTHON3)` -m venv $(VENV_NAME) && \
	. $@ && \
	pip install --upgrade pip
	touch $@
