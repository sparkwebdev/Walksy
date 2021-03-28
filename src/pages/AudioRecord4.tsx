import React, { useState } from "react";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import { IonPage } from "@ionic/react";

const AudioRecord4: React.FC = () => {
  console.log("e");
  const [recordState, setRecordState] = useState<any>(null);

  const start = () => {
    console.log("e", RecordState);
    setRecordState(RecordState.START);
  };

  const stop = () => {
    setRecordState(RecordState.STOP);
  };

  //audioData contains blob and blobUrl
  const onStop = (audioData: any) => {
    console.log("audioData", audioData);
  };
  return (
    <IonPage>
      <AudioReactRecorder
        state={recordState}
        onStop={onStop}
        type="audio/mpeg"
      />

      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </IonPage>
  );
};

export default AudioRecord4;
