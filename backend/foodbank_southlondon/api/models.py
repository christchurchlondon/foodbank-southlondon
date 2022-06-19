from flask_restx import fields  # type: ignore

from foodbank_southlondon.api import rest


pagination_fields = {
    "page": fields.Integer(required=True, description="The page of the results", example=1),
    "per_page": fields.Integer(required=True, description="The maximum number of items per page", example=50),
    "total_items": fields.Integer(required=True, description="The total number of items", example=993),
    "total_pages": fields.Integer(required=True, description="The total number of pages", example=20)
}


pagination = rest.model("ResultsPage", pagination_fields)

suggestion_fields = {
    "key": fields.String(required=True),
    "value": fields.String(required=True), 
    "score": fields.Float(required=True)
}

suggestion = rest.model("Suggestion", suggestion_fields)

suggestions = rest.model("Suggestions", {
    "suggestions": fields.List(fields.Nested(suggestion))
})
