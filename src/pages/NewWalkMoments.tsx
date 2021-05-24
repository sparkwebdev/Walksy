import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonRow,
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
import dayjs from "dayjs";

const noteMaxLength = 280;

const NewWalkMoments: React.FC<{
  walkId: string;
  colour: string;
  momentType: string;
  resetMomentType: () => void;
  updateLocations: (location: Location) => void;
  updateTimestamp: (timestamp: string) => void;
  lastTimestamp?: string;
}> = ({
  walkId,
  colour,
  momentType,
  resetMomentType,
  updateLocations,
  updateTimestamp,
  lastTimestamp,
}) => {
  const walksCtx = useContext(WalksContext);

  // const imagePathRef = useRef<HTMLIonInputElement>(null);
  // const audioPathRef = useRef<HTMLIonInputElement>(null);
  const noteRef = useRef<HTMLIonTextareaElement>(null);
  const [note, setNote] = useState<string>("");

  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [timestamp, setTimestamp] = useState<string>(
    dayjs().format("YYYY-MM-DDTHH:mm")
  );

  const [takenPhoto, setTakenPhoto] = useState<Photo | null>();
  const [recordedAudioFilename, setRecordedAudioFilename] =
    useState<string | null>(null);

  const imagePickerRef = useRef<any>();

  const photoPickHandler = (photo: Photo) => {
    if (photo.location) {
      setLatitude(photo.location.lat);
      setLongitude(photo.location.lng);
    }
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
    if (lastTimestamp) {
      setTimestamp(
        dayjs(lastTimestamp).format("YYYY-MM-DDTHH:mm") ||
          dayjs().format("YYYY-MM-DDTHH:mm")
      );
    }
  }, [lastTimestamp]);

  useEffect(() => {
    if (takenPhoto?.path && !takenPhoto.path.startsWith("file://")) {
      addMomentHandler();
    }
  }, [takenPhoto]);

  const addMomentHandler = async () => {
    updateTimestamp(timestamp);
    const location: Location | null =
      latitude && longitude && timestamp
        ? {
            lat: latitude,
            lng: longitude,
            timestamp: dayjs(timestamp).valueOf(),
          }
        : null;
    if (momentType === "Location") {
      if (location) {
        updateLocations(location);
      }
    } else {
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

      walksCtx.addMoment(
        walkId,
        takenPhoto?.path || "",
        recordedAudioFilename || "",
        base64Data,
        enteredNote!.toString(),
        location,
        timestamp
      );
      if (location) {
        updateLocations(location);
      }
    }
    setLatitude(undefined);
    setLongitude(undefined);
    setTimestamp(dayjs().format("YYYY-MM-DDTHH:mm"));
    setTakenPhoto(null);
    setNote("");
    setRecordedAudioFilename(null);
    resetMomentType();
  };

  const locationInput = (
    <IonGrid>
      <IonRow className="ion-text-start">
        <IonCol>
          <IonInput
            className="input-text input-text--small"
            type="number"
            value={latitude}
            onIonChange={(e) => setLatitude(+e.detail!.value!)}
          />
          <IonLabel position="stacked">
            <small>Latitude</small>
          </IonLabel>
        </IonCol>
        <IonCol>
          <IonInput
            className="input-text input-text--small"
            type="number"
            value={longitude}
            onIonChange={(e) => setLongitude(+e.detail!.value!)}
          />
          <IonLabel position="stacked">
            <small>Longitude</small>
          </IonLabel>
        </IonCol>
        <IonCol>
          <IonInput
            className="input-text input-text--small"
            type="datetime-local"
            value={timestamp}
            onIonChange={(e) => setTimestamp(e.detail!.value!)}
          />
          <IonLabel position="stacked">
            <small>Timestamp</small>
          </IonLabel>
        </IonCol>
      </IonRow>
    </IonGrid>
  );

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
                <IonCard className="add-moment-audio">
                  <AudioPicker
                    onAudioPick={(fileName: string) => {
                      audioPickHandler(fileName);
                    }}
                  />
                  {locationInput}
                </IonCard>
              )}
              {(momentType === "Note" || takenPhoto) && (
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
                  {locationInput}
                </IonCard>
              )}
              {momentType === "Location" && (
                <IonCard
                  className={
                    takenPhoto
                      ? "add-moment-note add-moment-note--with-photo"
                      : "add-moment-note"
                  }
                >
                  <IonLabel hidden={true}>Add a location...</IonLabel>

                  {locationInput}
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
                  <IonRow>
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
                          setLatitude(undefined);
                          setLongitude(undefined);
                          setTimestamp(dayjs().format("YYYY-MM-DDTHH:mm"));
                          setNote("");
                          resetMomentType();
                        }}
                      >
                        <IonIcon slot="start" icon={cancelIcon} />
                        Cancel
                      </IonButton>
                    </IonCol>
                    <IonCol size="7">
                      <IonButton
                        expand="block"
                        color="secondary"
                        onClick={
                          takenPhoto ? saveImageHandler : addMomentHandler
                        }
                        disabled={
                          !latitude ||
                          !longitude ||
                          !timestamp ||
                          (momentType === "Note" &&
                            note.toString().trim().length < 1) ||
                          (momentType === "Photo" && !takenPhoto) ||
                          (momentType === "Audio" && !recordedAudioFilename)
                        }
                      >
                        <IonIcon slot="start" icon={addIcon} />
                        Add {momentType}
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
