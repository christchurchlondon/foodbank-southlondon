from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models, rest
from foodbank_southlondon.api.requests import models as requests_models


EVENT_NAMES = (
    "Deny Request",
    "Print Shopping List",
    "Print Shipping Label",
    "Print Driver Overview",
    "Mark as Out for Delivery",
    "Mark as Delivered",
    "Mark as Fullfilled with Trussell Trust"
)


event = rest.model("Event", {
    "request_id": requests_models.request["request_id"],
    "event_timestamp": fields.DateTime(required=True, description="The timestamp when the event was recorded, in ISO 8601 format",
                                       example="2020-04-26T13:31:42Z"),
    "event_name": fields.String(required=True, description="The name of the event that occured", example="Print Shipping Label", enum=EVENT_NAMES),
    "event_date": fields.String(required=False, description="The date when the event occurred", example="2020-04-01")
})

page_of_events = rest.inherit("EventsPage", models.pagination, {
    "items": fields.List(fields.Nested(event))
})

_distinct_event_name_value = rest.model("DistinctEventNameValue", {
    "event_name": fields.String(required=True, description="A valid event_name value"),
    "event_date_expected": fields.Boolean(required=True, description="Whether this event_name expects an event_date.", example=True),
    "confirmation_expected": fields.Boolean(required=True, description="Whether this event_name expects special confirmation.", example=False)
})

distinct_event_name_values = rest.model("DistinctEventNameValues", {
    "values": fields.List(fields.Nested(_distinct_event_name_value))
})
