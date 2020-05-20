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

import logging
logging.getLogger("weasyprint").addHandler(logging.StreamHandler())


# CONFIG VARIABLES
_FBSL_BASE_DOMAIN = "FBSL_BASE_DOMAIN"
_FBSL_CATCH_ALL_LIST = "FBSL_CATCH_ALL_LIST"
_FBSL_MAX_ACTION_REQUEST_IDS = "FBSL_MAX_ACTION_REQUEST_IDS"
_FBSL_MAX_PAGE_SIZE = "FBSL_MAX_PAGE_SIZE"
_PREFERRED_URL_SCHEME = "PREFERRED_URL_SCHEME"


def _api_base_url() -> str:
    scheme = "https" if flask.request.is_secure else "http"
    return f"{scheme}://{flask.current_app.config[_FBSL_BASE_DOMAIN]}/api/"


def _get(url: str, **kwargs: Any) -> Dict[str, Any]:
    print(url)
    r = requests.get(url, **kwargs)
    if not r.ok:
        r.raise_for_status()
    return r.json()


def _post(url: str, **kwargs: Any) -> Dict:
    r = requests.post(url, **kwargs)
    if not r.ok:
        r.raise_for_status()
    return r.json()


@rest.route("/actions/")
class Actions(flask_restx.Resource):

    @staticmethod
    def _generate_driver_overview_pdf(requests_items):
        template_name = "driver-overview"
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        html = weasyprint.HTML(string=flask.render_template(f"{template_name}.html", requests_items=requests_items, date=today), encoding="utf8")
        document = html.render()
        return Actions._make_pdf_response(document.pages, document.metadata, document.url_fetcher, document._font_config, template_name)

    @staticmethod
    def _generate_shopping_list_pdf(requests_items, api_base_url, cookies):
        lists: Dict[str, Dict[str, Any]] = {}
        catch_all_list_name = flask.current_app.config[_FBSL_CATCH_ALL_LIST]
        template_name = "shopping-lists"
        pages = []
        document = None
        for request in requests_items:
            household_size = request["household_size"]
            list = lists.get(household_size)
            if list is None:
                list_name = household_size.lower().replace(" ", "_")
                list_name = list_name if list_name in lists_models.LIST_NAMES else catch_all_list_name
                list = lists[household_size] = _get(f"{api_base_url}lists/{list_name}", cookies=cookies)
            html = weasyprint.HTML(string=flask.render_template(f"{template_name}.html", request=request, list=list))
            document = html.render()
            pages.extend(document.pages)
        return Actions._make_pdf_response(pages, document.metadata, document.url_fetcher, document._font_config, template_name)

    @staticmethod
    def _generate_shipping_label_pdf(request_items, quantity):
        template_name = "shipping-labels"
        pages = []
        document = None
        for request in request_items:
            for index in range(quantity):
                html = weasyprint.HTML(string=flask.render_template(f"{template_name}.html", request=request, page=index + 1, total_pages=quantity))
                document = html.render()
                pages.extend(document.pages)
        return Actions._make_pdf_response(pages, document.metadata, document.url_fetcher, document._font_config, template_name)

    @staticmethod
    def _make_pdf_response(pages, metadata, url_fetcher, font_config, template_name):
        pdf = weasyprint.Document(pages, metadata, url_fetcher, font_config).write_pdf()
        response = flask.make_response((pdf, 201))
        response.headers["Content-Type"] = "application/pdf"
        response.headers["Content-Disposition"] = f"inline; filename=\"{template_name}.pdf\""
        return response

    @rest.response(201, "Created")
    @rest.response(400, "Bad Request")
    @rest.response(404, "Not Found")
    @rest.expect(models.action)
    def post(self) -> Union[flask.Response, Tuple[Dict, int]]:
        """Process an action."""
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
            requests_items = _get(f"{api_base_url}requests/{','.join(request_ids)}", cookies=flask.request.cookies,
                                  params={"per_page": total_request_ids})["items"]
        except requests.exceptions.HTTPError as error:
            if error.response.status_code == 404:
                rest.abort(404, error.response.json()["message"])
            raise
        if event_name == "Print Shopping List":
            return_value = self._generate_shopping_list_pdf(requests_items, api_base_url, flask.request.cookies)
        elif event_name == "Print Shipping Label":
            if not event_data.isdigit():
                rest.abort(400, "When event_name is \"Print Shipping Label\", event_data is expected to be an integer quantity of pages to print.")
            return_value = self._generate_shipping_label_pdf(requests_items, int(event_data))
        elif event_name == "Print Driver Overview":
            return_value = self._generate_driver_overview_pdf(requests_items)
        else:
            return_value = ({}, 201)
        now = f"{datetime.datetime.utcnow().isoformat()}Z"
        _post(f"{api_base_url}events/", cookies=flask.request.cookies,
              json={"items": [{"request_id": request_id, "event_timestamp": now, "event_name": event_name, "event_data": event_data}
                              for request_id in request_ids]})
        return return_value


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
        try:
            requests_items = _get(f"{api_base_url}requests/{request_id}", cookies=flask.request.cookies,
                                  params={"refresh_cache": refresh_cache})["items"]
        except requests.exceptions.HTTPError as error:
            if error.response.status_code == 404:
                rest.abort(404, f"request_id, {request_id} does not match any existing request.")
            raise
        request_data = requests_items[0]
        max_per_page = flask.current_app.config[_FBSL_MAX_PAGE_SIZE]
        events_data = _get(f"{api_base_url}events/", cookies=flask.request.cookies,
                           params={"refresh_cache": refresh_cache, "request_ids": request_id, "per_page": max_per_page})
        params = {"refresh_cache": refresh_cache}
        for attribute in ("client_full_name", "postcode"):
            value = request_data[attribute]
            if value:
                params[f"{attribute}s"] = value
        similar_request_data = _get(f"{api_base_url}requests/", cookies=flask.request.cookies,
                                    headers={"X-Fields": "items{request_id, timestamp, client_full_name, postcode, reference_number}, total_pages"},
                                    params=params)
        assert (events_data["total_pages"] <= 1 and similar_request_data["total_pages"] <= 1)
        similar_request_items = similar_request_data["items"]
        for index, request in enumerate(similar_request_items):
            if request["request_id"] == request_id:
                del similar_request_items[index]
                break
        return {
            "request": request_data,
            "events": events_data["items"],
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
        delivery_dates = ",".join(params["delivery_dates"] or ()) or None
        client_full_names = ",".join(params["client_full_names"] or ()) or None
        postcodes = ",".join(params["postcodes"] or ()) or None
        reference_numbers = ",".join(params["reference_numbers"] or ()) or None
        per_page = params["per_page"]
        api_base_url = _api_base_url()
        items = []
        requests_data = _get(f"{api_base_url}requests/", cookies=flask.request.cookies,
                             headers={"X-Fields": "items{request_id, client_full_name, reference_number, postcode, delivery_date}, "
                                      "page, per_page, total_items, total_pages"},
                             params={"client_full_names": client_full_names, "delivery_dates": delivery_dates, "page": params["page"],
                                     "per_page": per_page, "postcodes": postcodes, "reference_numbers": reference_numbers,
                                     "refresh_cache": refresh_cache})
        requests_df = pd.DataFrame(requests_data["items"])
        if not requests_df.empty:
            request_ids = requests_df["request_id"].unique()
            event_attributes = ("request_id", "event_timestamp", "event_name", "event_data")
            events_data = _get(f"{api_base_url}events/", cookies=flask.request.cookies,
                               headers={"X-Fields": f"items{{{', '.join(event_attributes)}}}"},
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
