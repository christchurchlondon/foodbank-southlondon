from typing import Tuple

from werkzeug import exceptions
import flask

from foodbank_southlondon import app


@app.errorhandler(exceptions.HTTPException)
def handle_http_error(error: exceptions.HTTPException) -> Tuple[str, int]:
    flask.current_app.logger.debug(f"A {error.name} ({error.code}: {error.description}) error was encountered.")
    return (error.name, error.code)
