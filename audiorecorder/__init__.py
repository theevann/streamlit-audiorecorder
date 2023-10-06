import os
import streamlit.components.v1 as components

from io import BytesIO
from base64 import b64decode
from pydub import AudioSegment

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


def audiorecorder(start_prompt="Start recording", stop_prompt="Stop recording", pause_prompt="", key=None):
    base64_audio = _component_func(start_prompt=start_prompt, stop_prompt=stop_prompt, pause_prompt=pause_prompt, key=key, default=b"")
    audio_segment = AudioSegment.empty()
    if len(base64_audio) > 0:
         # Firefox and Chrome handle webm but Safari doesn't, so we let pydub/ffmpeg figure out the format
        audio_segment = AudioSegment.from_file(BytesIO(b64decode(base64_audio)))
        # audio_segment = AudioSegment.from_file(BytesIO(b64decode(base64_audio)), format="webm")
    return audio_segment


if not _RELEASE:
    import streamlit as st

    st.subheader("Audio Recorder Test")
    audio = audiorecorder("Click to record", "Click to stop recording", "Click to pause")

    if len(audio) > 0:
        # To play the audio in the frontend
        st.audio(audio.export().read())

        # To get audio properties
        print(audio.frame_rate)
        print(audio.frame_width)
        print(audio.duration_seconds)
        st.write(f"Frame rate: {audio.frame_rate}, Frame width: {audio.frame_width}, Duration: {audio.duration_seconds} seconds")

        # To save the audio
        # audio.export("audio.wav", format="wav")