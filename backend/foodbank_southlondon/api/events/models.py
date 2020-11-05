import dataclasses

from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models, rest
from foodbank_southlondon.api.requests import models as requests_models


@dataclasses.dataclass
class Event:
    name: str
    confirmation_expected: bool
    date_expected: bool
    quantity_expected: bool
    name_expected: bool
    returns_pdf: bool
    confirmation_label: str = None
    value_override: str = None


STATUSES = (
    Event("Request Denied", True, False, False, False, False, "This action marks the request as denied but does not delete the request."),
    Event("No Status", True, False, False, False, False, "This action clears the current status.", ""),
    Event("Pending More Info", True, False, False, False, False),
    Event("Called & Confirmed", True, True, False, False, False, "What date did you call the client?"),
    Event("Called & No Response", True, True, False, False, False, "What date did you attempt to call the client?"),
    Event("Ready to Dispatch", True, False, False, False, False),
    Event("Delivered", True, True, False, False, False, "What date were the parcels delivered?"),
    Event("Delivery Failed", True, True, False, False, False, "What date did the delivery fail?"),
    Event("Client Contact Required", True, False, False, False, False),
    Event("Delivery Cancelled", True, True, False, False, False, "What date was the delivery marked as cancelled?"),
    Event("Fullfilled with Trussell Trust", True, True, False, False, False, "What date was Trussel Trust updated as fulfilled for this request?")
)

ACTIONS = (
    Event("Print Shopping List", False, False, False, False, True),
    Event("Print Shipping Label", True, False, True, False, True, "How many boxes have been made for this client?"),
    Event("Print Driver Overview", True, False, False, True, True),
    Event("Permanently Delete Request", True, False, False, False, False, "This action permanently deletes the request. This action cannot be "
          "undone.Are you sure you wish to continue?")
)

ACTION_STATUSES = (
    Event("Shopping List Printed", False, False, False, False, False),
    Event("Shipping Label Printed", False, False, False, False, False),
    Event("Driver Overview Printed", False, False, False, False, False),
    Event("Request Deleted", False, False, False, False, False)
)

EVENTS = STATUSES + ACTION_STATUSES

_example_event = EVENTS[0]

event = rest.model("Event", {
    "request_id": requests_models.request["request_id"],
    "event_timestamp": fields.DateTime(required=True, description="The timestamp when the event was recorded, in ISO 8601 format",
                                       example="2020-04-26T13:31:42Z"),
    "event_name": fields.String(required=True, description="The name of the event that occured", example=_example_event.name,
                                enum=[event.name for event in EVENTS]),
    "event_data": fields.String(required=True, description="Data that accompanied the event submission such as a date or name", example="2020-04-01")
})

page_of_events = rest.inherit("EventsPage", models.pagination, {
    "items": fields.List(fields.Nested(event))
})

all_events = rest.model("AllEvents", {
    "items": fields.List(fields.Nested(event))
})

_distinct_event_type = rest.model("DistinctEventType", {
    "event_name": fields.String(required=True, description="A valid event_name value", example=_example_event.name),
    "confirmation_expected": fields.Boolean(required=True, description="Whether this event_name expects special confirmation.", example=False),
    "date_expected": fields.Boolean(required=True, description="Whether this event_name expects a date to be captured.", example=True),
    "quantity_expected": fields.Boolean(required=True, description="Whether this event_name expects a quantity to be captured.", example=True),
    "name_expected": fields.Boolean(required=True, description="Whether this event_name expects a driver name to be captured.", example=False),
    "returns_pdf": fields.Boolean(required=True, description="Whether a POST of this event_name would return a PDF or not.", example=False),
    "confirmation_label": fields.String(required=True, description="The label to show when requesting confirmation.",
                                        example=_example_event.confirmation_label)
})

distinct_event_types = rest.model("DistinctEventTypes", {
    "items": fields.List(fields.Nested(_distinct_event_type))
})
