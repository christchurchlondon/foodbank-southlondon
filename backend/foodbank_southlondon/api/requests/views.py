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
        client_full_names = params["client_full_names"]
        last_req_only = params["last_req_only"]
        data = cache(force_refresh=refresh_cache)
        if client_full_names:
            data = data[data["Client Full Name"].isin(client_full_names)]
        if last_req_only:
            data = (
                data.astype("str").assign(rank=data.groupby(["Client Full Name"]).cumcount(ascending=False) + 1)
                .query("rank == 1")
                .drop("rank", axis=1)
            )
        data["edit_details_url"] = data["RequestID"].apply(_edit_details_url)
        return (data, params["page"], params["per_page"])


@namespace.route("/<string:request_id>")
@namespace.doc(params={"request_id": "The id of the Client Request to retrieve."})
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
        data["edit_details_url"] = data["RequestID"].apply(_edit_details_url)
        return data.to_dict("records")[0]


@namespace.route("/distinct/")
class DistinctRequestsValues(flask_restx.Resource):

    @rest.expect(parsers.distinct_requests_params)
    @rest.marshal_with(models.distinct_request_values)
    def get(self) -> Dict[str, List]:
        """Get the distinct values of a Requests attribute."""
        params = parsers.distinct_requests_params.parse_args(flask.request)
        attribute = params["attribute"]
        refresh_cache = params["refresh_cache"]
        data = cache(force_refresh=refresh_cache)
        data = data[attribute].unique()
        return {"Values": list(data)}


def _edit_details_url(request_id):
    return f"https://docs.google.com/forms/d/e/{flask.current_app.config['FBSL_REQUESTS_FORM_URI']}/viewForm?edit2={request_id}"


def cache(force_refresh: bool = False) -> pd.DataFrame:
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_REQUESTS_GSHEET_URI],
                       expires_after=flask.current_app.config[_FBSL_REQUESTS_CACHE_EXPIRY_SECONDS], force_refresh=force_refresh)
