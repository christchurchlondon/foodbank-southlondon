from typing import Dict, List
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

_cache_expiries: Dict[str, float] = {}
_caches: Dict[str, pd.DataFrame] = {}


def _gsheet(spreadsheet_id: str):
    gc = flask.g.get("gc")
    if gc is None:
        credentials = Credentials.from_service_account_file(flask.current_app.config[_FBSL_SA_KEY_FILE_PATH], scopes=_SCOPES)
        gc = flask.g.gc = gspread.authorize(credentials)
    spreadsheet = gc.open_by_key(spreadsheet_id)
    sheet = spreadsheet.get_worksheet(0)
    return sheet


def _gsheet_to_df(spreadsheet_id: str):
    sheet = _gsheet(spreadsheet_id)
    data = sheet.get_all_values()
    headers = data.pop(0)
    return pd.DataFrame(data, columns=headers)


def append_row(spreadsheet_id: str, row: List):
    sheet = _gsheet(spreadsheet_id)
    sheet.append_row(row, value_input_option="USER_ENTERED")


def cache(name: str, spreadsheet_id: str, expires_after: int = None, force_refresh: bool = False):
    now = time.time()
    cache = _caches.get(name)
    if force_refresh or cache is None or (expires_after and (now - _cache_expiries[name]) >= expires_after):
        cache = _caches[name] = _gsheet_to_df(spreadsheet_id)
        _cache_expiries[name] = now
    return cache


def delete_cache(name: str):
    _caches.pop(name, None)
    _cache_expiries.pop(name, None)


def upsert_row(spreadsheet_id: str, query: str, row: List, column: int = 1):
    sheet = _gsheet(spreadsheet_id)
    try:
        row_number = sheet.find(query, in_column=column).row
    except gspread.exceptions.CellNotFound:
        append_row(spreadsheet_id, row)
    else:
        sheet.update(f"{row_number}:{row_number}", [row], value_input_option="USER_ENTERED")


def paginate(*sort_by: str):
    @wrapt.decorator
    def wrapper(wrapped, instance, args, kwargs):
        data, page, per_page = wrapped(*args, **kwargs)
        offset = (page - 1) * per_page
        total_items = len(data.index)
        data = data.sort_values(list(sort_by)).iloc[offset: offset + per_page]
        return {
            "page": page,
            "per_page": per_page,
            "total_pages": math.ceil(total_items / per_page),
            "total_items": total_items,
            "items": data.to_dict("records")
        }
    return wrapper
