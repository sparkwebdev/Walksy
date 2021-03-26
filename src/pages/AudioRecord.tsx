import React, { Component } from "react";

import Recorder from "react-mp3-recorder";

export default class AudioRecord extends Component {
  render() {
    return (
      <div className="recorder">
        <Recorder
          onRecordingComplete={this._onRecordingComplete}
          onRecordingError={this._onRecordingError}
        />
      </div>
    );
  }

  _onRecordingComplete = (blob: any) => {
    console.log("recording", blob);
  };

  _onRecordingError = (err: any) => {
    console.log("recording error", err);
  };
}
