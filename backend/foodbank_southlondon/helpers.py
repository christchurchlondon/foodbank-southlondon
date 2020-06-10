from typing import Any, Callable, Dict, List
import json

from google.oauth2.service_account import Credentials  # type:ignore
from googleapiclient import discovery  # type:ignore
import flask
import gspread  # type:ignore
import wrapt  # type:ignore


# CONFIG VARIABLES
_FBSL_GSUITE_IMPERSONATE_ADDRESS = "FBSL_GSUITE_IMPERSONATE_ADDRESS"
_FBSL_PROTECT_API = "FBSL_PROTECT_API"
_FBSL_SA_KEY = "FBSL_SA_KEY"
_FBSL_USER_SESSION_VAR = "FBSL_USER_SESSION_VAR"


def apps_script_resource() -> discovery.Resource:
    apps_script_resource = flask.g.get("apps_script_resource")
    if apps_script_resource is None:
        creds = credentials("https://www.googleapis.com/auth/drive.metadata.readonly")
        apps_script_resource = flask.g.apps_script_resource = discovery.build("script", "v1", credentials=creds).files()
    return apps_script_resource


def credentials(*scopes: str) -> Credentials:
    return Credentials.from_service_account_info(json.loads(flask.current_app.config[_FBSL_SA_KEY]), scopes=list(scopes))


def drive_files_resource() -> discovery.Resource:
    drive_files_resource = flask.g.get("drive_files_resource")
    if drive_files_resource is None:
        creds = credentials("https://www.googleapis.com/auth/drive.metadata.readonly")
        drive_files_resource = flask.g.drive_files_resource = discovery.build("drive", "v3", credentials=creds).files()
    return drive_files_resource


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
    if flask.current_app.config[_FBSL_PROTECT_API] and not flask.session.get(flask.current_app.config[_FBSL_USER_SESSION_VAR]):
        flask.abort(403, "Permission Denied.")
    return wrapped(*args, **kwargs)
