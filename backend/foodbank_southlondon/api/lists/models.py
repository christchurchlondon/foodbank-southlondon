from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import rest
from foodbank_southlondon.api.requests import models as requests_models


item = rest.model("Item", {
    "Description": fields.String(required=True, description="A description of the item", example="Eggs"),
    "Quantity": fields.Integer(required=True, description="The quantity of the item"),
    "Comments": fields.String(required=False, description="Any item-specific comments", example="Full fat option if available")
})

list = rest.model("List", {
    "Type": requests_models.request["Type"],
    "Comments": fields.String(required=False, description="Any generic list-wide comments", example="Lots of additions due to Easter"),
    "Items": fields.List(fields.Nested(item))
})

all_lists = rest.model("All Lists", {
    "items": fields.List(fields.Nested(list))
})
