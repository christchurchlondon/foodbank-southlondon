default: help

.PHONY: help
help: ## (display this help message)
	@echo "Please use \`make <target>\` where <target> is one of:"
	@grep -h '^[a-zA-Z]' $(MAKEFILE_LIST) | sort | awk -F ':.*?## ' 'NF==2 {printf "\033[36m%-15s\033[0m%s\n", $$1, $$2}'

.PHONY: install
install: ## (install the node application dependencies)
	npm install

.PHONY: run
run: install ## (start the node application)
	npm start
