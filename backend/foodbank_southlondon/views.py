import flask

from foodbank_southlondon import app


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path: str) -> flask.Response:
    return app.send_static_file("index.html")
