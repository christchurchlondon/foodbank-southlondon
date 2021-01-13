from typing import Any, Callable, Dict, List
import math
import datetime

import flask
import gspread  # type:ignore
import pandas as pd  # type:ignore
import wrapt  # type:ignore

from foodbank_southlondon import helpers


# CONFIG VARIABLES
_FBSL_CACHE_TTL_SECONDS = "FBSL_CACHE_TTL_SECONDS"
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
    flask.current_app.logger.info(f"Download gSheet, {sheet.spreadsheet.title} ({sheet.url}) ...")
    data = sheet.get_all_values()
    headers = data.pop(0)
    return pd.DataFrame(data, columns=headers)


def append_rows(spreadsheet_id: str, rows: List) -> None:
    sheet = _gsheet(spreadsheet_id)
    flask.current_app.logger.info(f"Writing {len(rows)} rows, in {sheet.spreadsheet.title} ({sheet.url}) ...")
    sheet.append_rows(rows, value_input_option="USER_ENTERED")


def cache(name: str, spreadsheet_id: str, force_refresh: bool = False) -> pd.DataFrame:
    now = datetime.datetime.now(datetime.timezone.utc)
    cache = _caches.get(name)
    if cache is not None:
        file_metadata = helpers.drive_files_resource().get(fileId=spreadsheet_id, supportsAllDrives=True, fields="modifiedTime").execute()
        file_modified_time = datetime.datetime.fromisoformat(file_metadata["modifiedTime"].replace("Z", "+00:00"))
        cache_max_age_time = now - datetime.timedelta(seconds=flask.current_app.config[_FBSL_CACHE_TTL_SECONDS])
        if not force_refresh and _caches_updated[name] >= max(file_modified_time, cache_max_age_time):
            return cache
    flask.current_app.logger.info(f"Refreshing cache, {name} ...")
    _caches_updated[name] = now
    cache = _caches[name] = _gsheet_to_df(spreadsheet_id)
    return cache


def delete_row(spreadsheet_id: str, find_value: str) -> None:
    sheet = _gsheet(spreadsheet_id)
    flask.current_app.logger.info(f"Deleting the row with {find_value} in the last column...")
    sheet.delete_row(sheet.find(find_value, in_column=sheet.col_count).row)


def expire_cache(name: str) -> None:
    if name in _caches:
        del _caches[name]
        del _caches_updated[name]


def gsheet_a1(spreadsheet_id: str, index: int = 0) -> str:
    sheet = _gsheet(spreadsheet_id, index)
    return sheet.cell(1, 1).value


def overwrite_rows(spreadsheet_id: str, rows: List, index: int = 0) -> None:
    sheet = _gsheet(spreadsheet_id, index)
    new_row_count = len(rows)
    flask.current_app.logger.info(f"Overwriting all rows with {new_row_count} new rows in {sheet.spreadsheet.title} ({sheet.url}) ...")
    existing_row_count = sheet.row_count
    if rows:
        sheet.update(rows, value_input_option="USER_ENTERED")
    if existing_row_count > 1 and existing_row_count > new_row_count:
        sheet.delete_rows((new_row_count or 1) + 1, existing_row_count)


def paginate(*sort_by: str, ascending: bool = True) -> Callable:
    @wrapt.decorator
    def wrapper(wrapped: Callable, instance: Any, args: List, kwargs: Dict) -> Dict[str, Any]:
        data, page, per_page = wrapped(*args, **kwargs)
        per_page = max(min(per_page, flask.current_app.config[_FBSL_MAX_PAGE_SIZE]), 0)
        offset = (page - 1) * per_page
        total_items = len(data.index)
        data = data.sort_values(list(sort_by), ascending=ascending, key=lambda col: col.str.lower()).iloc[offset: offset + per_page]
        return {
            "page": page,
            "per_page": per_page,
            "total_pages": 0 if per_page == 0 else math.ceil(total_items / per_page),
            "total_items": total_items,
            "items": data.to_dict("records")
        }
    return wrapper
