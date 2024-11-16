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

  const recorderControls = useAudioRecorder();

  const useAudioRecorderVisualiser = props.args.startPrompt === "" && props.args.stopPrompt === "";

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
    if (!useAudioRecorderVisualiser && recorderControls.recordingBlob) {
      onRecordingComplete(recorderControls.recordingBlob);
    }
  }, [recorderControls.recordingBlob, useAudioRecorderVisualiser]);


  return !useAudioRecorderVisualiser ? (
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
          ...{
            display: (!recorderControls.isRecording || props.args.pausePrompt !== "") ? "inline-block" : "none",
            marginBottom: "1px",
            marginRight: "10px",
            color: props.theme?.textColor,
            backgroundColor: isHoveredStart ? props.theme?.secondaryBackgroundColor : props.theme?.backgroundColor,
            borderColor: props.theme?.textColor,
            fontFamily: props.theme?.font,
          },
          ...props.args.customStyle,
          ...(recorderControls.isRecording && !recorderControls.isPaused ? props.args.pauseStyle : props.args.startStyle),
        }}
        onMouseEnter={() => setIsHoveredStart(true)}
        onMouseLeave={() => setIsHoveredStart(false)}
      >
        {recorderControls.isRecording && !recorderControls.isPaused ? props.args.pausePrompt : props.args.startPrompt}
      </button>
      <button
        onClick={recorderControls.stopRecording}
        disabled={props.disabled || (!recorderControls.isRecording && !recorderControls.isPaused)}
        className="btn btn-outline-secondary"
        style={{
          ...{
            display: (recorderControls.isRecording || recorderControls.isPaused) ? "inline-block" : "none",
            marginBottom: "1px",
            color: props.theme?.textColor,
            backgroundColor: isHoveredStop ? props.theme?.secondaryBackgroundColor : props.theme?.backgroundColor,
            borderColor: props.theme?.textColor,
            fontFamily: props.theme?.font,
          },
          ...props.args.customStyle,
          ...props.args.stopStyle,
        }}
        onMouseEnter={() => setIsHoveredStop(true)}
        onMouseLeave={() => setIsHoveredStop(false)}
      >
        {props.args.stopPrompt}
      </button>
    </span>
  ) : (
      <div style={{ padding: "5px" }}>
        <AudioRecorderVisualiser
          onRecordingComplete={onRecordingComplete}
          recorderControls={recorderControls}
          showVisualizer={props.args.showVisualizer}
        />
      </div>
  );
}

export default withStreamlitConnection(AudioRecorder);