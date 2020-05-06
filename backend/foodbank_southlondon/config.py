import os


class _Config(object):
    BUNDLE_ERRORS = True
    ERROR_404_HELP = False
    RESTX_VALIDATE = True
    SECRET_KEY = os.urandom(16)

    FBSL_BASE_URL = ""
    FBSL_CATCH_ALL_LIST = "Family of 5+"
    FBSL_EVENTS_CACHE_EXPIRY_SECONDS = 0
    FBSL_EVENTS_GSHEET_URI = ""
    FBSL_GSUITE_GROUP_ADDRESS = ""
    FBSL_LISTS_CACHE_EXPIRY_SECONDS = 0
    FBSL_LISTS_GSHEET_URI = ""
    FBSL_MAX_PAGE_SIZE = 500
    FBSL_REQUESTS_CACHE_EXPIRY_SECONDS = 0
    FBSL_REQUESTS_FORM_URI = ""
    FBSL_REQUESTS_GSHEET_URI = ""
    FBSL_SA_KEY_FILE_PATH = ""

    GOOGLE_CLIENT_ID = ""
    GOOGLE_CLIENT_SECRET = ""


class DevelopmentConfig(_Config):
    DEBUG = True

    FBSL_BASE_URL = "http://localhost:5000"
    FBSL_EVENTS_CACHE_EXPIRY_SECONDS = 60
    FBSL_EVENTS_GSHEET_URI = "1GfD-YA_9eMSMqu9eTZlCEC0wvsV6c0CRlMLRPOvWM48"
    FBSL_LISTS_CACHE_EXPIRY_SECONDS = 0
    FBSL_LISTS_GSHEET_URI = "1Hor0i7K_W99LFXw-Grpf1mIY2MjDUNGnfV2ByNGf1gQ"
    FBSL_GSUITE_GROUP_ADDRESS = "foodbank-southlondon@adamcunnington.info"
    FBSL_REQUESTS_CACHE_EXPIRY_SECONDS = 60
    FBSL_REQUESTS_FORM_URI = "1kaRXNMym-MIG73c1Ti6chRtBwUkVYYXhbpD5Hgu9DUs"
    FBSL_REQUESTS_GSHEET_URI = "1eMiA6DAYmYJVYwNvxj18yRiSBImCXu6WiCD-4CqM7P8"
    FBSL_SA_KEY_FILE_PATH = "sa-key.dev"

    GOOGLE_CLIENT_ID = "99797708931-48j5pomhhh4lss7bfhg50ke5l34ah3ar.apps.googleusercontent.com"
    with open("client-secret.dev") as f:
        GOOGLE_CLIENT_SECRET = f.read()


class ProductionConfig(_Config):
    DEBUG = False

    FBSL_BASE_URL = "http://localhost:8080"
    FBSL_EVENTS_CACHE_EXPIRY_SECONDS = 3600
    FBSL_EVENTS_GSHEET_URI = "1OAluin8tOIpYUxcm18gHJSc0z1tx4EdxY9I2bdB4zj4"
    FBSL_LISTS_CACHE_EXPIRY_SECONDS = 0
    FBSL_LISTS_GSHEET_URI = "1D0TcNW7pTMGgKYDogS4YDVJqEBAavu3GfXHu_iGlSmU"
    FBSL_GSUITE_GROUP_ADDRESS = ""
    FBSL_REQUESTS_CACHE_EXPIRY_SECONDS = 300
    FBSL_REQUESTS_FORM_URI = "1nSPgge024rIYUBxnVx3lNhJok8DuBcg8ZlehhZDfjFc"
    FBSL_REQUESTS_GSHEET_URI = "1TDM35lGcVPcf0HJda-V7l2QLH9R0EMHP8mbLdZcpb5k-4CqM7P8"
    FBSL_SA_KEY_FILE_PATH = "sa-key.production"

    GOOGLE_CLIENT_ID = "263170890363-rhsbplt11sk409p6o7qh1566nt1ra8bj.apps.googleusercontent.com"
    with open("client-secret.production") as f:
        GOOGLE_CLIENT_SECRET = f.read()


CONFIGURATIONS = {
    "dev": DevelopmentConfig,
    "prod": ProductionConfig
}
