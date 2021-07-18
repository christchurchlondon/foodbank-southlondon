import datetime
import time

import pandas as pd  # type:ignore

from foodbank_southlondon import app, helpers
from foodbank_southlondon.api.requests import views as requests_views


# CONFIG VARIABLES
_FBSL_COLLECTION_EVENT_DURATION_MINS = "FBSL_COLLECTION_EVENT_DURATION_MINS"
_FBSL_COLLECTION_SITE_CALENDAR_IDS = "FBSL_COLLECTION_SITE_CALENDAR_IDS"
_FBSL_WATERMARK_CALENDAR_ID = "FBSL_WATERMARK_CALENDAR_ID"
_FBSL_WATERMARK_CALENDAR_EVENT_ID = "FBSL_WATERMARK_CALENDAR_EVENT_ID"

_COLLECTION = "Collection"


def _event_end_rfc3339_from_start(start_datetime):
    return (start_datetime + datetime.timedelta(minutes=app.config[_FBSL_COLLECTION_EVENT_DURATION_MINS])).isoformat()


def _find_event(calendar_events_resource, calendar_ids, private_extended_property):
    for calendar_id in calendar_ids:
        event = next(iter(calendar_events_resource.list(calendarId=calendar_id,
                                                        privateExtendedProperty=private_extended_property).execute()["items"]), None)
        if event:
            return (calendar_id, event)
    return (None, None)


@app.cli.command()
def sync_calendar():
    """Synchronise the Foodbank Google Calendar based on changes in the Request data."""
    app.logger.info("Starting the calendar synchronisation process...")
    watermark_calendar_id = app.config[_FBSL_WATERMARK_CALENDAR_ID]
    new_threshold = datetime.datetime.now(datetime.timezone.utc)
    calendar_events_resource = helpers.calendar_events_resource()
    requests_date_format = "%d/%m/%Y"
    request_id_attribute = "request_id"
    app.logger.info("Retrieving last known state...")
    watermark_event = calendar_events_resource.get(calendarId=watermark_calendar_id, eventId=app.config[_FBSL_WATERMARK_CALENDAR_EVENT_ID]).execute()
    old_threshold_raw = datetime.datetime.fromisoformat(watermark_event["start"]["dateTime"])
    old_threshold = (old_threshold_raw - datetime.timedelta(hours=2)).replace(tzinfo=None)  # safe because of 2h buffer
    requests_df = requests_views.cache()
    app.logger.info("Identifying changed requests...")
    requests_df = requests_df.loc[pd.to_datetime(requests_df["Timestamp"], format=f"{requests_date_format} %H:%M:%S",
                                                 errors="coerce") > old_threshold]
    app.logger.info(f"Found {len(requests_df.index)} potential changes.")
    calendar_ids = app.config[_FBSL_COLLECTION_SITE_CALENDAR_IDS]
    calendar_ids_values = calendar_ids.values()
    for _, row in requests_df.iterrows():
        request_id = row[request_id_attribute]
        private_extended_property = {request_id_attribute: request_id}
        private_extended_property_query = "&".join("=".join(item) for item in private_extended_property.items())
        if row["Shipping Method"] == _COLLECTION:
            collection_site = row["Collection Site"]
            collection_site_calendar_id = calendar_ids[collection_site]
            collection_date = datetime.datetime.strptime(row["Collection Date"], requests_date_format)
            collection_time = time.strptime(row[f"{collection_site} Collection Time"], "%H:%M")
            collection_datetime = datetime.datetime(collection_date.year, collection_date.month, collection_date.day, collection_time.tm_hour,
                                                    collection_time.tm_min).astimezone()
            new_event = {
                "summary": f"[{collection_site}] {row['Client Full Name']}",
                "start": {"dateTime": collection_datetime.isoformat()},
                "end": {"dateTime": _event_end_rfc3339_from_start(collection_datetime)},
                "location": collection_site,
                "extendedProperties": {"private": private_extended_property}
            }
            old_event = next(iter(calendar_events_resource.list(calendarId=collection_site_calendar_id,
                                                                privateExtendedProperty=private_extended_property_query).execute()["items"]), None)
            if not old_event:
                calendar_id, old_event = _find_event(calendar_events_resource, calendar_ids_values, private_extended_property_query)
                if old_event:
                    app.logger.info(f"Moving event for request ID, {request_id}...")
                    calendar_events_resource.move(calendarId=calendar_id, eventId=old_event["id"], destination=collection_site_calendar_id).execute()
            if old_event:
                changed_event_attributes = {k: v for k, v in new_event.items() if old_event[k] != v}
                if changed_event_attributes:
                    app.logger.info(f"Updating event for request ID, {request_id}...")
                    calendar_events_resource.patch(calendarId=collection_site_calendar_id, eventId=old_event["id"], body=new_event).execute()
            else:
                app.logger.info(f"Creating event for request ID, {request_id}...")
                calendar_events_resource.insert(calendarId=collection_site_calendar_id, body=new_event).execute()
        else:
            calendar_id, old_event = _find_event(calendar_events_resource, calendar_ids_values, private_extended_property_query)
            if old_event:
                app.logger.info(f"Deleting event for request ID, {request_id}...")
                calendar_events_resource.delete(calendarId=calendar_id, eventId=old_event["id"]).execute()
    app.logger.info("Dumping current state...")
    calendar_events_resource.patch(calendarId=watermark_calendar_id, eventId=watermark_event["id"],
                                   body={"start": {"dateTime": new_threshold.isoformat()},
                                         "end": {"dateTime": _event_end_rfc3339_from_start(new_threshold)}}).execute()
