import datetime

import flask
import pandas as pd  # type:ignore

from foodbank_southlondon import app, helpers
from foodbank_southlondon.api.requests import views as requests_views


# CONFIG VARIABLES
_FBSL_CALENDAR_ID = "FBSL_CALENDAR_ID"
_FBSL_COLLECTION_EVENT_DURATION_MINS = "FBSL_COLLECTION_EVENT_DURATION_MINS"
_FBSL_COLLECTION_SITES = "FBSL_COLLECTION_SITES"
_FBSL_WATERMARK_CALENDAR_EVENT_ID = "FBSL_WATERMARK_CALENDAR_EVENT_ID"


@app.cli.command()
def sync_calendar():
    """Synchronise the Foodbank Google Calendar based on changes in the Request data."""
    new_threshold = datetime.datetime.utcnow()  # need to check if timestamp in sheet is local without tz or utc
    calendar_events_resource = helpers.calendar_events_resource()
    calendar_id = flask.current_app.config[_FBSL_CALENDAR_ID]
    watermark_event = calendar_events_resource.get(calendarId=calendar_id,
                                                   eventId=flask.current_app.config[_FBSL_WATERMARK_CALENDAR_EVENT_ID]).execute()
    old_threshold = datetime.datetime.fromisoformat(watermark_event["start"]["dateTime"]).replace(tzinfo=None)  # safe because UTC
    requests_df = requests_views.cache()
    requests_df = requests_df.loc[pd.to_datetime(requests_df["Timestamp"], format="%d/%m/%Y %H:%M:%S", errors="coerce") > old_threshold]
    request_id_attribute = "request_id"
    for index, row in requests_df.iterrows():
        old_event = next(iter(calendar_events_resource.list(calendarId=calendar_id,
                         privateExtendedProperty=f"{request_id_attribute}={row[request_id_attribute]}").execute()["items"]), {})
        old_event_id = old_event.get("id")
        if row["Collection"]:
            collection_site = row["Collection Site"]
            new_event = {
                "summary": f"[{collection_site}] {row['Client Full Name']}",
                "start": {"datetime": row['Collection Time']},
                "location": collection_site,
                "colorId": flask.current_app.config[_FBSL_COLLECTION_SITES].get(collection_site)
            }
            if old_event:
                if set(new_event.items()).symmetric_difference({k: old_event[k] for k in new_event}.items()):
                    calendar_events_resource.patch(calendarId=calendar_id, event_id=old_event_id, body=new_event)
            else:
                calendar_events_resource.insert(calendarId=calendar_id, body=new_event)
        elif old_event:
            calendar_events_resource.delete(calendarId=calendar_id, eventId=old_event_id)
    calendar_events_resource.patch(calendarId=calendar_id, event_id=watermark_event["id"], body={"start": {"dateTime": new_threshold}})
