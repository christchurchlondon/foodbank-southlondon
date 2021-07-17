import setuptools  # type: ignore


with open("requirements.txt") as f:
    dependencies = f.readlines()

setuptools.setup(
    name="foodbank-southlondon",
    packages=["foodbank_southlondon"],
    include_package_data=True,
    install_requires=dependencies,
    extras_require={
        "dev": [
            "flake8",
            "mypy",
            "types-flask",
            "types-pytz",
            "types-requests",
            "types-werkzeug"
        ]
    }
)
