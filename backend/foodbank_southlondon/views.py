from typing import Union

import flask
import googleapiclient
import werkzeug

from foodbank_southlondon import app, oauth, utils


# CONFIG VARIABLES
_FBSL_GSUITE_GROUP_ADDRESS = "FBSL_GSUITE_GROUP_ADDRESS"


# INTERNALS
_USER_SESSION_VAR = "user"


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path: str) -> Union[flask.Response, str]:
    if flask.session.get(_USER_SESSION_VAR):
        return app.send_static_file("index.html")
    return "<a href=/login><h1>Login</h1></a>"


@app.route("/auth")
def auth() -> Union[str, werkzeug.Response]:
    token = oauth.google.authorize_access_token()
    user = oauth.google.parse_id_token(token)
    try:
        utils.gsuite_members_resource().get(groupKey=flask.current_app.config[_FBSL_GSUITE_GROUP_ADDRESS], memberKey=user["email"]).execute()
    except googleapiclient.errors.HttpError as error:
        if error.resp.status == 404:
            return "Permission Denied. Go back to <a href=/>Home</a>."
        raise
    flask.session[_USER_SESSION_VAR] = user
    return flask.redirect("/")


@app.route("/login")
def login() -> werkzeug.Response:
    return oauth.google.authorize_redirect(flask.url_for("auth", _external=True))


@app.route("/logout")
def logout() -> werkzeug.Response:
    flask.session.pop(_USER_SESSION_VAR, None)
    return flask.redirect("/")
