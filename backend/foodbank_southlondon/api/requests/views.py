import flask
import flask_restx  # type:ignore

from foodbank_southlondon.api import rest, utils
from foodbank_southlondon.api.requests import models, namespace, parsers


# CONFIG VARIABLES
_FBSL_REQUESTS_DRIVE_URI = "FBSL_REQUESTS_DRIVE_URI"

# INTERNALS
_CACHE_NAME = "requests"


@namespace.route("/")
class Requests(flask_restx.Resource):

    @rest.expect(parsers.requests_params)
    @rest.marshal_with(models.page_of_requests)
    @utils.paginate
    def get(self):
        """List all Client Requests."""
        params = parsers.requests_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        ref_numbers = params["ref_numbers"]
        last_req_only = params["last_req_only"]
        data = cache(force_refresh=refresh_cache)
        if ref_numbers:
            data = data[data["Reference Number"] in ref_numbers]
        if last_req_only:
            data = (
                data.assign(rank=data.groupby(["Reference Number"])["Request ID"].rank(method="first", ascending=False))
                .query("rank == 1")
                .drop("rank")
            )
        return (data, params["page"], params["per_page"])


@namespace.route("/<string:id>")
class Request(flask_restx.Resource):
    def get(self, id):
        """Get a single Client Request."""
        pass


def cache(force_refresh=False):
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_REQUESTS_DRIVE_URI], force_refresh=force_refresh)
