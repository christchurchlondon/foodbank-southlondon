from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models
from foodbank_southlondon.api.requests import models as requests_models
from foodbank_southlondon.api.events import models as events_models
from foodbank_southlondon.bff import rest


pagination = rest.model("ResultsPage", models.pagination_fields)


status = rest.model("Status", {
    "request_id": requests_models.request["request_id"],
    "client_full_name": requests_models.request["client_full_name"],
    "reference_number": requests_models.request["reference_number"],
    "postcode": requests_models.request["postcode"],
    "delivery_date": requests_models.request["delivery_date"],
    "event_timestamp": events_models.event["event_timestamp"],
    "event_name": events_models.event["event_name"],
    "event_date": events_models.event["event_date"]
})


page_of_status = rest.inherit("StatusPage", pagination, {
    "items": fields.List(fields.Nested(status))
})
