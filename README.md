# Audio Recorder for streamlit

Audio recorder component for streamlit.  
It creates a button: one click to start recording, one click to stop recording.  
The return value is a numpy array that can be directly passed to `st.audio`, or that can be written to disk as audio file.

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
    st.audio(audio)
    
    # To save audio to a file:
    wav_file = open("audio.mp3", "wb")
    wav_file.write(audio.tobytes())
```
