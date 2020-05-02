from flask_restx import inputs  # type:ignore

from foodbank_southlondon.api.parsers import cache_params, pagination_params  # noqa: F401


requests_params = pagination_params.copy()
requests_params.add_argument("client_full_names", type=str, required=False, action="split", help="A comma separated list of Client Full Names to "
                             "filter on")
requests_params.add_argument("last_req_only", type=inputs.boolean, required=False, help="Whether only the most recent request per Client Full Name "
                             "will be fetched")

distinct_requests_params = cache_params.copy()
distinct_requests_params.add_argument("attribute", type=str, required=True, choices=["Delivery Date"],
                                      help="The attribute to get distinct values for.")
