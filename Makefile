default: help

.PHONY: help
help: ## (display this help message)
	@echo "Please use \`make <target>\` where <target> is one of:"
	@grep -h '^[a-zA-Z]' $(MAKEFILE_LIST) | sort | awk -F ':.*?## ' 'NF==2 {printf "\033[36m%-15s\033[0m%s\n", $$1, $$2}'

.PHONY: install
install:  ## (install the frontend and backend applications' dependencies)
	make -C frontend install
	make -C backend install

.PHONY: run
run: ## (start the frontend and backend applications)
	make -C frontend run
	make -C backend run

# add a target that runs the webserver (if not already running) AND starts the machine's default internet browser with the website open
