from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models, rest


request = rest.model("Client Request", {
    "Request ID": fields.String(required=True, description="The unique ID of the Client Request",
                                example="ACYDBNgidDBRKTk_WpZiWnVOKVzOzbPPXzO3NxqUlTK9cNXuEfpOLTRRT5YV2dnscmWOucg"),
    "Reference Number": fields.String(required=True, description="The unique FoodBank Reference Number of the Client (consistent across requests)",
                                      example="H-00001-00001"),
    "Name": fields.String(required=True, description="The name of the Client", example="John Smith"),
    "Type": fields.String(required=True, enum=["Single, Couple, Family of 4"], description="The type of request", example="Single")
})

page_of_requests = rest.inherit("A page of Client Requests", models.pagination, {
    "items": fields.List(fields.Nested(request))
})
