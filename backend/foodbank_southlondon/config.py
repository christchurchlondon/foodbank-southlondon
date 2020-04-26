class _Config(object):
    DEBUG = True
    FBSL_CACHE_EXPIRY_SECONDS = 300
    FBSL_SA_KEY_FILE_PATH = "foodbank-southlondon-ecd573527735.json"
    RESTX_MASK_SWAGGER = False
    RESTX_VALIDATE = True


class DevelopmentConfig(_Config):
    FBSL_EVENTS_DRIVE_URI = "1GfD-YA_9eMSMqu9eTZlCEC0wvsV6c0CRlMLRPOvWM48"
    FBSL_LISTS_DRIVE_URI = "1Hor0i7K_W99LFXw-Grpf1mIY2MjDUNGnfV2ByNGf1gQ"
    FBSL_REQUESTS_DRIVE_URI = "1eMiA6DAYmYJVYwNvxj18yRiSBImCXu6WiCD-4CqM7P8"


class ProductionConfig(_Config):
    pass


CONFIGURATIONS = {
    None: _Config,
    "dev": DevelopmentConfig,
    "prod": ProductionConfig
}
