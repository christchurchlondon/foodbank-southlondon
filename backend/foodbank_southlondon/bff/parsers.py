from foodbank_southlondon.api import parsers
from foodbank_southlondon.api.parsers import cache_params  # noqa: F401
from foodbank_southlondon.api.requests.parsers import requests_params


_requests_params_args = {arg.name: arg for arg in requests_params.args}


status_params = parsers.pagination_params.copy()
status_params.add_argument(_requests_params_args["client_full_names"])
status_params.add_argument(_requests_params_args["postcodes"])
