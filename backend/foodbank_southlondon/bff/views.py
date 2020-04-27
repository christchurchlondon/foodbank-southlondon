import flask_restx  # type:ignore

from foodbank_southlondon.bff import rest


@rest.route("/test")
class Test(flask_restx.Resource):
    def get(self):
        pass
