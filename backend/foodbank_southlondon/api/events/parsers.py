from flask_restx import inputs  # type:ignore

from foodbank_southlondon.api.parsers import pagination_params
from foodbank_southlondon.api.events import models as event_models


events_params = pagination_params.copy()
events_params.add_argument("req_ids", type=str, required=False, action="split", help="A comma separated list of Request IDs to filter on")
events_params.add_argument("event_name", type=str, required=False, choices=event_models.event["EventName"].enum,
                           help="An event name to filter results to (only one of event_name and last_event_only can be provided)")
events_params.add_argument("last_event_only", type=inputs.boolean, required=False, help="Whether only the most recent event (based on Timestamp) "
                           "should be returned, per Request ID (only one of event_name and last_event_only can be provided)")
