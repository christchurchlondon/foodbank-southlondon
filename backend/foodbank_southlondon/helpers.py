from typing import Any, Callable, Dict, List

from google.oauth2.service_account import Credentials  # type:ignore
from googleapiclient import discovery  # type:ignore
import flask
import gspread  # type:ignore
import wrapt  # type:ignore


# CONFIG VARIABLES
_FBSL_GSUITE_IMPERSONATE_ADDRESS = "FBSL_GSUITE_IMPERSONATE_ADDRESS"
_FBSL_SA_KEY_FILE_PATH = "FBSL_SA_KEY_FILE_PATH"
_FBSL_USER_SESSION_VAR = "FBSL_USER_SESSION_VAR"


def credentials(*scopes: str) -> Credentials:
    return Credentials.from_service_account_file(flask.current_app.config[_FBSL_SA_KEY_FILE_PATH], scopes=list(scopes))


def gspread_client() -> gspread.Client:
    gspread_client = flask.g.get("gspread_client")
    if gspread_client is None:
        creds = credentials("https://www.googleapis.com/auth/spreadsheets")
        gspread_client = flask.g.gspread_client = gspread.authorize(creds)
    return gspread_client


def gsuite_members_resource() -> discovery.Resource:
    gsuite_members_resource = flask.g.get("gsuite_members_resource")
    if gsuite_members_resource is None:
        creds = credentials("https://www.googleapis.com/auth/admin.directory.group.member.readonly")
        delegated_creds = creds.with_subject(flask.current_app.config[_FBSL_GSUITE_IMPERSONATE_ADDRESS])
        gsuite_members_resource = flask.g.gsuite_members_resource = discovery.build("admin", "directory_v1", credentials=delegated_creds).members()
    return gsuite_members_resource


@wrapt.decorator
def login_required(wrapped: Callable, instance: Any, args: List, kwargs: Dict) -> Any:
    if not flask.session.get(flask.current_app.config[_FBSL_USER_SESSION_VAR]):
        flask.abort(403, "Permission Denied.")
    return wrapped(*args, **kwargs)
