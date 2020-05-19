from typing import Optional

import os


class _Config(object):
    BUNDLE_ERRORS = True
    DEBUG: Optional[bool] = None
    ERROR_404_HELP = False
    GOOGLE_CLIENT_ID = ""
    PREFERRED_URL_SCHEME = "http"
    RESTX_VALIDATE = True
    SECRET_KEY = os.urandom(16)

    FBSL_BASE_URL = ""
    FBSL_CATCH_ALL_LIST = "family_of_5+"
    FBSL_EVENTS_GSHEET_URI = ""
    FBSL_GSUITE_IMPERSONATE_ADDRESS = ""
    FBSL_GSUITE_GROUP_ADDRESS = ""
    FBSL_LISTS_GSHEET_URI = ""
    FBSL_MAX_ACTION_REQUEST_IDS = 20
    FBSL_MAX_PAGE_SIZE = 500
    assert FBSL_MAX_ACTION_REQUEST_IDS < FBSL_MAX_PAGE_SIZE
    FBSL_PROTECT_API = None
    FBSL_REQUESTS_FORM_URI = ""
    FBSL_REQUESTS_GSHEET_URI = ""
    FBSL_USER_SESSION_VAR = "user"

    @property
    def GOOGLE_CLIENT_SECRET(self):
        return os.environ.get("FBSL_CLIENT_SECRET")

    @property
    def FBSL_SA_KEY(self):
        return os.environ.get("FBSL_SA_KEY")


class DevelopmentConfig(_Config):
    DEBUG = True
    GOOGLE_CLIENT_ID = "99797708931-48j5pomhhh4lss7bfhg50ke5l34ah3ar.apps.googleusercontent.com"

    FBSL_BASE_URL = "http://localhost:5000"
    FBSL_EVENTS_GSHEET_URI = "1GfD-YA_9eMSMqu9eTZlCEC0wvsV6c0CRlMLRPOvWM48"
    FBSL_LISTS_GSHEET_URI = "1Hor0i7K_W99LFXw-Grpf1mIY2MjDUNGnfV2ByNGf1gQ"
    FBSL_GSUITE_IMPERSONATE_ADDRESS = "ac@adamcunnington.info"
    FBSL_GSUITE_GROUP_ADDRESS = "foodbank-southlondon@adamcunnington.info"
    FBSL_PROTECT_API = False
    FBSL_REQUESTS_FORM_URI = "1kaRXNMym-MIG73c1Ti6chRtBwUkVYYXhbpD5Hgu9DUs"
    FBSL_REQUESTS_GSHEET_URI = "1eMiA6DAYmYJVYwNvxj18yRiSBImCXu6WiCD-4CqM7P8"


class ProductionConfig(_Config):
    DEBUG = False
    GOOGLE_CLIENT_ID = "555689098172-2hmfl06vftk660n1a1cvcpu5kuh5l243.apps.googleusercontent.com"
    PREFERRED_URL_SCHEME = "https"

    FBSL_BASE_URL = "https://foodbankapp.christchurchlondon.org"
    FBSL_EVENTS_GSHEET_URI = "1OAluin8tOIpYUxcm18gHJSc0z1tx4EdxY9I2bdB4zj4"
    FBSL_LISTS_GSHEET_URI = "1D0TcNW7pTMGgKYDogS4YDVJqEBAavu3GfXHu_iGlSmU"
    FBSL_GSUITE_IMPERSONATE_ADDRESS = "ed@christchurchlondon.org"
    FBSL_GSUITE_GROUP_ADDRESS = "foodbankapp-users@christchurchlondon.org"
    FBSL_PROTECT_API = True
    FBSL_REQUESTS_FORM_URI = "1nSPgge024rIYUBxnVx3lNhJok8DuBcg8ZlehhZDfjFc"
    FBSL_REQUESTS_GSHEET_URI = "1TDM35lGcVPcf0HJda-V7l2QLH9R0EMHP8mbLdZcpb5k-4CqM7P8"
