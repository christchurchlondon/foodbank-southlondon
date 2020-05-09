from typing import Any, Callable, Dict, List
import math
import datetime

import flask
import gspread  # type:ignore
import pandas as pd  # type:ignore
import wrapt  # type:ignore

from foodbank_southlondon import helpers


# CONFIG VARIABLES
_FBSL_MAX_PAGE_SIZE = "FBSL_MAX_PAGE_SIZE"


_caches_updated: Dict[str, datetime.datetime] = {}
_caches: Dict[str, pd.DataFrame] = {}


def _gsheet(spreadsheet_id: str, index: int = 0) -> gspread.Worksheet:
    gspread_client = helpers.gspread_client()
    spreadsheet = gspread_client.open_by_key(spreadsheet_id)
    sheet = spreadsheet.get_worksheet(index)
    return sheet


def _gsheet_to_df(spreadsheet_id: str) -> pd.DataFrame:
    sheet = _gsheet(spreadsheet_id)
    flask.current_app.logger.debug(f"Download gSheet, {sheet.spreadsheet.title} ({sheet.url}) ...")
    data = sheet.get_all_values()
    headers = data.pop(0)
    return pd.DataFrame(data, columns=headers)


def append_rows(spreadsheet_id: str, rows: List) -> None:
    sheet = _gsheet(spreadsheet_id)
    flask.current_app.logger.debug(f"Writing {len(rows)} rows, in {sheet.spreadsheet.title} ({sheet.url}) ...")
    sheet.append_rows(rows, value_input_option="USER_ENTERED")


def cache(name: str, spreadsheet_id: str, force_refresh: bool = False) -> pd.DataFrame:
    now = datetime.datetime.now(datetime.timezone.utc)
    cache = _caches.get(name)
    if cache is not None:
        file_metadata = helpers.drive_files_resource().get(fileId=spreadsheet_id, supportsAllDrives=True, fields="modifiedTime").execute()
        file_modified_time = datetime.datetime.fromisoformat(file_metadata["modifiedTime"].replace("Z", "+00:00"))
        if _caches_updated[name] >= file_modified_time:
            return cache
    flask.current_app.logger.debug(f"Refreshing cache, {name} ...")
    _caches_updated[name] = now
    cache = _caches[name] = _gsheet_to_df(spreadsheet_id)
    return cache


def gsheet_a1(spreadsheet_id, index) -> str:
    sheet = _gsheet(spreadsheet_id, index)
    return sheet.acell("A1").value


def overwrite_rows(spreadsheet_id: str, rows: List) -> None:
    sheet = _gsheet(spreadsheet_id)
    flask.current_app.logger.debug(f"Overwriting all rows with {len(rows)} new rows in {sheet.spreadsheet.title} ({sheet.url}) ...")
    sheet.update(f"{sheet.title}", rows, value_input_option="USER_ENTERED")


def paginate(*sort_by: str, ascending: bool = True) -> Callable:
    @wrapt.decorator
    def wrapper(wrapped: Callable, instance: Any, args: List, kwargs: Dict) -> Dict[str, Any]:
        data, page, per_page = wrapped(*args, **kwargs)
        per_page = max(min(per_page, flask.current_app.config[_FBSL_MAX_PAGE_SIZE]), 0)
        offset = (page - 1) * per_page
        total_items = len(data.index)
        data = data.sort_values(list(sort_by), ascending=ascending).iloc[offset: offset + per_page]
        return {
            "page": page,
            "per_page": per_page,
            "total_pages": 0 if per_page == 0 else math.ceil(total_items / per_page),
            "total_items": total_items,
            "items": data.to_dict("records")
        }
    return wrapper
