import flask

from foodbank_southlondon import app


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path: str) -> flask.Response:
    return flask.redirect("http://localhost:3000")
