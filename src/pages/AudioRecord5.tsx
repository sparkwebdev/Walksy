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
    <div>
      <p>{status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <audio src={mediaBlobUrl || ""} controls loop />
    </div>
  );
};

export default AudioRecord5;
