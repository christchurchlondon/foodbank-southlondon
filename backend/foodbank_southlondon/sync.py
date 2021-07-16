import flask

from backend.foodbank_southlondon.helpers import calendar_events_resource
from foodbank_southlondon import app, helpers


# CONFIG VARIABLES
_FBSL_CALENDAR_ID = "FBSL_CALENDAR_ID"
_FBSL_WATERMARK_CALENDAR_EVENT_ID = "FBSL_WATERMARK_CALENDAR_EVENT_ID"


@app.cli.command()
def sync_calendar():
    calendar_events_resource = helpers.calendar_events_resource()
    watermark_event = calendar_events_resource.get(flask.current_app.config[_FBSL_CALENDAR_ID],
                                                   flask.current_app.config[_FBSL_WATERMARK_CALENDAR_EVENT_ID])
    threshold = watermark_event.
    # get state
    # get requests that have changed since threshold
    # for each request
        # does event exist?
            # should it be deleted (delivery)?
                # delete it
            # else should it be updated (name, location [calendar], date, time)
                # update it
        # else should it be created?
            # create it
    # update state
