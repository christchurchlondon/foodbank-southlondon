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


def _event_end_rfc3339_from_start(start_datetime):
    return (start_datetime + datetime.timedelta(minutes=flask.current_app.config[_FBSL_COLLECTION_EVENT_DURATION_MINS])).isoformat()


@app.cli.command()
def sync_calendar():
    """Synchronise the Foodbank Google Calendar based on changes in the Request data."""
    # add logging
    new_threshold = datetime.datetime.now(datetime.timezone.utc)
    calendar_events_resource = helpers.calendar_events_resource()
    config = flask.current_app.config
    calendar_id = config[_FBSL_CALENDAR_ID]
    watermark_event = calendar_events_resource.get(calendarId=calendar_id, eventId=config[_FBSL_WATERMARK_CALENDAR_EVENT_ID]).execute()
    old_threshold_raw = datetime.datetime.fromisoformat(watermark_event["start"]["dateTime"])
    old_threshold = (old_threshold_raw - datetime.timedelta(hours=2)).replace(tzinfo=None)  # safe because of 2h buffer
    requests_df = requests_views.cache()
    requests_datetime_format = "%d/%m/%Y %H:%M:%S"
    requests_df = requests_df.loc[pd.to_datetime(requests_df["Timestamp"], format=requests_datetime_format, errors="coerce") > old_threshold]
    request_id_attribute = "request_id"
    for _, row in requests_df.iterrows():
        request_id = row[request_id_attribute]
        old_event = next(iter(calendar_events_resource.list(calendarId=calendar_id,
                         privateExtendedProperty=f"{request_id_attribute}={request_id}").execute()["items"]), {})
        old_event_id = old_event.get("id")
        if row["Collection"]:
            collection_site = row["Collection Site"]
            start_datetime = datetime.datetime.strptime(row['Collection Time'], "%d/%m/%Y %H:%M:%S").astimezone()
            new_event = {
                "summary": f"[{collection_site}] {row['Client Full Name']}",
                "start": {"dateTime": start_datetime.isoformat()},
                "end": {"dateTime": _event_end_rfc3339_from_start(start_datetime)},
                "location": collection_site,
                "colorId": config[_FBSL_COLLECTION_SITES].get(collection_site, {}).get("colorId", "11"),
                "extendedProperties": {"private": {request_id_attribute: request_id}}
            }
            if old_event:
                changed_event_attributes = {k: v for k, v in new_event.items() if old_event[k] != v}
                if changed_event_attributes:
                    calendar_events_resource.patch(calendarId=calendar_id, eventId=old_event_id, body=new_event).execute()
            else:
                calendar_events_resource.insert(calendarId=calendar_id, body=new_event).execute()
        elif old_event:
            calendar_events_resource.delete(calendarId=calendar_id, eventId=old_event_id).execute()
    calendar_events_resource.patch(calendarId=calendar_id, eventId=watermark_event["id"],
                                   body={"start": {"dateTime": new_threshold.isoformat()},
                                         "end": {"dateTime": _event_end_rfc3339_from_start(new_threshold)}}).execute()
