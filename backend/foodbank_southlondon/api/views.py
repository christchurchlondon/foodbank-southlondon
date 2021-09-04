from flask_restx import fields  # type: ignore
import flask
import flask_restx  # type: ignore

from foodbank_southlondon.api import rest


# CONFIG VARIABLES
_FBSL_COLLECTION_CENTRES = "FBSL_COLLECTION_CENTRES"

calendar = rest.model("Calendar", {
    "id": fields.String(required=True, description="The calendar ID for a given collection centre",
                        example="ca2ikhedkfjhawd213123@group.calendar.google.com"),
    "colour": fields.String(required=True, description="Hex code colour for the calendar events")
})

_calendar_model = rest.model("Calendars", {
    "calendars": fields.List(fields.Nested(calendar))
})


@rest.route("/calendars/")
class Calendars(flask_restx.Resource):

    @rest.marshal_with(_calendar_model)
    def get(self):
        centres = flask.current_app.config[_FBSL_COLLECTION_CENTRES].values()

        return {
            "calendars": [
                {"id": centre["calendar_id"], "colour": centre["calendar_colour"]} for centre in centres
            ]
        }
