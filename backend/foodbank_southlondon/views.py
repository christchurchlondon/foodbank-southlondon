from typing import Tuple, Union

import flask
import googleapiclient  # type:ignore
import werkzeug

from foodbank_southlondon import app, oauth, helpers


# CONFIG VARIABLES
_FBSL_GSUITE_GROUP_ADDRESS = "FBSL_GSUITE_GROUP_ADDRESS"
_FBSL_USER_SESSION_VAR = "FBSL_USER_SESSION_VAR"
_PREFERRED_URL_SCHEME = "PREFERRED_URL_SCHEME"


@app.route("/")
def catch_all() -> Union[flask.Response, werkzeug.Response]:
    if flask.session.get(flask.current_app.config[_FBSL_USER_SESSION_VAR]):
        return app.send_static_file("index.html")
    return flask.redirect("/login")


@app.route("/auth")
def auth() -> Union[Tuple[str, int], werkzeug.Response]:
    token = oauth.google.authorize_access_token()
    user = oauth.google.parse_id_token(token)
    try:
        helpers.gsuite_members_resource().get(groupKey=flask.current_app.config[_FBSL_GSUITE_GROUP_ADDRESS], memberKey=user["sub"]).execute()
    except googleapiclient.errors.HttpError as error:
        if error.resp.status == 404:
            return ("Permission Denied.", 403)
        raise
    flask.session[flask.current_app.config[_FBSL_USER_SESSION_VAR]] = user
    return flask.redirect("/")


@app.route("/login")
def login() -> werkzeug.Response:
    return oauth.google.authorize_redirect(flask.url_for("auth", _external=True))


@app.route("/logout")
def logout() -> werkzeug.Response:
    flask.session.pop(flask.current_app.config[_FBSL_USER_SESSION_VAR], None)
    return flask.redirect("https://accounts.google.com/Logout")
