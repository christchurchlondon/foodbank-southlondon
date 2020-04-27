import flask
import flask_restx  # type:ignore

from foodbank_southlondon.api import rest, utils
from foodbank_southlondon.api.requests import models, namespace, parsers


# CONFIG VARIABLES
_FBSL_REQUESTS_CACHE_EXPIRY_SECONDS = "FBSL_REQUESTS_CACHE_EXPIRY_SECONDS"
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
            data = data[data["Reference Number"].isin(ref_numbers)]
        if last_req_only:
            data = (
                data.assign(rank=data.groupby(["Reference Number"])["Request ID"].rank(method="first", ascending=False))
                .query("rank == 1")
                .drop("rank", axis=1)
            )
        return (data, params["page"], params["per_page"])


@namespace.route("/<string:request_id>")
class Request(flask_restx.Resource):

    @rest.response(404, "Request not found")
    @rest.expect(parsers.cache_params)
    @rest.marshal_with(models.request)
    def get(self, request_id):
        """Get a single Client Request."""
        params = parsers.requests_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        data = cache(force_refresh=refresh_cache)
        data = data[data["Request ID"].astype("str") == request_id]  # shouldn't need astype conversion
        if data.empty:
            rest.abort(404, f"Request ID, {request_id} was not found.")
        return data.to_dict("records")[0]


def cache(force_refresh=False):
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_REQUESTS_DRIVE_URI],
                       expires_after=flask.current_app.config[_FBSL_REQUESTS_CACHE_EXPIRY_SECONDS], force_refresh=force_refresh)
