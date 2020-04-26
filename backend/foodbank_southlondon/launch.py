import os

import click
import dotenv

from foodbank_southlondon import api, app, bff, config
from foodbank_southlondon.api import events, lists, requests
import foodbank_southlondon.views  # noqa: F401
import foodbank_southlondon.api.events.views  # noqa: F401
import foodbank_southlondon.api.lists.views  # noqa: F401
import foodbank_southlondon.api.requests.views  # noqa: F401
import foodbank_southlondon.bff.views  # noqa: F401


# ENVIRONMENT VARIABLES
_FBSL_ENVIRONMENT_ENV_VAR = "FBSL_ENVIRONMENT"


@click.command()
def main():
    dotenv.load_dotenv(os.path.join(app.instance_path, "..", ".env"))
    environment = os.environ.get(_FBSL_ENVIRONMENT_ENV_VAR)
    app.config.from_object(config.CONFIGURATIONS[environment])
    api.rest.init_app(api.blueprint)
    api.rest.add_namespace(events.namespace)
    api.rest.add_namespace(lists.namespace)
    api.rest.add_namespace(requests.namespace)
    app.register_blueprint(api.blueprint, url_prefix="/api")
    bff.rest.init_app(bff.blueprint)
    app.register_blueprint(bff.blueprint, url_prefix="/bff")
    app.run()
