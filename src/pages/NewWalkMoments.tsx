import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonGrid,
  IonIcon,
  IonLabel,
  IonModal,
  IonRow,
  IonSpinner,
  IonTextarea,
} from "@ionic/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Location, Photo } from "../data/models";
import WalksContext from "../data/walks-context";
import NewWalkMomentsOutput from "../components/NewWalkMomentsOutput";
import { close as cancelIcon, add as addIcon } from "ionicons/icons";
import ImagePicker from "../components/ImagePicker";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { Filesystem, FilesystemDirectory } from "@capacitor/core";
import AudioPicker from "../components/AudioPicker";

const noteMaxLength = 280;

const NewWalkMoments: React.FC<{
  walkId: string;
  colour: string;
  momentType: string;
  resetMomentType: () => void;
  getLocation: () => Promise<Location | null>;
}> = ({ walkId, colour, momentType, resetMomentType, getLocation }) => {
  const walksCtx = useContext(WalksContext);

  // const imagePathRef = useRef<HTMLIonInputElement>(null);
  // const audioPathRef = useRef<HTMLIonInputElement>(null);
  const noteRef = useRef<HTMLIonTextareaElement>(null);
  const [note, setNote] = useState<string>("");

  const [takenPhoto, setTakenPhoto] = useState<Photo | null>();
  const [recordedAudioFilename, setRecordedAudioFilename] =
    useState<string | null>(null);

  const imagePickerRef = useRef<any>();

  const photoPickHandler = (photo: Photo) => {
    setTakenPhoto(photo);
    // resetMomentType();
  };

  const audioPickHandler = (audioFilename: string) => {
    setRecordedAudioFilename(audioFilename);
  };
  const audioPickDeleteHandler = async (audioFilename: string) => {
    if (audioFilename) {
      await Filesystem.deleteFile({
        path: `moments/${audioFilename}`,
        directory: FilesystemDirectory.Data,
      })
        .then(() => {
          setRecordedAudioFilename(null);
        })
        .catch((e) => {
          console.log("could not delete: ", audioFilename, e);
        });
    }
    setRecordedAudioFilename(null);
  };

  const saveImageHandler = async () => {
    if (!takenPhoto) {
      return;
    }
    const fileName = new Date().getTime() + ".jpeg";
    const base64 = await base64FromPath(takenPhoto.preview);
    Filesystem.writeFile({
      path: `moments/${fileName}`,
      data: base64,
      directory: FilesystemDirectory.Data,
    })
      .then(() => {
        setTakenPhoto({
          path: fileName,
          preview: takenPhoto.preview,
        });
      })
      .catch((e) => {
        console.log("Couldn't write file", e);
      });
  };

  useEffect(() => {
    if (takenPhoto?.path && !takenPhoto.path.startsWith("file://")) {
      addMomentHandler();
    }
  }, [takenPhoto]);

  const addMomentHandler = async () => {
    const enteredNote = noteRef.current?.value || "";
    if (
      !recordedAudioFilename &&
      enteredNote.toString().trim().length === 0 &&
      !takenPhoto
    ) {
      return;
    }
    let base64Data = "";
    if (takenPhoto?.preview) {
      base64Data = await base64FromPath(takenPhoto.preview);
    } else if (recordedAudioFilename) {
      await Filesystem.readFile({
        path: `moments/${recordedAudioFilename}`,
        directory: FilesystemDirectory.Data,
      })
        .then((file) => {
          base64Data = `data:audio/aac;base64,${file.data}`;
        })
        .catch((e) => {
          console.log("Couldn't load file", recordedAudioFilename);
          resetMomentType();
        });
    }

    const latestLocation: Location | undefined = walksCtx.walk?.locations
      .slice(-1)
      .pop();

    getLocation()
      .then((newLocation) => {
        walksCtx.addMoment(
          walkId,
          takenPhoto?.path || "",
          recordedAudioFilename || "",
          base64Data,
          enteredNote!.toString(),
          newLocation || latestLocation || null,
          new Date().toISOString()
        );
      })
      .catch((e) => {
        console.log("Could not get your location", e);
      });
    setTakenPhoto(null);
    setRecordedAudioFilename(null);
    resetMomentType();
  };

  return (
    <IonCardContent className="constrain constrain--large">
      <NewWalkMomentsOutput colour={colour} />

      <IonModal
        backdrop-dismiss="false"
        isOpen={momentType !== ""}
        onDidDismiss={resetMomentType}
        cssClass="add-moment-modal"
        onDidPresent={() => {
          if (momentType === "Photo") {
            imagePickerRef.current.triggerTakePhoto();
          } else if (momentType === "Note") {
            noteRef.current!.setFocus();
          }
        }}
      >
        <div className="add-moment-container">
          {momentType !== "" && (
            <>
              {momentType === "Photo" && (
                <div className="ion-padding ion-text-center add-moment-photo">
                  <ImagePicker
                    ref={imagePickerRef}
                    onCancel={resetMomentType}
                    onImagePick={photoPickHandler}
                  />
                </div>
              )}
              {momentType === "Audio" && (
                <div className="ion-text-center ion-padding add-moment-audio">
                  <div className="audio-picker ion-margin">
                    <AudioPicker
                      onAudioPick={(fileName: string) => {
                        audioPickHandler(fileName);
                      }}
                    />
                  </div>
                </div>
              )}
              {(momentType === "Note" ||
                takenPhoto ||
                recordedAudioFilename) && (
                <IonCard
                  className={
                    takenPhoto
                      ? "add-moment-note add-moment-note--with-photo"
                      : "add-moment-note"
                  }
                >
                  <IonLabel hidden={true}>Add a note...</IonLabel>
                  <IonTextarea
                    placeholder="A thought or description..."
                    maxlength={noteMaxLength}
                    rows={takenPhoto ? 3 : 7}
                    autocapitalize="on"
                    style={{
                      padding: "10px 20px",
                      margin: "0",
                      backgroundColor: "white",
                    }}
                    // value={note}
                    ref={noteRef}
                    onIonChange={(event) => {
                      setNote(event.detail.value!);
                    }}
                  ></IonTextarea>
                  <p className="ion-padding ion-no-margin with-tint">
                    <small>
                      {noteMaxLength - note.length} characters remaining
                    </small>
                  </p>

                  {/* <IonItem>
                      <IonLabel position="floating">Moment Note</IonLabel>
                      <IonInput type="text" ref={noteRef}></IonInput>
                    </IonItem> */}
                </IonCard>
              )}
              <IonCardHeader
                className="ion-no-padding add-moment-footer"
                color="light"
                style={{
                  paddingBottom: "20px",
                }}
              >
                <IonGrid>
                  <IonRow className="ion-align-items-center">
                    <IonCol size="5">
                      <IonButton
                        fill="clear"
                        expand="block"
                        color="danger"
                        onClick={() => {
                          setTakenPhoto(null);
                          if (recordedAudioFilename) {
                            audioPickDeleteHandler(recordedAudioFilename);
                          }
                          setNote("");
                          resetMomentType();
                        }}
                      >
                        <IonIcon slot="start" icon={cancelIcon} />
                        Cancel
                      </IonButton>
                    </IonCol>
                    {!walksCtx.canStoreFiles && (
                      <IonCol size="1" className="ion-text-center">
                        <IonSpinner color="medium" />
                      </IonCol>
                    )}
                    <IonCol size={walksCtx.canStoreFiles ? "7" : "6"}>
                      <IonButton
                        expand="block"
                        color="secondary"
                        onClick={
                          takenPhoto ? saveImageHandler : addMomentHandler
                        }
                        disabled={
                          (note.length < 1 ||
                            note.toString().trim().length < 1) &&
                          !takenPhoto &&
                          !recordedAudioFilename
                        }
                      >
                        <IonIcon slot="start" icon={addIcon} /> Add {momentType}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardHeader>
            </>
          )}
        </div>
      </IonModal>
    </IonCardContent>
  );
};

export default NewWalkMoments;
