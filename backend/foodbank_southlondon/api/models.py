from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import rest


pagination = rest.model("ResultsPage", {
    "page": fields.Integer(description="The page of the results", example=1),
    "per_page": fields.Integer(description="The maximum number of items per page", example=50),
    "total_pages": fields.Integer(description="The total number of pages", example=20),
    "total_items": fields.Integer(description="The total number of items", example=993)
})
