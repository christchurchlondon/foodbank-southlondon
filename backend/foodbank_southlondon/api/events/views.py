from typing import Dict, List, Tuple

import flask
import flask_restx  # type:ignore
import pandas as pd  # type:ignore

from foodbank_southlondon.api import rest, utils
from foodbank_southlondon.api.events import models, namespace, parsers
from foodbank_southlondon.api.requests import views as request_views


# CONFIG VARIABLES
_FBSL_EVENTS_CACHE_EXPIRY_SECONDS = "FBSL_EVENTS_CACHE_EXPIRY_SECONDS"
_FBSL_EVENTS_GSHEET_URI = "FBSL_EVENTS_GSHEET_URI"

# INTERNALS
_CACHE_NAME = "events"


@namespace.route("/")
class Events(flask_restx.Resource):

    @rest.expect(parsers.events_params)
    @rest.marshal_with(models.page_of_events)
    @utils.paginate("RequestID", "Timestamp")
    def get(self) -> Tuple[pd.DataFrame, int, int]:
        """List all Events."""
        params = parsers.events_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        req_ids = params["req_ids"]
        event_name = params["event_name"]
        latest_event_only = params["latest_event_only"]
        data = cache(force_refresh=refresh_cache)
        if req_ids:
            data = data[data["RequestID"].isin(req_ids)]
        if event_name:
            data = data[data["EventName"] == event_name]
        if latest_event_only:
            data = (
                data.assign(rank=data.sort_values("Timestamp").groupby(["RequestID"]).cumcount(ascending=False) + 1)
                .query("rank == 1")
                .drop("rank", axis=1)
            )
        return (data, params["page"], params["per_page"])

    @rest.expect(models.event)
    @rest.response(201, "Created")
    def post(self) -> Tuple[Dict, int]:
        """Create (log) an Event."""
        data = flask.request.json
        flask.current_app.logger.debug(f"Received request body, {data}")
        request_id = data["RequestID"]
        requests_data = request_views.cache(force_refresh=True)
        if requests_data[requests_data["RequestID"] == request_id].empty:
            rest.abort(400, f"RequestID, {request_id} does not match any existing request.")
        utils.append_row(flask.current_app.config[_FBSL_EVENTS_GSHEET_URI], list(data.values()))
        utils.delete_cache(_CACHE_NAME)
        return ({}, 201)


@namespace.route("/distinct/")
class DistinctEventNameValues(flask_restx.Resource):

    @rest.expect(parsers.distinct_events_params)
    @rest.marshal_with(models.distinct_event_name_values)
    def get(self) -> Dict[str, List]:
        """Get the distinct options for an Events attribute."""
        params = parsers.distinct_events_params.parse_args(flask.request)  # noqa: F841 - here as reminder; currently we only support 1 value
        return {"Values": models.EVENT_NAMES}


def cache(force_refresh: bool = False) -> pd.DataFrame:
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_EVENTS_GSHEET_URI],
                       expires_after=flask.current_app.config[_FBSL_EVENTS_CACHE_EXPIRY_SECONDS], force_refresh=force_refresh)
