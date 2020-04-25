import setuptools  # type: ignore


with open("requirements.txt") as f:
    dependencies = f.readlines()

setuptools.setup(
    name="foodbank-southlondon",
    install_requires=dependencies,
    extras_require={
        "dev": [
            "flake8",
            "mypy"
        ]
    }
)
