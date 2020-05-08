from typing import Any, Dict, Tuple, Union
import datetime

import flask
import flask_restx  # type:ignore
import numpy as np  # type:ignore
import pandas as pd  # type:ignore
import requests
import weasyprint  # type:ignore

from foodbank_southlondon.api.lists import models as lists_models
from foodbank_southlondon.bff import models, parsers, rest


# CONFIG VARIABLES
_FBSL_BASE_URL = "FBSL_BASE_URL"
_FBSL_CATCH_ALL_LIST = "FBSL_CATCH_ALL_LIST"
_FBSL_MAX_ACTION_REQUEST_IDS = "FBSL_MAX_ACTION_REQUEST_IDS"


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
    @rest.response(404, "Not Found")
    @rest.expect(models.action)
    def post(self) -> Union[flask.Response, Tuple[Dict, int]]:
        """Process an action."""
        cookies = {"Cookie": flask.request.headers["Cookie"]}
        data = flask.request.json
        request_ids = data["request_ids"]
        total_request_ids = len(request_ids)
        max_action_request_ids = flask.current_app.config[_FBSL_MAX_ACTION_REQUEST_IDS]
        if total_request_ids > max_action_request_ids:
            rest.abort(400, f"The maximum number of request_id values that can be passed in a single action request is {max_action_request_ids}.")
        event_name = data["event_name"]
        event_data = data["event_data"]
        api_base_url = _api_base_url()
        try:
            requests_items = _get(f"{api_base_url}requests/{','.join(request_ids)}", cookies=cookies, params={"per_page": total_request_ids})["items"]
        except requests.exceptions.HTTPError as error:
            if error.response.status_code == 404:
                rest.abort(404, error.response.json()["message"])
            raise
        if event_name == "Print Shopping List":
            lists: Dict[str, Dict[str, str]] = {}
            catch_all_list_name = flask.current_app.config[_FBSL_CATCH_ALL_LIST]
            pages = []
            args = None
            for request in requests_items:
                household_size = request["household_size"]
                list = lists.get(household_size)
                if list is None:
                    list_name = household_size if household_size in lists_models.LIST_NAMES else catch_all_list_name
                    list = lists[household_size] = _get(f"{api_base_url}lists/{list_name}", cookies=cookies)
                html = weasyprint.HTML(string=flask.render_template("shopping-list.html"))
                document = html.render()
                if not args:
                    args = (document.metadata, document.url_fetcher, document._font_config)
                pages.extend(document.pages)
            pdf = weasyprint.Document(pages, *args).write_pdf()
            response = flask.make_response(pdf)
            response.headers["Content-Type"] = "application/pdf"
            response.headers["Content-Disposition"] = "inline; filename=\"shopping-list.pdf\""
            return_value = response
        elif event_name == "Print Shipping Label":
            pass
        elif event_name == "Print Driver Overview":
            pass
        else:
            return_value = ({}, 201)
        now = f"{datetime.datetime.utcnow().isoformat()}Z"
        for request_id in request_ids:
            requests.post(f"{api_base_url}events/", cookies=cookies, json={"request_id": request_id, "event_timestamp": now, "event_name": event_name,
                                                                           "event_data": event_data})
        return return_value


@rest.route("/details/<string:request_id>")
class Details(flask_restx.Resource):

    @rest.response(404, "Not Found")
    @rest.expect(parsers.cache_params)
    @rest.marshal_with(models.details)
    def get(self, request_id: str) -> Dict[str, Any]:
        """Get detailed information for a single Client Request."""
        cookies = {"Cookie": flask.request.headers["Cookie"]}
        params = parsers.status_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        api_base_url = _api_base_url()
        try:
            requests_items = _get(f"{api_base_url}requests/{request_id}", cookies=cookies, params={"refresh_cache": refresh_cache})["items"]
        except requests.exceptions.HTTPError as error:
            if error.response.status_code == 404:
                rest.abort(404, f"request_id, {request_id} does not match any existing request.")
            raise
        request_data = requests_items[0]
        # both of these next requests could theoretically return more than one page (would be crazy) - we don't worry about paginating in this case
        events_items = _get(f"{api_base_url}/events/", cookies=cookies, params={"refresh_cache": refresh_cache, "request_ids": request_id})["items"]
        similar_request_items = _get(f"{api_base_url}requests/", cookies=cookies,
                                     headers={"X-Fields": "items{request_id, timestamp, client_full_name, postcode, reference_number}"},
                                     params={"client_full_names": request_data["client_full_name"], "postcodes": request_data["postcode"],
                                             "refresh_cache": refresh_cache})["items"]
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
        cookies = {"Cookie": flask.request.headers["Cookie"]}
        params = parsers.status_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        delivery_dates = ",".join(params["delivery_dates"] or ()) or None
        client_full_names = ",".join(params["client_full_names"] or ()) or None
        postcodes = ",".join(params["postcodes"] or ()) or None
        reference_numbers = ",".join(params["reference_numbers"] or ()) or None
        per_page = params["per_page"]
        api_base_url = _api_base_url()
        items = []
        requests_data = _get(f"{api_base_url}requests/", cookies=cookies,
                             headers={"X-Fields": "items{request_id, client_full_name, reference_number, postcode, delivery_date}, "
                                      "page, per_page, total_items, total_pages"},
                             params={"client_full_names": client_full_names, "delivery_dates": delivery_dates, "page": params["page"],
                                     "per_page": per_page, "postcodes": postcodes, "reference_numbers": reference_numbers,
                                     "refresh_cache": refresh_cache})
        requests_df = pd.DataFrame(requests_data["items"])
        if not requests_df.empty:
            request_ids = requests_df["request_id"].unique()
            event_attributes = ("request_id", "event_timestamp", "event_name", "event_data")
            events_data = _get(f"{api_base_url}events/", cookies=cookies, headers={"X-Fields": f"items{{{', '.join(event_attributes)}}}"},
                               params={"latest_event_only": True, "per_page": per_page, "refresh_cache": refresh_cache,
                                       "request_ids": ",".join(request_ids)})
            events_df = pd.DataFrame(events_data["items"], columns=event_attributes)
            df = pd.merge(requests_df, events_df, on="request_id", how="left").replace({np.nan: None})
            items = df.to_dict("records")
        return {
            "page": requests_data["page"],
            "per_page": requests_data["per_page"],
            "total_pages": requests_data["total_pages"],
            "total_items": requests_data["total_items"],
            "items": items
        }
