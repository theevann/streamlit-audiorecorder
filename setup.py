import setuptools

setuptools.setup(
    name="streamlit-audiorecorder",
    version="0.0.2",
    author="Evann Courdier",
    author_email="",
    description="Audio recorder component for streamlit",
    long_description="",
    long_description_content_type="text/plain",
    url="https://github.com/theevann/streamlit-audiorecorder",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[],
    python_requires=">=3.6",
    install_requires=[
        "streamlit >= 0.63",
    ],
)
