from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models, rest
from foodbank_southlondon.api.requests import models as requests_models


EVENT_NAMES = [
    "Shopping List Printed",
    "Shipping Label Printed",
    "Marked as Out for Delivery",
    "Marked as Delivered",
    "Mark as Fullfilled with Trussell Trust",
    "Request Denied"
]


event = rest.model("Event", {
    "request_id": requests_models.request["request_id"],
    "timestamp": fields.DateTime(attribute="Timestamp", required=True, description="The timestamp when the event was recorded, in ISO 8601 format",
                                 example="2020-04-26T13:31:42Z"),
    "event_name": fields.String(attribute="EventName", required=True, description="The name of the event that occured",
                                example="Shipping Label Printed", enum=EVENT_NAMES),
    "event_date": fields.String(required=False, description="The date when the event occurred", example="2020-04-01")
})

page_of_events = rest.inherit("EventsPage", models.pagination, {
    "items": fields.List(fields.Nested(event))
})

distinct_event_name_values = rest.model("DistinctEventNameValues", {
    "values": fields.List(fields.String(required=True, description="A valid EventName value"))
})
