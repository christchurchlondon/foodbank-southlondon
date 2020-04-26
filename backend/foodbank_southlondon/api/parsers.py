from flask_restx import reqparse  # type:ignore


pagination_params = reqparse.RequestParser()
pagination_params.add_argument("page", type=int, required=False, default=1, help="Page number")
pagination_params.add_argument("per_page", type=int, required=False, default=10, help="Maximum items per page (max=100)")
