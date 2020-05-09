from typing import Any, Dict, Tuple

import flask
import flask_restx  # type:ignore
import pandas as pd  # type:ignore

from foodbank_southlondon.api import rest, utils
from foodbank_southlondon.api.lists import models, namespace, parsers


# CONFIG VARIABLES
_FBSL_LISTS_GSHEET_URI = "FBSL_LISTS_GSHEET_URI"

# INTERNALS
_CACHE_NAME = "lists"


@namespace.route("/")
class Lists(flask_restx.Resource):

    @rest.expect(parsers.cache_params)
    @rest.marshal_with(models.all_lists_items)
    def get(self) -> Dict[str, Any]:
        """List all Shopping Lists."""
        params = parsers.cache_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        df = cache(force_refresh=refresh_cache)
        notes = utils.gsheet_a1(flask.current_app.config[_FBSL_LISTS_GSHEET_URI], 1)
        return {"notes": notes, "items": df.to_dict("records")}

    @rest.response(201, "Created")
    @rest.expect(models.all_lists_items)
    def post(self) -> Tuple[Dict, int]:
        """Overwrite the Shopping Lists."""
        data = flask.request.json
        flask.current_app.logger.debug(f"Received request body, {data}")
        utils.overwrite_rows(flask.current_app.config[_FBSL_LISTS_GSHEET_URI], list(data.values()))
        return ({}, 201)


@namespace.route("/<string:list_name>")
@namespace.doc(params={"list_name": f"The name of the list to retrieve. Should be one of: {models.LIST_NAMES}"})
class List(flask_restx.Resource):

    @rest.response(404, "Not Found")
    @rest.expect(parsers.cache_params)
    @rest.marshal_with(models.one_list_items)
    def get(self, list_name: str) -> Dict[str, Any]:
        """Get a single Shopping List."""
        params = parsers.cache_params.parse_args(flask.request)
        refresh_cache = params["refresh_cache"]
        df = cache(force_refresh=refresh_cache)
        if list_name not in models.LIST_NAMES:
            rest.abort(404, f"List Name, {list_name} was not found.")
        columns = {f"{list_name}_quantity": "quantity", f"{list_name}_notes": "notes"}
        df = df.loc[:, ["item_description", *columns]].rename(columns=columns)
        notes = utils.gsheet_a1(flask.current_app.config[_FBSL_LISTS_GSHEET_URI], 1)
        return {"notes": notes, "items": df.to_dict("records")[0]}


def cache(force_refresh: bool = False) -> pd.DataFrame:
    return utils.cache(_CACHE_NAME, flask.current_app.config[_FBSL_LISTS_GSHEET_URI], force_refresh=force_refresh)
