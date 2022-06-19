from typing import Dict, List, Tuple
import dataclasses

import flask
import flask_restx  # type: ignore
import pandas as pd  # type: ignore

from foodbank_southlondon.api import rest, utils, models as common_models, parsers as common_parsers
from foodbank_southlondon.api.events import models, namespace, parsers
from foodbank_southlondon.api.requests import views as requests_views


# CONFIG VARIABLES
_FBSL_EVENTS_GSHEET_ID = "FBSL_EVENTS_GSHEET_ID"
_FBSL_FUZZY_SEARCH_THRESHOLD = "FBSL_FUZZY_SEARCH_THRESHOLD"
_FBSL_MAX_NUMBER_OF_SUGGESTIONS = "FBSL_MAX_NUMBER_OF_SUGGESTIONS"

# INTERNALS
_ACTIONS = "actions"
_CACHE_NAME = "events"
_STATUSES = "statuses"


@namespace.route("/")
class Events(flask_restx.Resource):

    @rest.expect(parsers.events_params)
    @rest.marshal_with(models.page_of_events)
    @utils.paginate("event_timestamp", "request_id", ascending=False)
    def get(self) -> Tuple[pd.DataFrame, int, int]:
        """List all Events."""
        params = parsers.events_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        request_ids = set(request_id.strip() for request_id in (params["request_ids"] or ()))
        event_names = set(event_name.strip() for event_name in (params["event_names"] or ()))
        invalid_event_names = event_names.difference(models.EVENT_NAMES)
        if invalid_event_names:
            rest.abort(400, f"The following event names are invalid options: {invalid_event_names}. Valid options are: {models.EVENT_NAMES}.")
        latest_event_only = params["latest_event_only"]
        df = cache(force_refresh=refresh_cache)
        request_id_attribute = "request_id"
        if request_ids:
            df = df.loc[df[request_id_attribute].isin(request_ids)]
        if event_names:
            df = df.loc[df["event_name"].isin(event_names)]
        if latest_event_only:
            df = (
                df.assign(rank=df.sort_values("event_timestamp").groupby([request_id_attribute]).cumcount(ascending=False) + 1).query("rank == 1")
                .drop("rank", axis=1)
            )
        return (df, params["page"], params["per_page"])

    @rest.expect(models.all_events)
    @rest.response(400, "Bad Request")
    @rest.response(201, "Created")
    def post(self) -> Tuple[Dict, int]:
        """Create (log) Events."""
        current_app = flask.current_app
        data = flask.request.json
        current_app.logger.debug(f"Received request body, {data}")
        items = data["items"]
        if not items:
            rest.abort(400, "The body, items must not be empty.")
        items_df = pd.DataFrame(items)
        requests_df = requests_views.cache()
        missing_request_ids = set(items_df["request_id"].unique()).difference(requests_df["request_id"].unique())
        if missing_request_ids:
            rest.abort(400, f"the following Request ID values {missing_request_ids} were not found.")
        utils.append_rows(current_app.config[_FBSL_EVENTS_GSHEET_ID], [list(item.values()) for item in items])
        utils.expire_cache(_CACHE_NAME)
        return ({}, 201)


@namespace.route("/distinct")
@namespace.route(f"/distinct/<any({_STATUSES},{_ACTIONS}):type>")
class DistinctEventNameValues(flask_restx.Resource):

    @rest.marshal_with(models.distinct_event_types)
    def get(self, type: str = None) -> Dict[str, List]:
        """Get the distinct Event options for a given type."""
        events = {_STATUSES: models.STATUSES, _ACTIONS: models.ACTIONS, None: models.EVENTS}
        return {"items": [dataclasses.asdict(event) for event in events[type]]}


@namespace.route("/suggestions/")
class Suggestions(flask_restx.Resource):

    @rest.expect(common_parsers.search_params)
    @rest.marshal_with(common_models.suggestions)
    def get(self) -> List:
        """Get suggested values for search filters"""
        params = common_parsers.search_params.parse_args(flask.request)
        search_threshold = flask.current_app.config[_FBSL_FUZZY_SEARCH_THRESHOLD]
        max_suggestions = flask.current_app.config[_FBSL_MAX_NUMBER_OF_SUGGESTIONS]
        suggestions = [{"key": "event_names", "value": e.event_name, "score": 100.0} for e in models.EVENTS if e.event_name]
        if params.q:
            search = params.q.lower()
            suggestions = [{**s, "score": utils.fuzzy_scorer(search, s["value"])} for s in suggestions]
        suggestions = [s for s in suggestions if s["score"] > search_threshold][:max_suggestions]
        return {"suggestions": suggestions}


def cache(force_refresh: bool = False) -> pd.DataFrame:
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_EVENTS_GSHEET_ID], force_refresh=force_refresh).data
