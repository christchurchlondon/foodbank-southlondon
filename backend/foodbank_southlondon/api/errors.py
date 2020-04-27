from typing import Dict, Tuple

from werkzeug import exceptions
import flask

from foodbank_southlondon.api import rest


@rest.errorhandler(exceptions.HTTPException)
def handle_http_error(error: exceptions.HTTPException) -> Tuple[Dict, int]:
    data = getattr(error, "data", {})
    flask.current_app.logger.debug(f"A {error.name} ({error.code}: {error.description}) error was encountered. Data: {data}")
    return (data, error.code)
