import copy

from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models
from foodbank_southlondon.api.requests import models as requests_models
from foodbank_southlondon.api.events import models as events_models
from foodbank_southlondon.bff import rest


def _clone_without_attribute(field):
    field_copy = copy.copy(field)
    field_copy.attribute = None
    return field_copy


pagination = rest.model("ResultsPage", models.pagination_fields)

status = rest.model("Status", {
    "request_id": requests_models.request["request_id"],
    "client_full_name": _clone_without_attribute(requests_models.request["client_full_name"]),
    "reference_number": _clone_without_attribute(requests_models.request["reference_number"]),
    "postcode": _clone_without_attribute(requests_models.request["postcode"]),
    "delivery_date": _clone_without_attribute(requests_models.request["delivery_date"]),
    "event_timestamp": events_models.event["event_timestamp"],
    "event_name": events_models.event["event_name"],
    "event_date": events_models.event["event_date"]
})


page_of_status = rest.inherit("StatusPage", pagination, {
    "items": fields.List(fields.Nested(status))
})
