import flask_restx

from foodbank_southlondon.api import rest, utils


_requests_by_id = {}
_requests_by_ref = {}


namespace = rest.namespace("requests", description="Operations related to Client Requests")


@namespace.route("/")
class Requests(flask_restx.Resource):
    def get(self):
        """List all Client Requests."""
        pass


@namespace.route("/<string:id>")
class Request(flask_restx.Resource):
    def get(self, id):
        """Get a single Client Request."""
        pass


def requests_by_id():
    if not _requests_by_id:
        update_cache()


def requests_by_ref():
    if not _requests_by_ref:
        update_cache()


def update_cache():
    pass
