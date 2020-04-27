import flask
import flask_restx  # type:ignore

from foodbank_southlondon.api import rest, utils
from foodbank_southlondon.api.events import models, namespace, parsers


# CONFIG VARIABLES
_FBSL_EVENTS_CACHE_EXPIRY_SECONDS = "FBSL_EVENTS_CACHE_EXPIRY_SECONDS"
_FBSL_EVENTS_GSHEET_URI = "FBSL_EVENTS_GSHEET_URI"

# INTERNALS
_CACHE_NAME = "events"


@namespace.route("/")
class Events(flask_restx.Resource):

    @rest.expect(parsers.events_params)
    @rest.marshal_with(models.page_of_events)
    @utils.paginate
    def get(self):
        """List all Events."""
        params = parsers.requests_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        req_ids = params["req_ids"]
        event_name = params["event_name"]
        last_event_only = params["last_event_only"]
        data = cache(force_refresh=refresh_cache)

    def post(self):
        """Create (log) an Event."""
        pass


def cache(force_refresh=False):
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_EVENTS_GSHEET_URI],
                       expires_after=flask.current_app.config[_FBSL_EVENTS_CACHE_EXPIRY_SECONDS], force_refresh=force_refresh)
