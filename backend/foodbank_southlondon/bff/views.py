from typing import Any, Dict

import flask
import flask_restx  # type:ignore
import numpy as np  # type:ignore
import pandas as pd  # type:ignore
import requests

from foodbank_southlondon.bff import models, parsers, rest


# CONFIG VARIABLES
_FBSL_BASE_URL = "FBSL_BASE_URL"


@rest.route("/status")
class Events(flask_restx.Resource):

    @rest.expect(parsers.status_params)
    @rest.marshal_with(models.page_of_status)
    def get(self) -> Dict[str, Any]:
        params = parsers.status_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        client_full_names = params["client_full_names"]
        postcodes = params["postcodes"]
        page = params["page"]
        per_page = params["per_page"]
        api_base_url = flask.current_app.config[_FBSL_BASE_URL] + "/api/"
        items = []
        requests_data = requests.get(f"{api_base_url}requests/",
                                     params={"client_full_names": client_full_names, "page": page, "per_page": per_page, "postcodes": postcodes,
                                             "refresh_cache": refresh_cache},
                                     headers={"X-Fields": "items{request_id, client_full_name, reference_number, postcode, delivery_date}, "
                                              "page, per_page, total_items, total_pages"}).json()
        requests_df = pd.DataFrame(requests_data["items"])
        if not requests_df.empty:
            request_ids = requests_df["request_id"].unique()
            event_attributes = ("request_id", "event_timestamp", "event_name", "event_date")
            events_data = requests.get(f"{api_base_url}events/", params={"latest_event_only": True, "per_page": per_page,
                                                                         "refresh_cache": refresh_cache, "request_ids": ",".join(request_ids)},
                                       headers={"X-Fields": f"items{{{', '.join(event_attributes)}}}"}).json()
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
