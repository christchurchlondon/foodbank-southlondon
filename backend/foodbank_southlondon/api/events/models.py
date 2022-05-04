import dataclasses
import enum

from flask_restx import fields  # type: ignore

from foodbank_southlondon.api import models, rest
from foodbank_southlondon.api.requests import models as requests_models


class ResponseType(enum.Enum):
    NO_CONTENT = "NO_CONTENT"
    DOWNLOAD = "DOWNLOAD"
    URL = "URL"


@dataclasses.dataclass
class Event:
    event_name: str
    confirmation_expected: bool
    date_expected: bool
    quantity_expected: bool
    name_expected: bool
    response_type: str
    confirmation_label: str = None


class Action(enum.Enum):
    GENERATE_MAP = Event("Generate Map", False, False, False, False, ResponseType.URL.value,
                         "This action generates a google map URL with location markers without logging a status.")
    PRINT_DAY_OVERVIEW = Event("Print Day Overview", True, False, False, False, ResponseType.DOWNLOAD.value,
                               "This action generates a driver-overview like PDF without logging a status.")
    PRINT_SHOPPING_LIST = Event("Print Shopping List", True, False, False, False, ResponseType.DOWNLOAD.value)
    PRINT_SHIPPING_LABEL = Event("Print Shipping Label", True, False, True, False, ResponseType.DOWNLOAD.value,
                                 "How many boxes have been made for this client?")
    PRINT_DRIVER_OVERVIEW = Event("Print Driver Overview", True, False, False, True, ResponseType.DOWNLOAD.value)
    DELETE_REQUEST = Event("Delete Request", True, False, False, False, ResponseType.NO_CONTENT.value,
                           "This action permanently deletes the request. This action cannot be undone. Are you sure you wish to continue?")


ACTIONS = [action.value for action in Action]
ACTION_NAMES = [action.event_name for action in ACTIONS]


class Status(enum.Enum):
    REQUEST_DENIED = Event("Request Denied", True, False, False, False, ResponseType.NO_CONTENT.value,
                           "This action marks the request as denied but does not delete the request.")
    NO_STATUS = Event("", True, False, False, False, ResponseType.NO_CONTENT.value, "This action clears the current status.")
    PENDING_MORE_INFO = Event("Pending More Info", True, False, False, False, ResponseType.NO_CONTENT.value)
    CALLED_CONFIRMED = Event("Called & Confirmed", True, True, False, False, ResponseType.NO_CONTENT.value, "What date did you call the client?")
    CALLED_NO_RESPONSE = Event("Called & No Response", True, True, False, False, ResponseType.NO_CONTENT.value,
                               "What date did you attempt to call the client?")
    READY_TO_DISPATCH = Event("Ready to Dispatch", True, False, False, False, ResponseType.NO_CONTENT.value)
    RECEIVED_BY_CENTRE = Event("Received by Centre", True, True, False, False, ResponseType.NO_CONTENT.value,
                               "What date did the centre receive the parcel?")
    COLLECTION_FAILED = Event("Collection Failed", True, True, False, False, ResponseType.NO_CONTENT.value, "What date did the collection fail?")
    PARCEL_COLLECTED = Event("Parcel Collected", True, True, False, False, ResponseType.NO_CONTENT.value,
                             "What date did the client collect the parcel?")
    DELIVERED = Event("Delivered", True, True, False, False, ResponseType.NO_CONTENT.value, "What date were the parcels delivered?")
    DELIVERY_FAILED = Event("Delivery Failed", True, True, False, False, ResponseType.NO_CONTENT.value, "What date did the delivery fail?")
    # CLIENT_CONTACT_REQUIRED = Event("Client Contact Required", True, False, False, False, ResponseType.NO_CONTENT.value) removed at request 13/01
    DELIVERY_CANCELLED = Event("Delivery Cancelled", True, True, False, False, ResponseType.NO_CONTENT.value,
                               "What date was the delivery marked as cancelled?")
    FULFILLED_WITH_TRUSSELL_TRUST = Event("Fulfilled with Trussell Trust", True, True, False, False, ResponseType.NO_CONTENT.value,
                                          "What date was Trussel Trust updated as fulfilled for this request?")


STATUSES = [status.value for status in Status]
STATUS_NAMES = [status.event_name for status in STATUSES]


class ActionStatus(enum.Enum):
    SHOPPING_LIST_PRINTED = Event("Shopping List Printed", False, False, False, False, ResponseType.NO_CONTENT.value)
    SHIPPING_LABEL_PRINTED = Event("Shipping Label Printed", False, False, False, False, ResponseType.NO_CONTENT.value)
    OUT_FOR_DELIVERY = Event("Out for Delivery", False, False, False, False, ResponseType.NO_CONTENT.value)
    REQUEST_DELETED = Event("Request Deleted", False, False, False, False, ResponseType.NO_CONTENT.value)


ACTION_STATUSES = [action_status.value for action_status in ActionStatus]

EVENTS = STATUSES + ACTION_STATUSES
EVENT_NAMES = [event.event_name for event in EVENTS]

_distinct_event_type = rest.model("DistinctEventType", {
    "event_name": fields.String(required=True, description="A valid event_name value", example=Status.REQUEST_DENIED.value.event_name),
    "confirmation_expected": fields.Boolean(required=True, description="Whether this event_name expects special confirmation.", example=False),
    "date_expected": fields.Boolean(required=True, description="Whether this event_name expects a date to be captured.", example=True),
    "quantity_expected": fields.Boolean(required=True, description="Whether this event_name expects a quantity to be captured.", example=True),
    "name_expected": fields.Boolean(required=True, description="Whether this event_name expects a driver name to be captured.", example=False),
    "response_type": fields.String(required=True, description="The type of response returned from submitting the action.",
                                   example=ResponseType.DOWNLOAD.value),
    "confirmation_label": fields.String(required=True, description="The label to show when requesting confirmation.",
                                        example=Status.REQUEST_DENIED.value.confirmation_label)
})

distinct_event_types = rest.model("DistinctEventTypes", {
    "items": fields.List(fields.Nested(_distinct_event_type))
})

event = rest.model("Event", {
    "request_id": requests_models.request["request_id"],
    "event_timestamp": fields.DateTime(required=True, description="The timestamp when the event was recorded, in ISO 8601 format",
                                       example="2020-04-26T13:31:42Z"),
    "event_name": fields.String(required=True, description="The name of the event that occured", example=Status.REQUEST_DENIED.value.event_name,
                                enum=EVENT_NAMES),
    "event_data": fields.String(required=True, description="Data that accompanied the event submission such as a date or name", example="2020-04-01")
})

page_of_events = rest.inherit("EventsPage", models.pagination, {
    "items": fields.List(fields.Nested(event))
})

all_events = rest.model("AllEvents", {
    "items": fields.List(fields.Nested(event))
})
