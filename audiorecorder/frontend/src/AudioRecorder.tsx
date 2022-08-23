import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"

interface State {
  recording: boolean,
  recorder: MediaRecorder | null,
}

function BlobToDataURL(blob: Blob) {
  return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener("loadend", () => resolve(reader.result as string));
      reader.readAsDataURL(blob);
  }) as Promise<string>;
}

class AudioRecorder extends StreamlitComponentBase<State> {
  public state:State = { recording: false, recorder: null };

  public componentDidMount(): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then((mediaStreamObj) => {
      const recorder = new MediaRecorder(mediaStreamObj);
      this.setState({ recorder });

      recorder.ondataavailable = async ({data}) => {
        const audioData = new Blob([data], {type: "audio/mp3"});
        const audioData_str = (await BlobToDataURL(audioData)).replace(/^data:.+?base64,/, "");
        Streamlit.setComponentValue(audioData_str);
      }
    });
  }

  public render = (): ReactNode => {
    const {record_prompt, recording_prompt} = this.props.args;

    return (
      <span>        
        <button
          onClick={this.onClicked}
          disabled={this.props.disabled}
          className="btn btn-outline-secondary"
          style={{marginBottom: "1px"}}
        >
          {this.state.recording ? recording_prompt : record_prompt}
        </button>
      </span>
    )
  }

  private onClicked = (): void => {
    const recorder = this.state.recorder as MediaRecorder;
    if (this.state.recording) {
      recorder.stop();
    } else {
      recorder.start();
    }

    this.setState(
      prevState => ({ recording: !prevState.recording }),
    )
  }
}

export default withStreamlitConnection(AudioRecorder)
