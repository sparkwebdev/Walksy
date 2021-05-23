import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { Filesystem, FilesystemDirectory } from "@capacitor/core";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { getFileExtension } from "../helpers";

import { Plugins } from "@capacitor/core";
import { RecordingData, GenericResponse } from "capacitor-voice-recorder";
import {
  mic as recordIcon,
  stop as stopIcon,
  alertCircle as errorIcon,
} from "ionicons/icons";

const { VoiceRecorder } = Plugins;
let ticker: any = null;
const maximumDuration = 30;

const AudioPicker: React.FC<{
  onAudioPick: (filename: string) => void;
}> = (props) => {
  const [canRecord, setCanRecord] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioPath, setAudioPath] = useState<string>("");
  const [audioFilename, setAudioFilename] = useState<string>("");
  const [secondsRemaining, setSecondsRemaining] =
    useState<number>(maximumDuration);
  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  const filePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // // will print true / false based on the device ability to record
    // VoiceRecorder.canDeviceVoiceRecord()
    //   .then((result: GenericResponse) => {
    //     // console.log(result.value);
    //     setCanRecord(true); // Check for value
    //   })
    //   .catch((e: Error) => {
    //     console.log(e);
    //   });

    /**
     * will prompt the user to give the required permission, after that
     * the function will print true / false based on the user response
     */
    VoiceRecorder.requestAudioRecordingPermission()
      .then((result: GenericResponse) => {
        // console.log(result.value);
        setCanRecord(true); // Check for value
      })
      .catch((e: Error) => {
        console.log("Can't request audio status", e);
        openFilePicker();
      });
  }, []);

  // /**
  //  * In case of success the promise will resolve with {"value": true}
  //  * in case of an error the promise will reject with one of the following messages:
  //  * "MISSING_PERMISSION", "ALREADY_RECORDING", "CANNOT_RECORD_ON_THIS_PHONE", "MICROPHONE_BEING_USED" or "FAILED_TO_RECORD"
  //  */
  const startRecordingHandler = async () => {
    if (audioFilename) {
      await Filesystem.deleteFile({
        path: `moments/${audioFilename}`,
        directory: FilesystemDirectory.Data,
      })
        .then((result) => {
          setAudioFilename("");
        })
        .catch((e) => {
          console.log("could not delete: ", audioFilename, e);
        });
    }
    let seconds = 1;
    ticker = setInterval(() => {
      setSecondsRemaining(maximumDuration - seconds);
      seconds++;
      if (seconds >= maximumDuration) {
        stopRecordingHandler();
      }
    }, 1000);
    VoiceRecorder.startRecording()
      .then()
      .catch((error: Error) => console.log("Could not start recording", error));
    setIsRecording(true);
  };

  /**
   * In case of success the promise will resolve with:
   * {"value": { recordDataBase64: string, msDuration: number, mimeType: string }},
   * the file will be in *.acc format.
   * in case of an error the promise will reject with one of the following messages:
   * "RECORDING_HAS_NOT_STARTED" or "FAILED_TO_FETCH_RECORDING"
   */
  const stopRecordingHandler = () => {
    clearInterval(ticker);
    VoiceRecorder.stopRecording()
      .then((result: RecordingData) => {
        if (result.value.recordDataBase64) {
        }
        const base64Sound = result.value.recordDataBase64;
        setAudioPath(`data:audio/aac;base64,${base64Sound}`);
        saveAudioFileHandler(base64Sound);
      })
      .catch((error: Error) => console.log("Could stop recording", error));
    tryAgainHandler();
  };

  const tryAgainHandler = () => {
    setIsRecording(false);
    setSecondsRemaining(maximumDuration);
    setAudioPath("");
  };

  const openFilePicker = () => {
    if (filePickerRef.current) {
      filePickerRef.current.click();
    }
  };

  const saveAudioFileHandler = async (
    base64Data: string,
    fileType: string = "aac"
  ) => {
    if (!base64Data) {
      return;
    }
    const fileName = `${new Date().getTime()}.${fileType}`;
    Filesystem.writeFile({
      path: `moments/${fileName}`,
      data: base64Data,
      directory: FilesystemDirectory.Data,
    }).then(() => {
      setAudioFilename(fileName);
      props.onAudioPick(fileName);
    });
  };

  const pickFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target!.files![0];
    let targetFileType = "mp3";
    const fileExtensionData = getFileExtension(file.name);
    if (
      !fileExtensionData ||
      (fileExtensionData[1] !== "mp3" && fileExtensionData[1] !== "aac")
    ) {
      setError({
        showError: true,
        message: "Please upload a valid file type (.mp3 or .aac)",
      });
      return;
    } else {
      targetFileType = fileExtensionData[1];
    }

    const fr = new FileReader();
    fr.onload = async () => {
      const data = fr.result!.toString();
      if (data) {
        setAudioPath(data);
        const base64 = await base64FromPath(data);
        saveAudioFileHandler(base64, targetFileType);
      }
    };
    fr.readAsDataURL(file);
  };

  return (
    <>
      <div className="audio-recorder ion-text-center">
        {audioPath ? (
          <div className="audio-recorder__output ion-margin">
            <audio controls className="moments-list__audio">
              <source src={audioPath} type="audio/mpeg" />
            </audio>
            <IonButton className="ion-margin-top" onClick={tryAgainHandler}>
              Try again?
            </IonButton>
          </div>
        ) : (
          <>
            {canRecord ? (
              <>
                <IonButton
                  color={isRecording ? "tertiary" : "secondary"}
                  onClick={
                    isRecording ? stopRecordingHandler : startRecordingHandler
                  }
                  className="audio-recorder__record"
                >
                  <IonIcon
                    icon={isRecording ? stopIcon : recordIcon}
                    size="large"
                  />
                  <IonText className="ion-hide">
                    {isRecording ? "Stop" : "Start"} recording
                  </IonText>
                </IonButton>
                <p className="audio-recorder__record-label text-body">
                  Click to {isRecording ? "stop" : "start"} recording.
                </p>
                <p className="small-print text-body">
                  {isRecording ? (
                    <>
                      <strong>{secondsRemaining}</strong> seconds remaining.
                    </>
                  ) : (
                    <>You can record up to {maximumDuration} seconds.</>
                  )}
                </p>
              </>
            ) : (
              <IonCard className="constrain constrain--small ion-margin">
                <IonCardContent>
                  <IonIcon icon={errorIcon} size="large" color="danger" />
                  <p>
                    <IonText color="danger">
                      <strong>
                        It looks like your device doesn't support audio
                        recording.
                      </strong>
                    </IonText>
                    <IonButton
                      className="ion-margin-top"
                      onClick={openFilePicker}
                    >
                      Upload a file
                    </IonButton>
                  </p>
                  <input
                    type="file"
                    hidden
                    ref={filePickerRef}
                    onChange={pickFileHandler}
                  />
                </IonCardContent>
              </IonCard>
            )}
          </>
        )}
      </div>
      <IonToast
        duration={3000}
        position="bottom"
        isOpen={error.showError}
        onDidDismiss={() => setError({ showError: false, message: undefined })}
        message={error.message}
      />
    </>
  );
};

export default AudioPicker;
