import time

from google.oauth2.service_account import Credentials  # type:ignore
import flask
import gspread  # type:ignore
import wrapt  # type:ignore


# INTERNALS
_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

# CONFIG VARIABLES
_FBSL_CACHE_EXPIRY_SECONDS = "FBSL_CACHE_EXPIRY_SECONDS"
_FBSL_SA_KEY_FILE_PATH = "FBSL_SA_KEY_FILE_PATH"

_cache_expiries = {}


def _gspread_client():
    if "gc" not in flask.g:
        flask.g.gc = gspread.authorize(Credentials.from_service_account_file(flask.current_app.config[_FBSL_SA_KEY_FILE_PATH], scopes=_SCOPES))
    return flask.g.gc


def expiring_cache(*caches):
    @wrapt.decorator
    def wrapper(wrapped, instance, args, kwargs):
        now = time.time()
        for cache in caches:
            cache_id = id(cache)
            created = _cache_expiries.get(cache_id)
            if created:
                if (now - created) >= flask.current_app.config[_FBSL_CACHE_EXPIRY_SECONDS]:
                    cache.clear()
                else:
                    continue
            _cache_expiries[cache_id] = now
        return wrapped(*args, **kwargs)
    return wrapper


def first_sheet(spreadsheet_id):
    gc = _gspread_client()
    return gc.open_by_key(spreadsheet_id).get_worksheet(0)


def sheet_data_values(sheet, column=None):
    if column is None:
        data = sheet.get_all_values(value_render_option="UNFORMATTED_VALUE")
    else:
        data = sheet.col_values(column, value_render_option="UNFORMATTED_VALUE")
    del data[0]
    return data  # the big problem with this is we are returning a list of values/lists, not a list of dicts of values/lists
