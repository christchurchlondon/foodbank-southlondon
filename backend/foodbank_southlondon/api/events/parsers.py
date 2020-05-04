from flask_restx import inputs, reqparse  # type:ignore

from foodbank_southlondon.api.parsers import pagination_params
from foodbank_southlondon.api.events import models as event_models


events_params = pagination_params.copy()
events_params.add_argument("request_ids", type=str, required=False, action="split", help="A comma separated list of request_id values to filter on")
events_params.add_argument("event_name", type=str, required=False, choices=event_models.EVENT_NAMES,
                           help="An event name to filter results to (only one of event_name and last_event_only can be provided)")
events_params.add_argument("latest_event_only", type=inputs.boolean, required=False, help="Whether only the latest event (based on Timestamp) "
                           "should be returned, per request_id. The event_name filter is provided first if passed.")

distinct_events_params = reqparse.RequestParser()
distinct_events_params.add_argument("attribute", type=str, required=True, choices=["event_name"], help="The attribute to get distinct options for.")
