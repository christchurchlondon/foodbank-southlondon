from flask_restx import inputs, reqparse  # type:ignore


requests_params = reqparse.RequestParser()
requests_params.add_argument("page", type=int, required=False, default=1, help="Page number")
requests_params.add_argument("per_page", type=int, required=False, default=10, help="Maximum items per page (max=100)")
requests_params.add_argument("ref_numbers", type=str, required=False, action="split", help="A comma separated list of ref_numbers to filter on")
requests_params.add_argument("last_req_only", type=inputs.boolean, required=False, help="Whether only the most recent request per Reference Number "
                             "will be fetched")
