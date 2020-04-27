from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models, rest
from foodbank_southlondon.api import requests


event = rest.model("Event", {
    "Request ID": requests.models.request["Request ID"],
    "Timestamp": fields.DateTime(required=True, description="The timestamp when the event was recorded, in ISO 8601 format",
                                 example="2020-04-26t13:31:42Z"),
    "Event Name": fields.String(required=True, description="The name of the event that occured", example="Label Printed",
                                enum=["Shopping List Printed", "Shipping Label Printed", "Marked as Out for Delivery", "Marked as Delivered",
                                      "Request Denied"]),
    "Event Date": fields.String(required=False, description="The date when the event occurred", example="2020-04-01")
})

page_of_events = rest.inherit("A page of Events", models.pagination, {
    "items": fields.List(fields.Nested(event))
})
