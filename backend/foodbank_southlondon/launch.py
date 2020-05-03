import logging
import os

import click
import dotenv

from foodbank_southlondon import api, app, bff, config
from foodbank_southlondon.api import events, lists, requests
import foodbank_southlondon.views  # noqa: F401
import foodbank_southlondon.errors  # noqa: F401
import foodbank_southlondon.api.errors  # noqa: F401
import foodbank_southlondon.api.events.views  # noqa: F401
import foodbank_southlondon.api.lists.views  # noqa: F401
import foodbank_southlondon.api.requests.views  # noqa: F401
import foodbank_southlondon.bff.views  # noqa: F401


# ENVIRONMENT VARIABLES
_FBSL_ENVIRONMENT_ENV_VAR = "FBSL_ENVIRONMENT"


def main():
    dotenv.load_dotenv(os.path.join(app.root_path, "..", ".env"))
    environment = os.environ.get(_FBSL_ENVIRONMENT_ENV_VAR)
    app.logger.setLevel(logging.INFO if environment == "prod" else logging.DEBUG)
    app.logger.info(f"Loading environment, {environment} ...")
    app.config.from_object(config.CONFIGURATIONS[environment])
    app.logger.info(f"Initialising APIs, attaching namespaces and registering blueprints  ...")
    api.rest.init_app(api.blueprint)
    api.rest.add_namespace(events.namespace)
    api.rest.add_namespace(lists.namespace)
    api.rest.add_namespace(requests.namespace)
    app.register_blueprint(api.blueprint, url_prefix="/api")
    bff.rest.init_app(bff.blueprint)
    app.register_blueprint(bff.blueprint, url_prefix="/bff")
    return app
