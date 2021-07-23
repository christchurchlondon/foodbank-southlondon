import flask
import flask_restx  # type: ignore

from foodbank_southlondon import helpers


blueprint = flask.Blueprint("api", __name__)
rest = flask_restx.Api(title="FoodBank South London API")


@blueprint.before_request
@helpers.login_required
def before_request() -> None:
    pass
