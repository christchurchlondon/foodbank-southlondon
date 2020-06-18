from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models, rest
from foodbank_southlondon.api.requests import models as requests_models


EVENTS = {
    "Deny Request": "This action marks the request as denied but does not delete the request from the system.",
    "Print Shopping List": None,
    "Print Shipping Label": "How many boxes have been made for this client?",
    "Print Driver Overview": None,
    "Mark as Called and Confirmed": "What date did you call the client?",
    "Mark as Called and No Response": "What date did you attempt to call the client?",
    "Mark as Out for Delivery": "What date did the parcels leave the warehouse?",
    "Mark as Delivered": "What date were the parcels delivered?",
    "Mark as Delivery Cancelled": "What date was the delivery marked as cancelled?",
    "Mark as Fullfilled with Trussell Trust": "What date was Trussel Trust updated as fulfilled for this request?",
    "Permanently Delete Request": "This action permanently deletes the data from the system. This action cannot be undone. Are you sure you wish to "
                                  "continue?"
}


_example_name, _example_label = next(iter(EVENTS.items()))

event = rest.model("Event", {
    "request_id": requests_models.request["request_id"],
    "event_timestamp": fields.DateTime(required=True, description="The timestamp when the event was recorded, in ISO 8601 format",
                                       example="2020-04-26T13:31:42Z"),
    "event_name": fields.String(required=True, description="The name of the event that occured", example=_example_name, enum=list(EVENTS.keys())),
    "event_data": fields.String(required=True, description="The data recorded with the event (blank, a date or quantity)", example="2020-04-01")
})

page_of_events = rest.inherit("EventsPage", models.pagination, {
    "items": fields.List(fields.Nested(event))
})

all_events = rest.model("AllEvents", {
    "items": fields.List(fields.Nested(event))
})


_distinct_event_name_value = rest.model("DistinctEventNameValue", {
    "event_name": fields.String(required=True, description="A valid event_name value", example=_example_name),
    "confirmation_expected": fields.Boolean(required=True, description="Whether this event_name expects special confirmation.", example=False),
    "date_expected": fields.Boolean(required=True, description="Whether this event_name expects a date to be captured.", example=True),
    "quantity_expected": fields.Boolean(required=True, description="Whether this event_name expects a quantity to be captured.", example=True),
    "returns_pdf": fields.Boolean(required=True, description="Whether a POST of this event_name would return a PDF or not.", example=False),
    "confirmation_label": fields.String(required=True, description="The label to show when requesting confirmation.", example=_example_label)
})

distinct_event_name_values = rest.model("DistinctEventNameValues", {
    "values": fields.List(fields.Nested(_distinct_event_name_value))
})
