import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="streamlit-audiorecorder",
    version="0.0.6",
    author="Evann Courdier",
    author_email="",
    description="Audio recorder component for streamlit",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/theevann/streamlit-audiorecorder",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[],
    python_requires=">=3.6",
    install_requires=[
        "streamlit >= 0.63",
        "pydub >= 0.24",
    ],
)
