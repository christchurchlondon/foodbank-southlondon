from urllib import parse

from flask_restx import fields  # type: ignore
import flask
import flask_restx  # type: ignore

from foodbank_southlondon.api import rest


# CONFIG VARIABLES
_FBSL_COLLECTION_CENTRES = "FBSL_COLLECTION_CENTRES"


_calendar_model = rest.model("Calendars", {
    "calendar_ids": fields.List(fields.String(required=True, description="The escaped calendar ID for a given collection centre.",
                                              example="ca2ikhedkfjhawd213123@group.calendar.google.com"))
})


@rest.route("/calendars/")
class Calendars(flask_restx.Resource):

    @rest.marshal_with(_calendar_model)
    def get(self):
        return {
            "calendar_ids": [calendar["calendar_id"] for calendar in flask.current_app.config[_FBSL_COLLECTION_CENTRES].values()],
        }
