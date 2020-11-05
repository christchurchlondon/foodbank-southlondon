from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models, rest
from foodbank_southlondon.api.requests import models as requests_models


STATUSES = {
    "Request Denied": "This action marks the request as denied but does not delete the request from the system.",
    "No Status": None,
    "Pending More Info": None,
    "Called & Confirmed": "What date did you call the client?",
    "Called & No Response": "What date did you attempt to call the client?",
    "Ready to Dispatch": None,
    "Delivered": "What date were the parcels delivered?",
    "Delivery Failed": "What date did the delivery fail?",
    "Client Contact Required": None,
    "Delivery Cancelled": "What date was the delivery marked as cancelled?",
    "Fullfilled with Trussell Trust": "What date was Trussel Trust updated as fulfilled for this request?",
    "Request Deleted": None
}

ACTIONS = {
    "Print Shopping List": None,
    "Print Shipping Label": "How many boxes have been made for this client?",
    "Print Driver Overview": None,
    "Permanently Delete Request": "This action permanently deletes the data from the system. This action cannot be undone. Are you sure you wish to "
                                  "continue?"
}

ACTION_STATUSES = (
    "Shopping List Printed",
    "Shipping Label Printed",
    "Driver Overview Printed"
)

EVENTS = list(STATUSES) + list(ACTION_STATUSES)

_example_name, _example_label = next(iter(STATUSES.items()))

event = rest.model("Event", {
    "request_id": requests_models.request["request_id"],
    "event_timestamp": fields.DateTime(required=True, description="The timestamp when the event was recorded, in ISO 8601 format",
                                       example="2020-04-26T13:31:42Z"),
    "event_name": fields.String(required=True, description="The name of the event that occured", example=_example_name, enum=EVENTS),
    "event_data": fields.String(required=True, description="Data that accompanied the event submission such as a date or name", example="2020-04-01")
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
    "name_expected": fields.Boolean(required=True, description="Whether this event_name expects a driver name to be captured.", example=False),
    "returns_pdf": fields.Boolean(required=True, description="Whether a POST of this event_name would return a PDF or not.", example=False),
    "confirmation_label": fields.String(required=True, description="The label to show when requesting confirmation.", example=_example_label)
})

distinct_event_name_values = rest.model("DistinctEventNameValues", {
    "values": fields.List(fields.Nested(_distinct_event_name_value))
})
