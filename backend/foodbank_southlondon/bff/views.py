from typing import Any, Dict, Tuple

import flask
import flask_restx  # type:ignore
import numpy as np  # type:ignore
import pandas as pd  # type:ignore
import requests

from foodbank_southlondon.bff import models, parsers, rest


# CONFIG VARIABLES
_FBSL_BASE_URL = "FBSL_BASE_URL"


def _api_base_url() -> str:
    return flask.current_app.config[_FBSL_BASE_URL] + "/api/"


def _get(url: str, **kwargs: Any) -> Dict[str, Any]:
    r = requests.get(url, **kwargs)
    if not r.ok:
        r.raise_for_status()
    return r.json()


@rest.route("/actions/")
class Actions(flask_restx.Resource):

    @rest.response(201, "Created")
    @rest.expect(models.action)
    def post(self) -> Tuple[Dict, int]:
        """Process an action."""
        return ({}, 201)


@rest.route("/details/<string:request_id>")
class Details(flask_restx.Resource):

    @rest.response(404, "Not Found")
    @rest.expect(parsers.cache_params)
    @rest.marshal_with(models.details)
    def get(self, request_id: str) -> Dict[str, Any]:
        """Get detailed information for a single Client Request."""
        params = parsers.status_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        api_base_url = _api_base_url()
        requests_items = _get(f"{api_base_url}/requests/{request_id}", params={"refresh_cache": refresh_cache})["items"]
        if not requests_items:
            rest.abort(400, f"request_id, {request_id} does not match any existing request.")
        request_data = requests_items[0]
        # both of these next requests could theoretically return more than one page (would be crazy) - we don't worry about paginating in this case
        events_items = _get(f"{api_base_url}/events/", params={"refresh_cache": refresh_cache, "request_ids": request_id})["items"]
        similar_request_items = _get(f"{api_base_url}/requests/", params={"client_full_names": request_data["client_full_name"],
                                                                          "postcodes": request_data["postcode"], "refresh_cache": refresh_cache},
                                     headers={"X-Fields": "items{request_id, timestamp, client_full_name, postcode}"})["items"]
        for index, request in enumerate(similar_request_items):
            if request["request_id"] == request_id:
                del similar_request_items[index]
                break
        return {
            "request": request_data,
            "events": events_items,
            "similar_request_ids": similar_request_items
        }


@rest.route("/status")
class Status(flask_restx.Resource):

    @rest.expect(parsers.status_params)
    @rest.marshal_with(models.page_of_status)
    def get(self) -> Dict[str, Any]:
        """List Client Request summary and status information."""
        params = parsers.status_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        client_full_names = params["client_full_names"]
        postcodes = params["postcodes"]
        page = params["page"]
        per_page = params["per_page"]
        api_base_url = _api_base_url()
        items = []
        requests_data = _get(f"{api_base_url}requests/",
                             params={"client_full_names": client_full_names, "page": page, "per_page": per_page, "postcodes": postcodes,
                                     "refresh_cache": refresh_cache},
                             headers={"X-Fields": "items{request_id, client_full_name, reference_number, postcode, delivery_date}, "
                                      "page, per_page, total_items, total_pages"})
        requests_df = pd.DataFrame(requests_data["items"])
        if not requests_df.empty:
            request_ids = requests_df["request_id"].unique()
            event_attributes = ("request_id", "event_timestamp", "event_name", "event_date")
            events_data = _get(f"{api_base_url}events/", params={"latest_event_only": True, "per_page": per_page,
                                                                 "refresh_cache": refresh_cache, "request_ids": ",".join(request_ids)},
                               headers={"X-Fields": f"items{{{', '.join(event_attributes)}}}"})
            events_df = pd.DataFrame(events_data["items"], columns=event_attributes)
            df = pd.merge(requests_df, events_df, on="request_id", how="left")
            df.replace({np.nan: None}, inplace=True)
            items = df.to_dict("records")
        return {
            "page": requests_data["page"],
            "per_page": requests_data["per_page"],
            "total_pages": requests_data["total_pages"],
            "total_items": requests_data["total_items"],
            "items": items
        }
