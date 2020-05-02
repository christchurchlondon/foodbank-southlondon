default: help

.PHONY: help
help: ## (display this help message)
	@echo "Please use \`make <target>\` where <target> is one of:"
	@grep -h '^[a-zA-Z]' $(MAKEFILE_LIST) | sort | awk -F ':.*?## ' 'NF==2 {printf "\033[36m%-15s\033[0m%s\n", $$1, $$2}'

.PHONY: install
install:  ## (install the backend and frontend applications' dependencies)
	make -C backend install
	make -C frontend install

.PHONY: run
run: ## (start the backend and frontend applications)
	make -C backend run
	make -C frontend run

# add a target that runs the webserver (if not already running) AND starts the machine's default internet browser with the website open
