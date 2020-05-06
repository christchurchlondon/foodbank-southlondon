from typing import Union

import flask
import werkzeug

from foodbank_southlondon import app, oauth


_USER_SESSION_VAR = "user"


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path: str) -> Union[flask.Response, str]:
    if flask.session.get(_USER_SESSION_VAR):
        return app.send_static_file("index.html")
    return "<a href=/login><h1>Login</h1></a>"


@app.route("/auth")
def auth() -> werkzeug.Response:
    token = oauth.google.authorize_access_token()
    flask.session[_USER_SESSION_VAR] = oauth.google.parse_id_token(token)
    return flask.redirect("/")


@app.route("/login")
def login() -> werkzeug.Response:
    return oauth.google.authorize_redirect(flask.url_for("auth", _external=True))


@app.route("/logout")
def logout() -> werkzeug.Response:
    flask.session.pop(_USER_SESSION_VAR, None)
    return flask.redirect("/")
