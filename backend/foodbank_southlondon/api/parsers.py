from flask_restx import inputs, reqparse  # type: ignore


cache_params = reqparse.RequestParser(trim=True)
cache_params.add_argument("refresh_cache", type=inputs.boolean, required=False, help="Whether the cache should be force refreshed")

pagination_params = cache_params.copy()
pagination_params.add_argument("page", type=int, required=False, default=1, help="Page number")
pagination_params.add_argument("per_page", type=int, required=False, default=50, help="Maximum items per page")

search_params = reqparse.RequestParser(trim=True)
search_params.add_argument("q", required=False)
