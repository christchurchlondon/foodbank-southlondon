default: help

.PHONY: help
help: ## display this help message
	@echo "Please use \`make <target>\` where <target> is one of:"
	@grep -h '^[a-zA-Z]' $(MAKEFILE_LIST) | sort | awk -F ':.*?## ' 'NF==2 {printf "\033[36m%-15s\033[0m%s\n", $$1, $$2}'

.PHONY: clean
clean: ## clean up temp & local build files (FRONTEND make clean + BACKEND make clean)
	make -C frontend clean
	make -C backend clean

.PHONY: deploy
deploy: ## run the application in production using gunicorn inside docker (docker build & docker run)
	docker build -t foodbank-southlondon:latest .
	docker run --restart=always -p 8000:5000 -e FBSL_ENVIRONMENT=prod -e FLASK_ENV=production foodbank-southlondon:latest

.PHONY: install
install:  ## install the frontend and backend applications' dependencies locally (FRONTEND make install & BACKEND make install)
	make -C frontend install
	make -C backend install

.PHONY: run
run: ## run the application in development mode locally using the builtin Flask webserver (FRONTEND make build + BACKEND make run)
	make -C frontend build
	make -C backend run
