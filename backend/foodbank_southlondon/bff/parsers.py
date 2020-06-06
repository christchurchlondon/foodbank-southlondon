import datetime

from foodbank_southlondon.api import parsers
from foodbank_southlondon.api.parsers import cache_params  # noqa: F401
from foodbank_southlondon.api.requests.parsers import requests_params


_requests_params_args = {arg.name: arg for arg in requests_params.args}


status_params = parsers.pagination_params.copy()
status_params.add_argument("start_date", type=lambda x: datetime.date.fromisoformat(x), required=False,
                           help="An ISO 8601 formatted start date value to filter requests from. If an end_date is provided but a start_date is not "
                           "provided, the start_date defaults to the first of the month.")
status_params.add_argument("end_date", type=lambda x: datetime.date.fromisoformat(x), required=False,
                           help="An ISO 8601 formatted end date value to filter requests until. If a start_date is provided but an end_date is not "
                           "provided, it end_date defaults to to today.")
status_params.add_argument(_requests_params_args["client_full_names"])
status_params.add_argument(_requests_params_args["postcodes"])
status_params.add_argument(_requests_params_args["reference_numbers"])
