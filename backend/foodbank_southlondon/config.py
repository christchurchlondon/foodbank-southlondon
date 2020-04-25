class _Config(object):
    DEBUG = True


class DevelopmentConfig(_Config):
    pass


class ProductionConfig(_Config):
    pass


CONFIGURATIONS = {
    None: _Config,
    "dev": DevelopmentConfig,
    "prod": ProductionConfig
}
