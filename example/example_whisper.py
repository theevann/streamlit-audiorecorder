import io
import numpy as np
import streamlit as st
import whisper
from audiorecorder import audiorecorder
from scipy import signal

st.title("Audio Recorder")
audio = audiorecorder('', '')

if len(audio) > 0:
    # To play audio in frontend:
    st.audio(audio.export().read())  

    # To get audio properties, use pydub AudioSegment properties:
    st.write(f"Frame rate: {audio.frame_rate}, Frame width: {audio.frame_width}, Duration: {audio.duration_seconds} seconds")
    
    # Prepare the audio data for Whisper model
    audio_buffer = io.BytesIO()
    audio.export(audio_buffer, format="wav")
    audio_buffer.seek(0)  # Reset buffer position to the start
    audio_buffer.read(44)  # Skip the WAV header (44 bytes)

    # Convert audio bytes to a NumPy array
    audio_array = np.frombuffer(audio_buffer.read(), dtype=np.int16)
    audio_array = audio_array.astype(np.float32) / 32768.0  # Normalize to [-1.0, 1.0]

    # Resample audio to 16000 Hz if necessary
    if audio.frame_rate != 16000:
        num_samples = round(len(audio_array) * 16000 / audio.frame_rate)
        audio_array = signal.resample(audio_array, num_samples)

    # Load the Whisper model and transcribe the audio
    model = whisper.load_model("small")
    result = model.transcribe(audio_array)

    # Display the transcription
    st.write(f"Transcription: {result['text']}")