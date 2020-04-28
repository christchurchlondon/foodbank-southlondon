from typing import Any, Dict, List, Tuple

import flask
import flask_restx  # type:ignore
import pandas as pd  # type:ignore

from foodbank_southlondon.api import rest, utils
from foodbank_southlondon.api.requests import models, namespace, parsers


# CONFIG VARIABLES
_FBSL_REQUESTS_CACHE_EXPIRY_SECONDS = "FBSL_REQUESTS_CACHE_EXPIRY_SECONDS"
_FBSL_REQUESTS_GSHEET_URI = "FBSL_REQUESTS_GSHEET_URI"

# INTERNALS
_CACHE_NAME = "requests"


@namespace.route("/")
class Requests(flask_restx.Resource):

    @rest.expect(parsers.requests_params)
    @rest.marshal_with(models.page_of_requests)
    @utils.paginate("RequestID")
    def get(self) -> Tuple[Dict, int, int]:
        """List all Client Requests."""
        params = parsers.requests_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        ref_nums = params["ref_nums"]
        last_req_only = params["last_req_only"]
        data = cache(force_refresh=refresh_cache)
        if ref_nums:
            data = data[data["Reference Number"].isin(ref_nums)]
        if last_req_only:
            data = (
                data.astype("str").assign(rank=data.groupby(["Reference Number"]).cumcount(ascending=False) + 1)
                .query("rank == 1")
                .drop("rank", axis=1)
            )
        return (data, params["page"], params["per_page"])


@namespace.route("/distinct/")
class DistinctRequestsValues(flask_restx.Resource):

    @rest.expect(parsers.distinct_requests_params)
    @rest.marshal_with(models.distinct_values)
    def get(self) -> Dict[str, List]:
        """Get the distinct values of a Requests attribute."""
        params = parsers.distinct_requests_params.parse_args(flask.request)
        attribute = params["attribute"]
        refresh_cache = params["refresh_cache"]
        data = cache(force_refresh=refresh_cache)
        data = data[attribute].unique()
        return {"Values": list(data)}


@namespace.route("/<string:request_id>")
class Request(flask_restx.Resource):

    @rest.response(404, "Not Found")
    @rest.expect(parsers.cache_params)
    @rest.marshal_with(models.request)
    def get(self, request_id: str) -> Dict[str, Any]:
        """Get a single Client Request."""
        params = parsers.requests_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        data = cache(force_refresh=refresh_cache)
        data = data[data["RequestID"].astype("str") == request_id]
        if data.empty:
            rest.abort(404, f"RequestID, {request_id} was not found.")
        return data.to_dict("records")[0]


def cache(force_refresh: bool = False) -> pd.DataFrame:
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_REQUESTS_GSHEET_URI],
                       expires_after=flask.current_app.config[_FBSL_REQUESTS_CACHE_EXPIRY_SECONDS], force_refresh=force_refresh)
