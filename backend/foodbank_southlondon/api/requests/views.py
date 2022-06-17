from typing import Dict, Iterable, List, Tuple
import functools

from fuzzywuzzy import fuzz, process  # type: ignore
import flask
import flask_restx  # type: ignore
import pandas as pd  # type: ignore

from foodbank_southlondon.api import rest, utils
from foodbank_southlondon.api.events import models as events_models, views as events_views
from foodbank_southlondon.api.requests import models, namespace, parsers


# CONFIG VARIABLES
_FBSL_COLLECTION_CENTRES = "FBSL_COLLECTION_CENTRES"
_FBSL_CONGESTION_ZONE_POSTCODES = "FBSL_CONGESTION_ZONE_POSTCODES"
_FBSL_FORM_EDIT_URL_TEMPLATE = "FBSL_FORM_EDIT_URL_TEMPLATE"
_FBSL_FUZZY_SEARCH_THRESHOLD = "FBSL_FUZZY_SEARCH_THRESHOLD"
_FBSL_FORM_ID = "FBSL_FORM_ID"
_FBSL_REQUESTS_GSHEET_ID = "FBSL_REQUESTS_GSHEET_ID"

# INTERNALS
_CACHE_NAME = "requests"
_BASE_COLLECTION_COLUMNS = ["Collection Date", "Collection Centre"]

MAX_NUMBER_OF_SEARCH_RESULTS = 20
scorer = fuzz.partial_ratio

@namespace.route("/")
class Requests(flask_restx.Resource):

    @staticmethod
    def fuzzy_match(text: str, choices: Iterable) -> bool:
        search_threshold = flask.current_app.config[_FBSL_FUZZY_SEARCH_THRESHOLD]
        possibilities = process.extract(text, choices, scorer=scorer)
        return any(p[1] >= search_threshold for p in possibilities)

    @rest.expect(parsers.requests_params)
    @rest.marshal_with(models.page_of_requests)
    @utils.paginate("Packing Date", "Time of Day", "Collection Centre", "Postcode", "request_id")
    def get(self) -> Tuple[Dict, int, int]:
        """List all Client Requests."""
        params = parsers.requests_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        packing_dates = set(packing_date.strip() for packing_date in (params["packing_dates"] or ()))
        client_full_names = set(client_full_name.strip() for client_full_name in (params["client_full_names"] or ()))
        postcodes = set(postcode.strip() for postcode in (params["postcodes"] or ()))
        time_of_days = set(time_of_day.strip() for time_of_day in (params["time_of_days"] or ()))
        voucher_numbers = set("" if voucher_number.strip() == "?" else voucher_number.strip() for voucher_number in (params["voucher_numbers"] or ()))
        collection_centres = set(collection_centre.strip() for collection_centre in (params["collection_centres"] or ()))
        phone_numbers = set(phone_number.strip() for phone_number in (params["phone_numbers"] or ()))
        event_names = set(event_name.strip() for event_name in (params["event_names"] or ()))
        invalid_event_names = event_names.difference(events_models.EVENT_NAMES)
        if invalid_event_names:
            rest.abort(400, f"The following event names are invalid options: {invalid_event_names}. Valid options are: {events_models.EVENT_NAMES}.")
        last_request_only = params["last_request_only"]
        df = cache(force_refresh=refresh_cache)[0]
        df = _clean_collection_columns(df)
        request_id_attribute = "request_id"
        name_attribute = "Client Full Name"
        if packing_dates:
            df = df.loc[df["Packing Date"].isin(packing_dates)]
        if client_full_names:
            df = df.loc[df[name_attribute].map(functools.partial(self.fuzzy_match, choices=client_full_names))]
        postcode_attribute = "Postcode"
        if postcodes:
            df = df.loc[df[postcode_attribute].str.lower().str.startswith(tuple(postcodes)) |
                        df[postcode_attribute].str.lower().str.endswith(tuple(postcodes))]
        if voucher_numbers:
            df = df.loc[df["Voucher Number"].isin(voucher_numbers)]
        if time_of_days:
            df = df.loc[df["Time of Day"].isin(time_of_days)]
        if collection_centres:
            df = df.loc[df["Collection Centre"].isin(collection_centres)]
        if phone_numbers:
            df = df.loc[df["Phone Number"].isin(phone_numbers)]
        if event_names:
            events_df = events_views.cache(force_refresh=refresh_cache)
            events_df = (
                events_df.assign(rank=events_df.sort_values("event_timestamp").groupby([request_id_attribute]).cumcount(ascending=False) + 1)
                .query("rank == 1").drop("rank", axis=1)
            )
            events_df = events_df.loc[events_df["event_name"].isin(event_names)]
            df = df.loc[df[request_id_attribute].isin(events_df[request_id_attribute].values)]
        if last_request_only:
            df = df.assign(rank=df.groupby([name_attribute]).cumcount(ascending=False) + 1).query("rank == 1").drop("rank", axis=1)
        df = df.assign(edit_details_url=df[request_id_attribute].map(_edit_details_url),
                       congestion_zone=df[postcode_attribute].isin(_congestion_zone_postcodes()[postcode_attribute].values))
        return (df, params["page"], params["per_page"])


@namespace.route("/<string:request_ids>")
@namespace.doc(params={"request_ids": "A comma separated list of request_id values to retrieve."})
class RequestsByID(flask_restx.Resource):

    @rest.expect(parsers.pagination_params)
    @rest.response(404, "Not Found")
    @rest.marshal_with(models.page_of_requests)
    @utils.paginate("Postcode")
    def get(self, request_ids: str) -> Tuple[Dict, int, int]:
        """Get all Client Requests by provided request_id values."""
        request_id_values = set(request_id.strip() for request_id in request_ids.split(","))
        params = parsers.requests_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        request_id_attribute = "request_id"
        df = cache(force_refresh=refresh_cache)[0]
        df = _clean_collection_columns(df)
        df = df.loc[df[request_id_attribute].isin(request_id_values)]
        missing_request_ids = request_id_values.difference(df[request_id_attribute].unique())
        if missing_request_ids:
            rest.abort(404, f"the following Request ID values {missing_request_ids} were not found.")
        df = df.assign(edit_details_url=df[request_id_attribute].map(_edit_details_url),
                       congestion_zone=df["Postcode"].isin(_congestion_zone_postcodes()["Postcode"].values))
        return (df, params["page"], params["per_page"])


@namespace.route("/distinct/")
class DistinctRequestsValues(flask_restx.Resource):

    @rest.expect(parsers.distinct_requests_params)
    @rest.marshal_with(models.distinct_request_values)
    def get(self) -> Dict[str, List]:
        """Get the distinct values of a Requests attribute."""
        params = parsers.distinct_requests_params.parse_args(flask.request)
        packing_dates = set(packing_date.strip() for packing_date in (params["packing_dates"] or ()))
        attribute = params["attribute"]
        refresh_cache = params["refresh_cache"]
        df = cache(force_refresh=refresh_cache)[0]
        if packing_dates:
            df = df.loc[df["Packing Date"].isin(packing_dates)]
        distinct_values = df[attribute].unique()
        return {"values": sorted(distinct_values)}


@namespace.route("/search/")
class Search(flask_restx.Resource):

    # TODO MRB: add score as a field
    # and map the keys to their API keys rather than dataframe keys
    @rest.expect(parsers.search_params)
    @rest.marshal_with(models.search_results)
    def get(self) -> List:
        """Free text search for values"""
        params = parsers.search_params.parse_args(flask.request)
        search_threshold = flask.current_app.config[_FBSL_FUZZY_SEARCH_THRESHOLD]
        df = cache()[1]
        df["score"] = df["value"].map(lambda v: scorer(params.q, v))
        df = df.sort_values(by="score", ascending=False)
        df = df.loc[df["score"] > search_threshold]
        df = df.head(MAX_NUMBER_OF_SEARCH_RESULTS)
        return {"results": df.to_dict('records')}


def _clean_collection_columns(df: pd.DataFrame) -> pd.DataFrame:
    shipping_method_column = "Shipping Method"
    collection_centres = flask.current_app.config[_FBSL_COLLECTION_CENTRES]
    collection_time_columns = [f"{collection_centre} Collection Time" for collection_centre in collection_centres]
    empty_collection_time_columns = [""] * (len(collection_time_columns) - 1)
    collection_columns = _BASE_COLLECTION_COLUMNS + collection_time_columns
    df.loc[df[shipping_method_column] != models.SHIPPING_METHOD_COLLECTION, collection_columns] = [""] * len(collection_columns)
    for collection_centre in collection_centres:
        df.loc[(df[shipping_method_column] == models.SHIPPING_METHOD_COLLECTION) &
               (df["Collection Centre"] == collection_centre),
               [x for x in collection_time_columns if x != f"{collection_centre} Collection Time"]] = empty_collection_time_columns
    return df


def _congestion_zone_postcodes() -> pd.DataFrame:
    return pd.DataFrame(flask.current_app.config[_FBSL_CONGESTION_ZONE_POSTCODES], columns=["Postcode"])


def _edit_details_url(request_id: str) -> str:
    current_app = flask.current_app
    return current_app.config[_FBSL_FORM_EDIT_URL_TEMPLATE].format(form_id=current_app.config[_FBSL_FORM_ID], request_id=request_id)


def cache(force_refresh: bool = False) -> pd.DataFrame:
    search_columns = [
        'Client Full Name',
        'Postcode',
        'Voucher Number',
        'Collection Centre',
        'Phone Number',
        'Time of Day'
    ]
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_REQUESTS_GSHEET_ID], force_refresh=force_refresh, search_columns=search_columns)
