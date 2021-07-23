from flask_restx import inputs  # type: ignore

from foodbank_southlondon.api.parsers import cache_params, pagination_params  # noqa: F401
from foodbank_southlondon.api.events.parsers import events_params  # noqa: F401


_events_params_args = {arg.name: arg for arg in events_params.args}


requests_params = pagination_params.copy()
requests_params.add_argument("packing_dates", type=str, required=False, action="split", help="A comma separated list of Packing Dates in the format "
                             "of DD/MM/YYYY to filter on - if provided, this filter applies first")
requests_params.add_argument("client_full_names", type=str, required=False, action="split", help="A comma separated list of Client Full Names to "
                             "filter on (a fuzzy match will be attempted)")
requests_params.add_argument("postcodes", type=str, required=False, action="split", case_sensitive=False, help="A comma separated list of Postcodes "
                             "to filter on (case insensitive and can be a prefix)")
requests_params.add_argument("time_of_days", type=str, required=False, action="split", help="A comma separated list of Times of Day to filter on.")
requests_params.add_argument("voucher_numbers", type=str, required=False, action="split", help="A comma separated list of Voucher Numbers to "
                             "filter on")
requests_params.add_argument("collection_centres", type=str, required=False, action="split", help="A comma sepaerated list of Collection Centres to "
                             "filter on.")
requests_params.add_argument(_events_params_args["event_names"])
requests_params.add_argument("last_request_only", type=inputs.boolean, required=False, help="Whether only the most recent request per Client Full "
                             "Name will be fetched")

distinct_requests_params = cache_params.copy()
distinct_requests_params.add_argument("packing_dates", type=str, required=False, action="split", help="A comma separated list of Packing Dates in "
                                      "the format of DD/MM/YYYY to filter on - before fetching distinct values")
distinct_requests_params.add_argument("attribute", type=str, required=True, help="The attribute to get distinct values for.",
                                      choices=["Client Full Name", "Packing Date", "Postcode", "Time of Day", "Voucher Number"])
