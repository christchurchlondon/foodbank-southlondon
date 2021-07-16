from backend.foodbank_southlondon.helpers import calendar_events_resource
from foodbank_southlondon import app, helpers


@app.cli.command()
def sync_calendar():
    calendar_events_resource = helpers.calendar_events_resource()
    watermark_event = calendar_events_resource.get(app.)
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
