import flask


app = flask.Flask(__name__, instance_relative_config=True, static_folder="../../frontend/")
