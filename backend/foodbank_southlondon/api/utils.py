import math
import time

from google.oauth2.service_account import Credentials  # type:ignore
import flask
import gspread  # type:ignore
import pandas as pd  # type:ignore
import wrapt  # type:ignore


# CONFIG VARIABLES
_FBSL_SA_KEY_FILE_PATH = "FBSL_SA_KEY_FILE_PATH"

# INTERNALS
_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

_cache_expiries = {}
_caches = {}


def _gsheet_to_df(spreadsheet_id):
    if "gc" not in flask.g:
        credentials = Credentials.from_service_account_file(flask.current_app.config[_FBSL_SA_KEY_FILE_PATH], scopes=_SCOPES)
        gc = flask.g.gc = gspread.authorize(credentials)
    spreadsheet = gc.open_by_key(spreadsheet_id)
    sheet = spreadsheet.get_worksheet(0)
    data = sheet.get_all_values(value_render_option="UNFORMATTED_VALUE")
    headers = data.pop(0)
    return pd.DataFrame(data, columns=headers)


def cache(name, spreadsheet_id, expires_after=None, force_refresh=False):
    now = time.time()
    cache = _caches.get(name)
    if force_refresh or cache is None or (expires_after and (now - _cache_expiries[name]) >= expires_after):
        cache = _caches[name] = _gsheet_to_df(spreadsheet_id)
        _cache_expiries[name] = now
    return cache


@wrapt.decorator
def paginate(wrapped, instance, args, kwargs):
    data, page, per_page = wrapped(*args, **kwargs)
    offset = (page - 1) * per_page
    total_items = len(data.index)
    data = data.sort_values("Request ID").iloc[offset: offset + per_page + 1]
    return {
        "page": page,
        "per_page": per_page,
        "total_pages": math.ceil(total_items / per_page),
        "total_items": total_items,
        "items": data.to_dict("records")
    }
