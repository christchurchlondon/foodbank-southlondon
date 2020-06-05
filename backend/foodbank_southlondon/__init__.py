from typing import Callable, Dict

from authlib.integrations import flask_client  # type:ignore
import flask


class _ReverseProxied(object):
    def __init__(self, app: Callable) -> None:
        self.app = app

    def __call__(self, environ: Dict, start_response: Callable) -> Callable:
        scheme = environ.get("HTTP_X_FORWARDED_PROTO")
        if scheme:
            environ["wsgi.url_scheme"] = scheme
        return self.app(environ, start_response)


app = flask.Flask(__name__, static_folder="../../frontend/build", template_folder="templates")
app.wsgi_app = _ReverseProxied(app.wsgi_app)  # type:ignore

oauth = flask_client.OAuth()
