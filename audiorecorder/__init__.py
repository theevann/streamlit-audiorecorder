import os
import base64
import numpy as np
import streamlit.components.v1 as components

_RELEASE = True


if not _RELEASE:
    _component_func = components.declare_component(
        "audiorecorder",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("audiorecorder", path=build_dir)


def audiorecorder(record_prompt="Record", recording_prompt="Recording", key=None):
    output = _component_func(record_prompt=record_prompt, recording_prompt=recording_prompt, key=key, default=b"")
    np_array = np.frombuffer(base64.b64decode(output), dtype=np.uint8)
    return np_array


if not _RELEASE:
    import streamlit as st

    st.subheader("Audio Recorder Test")
    audio = audiorecorder("Click to record", "Recording...")
    print(audio)
    print(len(audio))

    if len(audio) > 0:
        st.audio(audio)
        wav_file = open("temp.mp3", "wb")
        wav_file.write(audio.tobytes())