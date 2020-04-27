import json

import flask
import flask_restx  # type:ignore

from foodbank_southlondon.api import rest, utils
from foodbank_southlondon.api.lists import models, namespace, parsers
from foodbank_southlondon.api.requests import views as request_views


# CONFIG VARIABLES
_FBSL_LISTS_CACHE_EXPIRY_SECONDS = "FBSL_LISTS_CACHE_EXPIRY_SECONDS"
_FBSL_LISTS_GSHEET_URI = "FBSL_LISTS_GSHEET_URI"

# INTERNALS
_CACHE_NAME = "lists"


@namespace.route("/")
class Lists(flask_restx.Resource):

    @rest.expect(parsers.cache_params)
    @rest.marshal_with(models.all_lists)
    def get(self):
        """List all Lists."""
        params = parsers.cache_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        data = cache(force_refresh=refresh_cache)
        return {"items": data.to_dict("records")}

    @rest.expect(models.list)
    @rest.response(201, "Created")
    def post(self):
        """Create (or overwrite) a Shopping List."""
        data = flask.request.json
        type = data["Type"]
        requests_data = request_views.cache(force_refresh=True)
        if requests_data[requests_data["Type"] == type].empty:
            rest.abort(400, f"Type, {type} is not found amongst any existing requests.")
        data["Items"] = str(data["Items"])
        utils.upsert_row(flask.current_app.config[_FBSL_LISTS_GSHEET_URI], type, list(data.values()))
        utils.delete_cache(_CACHE_NAME)
        return None, 201


@namespace.route("/<string:type>")
class Request(flask_restx.Resource):

    @rest.response(404, "Not found")
    @rest.expect(parsers.cache_params)
    @rest.marshal_with(models.list)
    def get(self, type):
        """Get a single Shopping List."""
        params = parsers.cache_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        data = cache(force_refresh=refresh_cache)
        data = data[data["Type"].astype("str") == type]  # shouldn't need astype conversion
        if data.empty:
            rest.abort(404, f"Type, {type} was not found.")
        list = data.to_dict("records")[0]
        list["Items"] = json.loads(list["Items"].replace("'", "\""))
        return list


def cache(force_refresh=False):
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_LISTS_GSHEET_URI],
                       expires_after=flask.current_app.config[_FBSL_LISTS_CACHE_EXPIRY_SECONDS], force_refresh=force_refresh)
