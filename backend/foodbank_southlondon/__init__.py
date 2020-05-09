from authlib.integrations import flask_client  # type:ignore
import flask


app = flask.Flask(__name__, static_folder="../../frontend/build", static_url_path="/", template_folder="templates")

oauth = flask_client.OAuth()
