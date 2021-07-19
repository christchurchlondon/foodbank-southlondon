from urllib import parse
from typing import Any, Callable, Dict, List
import base64
import hashlib
import hmac
import json
import time

from google.oauth2.service_account import Credentials  # type:ignore
from googleapiclient import discovery  # type:ignore
import flask
import gspread  # type:ignore
import wrapt  # type:ignore


# CONFIG VARIABLES
_FBSL_BASIC_API_KEY_SIGNING_SECRET = "FBSL_BASIC_API_KEY_SIGNING_SECRET"
_FBSL_GSUITE_IMPERSONATE_ADDRESS = "FBSL_GSUITE_IMPERSONATE_ADDRESS"
_FBSL_PROTECT_API = "FBSL_PROTECT_API"
_FBSL_SA_KEY = "FBSL_SA_KEY"
_FBSL_USER_SESSION_VAR = "FBSL_USER_SESSION_VAR"


def calendar_events_resource() -> discovery.Resource:
    calendar_events_resource = flask.g.get("calendar_events_resource")
    if calendar_events_resource is None:
        creds = credentials("https://www.googleapis.com/auth/calendar.events")
        delegated_creds = creds.with_subject(flask.current_app.config[_FBSL_GSUITE_IMPERSONATE_ADDRESS])
        calendar_events_resource = flask.g.calendar_events_resource = discovery.build("calendar", "v3", credentials=delegated_creds,
                                                                                      cache_discovery=False).events()
    return calendar_events_resource


def credentials(*scopes: str) -> Credentials:
    return Credentials.from_service_account_info(json.loads(flask.current_app.config[_FBSL_SA_KEY]), scopes=list(scopes))


def drive_files_resource() -> discovery.Resource:
    drive_files_resource = flask.g.get("drive_files_resource")
    if drive_files_resource is None:
        creds = credentials("https://www.googleapis.com/auth/drive.metadata.readonly")
        drive_files_resource = flask.g.drive_files_resource = discovery.build("drive", "v3", credentials=creds, cache_discovery=False).files()
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
        gsuite_members_resource = flask.g.gsuite_members_resource = discovery.build("admin", "directory_v1", credentials=delegated_creds,
                                                                                    cache_discovery=False).members()
    return gsuite_members_resource


@wrapt.decorator
def login_required(wrapped: Callable, instance: Any, args: List, kwargs: Dict) -> Any:
    if flask.current_app.config[_FBSL_PROTECT_API] and not user_authenticated():
        flask.abort(403, "Permission Denied.")
    return wrapped(*args, **kwargs)


def sign_url(url: str) -> str:
    url_parts = parse.urlparse(url)
    query_parts = parse.parse_qs(url_parts.query)
    url_to_sign = f"{url_parts.path}?{url_parts.query}"
    decoded_secret = base64.urlsafe_b64decode(flask.current_app.config[_FBSL_BASIC_API_KEY_SIGNING_SECRET])
    signature = hmac.new(decoded_secret, url_to_sign.encode("utf8"), hashlib.sha1)
    encoded_signature = base64.urlsafe_b64encode(signature.digest())
    query_parts["signature"] = encoded_signature.decode()
    url_parts.query = parse.urlencode(query_parts, doseq=True)
    return parse.urlunparse(url_parts)


def user_authenticated() -> bool:
    user = flask.session.get(flask.current_app.config[_FBSL_USER_SESSION_VAR])
    return user is not None and int(time.time()) < user["exp"]
