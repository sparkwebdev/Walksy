import { IonButton, IonPage } from "@ionic/react";
import React, { useState } from "react";
import MicRecorder from "mic-recorder-to-mp3";

const AudioRecord2: React.FC = () => {
  // const button = document.querySelector("button");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<HTMLAudioElement | null>(null);
  // const [buttonText, setButtonText] = useState<string>("Start recording");

  const recorder = new MicRecorder({
    bitRate: 128,
  });

  const startRecording = () => {
    recorder
      .start()
      .then(() => {
        setIsRecording(true);
        setRecording(null);
      })
      .catch((e: Error) => {
        console.error(e);
      });
  };

  const stopRecording = () => {
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]: any) => {
        console.log(buffer, blob);
        const file = new File(buffer, "music.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });

        const player = new Audio(URL.createObjectURL(file));
        player.controls = true;
        setRecording(player);
        setIsRecording(false);
      })
      .catch((e: Error) => {
        console.error(e);
      });
  };

  return (
    <IonPage>
      <h1>Mic Recorder to Mp3 Example</h1>

      {isRecording ? (
        <IonButton color="danger" onClick={stopRecording}>
          Stop Recording
        </IonButton>
      ) : (
        <IonButton color="success" onClick={startRecording}>
          Start Recording
        </IonButton>
      )}
      {recording}
    </IonPage>
  );
};

export default AudioRecord2;
