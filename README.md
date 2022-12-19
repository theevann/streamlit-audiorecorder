# Audio Recorder for streamlit
[![Streamlit App](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://theevann-streamlit-audiorecorder-exampleexample-5ds2ug.streamlitapp.com)

Audio recorder component for streamlit.  
It creates a button: one click to start recording, one click to stop recording.  
The return value is a numpy array.
After conversion to bytes using `.tobytes()`, it can be passed to `st.audio` or written to disk as an audio file.

### Install it with pip:
```bash
pip install streamlit-audiorecorder
```

### Use it:
```python
import streamlit as st
from audiorecorder import audiorecorder

st.title("Audio Recorder")
audio = audiorecorder("Click to record", "Recording...")

if len(audio) > 0:
    # To play audio in frontend:
    st.audio(audio.tobytes())
    
    # To save audio to a file:
    wav_file = open("audio.mp3", "wb")
    wav_file.write(audio.tobytes())
```