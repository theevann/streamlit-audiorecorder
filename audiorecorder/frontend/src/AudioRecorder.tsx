import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"

interface State {
  recorder: MediaRecorder | null,
  isHoveredStart: boolean,
  isHoveredStop: boolean,
}

function BlobToDataURL(blob: Blob) {
  return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener("loadend", () => resolve(reader.result as string));
      reader.readAsDataURL(blob);
  }) as Promise<string>;
}

class AudioRecorder extends StreamlitComponentBase<State> {
  public state:State = { recorder: null, isHoveredStart: false, isHoveredStop: false };

  public componentDidMount(): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((mediaStreamObj) => {
      const options = {
        // audioBitsPerSecond: 24000,
        // sampleSize: 16,
        // mimeType: "audio/webm",
      };
      const recorder = new MediaRecorder(mediaStreamObj, options);
      this.setState({ recorder });

      recorder.ondataavailable = async ({ data }) => {
        const audioData_str = (await BlobToDataURL(data)).replace(/^data:.+?base64,/, "");
        Streamlit.setComponentValue(audioData_str);
      }
    });
  }

  public render = (): ReactNode => {
    const {start_prompt, stop_prompt, pause_prompt} = this.props.args;

    return (
      <span>
        <button
          onClick={this.toggleRecording}
          disabled={this.props.disabled}
          className="btn btn-outline-secondary"
          style={{
            display: this.state.recorder?.state !== "recording" || pause_prompt !== "" ? "inline-block" : "none",
            marginBottom: "1px",
            marginRight: "10px",
            color: this.props.theme?.textColor,
            backgroundColor: this.state.isHoveredStart ? this.props.theme?.secondaryBackgroundColor : this.props.theme?.backgroundColor,
            borderColor: this.props.theme?.textColor,
            fontFamily: this.props.theme?.font,
          }}
          onMouseEnter={() => this.setState({ isHoveredStart: true })}
          onMouseLeave={() => this.setState({ isHoveredStart: false })}
        >
          {this.state.recorder?.state === "recording" ? pause_prompt : start_prompt}
        </button>
        <button
          onClick={this.stopRecording}
          disabled={this.props.disabled || this.state.recorder?.state === "inactive"}
          className="btn btn-outline-secondary"
          style={{
            display: this.state.recorder?.state !== "inactive" ? "inline-block" : "none",
            marginBottom: "1px",
            color: this.props.theme?.textColor,
            backgroundColor: this.state.isHoveredStop ? this.props.theme?.secondaryBackgroundColor : this.props.theme?.backgroundColor,
            borderColor: this.props.theme?.textColor,
            fontFamily: this.props.theme?.font,
          }}
          onMouseEnter={() => this.setState({ isHoveredStop: true })}
          onMouseLeave={() => this.setState({ isHoveredStop: false })}
        >
          {stop_prompt}
        </button>
      </span>
    )
  }

  private toggleRecording = (): void => {
    const recorder = this.state.recorder as MediaRecorder;
    if (recorder.state === "recording") {
      recorder.pause();
    } else if (recorder.state === "paused") {
      recorder.resume();
    } else {
      recorder.start();
    }
    this.forceUpdate();
  }

  private stopRecording = (): void => {
    const recorder = this.state.recorder as MediaRecorder;
    recorder.stop();
    this.forceUpdate();
  }
}

export default withStreamlitConnection(AudioRecorder)
