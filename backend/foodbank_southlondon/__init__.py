import flask


app = flask.Flask(__name__, static_folder="../../frontend/build", template_folder="templates")
