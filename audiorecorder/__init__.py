import os
import streamlit.components.v1 as components

from io import BytesIO
from base64 import b64decode
from pydub import AudioSegment


_RELEASE = True
_LOAD_LOCAL = False


if _LOAD_LOCAL and not _RELEASE:
    _component_func = components.declare_component(
        "audiorecorder",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("audiorecorder", path=build_dir)


def audiorecorder(
    start_prompt="Start recording",
    stop_prompt="Stop recording",
    pause_prompt="",
    custom_style={},
    start_style={},
    pause_style={},
    stop_style={},
    show_visualizer=True,
    key=None,
) -> AudioSegment:
    base64_audio = _component_func(
        startPrompt=start_prompt,
        stopPrompt=stop_prompt,
        pausePrompt=pause_prompt,
        customStyle=custom_style,
        startStyle=start_style,
        pauseStyle=pause_style,
        stopStyle=stop_style,
        showVisualizer=show_visualizer,
        key=key,
        default=b"",
    )
    audio_segment = AudioSegment.empty()
    if len(base64_audio) > 0:
        # Firefox and Chrome handle webm but Safari doesn't, so we let pydub/ffmpeg figure out the format
        # audio_segment = AudioSegment.from_file(BytesIO(b64decode(base64_audio)), format="webm")
        audio_segment = AudioSegment.from_file(BytesIO(b64decode(base64_audio)))
    return audio_segment


if not _RELEASE:
    import streamlit as st

    st.subheader("Audio Recorder Test")
    audio_1 = (
        audiorecorder(
            "Click to record",
            "Click to stop recording",
            "Click to pause",
            custom_style={"color": "blue", "backgroundColor": "lightgrey"},
            start_style={"color": "pink", "backgroundColor": "red"},
            pause_style={"color": "green"},
            stop_style={"backgroundColor": "purple"},
            key="audio_1",
        ),
        st.container(),
    )
    audio_2 = audiorecorder("", "", show_visualizer=True, key="audio_2"), st.container()

    for audio, container in [audio_1, audio_2]:
        if len(audio) > 0:
            # To play the audio in the frontend
            container.audio(audio.export().read())

            # To get audio properties
            print(audio.frame_rate)
            print(audio.frame_width)
            print(audio.duration_seconds)
            container.write(
                f"Frame rate: {audio.frame_rate}, Frame width: {audio.frame_width}, Duration: {audio.duration_seconds} seconds"
            )

            # To save the audio
            # audio.export("audio.wav", format="wav")
