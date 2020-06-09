from flask_restx import inputs  # type:ignore

from foodbank_southlondon.api.parsers import cache_params, pagination_params  # noqa: F401


requests_params = pagination_params.copy()
requests_params.add_argument("packing_dates", type=str, required=False, action="split", help="A comma separated list of Packing Dates to filter "
                             "on - if provided, this filter applies first")
requests_params.add_argument("client_full_names", type=str, required=False, action="split", help="A comma separated list of Client Full Names to "
                             "filter on - if provided alongside postcodes and/or voucher_numbers, the result will be based on an OR filter")
requests_params.add_argument("postcodes", type=str, required=False, action="split", help="A comma separated list of Postcodes to filter on - if "
                             "provided alongside client_full_names and/or voucher_numbers, the result will be based on an OR filter")
requests_params.add_argument("voucher_numbers", type=str, required=False, action="split", help="A comma separated list of Voucher Numbers to "
                             "filter on - if provided alongside client_full_names and/or packing_dates, the result will be based on an OR filter")
requests_params.add_argument("last_request_only", type=inputs.boolean, required=False, help="Whether only the most recent request per Client Full "
                             "Name will be fetched")

distinct_requests_params = cache_params.copy()
distinct_requests_params.add_argument("packing_dates", type=str, required=False, action="split", help="A comma separated list of Packing Dates to "
                                      "filter on before fetching distinct values")
distinct_requests_params.add_argument("attribute", type=str, required=True, help="The attribute to get distinct values for.",
                                      choices=["Client Full Name", "Packing Date", "Voucher Number", "Postcode"])
