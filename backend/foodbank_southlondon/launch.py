import os

import click
import dotenv

from foodbank_southlondon import api, bff, config, views
import foodbank_southlondon


# ENVIRONMENT VARIABLES
_FBSL_ENVIRONMENT_ENV_VAR = "FBSL_ENVIRONMENT"


@click.command()
def main():
    dotenv.load_dotenv(os.path.join(foodbank_southlondon.app.instance_path, "..", ".env"))
    environment = os.environ.get(_FBSL_ENVIRONMENT_ENV_VAR)
    foodbank_southlondon.app.config.from_object(config.CONFIGURATIONS[environment])
    foodbank_southlondon.app.register_blueprint(api.blueprint, url_prefix="/api")
    foodbank_southlondon.app.register_blueprint(bff.blueprint, url_prefix="/bff")
    foodbank_southlondon.app.run()
