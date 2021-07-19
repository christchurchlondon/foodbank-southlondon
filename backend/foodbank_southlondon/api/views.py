from urllib import parse

import flask
from flask_restx import fields  # type:ignore

from foodbank_southlondon.api import rest


# CONFIG VARIABLES
_FBSL_COLLECTION_SITES_CALENDAR_IDS = "FBSL_COLLECTION_SITES_CALENDAR_IDS"


_calendar_model = rest.model("Calendars", {
    "calendar_ids": fields.List(fields.String(required=True, description="The escaped calendar ID for a given collection site.",
                                              example="ca2ikhedkfjhawd213123@group.calendar.google.com"))
})


@rest.route("/calendars")
@rest.marshal_with(_calendar_model)
def get_calendars():
    return {
        "calendar_ids": [parse.quote(calendar_id) for calendar_id in flask.current_app.config[_FBSL_COLLECTION_SITES_CALENDAR_IDS].values()],
    }
