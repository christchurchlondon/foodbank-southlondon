import datetime

import flask

from foodbank_southlondon import app, helpers
from foodbank_southlondon.api.requests import views as requests_views


# CONFIG VARIABLES
_FBSL_CALENDAR_ID = "FBSL_CALENDAR_ID"
_FBSL_WATERMARK_CALENDAR_EVENT_ID = "FBSL_WATERMARK_CALENDAR_EVENT_ID"


@app.cli.command()
def sync_calendar():
    """Synchronise the Foodbank Google Calendar based on changes in the Request data."""
    new_threshold = datetime.datetime.utcnow()  # need to check if timestamp in sheet is local without tz or utc
    calendar_events_resource = helpers.calendar_events_resource()
    watermark_event = calendar_events_resource.get(calendarId=flask.current_app.config[_FBSL_CALENDAR_ID],
                                                   eventId=flask.current_app.config[_FBSL_WATERMARK_CALENDAR_EVENT_ID]).execute()
    old_threshold = datetime.datetime.fromisoformat(watermark_event["start"]["dateTime"]).replace(tzinfo=None)  # safe because UTC
    requests_df = requests_views.cache()
    requests_df = requests_df.loc[requests_df["Timestamp"].apply(lambda x: datetime.datetime.strptime(x, "%d/%m/%Y %H:%M:%S") if x else old_threshold)
                                  > old_threshold]
    print(requests_df)
    # for each request
        # does event exist?
            # should it be deleted (delivery)?
                # delete it
            # else should it be updated (name, location [calendar], date, time)
                # update it
        # else should it be created?
            # create it
    # update state
