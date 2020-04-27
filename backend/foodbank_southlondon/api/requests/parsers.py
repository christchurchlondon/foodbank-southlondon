from flask_restx import inputs  # type:ignore

from foodbank_southlondon.api.parsers import cache_params, pagination_params  # noqa: F401


requests_params = pagination_params.copy()
requests_params.add_argument("ref_numbers", type=str, required=False, action="split", help="A comma separated list of ref_numbers to filter on")
requests_params.add_argument("last_req_only", type=inputs.boolean, required=False, help="Whether only the most recent request per Reference Number "
                             "will be fetched")
