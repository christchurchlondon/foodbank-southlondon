from flask_restx import inputs  # type:ignore

from foodbank_southlondon.api.parsers import pagination_params
from foodbank_southlondon.api.events import models as event_models


events_params = pagination_params.copy()
events_params.add_argument("request_ids", type=str, required=False, action="split", help="A comma separated list of request_id values to filter on")
events_params.add_argument("event_names", type=str, required=False, action="split", help="An event name to filter results to.")
events_params.add_argument("latest_event_only", type=inputs.boolean, required=False, help="Whether only the latest event (based on Timestamp) "
                           "should be returned, per request_id - the event_name filter is applied first if passed")
