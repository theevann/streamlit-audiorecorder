# Audio Recorder for streamlit
[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://theevann-streamlit-audiorecorder-exampleexample-5ds2ug.streamlitapp.com)

Audio recorder component for streamlit.  
It creates a button: one click to start recording, one click to stop recording.  
The component's return value is a [pydub](https://github.com/jiaaro/pydub/) [AudioSegment](https://github.com/jiaaro/pydub/blob/master/API.markdown#audiosegment).  
To play the audio in the frontend, use `st.audio(audio.export().read())`.  
All pydub AudioSegment methods are available, so you can save the audio to a file with `audio.export("audio.wav", format="wav")` for example.

### Install it with pip:
```bash
pip install streamlit-audiorecorder
```
Note: This package uses pydub which uses ffmpeg, so both should be installed for this audiorecorder to work properly.

On ubuntu/debian: `sudo apt update && sudo apt install ffmpeg`  
On mac: `brew install ffmpeg`

### Use it:
```python
import streamlit as st
from audiorecorder import audiorecorder

st.title("Audio Recorder")
audio = audiorecorder("Click to record", "Click to stop recording")

if not audio.empty():
    # To play audio in frontend:
    st.audio(audio.export().read())  

    # To save audio to a file, use pydub export method:
    audio.export("audio.wav", format="wav")

    # To get audio properties, use pydub AudioSegment properties:
    st.write(f"Frame rate: {audio.frame_rate}, Frame width: {audio.frame_width}, Duration: {audio.duration_seconds} seconds")
```
