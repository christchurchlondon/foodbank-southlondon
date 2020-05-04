from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import models
from foodbank_southlondon.bff import rest


pagination = rest.model("ResultsPage", models.pagination_fields)


status = rest.model("Status", {
    "foo": fields.String()
})


page_of_status = rest.inherit("StatusPage", pagination, {
    "items": fields.List(fields.Nested(status))
})
