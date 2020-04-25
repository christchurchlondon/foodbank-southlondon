class _Config(object):
    DEBUG = True


class DevelopmentConfig(_Config):
    CLIENTS_DRIVE_URI = "1eMiA6DAYmYJVYwNvxj18yRiSBImCXu6WiCD-4CqM7P8"
    EVENTS_DRIVE_URI = "1GfD-YA_9eMSMqu9eTZlCEC0wvsV6c0CRlMLRPOvWM48"
    LISTS_DRIVE_URI = "1Hor0i7K_W99LFXw-Grpf1mIY2MjDUNGnfV2ByNGf1gQ"


class ProductionConfig(_Config):
    pass


CONFIGURATIONS = {
    None: _Config,
    "dev": DevelopmentConfig,
    "prod": ProductionConfig
}
