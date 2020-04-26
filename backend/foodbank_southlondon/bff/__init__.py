import flask
import flask_restx  # type:ignore


blueprint = flask.Blueprint("bff", __name__)
rest = flask_restx.Api(title="FoodBank South London API (BFF)")
