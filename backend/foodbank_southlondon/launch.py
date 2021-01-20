import logging
import os

import dotenv

from foodbank_southlondon import api, app, bff, config, oauth
from foodbank_southlondon.api import events, lists, requests
import foodbank_southlondon.views  # noqa: F401
import foodbank_southlondon.errors  # noqa: F401
import foodbank_southlondon.api.errors  # noqa: F401
import foodbank_southlondon.api.events.views  # noqa: F401
import foodbank_southlondon.api.lists.views  # noqa: F401
import foodbank_southlondon.api.requests.views  # noqa: F401
import foodbank_southlondon.bff.views  # noqa: F401


# ENVIRONMENT VARIABLES
_FLASK_ENV_ENV_VAR = "FLASK_ENV"


def main():
    environment = os.environ.get(_FLASK_ENV_ENV_VAR)
    app.logger.setLevel(logging.INFO if environment == "production" else logging.DEBUG)
    env_file_path = os.path.join(app.root_path, "..", f"{environment}.env")
    app.logger.info(f"Loading .env file, {env_file_path}...")
    dotenv.load_dotenv(env_file_path)
    app.logger.info(f"Loading environment, {environment} ...")
    configurations = {"development": config.DevelopmentConfig(), "production": config.ProductionConfig()}
    app.config.from_object(configurations[environment])
    app.logger.info("Initialising APIs, OAuth, attaching namespaces and registering blueprints  ...")
    oauth.register(name="google", server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
                   client_kwargs={"scope": "openid email profile"})
    oauth.init_app(app)
    api.rest.init_app(api.blueprint)
    api.rest.add_namespace(events.namespace)
    api.rest.add_namespace(lists.namespace)
    api.rest.add_namespace(requests.namespace)
    app.register_blueprint(api.blueprint, url_prefix="/api")
    bff.rest.init_app(bff.blueprint)
    app.register_blueprint(bff.blueprint, url_prefix="/bff")
    return app
