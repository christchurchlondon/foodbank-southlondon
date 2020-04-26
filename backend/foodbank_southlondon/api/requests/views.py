import itertools

import flask
import flask_restx  # type:ignore

from foodbank_southlondon.api import rest, utils
from foodbank_southlondon.api.requests import models, namespace, parsers


# CONFIG VARIABLES
_FBSL_REQUESTS_DRIVE_URI = "FBSL_REQUESTS_DRIVE_URI"


_requests_by_id = {}
_requests_by_ref = {}


@namespace.route("/")
class Requests(flask_restx.Resource):

    @rest.expect(parsers.requests_params)
    @rest.marshal_with(models.page_of_requests)
    def get(self):
        """List all Client Requests."""
        params = parsers.requests_params.parse_args(flask.request)
        ref_numbers = params["ref_numbers"]
        last_req_only = params["last_req_only"]
        if not ref_numbers and not last_req_only:
            data = _requests().values()
        else:
            data = _requests(by_ref=True)
            if ref_numbers:
                data = {k: v for k, v in data.items() if k in ref_numbers}
            if last_req_only:
                data = {k: [v[-1]] for k, v in data.items()}
            data = itertools.chain(*data.values())
        page = params["page"]
        per_page = params["per_page"]
        data = list(itertools.islice(data, (page - 1) * per_page, page * per_page))  # this pagination should be a decorator - or just use a db...
        print(data)
        return {
            "page": 0,
            "per_page": 0,
            "total_pages": 0,
            "total_items": 0,
            "items": data
        }


@namespace.route("/<string:id>")
class Request(flask_restx.Resource):
    def get(self, id):
        """Get a single Client Request."""
        pass


@utils.expiring_cache(_requests_by_id, _requests_by_ref)
def _requests(by_ref=False):
    if not _requests_by_id:
        _update_cache()
    return _requests_by_id if not by_ref else _requests_by_ref


def _update_cache():
    sheet = utils.first_sheet(flask.current_app.config[_FBSL_REQUESTS_DRIVE_URI])
    all_values = utils.sheet_data_values(sheet)
    _requests_by_id.update(dict(zip(utils.sheet_data_values(sheet, 1), all_values)))  # the clear followed by update is not atomic. thread-unsafe!!!
    data = {}
    for k, v in zip(utils.sheet_data_values(sheet, 2), all_values):
        data.setdefault(k, []).append(v)  # we assume naturally ordered by request ID
    _requests_by_ref.update(data)
