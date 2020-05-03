default: help

.PHONY: help
help: ## display this help message
	@echo "Please use \`make <target>\` where <target> is one of:"
	@grep -h '^[a-zA-Z]' $(MAKEFILE_LIST) | sort | awk -F ':.*?## ' 'NF==2 {printf "\033[36m%-15s\033[0m%s\n", $$1, $$2}'

.PHONY: build
build: install ## build the frontend application files
	npm run build

.PHONY: clean
clean: ## clean up temp & local build files
	rm -rf build
	rm -rf node_modules
	rm -rf npm-debug.log

.PHONY: install
install: ## install the node application dependencies locally
	npm install

.PHONY: run
run: install ## run the application locally using the node webserver [DEV]
	npm start
