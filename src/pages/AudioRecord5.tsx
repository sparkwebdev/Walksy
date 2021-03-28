import { IonPage } from "@ionic/react";
import React from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const AudioRecord5: React.FC = () => {
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ audio: true });

  return (
    <IonPage>
      <p>{status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <audio src={mediaBlobUrl || ""} controls loop />
    </IonPage>
  );
};

export default AudioRecord5;
