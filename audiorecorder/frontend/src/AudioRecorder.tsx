import React, { useEffect, useState } from "react"
import {
  Streamlit,
  withStreamlitConnection,
} from "streamlit-component-lib"
import { AudioRecorder as AudioRecorderVisualiser, useAudioRecorder } from '@theevann/react-audio-voice-recorder';


function BlobToDataURL(blob: Blob): Promise<string>{
  debugger;
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function AudioRecorder(props: any) {
  const [isHoveredStart, setIsHoveredStart] = useState(false);
  const [isHoveredStop, setIsHoveredStop] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const recorderControls = useAudioRecorder();

  const onRecordingComplete = async (blob: Blob) => {
    const audioDataStr = (await BlobToDataURL(blob)).replace(/^data:.+?base64,/, "");
    Streamlit.setComponentValue(audioDataStr);
  };

  useEffect(() => {
    // Component did mount
    Streamlit.setFrameHeight();

    // mimic componentDidUpdate if necessary
    const resizeListener = () => {
      Streamlit.setFrameHeight();
    };

    window.addEventListener('resize', resizeListener);

    // Component will unmount
    return () => { window.removeEventListener('resize', resizeListener); };
  }, []);

  useEffect(() => {
    if (buttonClicked && recorderControls.recordingBlob) {
      onRecordingComplete(recorderControls.recordingBlob);
      setButtonClicked(false);  // Reset the flag after calling the function
    }
  }, [recorderControls.recordingBlob, buttonClicked]);

  return props.args.start_prompt !== "" || props.args.stop_prompt !== "" ? (
    <span>
      <button
        onClick={() => {
          if (recorderControls.isRecording) {
            recorderControls.togglePauseResume();
          } else {
            recorderControls.startRecording();
          }
        }}
        disabled={props.disabled}
        className="btn btn-outline-secondary"
        style={{
          display: (!recorderControls.isRecording || props.args.pause_prompt !== "") ? "inline-block" : "none",
          marginBottom: "1px",
          marginRight: "10px",
          color: props.theme?.textColor,
          backgroundColor: isHoveredStart ? props.theme?.secondaryBackgroundColor : props.theme?.backgroundColor,
          borderColor: props.theme?.textColor,
          fontFamily: props.theme?.font,
        }}
        onMouseEnter={() => setIsHoveredStart(true)}
        onMouseLeave={() => setIsHoveredStart(false)}
      >
        {recorderControls.isRecording && !recorderControls.isPaused ? props.args.pause_prompt : props.args.start_prompt}
      </button>
      <button
        onClick={() => {
          recorderControls.stopRecording();
          setButtonClicked(true);  // Set the flag to true when button is clicked
        }}
        disabled={props.disabled || (!recorderControls.isRecording && !recorderControls.isPaused)}
        className="btn btn-outline-secondary"
        style={{
          display: (recorderControls.isRecording || recorderControls.isPaused) ? "inline-block" : "none",
          marginBottom: "1px",
          color: props.theme?.textColor,
          backgroundColor: isHoveredStop ? props.theme?.secondaryBackgroundColor : props.theme?.backgroundColor,
          borderColor: props.theme?.textColor,
          fontFamily: props.theme?.font,
        }}
        onMouseEnter={() => setIsHoveredStop(true)}
        onMouseLeave={() => setIsHoveredStop(false)}
      >
        {props.args.stop_prompt}
      </button>
    </span>
  ) : (
      <div style={{ padding: "5px" }}>
        <AudioRecorderVisualiser
          onRecordingComplete={onRecordingComplete}
          recorderControls={recorderControls}
          showVisualizer={props.args.show_visualizer}
        />
      </div>
  );
}

export default withStreamlitConnection(AudioRecorder);