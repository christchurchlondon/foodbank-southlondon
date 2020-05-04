from typing import Tuple

import flask
import flask_restx  # type:ignore
import pandas as pd  # type:ignore
import requests

from foodbank_southlondon.api import utils
from foodbank_southlondon.bff import models, parsers, rest


# CONFIG VARIABLES
_FBSL_BASE_URL = "FBSL_BASE_URL"


@rest.route("/status")
class Events(flask_restx.Resource):

    @rest.expect(parsers.status_params)
    @rest.marshal_with(models.page_of_status)
    @utils.paginate("Client Full Name", "request_id")
    def get(self) -> Tuple[pd.DataFrame, int, int]:
        params = parsers.status_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        client_full_names = params["client_full_names"]
        postcodes = params["postcodes"]
        api_url = flask.current_app.config[_FBSL_BASE_URL] + "/api/"
        r = requests.get(f"{api_url}requests/", params={"client_full_names": client_full_names, "postcodes": postcodes, "last_request_only": True},
                         headers={"X-Fields": "items{request_id, client_full_name, reference_number, postcode, delivery_date"})
        print(r.json())
        return (data, params["page"], params["per_page"])
