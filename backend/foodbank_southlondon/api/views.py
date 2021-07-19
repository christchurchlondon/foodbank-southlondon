from urllib import parse

from flask_restx import fields  # type:ignore
import flask
import flask_restx  # type:ignore

from foodbank_southlondon.api import rest


# CONFIG VARIABLES
_FBSL_COLLECTION_CENTRES_CALENDAR_IDS = "FBSL_COLLECTION_CENTRES_CALENDAR_IDS"


_calendar_model = rest.model("Calendars", {
    "calendar_ids": fields.List(fields.String(required=True, description="The escaped calendar ID for a given collection centre.",
                                              example="ca2ikhedkfjhawd213123@group.calendar.google.com"))
})


@rest.route("/calendars/")
class Calendars(flask_restx.Resource):

    @rest.marshal_with(_calendar_model)
    def get(self):
        return {
            "calendar_ids": [parse.quote(calendar_id) for calendar_id in flask.current_app.config[_FBSL_COLLECTION_CENTRES_CALENDAR_IDS].values()],
        }
