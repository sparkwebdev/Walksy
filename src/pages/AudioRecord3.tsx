import { IonPage } from "@ionic/react";
import React, { useState } from "react";

import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";

const AudioRecord3: React.FC = () => {
  const [audioDetails, setAudioDetails] = useState<any>({
    url: null,
    blob: null,
    chunks: null,
    duration: {
      h: 0,
      m: 0,
      s: 0,
    },
  });
  const handleAudioStop = (data: any) => {
    console.log(data);
    setAudioDetails(data);
  };
  const handleAudioUpload = (file: any) => {
    console.log(file);
  };
  const handleReset = () => {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    };
    setAudioDetails(reset);
  };
  return (
    <IonPage>
      <Recorder
        record={true}
        title={"New recording"}
        audioURL={audioDetails.url}
        showUIAudio
        handleAudioStop={(data: any) => handleAudioStop(data)}
        handleAudioUpload={(data: any) => handleAudioUpload(data)}
        handleRest={() => handleReset()}
      />
    </IonPage>
  );
};

export default AudioRecord3;
