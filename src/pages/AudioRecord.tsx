import { IonButton, IonPage } from "@ionic/react";
import React, { Component, useState } from "react";

import Recorder from "react-mp3-recorder";

let ticker: any = null;
const maximumDuration = 30;
const AudioRecord: React.FC<{
  onAudioPick?: () => void;
}> = (props) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioPath, setAudioPath] = useState<string>("");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    maximumDuration
  );

  const onRecordingComplete = (blob: any) => {
    setAudioPath(URL.createObjectURL(blob));
    setIsRecording(false);
    if (audioPath.startsWith("blob:")) {
      URL.revokeObjectURL(audioPath);
    }
    setSecondsRemaining(maximumDuration);
    clearInterval(ticker);
    if (props.onAudioPick) {
      props.onAudioPick();
    }
  };

  const onRecordingError = (err: any) => {
    console.log("recording error", err);
  };

  const startRecordingHandler = () => {
    setIsRecording(true);
    let seconds = 1;
    ticker = setInterval(() => {
      setSecondsRemaining(maximumDuration - seconds);
      seconds++;
    }, 1000);
  };

  const tryAgainHandler = (err: any) => {
    setIsRecording(false);
    setSecondsRemaining(30);
    setAudioPath("");
  };

  return (
    <IonPage>
      <div className="audio-recorder ion-text-center">
        {!audioPath ? (
          <>
            <div
              className={
                isRecording
                  ? "audio-recorder__record audio-recorder__record--on"
                  : "audio-recorder__record"
              }
              onMouseDown={() => {
                startRecordingHandler();
              }}
            >
              <Recorder
                onRecordingComplete={onRecordingComplete}
                onRecordingError={onRecordingError}
              />
            </div>
            <p className="audio-recorder__record-label text-body">
              Click and hold to start recording.
            </p>
            {isRecording ? (
              <p className="text-heading">
                <strong>{secondsRemaining}</strong>
              </p>
            ) : (
              <p className="small-print text-body">Up to 30 seconds.</p>
            )}
          </>
        ) : (
          <div className="audio-recorder__output">
            <audio controls className="moments-list__audio">
              <source src={audioPath} type="audio/mpeg" />
            </audio>
            <IonButton className="ion-margin-top" onClick={tryAgainHandler}>
              Try again?
            </IonButton>
          </div>
        )}
      </div>
    </IonPage>
  );
};
export default AudioRecord;
