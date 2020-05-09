from typing import Dict, List, Tuple

import flask
import flask_restx  # type:ignore
import pandas as pd  # type:ignore

from foodbank_southlondon.api import rest, utils
from foodbank_southlondon.api.requests import models, namespace, parsers


# CONFIG VARIABLES
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
        delivery_dates = set(delivery_date.strip() for delivery_date in (params["delivery_dates"] or ()))
        client_full_names = set(client_full_name.strip() for client_full_name in (params["client_full_names"] or ()))
        postcodes = set(postcode.strip() for postcode in (params["postcodes"] or ()))
        reference_numbers = set(reference_number.strip() for reference_number in (params["reference_numbers"] or ()))
        last_request_only = params["last_request_only"]
        df = cache(force_refresh=refresh_cache)
        if delivery_dates:
            df = df.loc[df["Delivery Date"].isin(delivery_dates)]
        name_attribute = "Client Full Name"
        if client_full_names or postcodes or reference_numbers:
            df = df.loc[df[name_attribute].isin(client_full_names) | df["Postcode"].isin(postcodes) | df["Reference Number"].isin(reference_numbers)]
        if last_request_only:
            df = df.assign(rank=df.groupby([name_attribute]).cumcount(ascending=False) + 1).query("rank == 1").drop("rank", axis=1)
        df = df.assign(edit_details_url=df["request_id"].map(_edit_details_url))
        return (df, params["page"], params["per_page"])


@namespace.route("/<string:request_ids>")
@namespace.doc(params={"request_ids": "A comma separated list of request_id values to retrieve."})
class RequestsByID(flask_restx.Resource):

    @rest.response(404, "Not Found")
    @rest.expect(parsers.pagination_params)
    @rest.marshal_with(models.page_of_requests)
    @utils.paginate("Client Full Name", "request_id")
    def get(self, request_ids: str) -> Tuple[Dict, int, int]:
        """Get all Client Requests by provided request_id values."""
        request_id_values = set(request_id.strip() for request_id in request_ids.split(","))
        params = parsers.requests_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        request_id_attribute = "request_id"
        df = cache(force_refresh=refresh_cache)
        df = df.loc[df[request_id_attribute].isin(request_id_values)]
        missing_request_ids = request_id_values.difference(df[request_id_attribute].unique())
        if missing_request_ids:
            rest.abort(404, f"the following request_id values {missing_request_ids} were not found.")
        df = df.assign(edit_details_url=df[request_id_attribute].map(_edit_details_url))
        return (df, params["page"], params["per_page"])


@namespace.route("/distinct/")
class DistinctRequestsValues(flask_restx.Resource):

    @rest.expect(parsers.distinct_requests_params)
    @rest.marshal_with(models.distinct_request_values)
    def get(self) -> Dict[str, List]:
        """Get the distinct values of a Requests attribute."""
        params = parsers.distinct_requests_params.parse_args(flask.request)
        delivery_dates = set(delivery_date.strip() for delivery_date in (params["delivery_dates"] or ()))
        attribute = params["attribute"]
        refresh_cache = params["refresh_cache"]
        df = cache(force_refresh=refresh_cache)
        if delivery_dates:
            df = df.loc[df["Delivery Date"].isin(delivery_dates)]
        distinct_values = df[attribute].unique()
        return {"values": sorted(distinct_values)}


def _edit_details_url(request_id):
    return f"https://docs.google.com/forms/d/e/{flask.current_app.config['FBSL_REQUESTS_FORM_URI']}/viewForm?edit2={request_id}"


def cache(force_refresh: bool = False) -> pd.DataFrame:
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_REQUESTS_GSHEET_URI], force_refresh=force_refresh)
