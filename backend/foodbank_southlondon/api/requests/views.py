import flask_restx  # type:ignore

from foodbank_southlondon.api import rest
from foodbank_southlondon.api.requests import models, namespace, parsers


@namespace.route("/")
class Requests(flask_restx.Resource):

    @rest.expect(parsers.requests_params)
    @rest.marshal_with(models.page_of_requests)
    def get(self):
        """List all Client Requests."""
        pass


@namespace.route("/<string:id>")
class Request(flask_restx.Resource):
    def get(self, id):
        """Get a single Client Request."""
        pass
