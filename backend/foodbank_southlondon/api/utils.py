from typing import Any, Callable, Dict, List
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


def _gsheet(spreadsheet_id: str, index: int = 0) -> gspread.Worksheet:
    gc = flask.g.get("gc")
    if gc is None:
        credentials = Credentials.from_service_account_file(flask.current_app.config[_FBSL_SA_KEY_FILE_PATH], scopes=_SCOPES)
        gc = flask.g.gc = gspread.authorize(credentials)
    spreadsheet = gc.open_by_key(spreadsheet_id)
    sheet = spreadsheet.get_worksheet(index)
    return sheet


def _gsheet_to_df(spreadsheet_id: str) -> pd.DataFrame:
    sheet = _gsheet(spreadsheet_id)
    flask.current_app.logger.debug(f"Download gSheet, {sheet.spreadsheet.title} ({sheet.url}) ...")
    data = sheet.get_all_values()
    headers = data.pop(0)
    return pd.DataFrame(data, columns=headers)


def append_row(spreadsheet_id: str, row: List) -> None:
    sheet = _gsheet(spreadsheet_id)
    flask.current_app.logger.debug(f"Writing the row, {row} in {sheet.spreadsheet.title} ({sheet.url}) ...")
    sheet.append_row(row, value_input_option="USER_ENTERED")


def cache(name: str, spreadsheet_id: str, expires_after: int = None, force_refresh: bool = False) -> pd.DataFrame:
    now = time.time()
    cache = _caches.get(name)
    if force_refresh or cache is None or (expires_after and (now - _cache_expiries[name]) >= expires_after):
        flask.current_app.logger.debug(f"Refreshing cache, {name} ...")
        cache = _caches[name] = _gsheet_to_df(spreadsheet_id)
        _cache_expiries[name] = now
    return cache


def delete_cache(name: str) -> None:
    flask.current_app.logger.debug(f"Deleting cache, {name} ...")
    _caches.pop(name, None)
    _cache_expiries.pop(name, None)


def gsheet_a1(spreadsheet_id, index) -> str:
    sheet = _gsheet(spreadsheet_id, index)
    return sheet.acell("A1").value


def overwrite_rows(spreadsheet_id: str, rows: List) -> None:
    sheet = _gsheet(spreadsheet_id)
    flask.current_app.logger.debug(f"Overwriting all rows with {len(rows)} new rows in {sheet.spreadsheet.title} ({sheet.url}) ...")
    sheet.update(f"{sheet.title}", rows, value_input_option="USER_ENTERED")


def paginate(*sort_by: str) -> Callable:
    @wrapt.decorator
    def wrapper(wrapped: Callable, instance: Any, args: List, kwargs: Dict) -> Dict[str, Any]:
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
