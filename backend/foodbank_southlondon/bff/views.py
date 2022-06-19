from collections.abc import Iterable, Iterator
from typing import Any, Dict, List, Optional, Tuple
from urllib import parse
import datetime
import itertools
import io

import flask
import flask_restx  # type: ignore
import numpy as np  # type: ignore
import pandas as pd  # type: ignore
import pytz
import requests
import weasyprint  # type: ignore
import werkzeug

from foodbank_southlondon.api import utils, models as common_models, parsers as common_parsers
from foodbank_southlondon.api.events import models as events_models
from foodbank_southlondon.api.lists import models as lists_models
from foodbank_southlondon.bff import models, parsers, rest

import logging
logging.getLogger("weasyprint").addHandler(logging.StreamHandler())


# CONFIG VARIABLES
_FBSL_BASE_DOMAIN = "FBSL_BASE_DOMAIN"
_FBSL_CATCH_ALL_LIST = "FBSL_CATCH_ALL_LIST"
_FBSL_COLLECTION_CENTRES = "FBSL_COLLECTION_CENTRES"
_FBSL_FORM_ID = "FBSL_FORM_ID"
_FBSL_FORM_SUBMIT_URL_TEMPLATE = "FBSL_FORM_SUBMIT_URL_TEMPLATE"
_FBSL_GOOGLE_MAPS_SEARCH_BASE_URL = "FBSL_GOOGLE_MAPS_SEARCH_BASE_URL"
_FBSL_MAX_ACTION_REQUEST_IDS = "FBSL_MAX_ACTION_REQUEST_IDS"
_FBSL_MAX_PAGE_SIZE = "FBSL_MAX_PAGE_SIZE"
_FBSL_MAX_REQUEST_IDS_PER_URL = "FBSL_MAX_REQUEST_IDS_PER_URL"
_FBSL_REQUESTS_GSHEET_ID = "FBSL_REQUESTS_GSHEET_ID"
_FBSL_STAFF_MOBILES = "FBSL_STAFF_MOBILES"


def _abbr_from_collection_centre_name(collection_centre_name: Optional[str]) -> str:
    collection_centre_abbr = ""
    if collection_centre_name:
        collection_centre = flask.current_app.config[_FBSL_COLLECTION_CENTRES][collection_centre_name]
        collection_centre_abbr = collection_centre["abbr"]
    return collection_centre_abbr


def _api_base_url() -> str:
    scheme = "https" if flask.request.is_secure else "http"
    return f"{scheme}://{flask.current_app.config[_FBSL_BASE_DOMAIN]}/api/"


def _chunk(iterable: Iterable, size: int) -> Iterator:
    iterator = iter(iterable)
    return iter(lambda: tuple(itertools.islice(iterator, size)), ())


def _get(url: str, **kwargs: Any) -> Dict[str, Any]:
    r = requests.get(url, **kwargs)
    if not r.ok:
        r.raise_for_status()
    return r.json()


def _post_event(api_base_url: str, request_ids: List, event_name: str, event_data: str) -> Dict:
    now = datetime.datetime.now(tz=pytz.timezone("Europe/London")).isoformat()
    r = requests.post(f"{api_base_url}events/", cookies=flask.request.cookies,
                      json={"items": [{"request_id": request_id, "event_timestamp": now, "event_name": event_name, "event_data": event_data}
                                      for request_id in request_ids]})
    if not r.ok:
        r.raise_for_status()
    return r.json()


@rest.route("/actions/")
class Actions(flask_restx.Resource):

    @staticmethod
    def _generate_day_overview_pdf(requests_items: List) -> flask.Response:
        template_name = "day-overview"
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        html = weasyprint.HTML(string=flask.render_template(f"{template_name}.html", requests_items=requests_items, date=today,
                                                            collection_centres=flask.current_app.config[_FBSL_COLLECTION_CENTRES]), encoding="utf8")
        document = html.render()
        return Actions._make_pdf_response(document.pages, document.metadata, document.url_fetcher, document._font_config, document.optimize_size,
                                          template_name)

    @staticmethod
    def _generate_driver_overview_pdf(items: List, driver_name: str) -> flask.Response:
        template_name = "driver-overview"
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        staff_mobiles = " | ".join(f"{staff} - {mobile}" for staff, mobile in flask.current_app.config[_FBSL_STAFF_MOBILES].items())
        html = weasyprint.HTML(string=flask.render_template(f"{template_name}.html", items=items, date=today, driver_name=driver_name,
                                                            staff_mobiles=staff_mobiles), encoding="utf8")
        document = html.render()
        return Actions._make_pdf_response(document.pages, document.metadata, document.url_fetcher, document._font_config, document.optimize_size,
                                          template_name)

    @staticmethod
    def _generate_shopping_list_pdf(requests_items: List, api_base_url: str,
                                    cookies: werkzeug.datastructures.ImmutableTypeConversionDict) -> flask.Response:
        lists: Dict[str, Dict[str, Any]] = {}
        catch_all_list_name = flask.current_app.config[_FBSL_CATCH_ALL_LIST]
        template_name = "shopping-lists"
        data = []
        for request in requests_items:
            household_size = request["household_size"]
            list = lists.get(household_size)
            if list is None:
                list_name = household_size.lower().replace(" ", "_").replace("+", "plus")
                list_name = list_name if list_name in lists_models.LIST_NAMES else catch_all_list_name
                list = lists[household_size] = _get(f"{api_base_url}lists/{list_name}", cookies=cookies)
            data.append({"request": request, "list": list})
        html = weasyprint.HTML(string=flask.render_template(f"{template_name}.html", data=data), encoding="utf8")
        document = html.render()
        return Actions._make_pdf_response(document.pages, document.metadata, document.url_fetcher, document._font_config, document.optimize_size,
                                          template_name)

    @staticmethod
    def _generate_shipping_label_pdf(request_items: List, quantity: int) -> flask.Response:
        template_name = "shipping-labels"
        pages = []
        document = None
        for request in request_items:
            for index in range(quantity):
                html = weasyprint.HTML(string=flask.render_template(f"{template_name}.html", request=request,
                                                                    collection_centres=flask.current_app.config[_FBSL_COLLECTION_CENTRES],
                                                                    page=index + 1, total_pages=quantity), encoding="utf8")
                document = html.render()
                pages.extend(document.pages)
        return Actions._make_pdf_response(pages, document.metadata, document.url_fetcher, document._font_config, document.optimize_size,
                                          template_name)

    @staticmethod
    def _make_pdf_response(pages: List, metadata: Any, url_fetcher: Any, font_config: Any, optimize_size: Any, template_name: str) -> flask.Response:
        pdf = weasyprint.Document(pages, metadata, url_fetcher, font_config, optimize_size).write_pdf()
        return flask.send_file(io.BytesIO(pdf), attachment_filename=f"{template_name}.pdf", as_attachment=True)

    @staticmethod
    def _process_warnings(requests_items: List, api_base_url: str, request_ids: List, action_status_name: str) -> Optional[flask.Response]:
        requests_df = pd.DataFrame(requests_items)
        event_attributes = ("request_id", )
        events_data = _get(f"{api_base_url}events/", cookies=flask.request.cookies,
                           headers={"X-Fields": f"items{{{', '.join(event_attributes)}}}"},
                           params={"request_ids": ",".join(request_ids), "event_names": [action_status_name], "latest_event_only": True,
                                   "refresh_cache": True, "per_page": len(request_ids)})
        events_df = pd.DataFrame(events_data["items"], columns=event_attributes)
        df = pd.merge(events_df, requests_df, on="request_id", how="left").replace({np.nan: None})
        if not df.empty:
            return flask.make_response({"warning": f"The following postcodes have already been printed: {', '.join(df['postcode'].unique())}. "
                                        "Are you sure you want to print again?"}, 202)
        return None

    @rest.expect(parsers.action_params)
    @rest.expect(models.action)
    @rest.response(201, "Created")
    @rest.response(202, "Accepted")
    @rest.response(400, "Bad Request")
    @rest.response(404, "Not Found")
    def post(self) -> flask.Response:
        """Process an action."""
        current_app = flask.current_app
        params = parsers.action_params.parse_args(flask.request)
        ignore_warnings = params["ignore_warnings"]
        data = flask.request.json
        current_app.logger.debug(f"Received request body, {data}")
        request_ids = data["request_ids"]
        total_request_ids = len(request_ids)
        max_action_request_ids = current_app.config[_FBSL_MAX_ACTION_REQUEST_IDS]
        if total_request_ids > max_action_request_ids:
            rest.abort(400, f"The maximum number of clients that can be selected at one time is {max_action_request_ids}.")
        event_name = data["event_name"]
        event_data = data["event_data"]
        api_base_url = _api_base_url()
        if event_name == events_models.Action.DELETE_REQUEST.value.event_name:
            for request_id in request_ids:
                # We want to delete before logging the event but the event log validates the request id is not missing which it will be if the
                # delete happens first. We could add some flag into the event log post request to supress the check but this feels hacky. For now,
                # leaving the operations in the wrong order - very small chance edge case that the deletion will fail but still be marked as deleted
                # - user can just delete again.
                _post_event(api_base_url, [request_id], events_models.ActionStatus.REQUEST_DELETED.value.event_name, event_data)
                utils.delete_row(current_app.config[_FBSL_REQUESTS_GSHEET_ID], request_id)
            return_value = flask.make_response({}, 201)
        else:
            action_status_name = None
            try:
                requests_items = []
                for chunk in list(_chunk(request_ids, current_app.config[_FBSL_MAX_REQUEST_IDS_PER_URL])):
                    requests_items.extend(_get(f"{api_base_url}requests/{','.join(chunk)}", cookies=flask.request.cookies,
                                          params={"per_page": len(chunk)})["items"])
            except requests.exceptions.HTTPError as error:
                if error.response.status_code == 404:
                    rest.abort(404, error.response.json()["message"])
                else:
                    rest.abort(error.response.status_code, error.response.text)
            if event_name == events_models.Action.PRINT_SHOPPING_LIST.value.event_name:
                action_status_name = events_models.ActionStatus.SHOPPING_LIST_PRINTED.value.event_name
                if not ignore_warnings:
                    return_value = self._process_warnings(requests_items, api_base_url, request_ids, action_status_name)
                    if return_value:
                        return return_value
                return_value = self._generate_shopping_list_pdf(requests_items, api_base_url, flask.request.cookies)
            elif event_name == events_models.Action.PRINT_SHIPPING_LABEL.value.event_name:
                action_status_name = events_models.ActionStatus.SHIPPING_LABEL_PRINTED.value.event_name
                if not ignore_warnings:
                    return_value = self._process_warnings(requests_items, api_base_url, request_ids, action_status_name)
                    if return_value:
                        return return_value
                if not event_data.isdigit() or int(event_data) < 1:
                    rest.abort(400, "Invalid quantity. The quantity must be positive integer.")
                return_value = self._generate_shipping_label_pdf(requests_items, int(event_data))
            elif event_name == events_models.Action.PRINT_DRIVER_OVERVIEW.value.event_name:
                requests_df = pd.DataFrame(requests_items)
                event_attributes = ("request_id", "event_data")
                events_data = _get(f"{api_base_url}events/", cookies=flask.request.cookies,
                                   headers={"X-Fields": f"items{{{', '.join(event_attributes)}}}"},
                                   params={"event_names": events_models.ActionStatus.SHIPPING_LABEL_PRINTED.value.event_name,
                                           "request_ids": ",".join(request_ids), "latest_event_only": True, "refresh_cache": True,
                                           "per_page": len(request_ids)})
                events_df = pd.DataFrame(events_data["items"], columns=event_attributes)
                df = pd.merge(requests_df, events_df, on="request_id", how="left").replace({np.nan: None})
                items = df.to_dict("records")
                action_status_name = events_models.ActionStatus.OUT_FOR_DELIVERY.value.event_name
                return_value = self._generate_driver_overview_pdf(items, event_data)
            elif event_name == events_models.Action.PRINT_DAY_OVERVIEW.value.event_name:
                requests_df = pd.DataFrame(requests_items)
                requests_df = requests_df.sort_values(by=["time_of_day", "postcode"], key=lambda col: col.str.lower())
                items = requests_df.to_dict("records")
                return self._generate_day_overview_pdf(items)
            elif event_name == events_models.Action.GENERATE_MAP.value.event_name:
                requests_df = pd.DataFrame(requests_items)
                postcodes = ",".join(parse.quote_plus(postcode) for postcode in requests_df["postcode"].unique())
                return flask.make_response({"url": current_app.config[_FBSL_GOOGLE_MAPS_SEARCH_BASE_URL] + postcodes}, 200)
            _post_event(api_base_url, request_ids, action_status_name, event_data)
        return return_value


@rest.route("/details/<string:request_id>")
class Details(flask_restx.Resource):

    @rest.expect(parsers.cache_params)
    @rest.response(404, "Not Found")
    @rest.marshal_with(models.details)
    def get(self, request_id: str) -> Dict[str, Any]:
        """Get detailed information for a single Client Request."""
        params = parsers.summary_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        api_base_url = _api_base_url()
        try:
            requests_items = _get(f"{api_base_url}requests/{request_id}", cookies=flask.request.cookies,
                                  params={"refresh_cache": refresh_cache})["items"]
        except requests.exceptions.HTTPError as error:
            if error.response.status_code == 404:
                rest.abort(404, f"Request ID, {request_id} does not match any existing request. Contact webmaster.")
            raise
        request_data = requests_items[0]
        max_per_page = flask.current_app.config[_FBSL_MAX_PAGE_SIZE]
        events_data = _get(f"{api_base_url}events/", cookies=flask.request.cookies,
                           params={"request_ids": request_id, "refresh_cache": refresh_cache, "per_page": max_per_page})
        params = {"refresh_cache": refresh_cache}
        for attribute in ("client_full_name", "postcode"):
            value = request_data[attribute]
            if value:
                params[f"{attribute}s"] = value
        similar_request_data = _get(f"{api_base_url}requests/", cookies=flask.request.cookies,
                                    headers={"X-Fields": "items{request_id, timestamp, client_full_name, postcode, voucher_number}, total_pages"},
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


@rest.route("/statuses/")
class Statuses(flask_restx.Resource):

    @rest.expect(models.status)
    @rest.response(201, "Created")
    @rest.response(400, "Bad Request")
    @rest.response(404, "Not Found")
    def post(self) -> Tuple[Dict, int]:
        """Process a status."""
        data = flask.request.json
        flask.current_app.logger.debug(f"Received request body, {data}")
        _post_event(_api_base_url(), data["request_ids"], data["event_name"], data["event_data"])
        return ({}, 201)


@rest.route("/summary")
class Summary(flask_restx.Resource):

    @rest.expect(parsers.summary_params)
    @rest.marshal_with(models.page_of_summary)
    def get(self) -> Dict[str, Any]:
        """List Client Request summary."""
        current_app = flask.current_app
        params = parsers.summary_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        start_date = params["start_date"]
        end_date = params["end_date"]
        packing_dates = None
        if start_date or end_date:
            today = datetime.date.today()
            start_date = start_date or today.replace(day=1)
            end_date = end_date or today
            if end_date < start_date:
                rest.abort(400, f"end_date {end_date} was before start_date, {start_date}.")
            packing_dates = ",".join((start_date + datetime.timedelta(days=i)).strftime("%d/%m/%Y") for i in range((end_date - start_date).days + 1))
        client_full_names = ",".join(params["client_full_names"] or ()) or None
        postcodes = ",".join(params["postcodes"] or ()) or None
        time_of_days = ",".join(params["time_of_days"] or ()) or None
        voucher_numbers = ",".join(params["voucher_numbers"] or ()) or None
        # Preserve the empty string to filter by delivery only
        _collection_centres = params["collection_centres"]
        collection_centres = ",".join(_collection_centres) if _collection_centres is not None else None
        phone_numbers = ",".join(params["phone_numbers"] or ()) or None
        event_names = ",".join(params["event_names"] or ()) or None
        per_page = params["per_page"]
        api_base_url = _api_base_url()
        items = []
        requests_data = _get(f"{api_base_url}requests/", cookies=flask.request.cookies,
                             headers={"X-Fields": "items{request_id, client_full_name, voucher_number, postcode, packing_date, time_of_day, "
                                      "household_size, congestion_zone, flag_for_attention, signposting_call, collection_centre, phone_number}, "
                                      "page, per_page, total_items, total_pages"},
                             params={"client_full_names": client_full_names, "packing_dates": packing_dates, "postcodes": postcodes,
                                     "time_of_days": time_of_days, "voucher_numbers": voucher_numbers, "collection_centres": collection_centres,
                                     "phone_numbers": phone_numbers, "event_names": event_names, "refresh_cache": refresh_cache,
                                     "page": params["page"], "per_page": per_page})
        requests_df = pd.DataFrame(requests_data["items"])
        if "collection_centre" in requests_df:
            requests_df["collection_centre_abbr"] = requests_df["collection_centre"].map(_abbr_from_collection_centre_name)
        if not requests_df.empty:
            events_df = None
            request_ids = requests_df["request_id"].unique()
            event_attributes = ("request_id", "event_timestamp", "event_name", "event_data")
            for chunk in _chunk(request_ids, current_app.config[_FBSL_MAX_REQUEST_IDS_PER_URL]):
                events_data = _get(f"{api_base_url}events/", cookies=flask.request.cookies,
                                   headers={"X-Fields": f"items{{{', '.join(event_attributes)}}}"},
                                   params={"request_ids": ",".join(chunk), "latest_event_only": True, "refresh_cache": refresh_cache,
                                           "per_page": per_page})
                events_chunk_df = pd.DataFrame(events_data["items"], columns=event_attributes)
                if events_df is None:
                    events_df = events_chunk_df
                else:
                    events_df = pd.concat([events_df, events_chunk_df])
            df = pd.merge(requests_df, events_df, on="request_id", how="left").replace({np.nan: None})
            items = df.to_dict("records")
        return {
            "page": requests_data["page"],
            "per_page": requests_data["per_page"],
            "total_pages": requests_data["total_pages"],
            "total_items": requests_data["total_items"],
            "form_submit_url": current_app.config[_FBSL_FORM_SUBMIT_URL_TEMPLATE].format(form_id=current_app.config[_FBSL_FORM_ID]),
            "items": items
        }

@rest.route("/suggestions")
class Search(flask_restx.Resource):
    
    @rest.expect(common_parsers.search_params)
    @rest.marshal_with(common_models.suggestions)
    def get(self):
        api_base_url = _api_base_url()
        # TODO MRB: add search endpoint to events too
        # then sort by score here and return the top N
        events_data = _get(f"{api_base_url}events/distinct", cookies=flask.request.cookies)
        results=[]
        for event in events_data['items']:
            results.append({ 'key': 'statuses', 'value': event['event_name'] })
        return {
            "results": results
        }
