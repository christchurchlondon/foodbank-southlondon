from typing import Generator, Optional, Tuple
import datetime
import time

from googleapiclient import discovery  # type: ignore
import pandas as pd  # type: ignore

from foodbank_southlondon import app, helpers
from foodbank_southlondon.api.requests import models as requests_models, views as requests_views


# CONFIG VARIABLES
_FBSL_COLLECTION_CENTRES = "FBSL_COLLECTION_CENTRES"
_FBSL_COLLECTION_EVENT_DURATION_MINS = "FBSL_COLLECTION_EVENT_DURATION_MINS"
_FBSL_WATERMARK_CALENDAR_ID = "FBSL_WATERMARK_CALENDAR_ID"
_FBSL_WATERMARK_CALENDAR_EVENT_ID = "FBSL_WATERMARK_CALENDAR_EVENT_ID"


# INTERNALS
_EVENT_DESCRIPTION = """
{Client Full Name}
{Phone Number}
{Address Line 1}
{Address Line 2}
{Postcode}
"""


def _event_end_rfc3339_from_start(start_datetime: datetime.datetime) -> str:
    return (start_datetime + datetime.timedelta(minutes=app.config[_FBSL_COLLECTION_EVENT_DURATION_MINS])).isoformat()


def _find_event(calendar_events_resource: discovery.Resource, calendar_ids: Generator,
                private_extended_property_query: str) -> Tuple[Optional[str], Optional[dict]]:
    for calendar_id in calendar_ids:
        event = next(iter(calendar_events_resource.list(calendarId=calendar_id,
                                                        privateExtendedProperty=private_extended_property_query).execute()["items"]), None)
        if event:
            return (calendar_id, event)
    return (None, None)


@app.cli.command()
def sync_calendar() -> None:
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
    collection_centres = app.config[_FBSL_COLLECTION_CENTRES]
    calendar_ids = (collection_centre["calendar_id"] for collection_centre in collection_centres.values())
    for _, row in requests_df.iterrows():
        request_id = row[request_id_attribute]
        private_extended_property = {request_id_attribute: request_id}
        private_extended_property_query = "&".join("=".join(item) for item in private_extended_property.items())
        if row["Shipping Method"] == requests_models.SHIPPING_METHOD_COLLECTION:
            collection_centre = row["Collection Centre"]
            collection_centre_details = collection_centres[collection_centre]
            collection_centre_calendar_id = collection_centre_details["calendar_id"]
            collection_centre_abbr = collection_centre_details["abbr"]
            collection_date = datetime.datetime.strptime(row["Collection Date"], requests_date_format)
            collection_time = time.strptime(row[f"{collection_centre} Collection Time"], "%H:%M")
            collection_datetime = datetime.datetime(collection_date.year, collection_date.month, collection_date.day, collection_time.tm_hour,
                                                    collection_time.tm_min).astimezone()
            new_event = {
                "summary": f"{row['Client Full Name']} [{collection_centre_abbr}]",
                "description": _EVENT_DESCRIPTION.format(**row),
                "start": {"dateTime": collection_datetime.isoformat()},
                "end": {"dateTime": _event_end_rfc3339_from_start(collection_datetime)},
                "extendedProperties": {"private": private_extended_property}
            }
            old_event = next(iter(calendar_events_resource.list(calendarId=collection_centre_calendar_id,
                                                                privateExtendedProperty=private_extended_property_query).execute()["items"]), None)
            if not old_event:
                calendar_id, old_event = _find_event(calendar_events_resource, calendar_ids, private_extended_property_query)
                if old_event:
                    app.logger.info(f"Moving event for request ID, {request_id}...")
                    calendar_events_resource.move(calendarId=calendar_id, eventId=old_event["id"],
                                                  destination=collection_centre_calendar_id).execute()
            if old_event:
                changed_event_attributes = {k: v for k, v in new_event.items() if old_event.get(k) != v}
                if changed_event_attributes:
                    app.logger.info(f"Updating event for request ID, {request_id}...")
                    calendar_events_resource.patch(calendarId=collection_centre_calendar_id, eventId=old_event["id"], body=new_event).execute()
            else:
                app.logger.info(f"Creating event for request ID, {request_id}...")
                calendar_events_resource.insert(calendarId=collection_centre_calendar_id, body=new_event).execute()
        else:
            calendar_id, old_event = _find_event(calendar_events_resource, calendar_ids, private_extended_property_query)
            if old_event:
                app.logger.info(f"Deleting event for request ID, {request_id}...")
                calendar_events_resource.delete(calendarId=calendar_id, eventId=old_event["id"]).execute()
    app.logger.info("Dumping current state...")
    calendar_events_resource.patch(calendarId=watermark_calendar_id, eventId=watermark_event["id"],
                                   body={"start": {"dateTime": new_threshold.isoformat()},
                                         "end": {"dateTime": _event_end_rfc3339_from_start(new_threshold)}}).execute()
