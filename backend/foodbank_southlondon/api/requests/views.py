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
    @utils.paginate("Client Full Name", "request_id")
    def get(self) -> Tuple[Dict, int, int]:
        """List all Client Requests."""
        params = parsers.requests_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        client_full_names = set(client_full_name.strip() for client_full_name in (params["client_full_names"] or ()))
        postcodes = set(postcode.strip() for postcode in (params["postcodes"] or ()))
        last_request_only = params["last_request_only"]
        data = cache(force_refresh=refresh_cache)
        client_full_name_attribute = "Client Full Name"
        if client_full_names and not postcodes:
            data = data[data[client_full_name_attribute].isin(client_full_names)]
        elif postcodes and not client_full_names:
            data = data[data["Postcode"].isin(postcodes)]
        elif client_full_names and postcodes:
            data = data[data[client_full_name_attribute].isin(client_full_names) | data["Postcode"].isin(postcodes)]
        if last_request_only:
            data = (
                data.assign(rank=data.groupby([client_full_name_attribute]).cumcount(ascending=False) + 1)
                .query("rank == 1")
                .drop("rank", axis=1)
            )
        data["edit_details_url"] = data["request_id"].apply(_edit_details_url)
        return (data, params["page"], params["per_page"])


@namespace.route("/<string:request_ids>")
@namespace.doc(params={"request_ids": "A comma separated list of request_id values to retrieve."})
class RequestsByID(flask_restx.Resource):

    @rest.response(404, "Not Found")
    @rest.expect(parsers.cache_params)
    @rest.marshal_with(models.request)
    def get(self, request_ids: str) -> Dict[str, Any]:
        """Get all Client Requests by provided request_id values."""
        request_id_values = set(request_id.strip() for request_id in request_ids.split(","))
        params = parsers.requests_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        request_id_attribute = "request_id"
        data = cache(force_refresh=refresh_cache)
        data = data[data[request_id_attribute].isin(request_id_values)]
        missing_request_ids = request_id_values.difference(data[request_id_attribute].unique())
        if missing_request_ids:
            rest.abort(404, f"{request_id_attribute}, the following request_id values {missing_request_ids} were not found.")
        data["edit_details_url"] = data[request_id_attribute].apply(_edit_details_url)
        return data.to_dict("records")


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
        return {"values": sorted(data)}


def _edit_details_url(request_id):
    return f"https://docs.google.com/forms/d/e/{flask.current_app.config['FBSL_REQUESTS_FORM_URI']}/viewForm?edit2={request_id}"


def cache(force_refresh: bool = False) -> pd.DataFrame:
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_REQUESTS_GSHEET_URI],
                       expires_after=flask.current_app.config[_FBSL_REQUESTS_CACHE_EXPIRY_SECONDS], force_refresh=force_refresh)
