import setuptools  # type: ignore


with open("requirements.txt") as f:
    dependencies = f.readlines()

setuptools.setup(
    name="foodbank-southlondon",
    packages=["foodbank_southlondon"],
    entry_points={
        "console_scripts": [
            "launch = foodbank_southlondon.launch:main"
        ]
    },
    include_package_data=True,
    install_requires=dependencies,
    extras_require={
        "dev": [
            "flake8",
            "mypy"
        ]
    }
)
