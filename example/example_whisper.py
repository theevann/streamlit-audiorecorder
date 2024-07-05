import io
import numpy as np
import streamlit as st
import whisper
from audiorecorder import audiorecorder
from scipy import signal

st.title("Audio Recorder with Whisper Model")
audio = audiorecorder('', '')

@st.cache_resource
def load_model(size="small"):
    return whisper.load_model(size, in_memory=True)

if len(audio) > 0:
    # To play audio in frontend:
    st.audio(audio.export().read())  

    # To get audio properties, use pydub AudioSegment properties:
    st.write(f"Frame rate: {audio.frame_rate}, Frame width: {audio.frame_width}, Duration: {audio.duration_seconds} seconds")
    
    # Prepare the audio data for Whisper model
    # Skipping the WAV header (44 bytes) when reading audio data from buffer
    audio_buffer = io.BytesIO()
    audio.export(audio_buffer, format="wav", parameters=["-ar", str(16000)])
    audio_array = np.frombuffer(audio_buffer.getvalue()[44:], dtype=np.int16).astype(np.float32) / 32768.0
    
    # Load the Whisper model and transcribe the audio
    with st.spinner("Transcribing..."):
        model = load_model()
        result = model.transcribe(audio_array, fp16=False)

    # Display the transcription
    st.write(f"Transcription: {result['text']}")