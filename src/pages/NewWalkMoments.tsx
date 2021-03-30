import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
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
import ImagePickerNew from "../components/ImagePickerNew";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import { Filesystem, FilesystemDirectory } from "@capacitor/core";

const noteMaxLength = 280;

const NewWalkMoments: React.FC<{
  walkId: string;
  momentType: string;
  resetMomentType: () => void;
  getLocation: () => Promise<Location | null>;
}> = ({ walkId, momentType, resetMomentType, getLocation }) => {
  const walksCtx = useContext(WalksContext);

  // const imagePathRef = useRef<HTMLIonInputElement>(null);
  const audioPathRef = useRef<HTMLIonInputElement>(null);
  const noteRef = useRef<HTMLIonTextareaElement>(null);
  const [note, setNote] = useState<string>("");

  const [takenPhoto, setTakenPhoto] = useState<Photo | null>();

  const imagePickerRef = useRef<any>();

  const photoPickHandler = (photo: Photo) => {
    setTakenPhoto(photo);
    // resetMomentType();
  };

  const saveImageHandler = async () => {
    if (!takenPhoto) {
      return;
    }
    const fileName = new Date().getTime() + ".jpeg";
    const base64 = await base64FromPath(takenPhoto.preview);
    Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: FilesystemDirectory.Data,
    }).then(() => {
      // setTakenPhoto((curPhoto) => {
      //   return {
      //     ...curPhoto!,
      //     path: fileName,
      //   };
      // });
      // addMomentHandler();
      setTakenPhoto({
        path: fileName,
        preview: takenPhoto.preview,
      });
    });
  };

  useEffect(() => {
    if (takenPhoto?.path && !takenPhoto.path.startsWith("file://")) {
      addMomentHandler();
    }
  }, [takenPhoto]);

  const addMomentHandler = async () => {
    const enteredAudioPath = audioPathRef.current?.value || "";
    const enteredNote = noteRef.current?.value || "";
    if (
      enteredAudioPath.toString().trim().length === 0 &&
      enteredNote.toString().trim().length === 0 &&
      !takenPhoto
    ) {
      return;
    }
    let loadedPhotoPath = "";
    if (takenPhoto?.path) {
      const enteredImagePath = takenPhoto?.path || "";
      await Filesystem.readFile({
        path: enteredImagePath,
        directory: FilesystemDirectory.Data,
      })
        .then((file) => {
          loadedPhotoPath = `data:image/jpeg;base64,${file.data}`;
        })
        .catch((e) => {
          console.log("Couldn't save file", loadedPhotoPath);
          resetMomentType();
        });
    }
    getLocation()
      .then((currentLocation) => {
        walksCtx.addMoment(
          walkId,
          loadedPhotoPath,
          enteredAudioPath!.toString(),
          enteredNote!.toString(),
          currentLocation,
          new Date().toISOString()
        );
      })
      .then(() => {
        setTakenPhoto(null);
        resetMomentType();
      });
  };

  return (
    <IonCardContent
      className="constrain constrain--large"
      style={{ margin: "auto" }}
    >
      <NewWalkMomentsOutput />

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
        {momentType !== "" && (
          <>
            {momentType === "Photo" && (
              <div
                className="ion-padding ion-text-center"
                style={{
                  marginTop: "auto",
                  overflow: "hidden",
                  flex: "1 1 auto",
                }}
              >
                <ImagePickerNew
                  ref={imagePickerRef}
                  onCancel={resetMomentType}
                  onImagePick={photoPickHandler}
                />
              </div>
            )}
            {momentType === "Audio" && (
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="floating">Moment Audio Path</IonLabel>
                    <IonInput type="text" ref={audioPathRef}></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
            )}
            {(momentType === "Note" || takenPhoto) && (
              <IonCard
                style={
                  takenPhoto
                    ? { marginTop: "auto", flex: "1 0 auto" }
                    : { marginTop: "auto" }
                }
              >
                <IonLabel hidden={true}>Add a note...</IonLabel>
                <IonTextarea
                  placeholder="A thought or description..."
                  maxlength={noteMaxLength}
                  rows={7}
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
              className="ion-no-padding"
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
                      color="success"
                      onClick={takenPhoto ? saveImageHandler : addMomentHandler}
                      disabled={
                        (note.length < 1 ||
                          note.toString().trim().length < 1) &&
                        !takenPhoto
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
      </IonModal>
      {/* <NewWalkAddMomentModal
          updateMoment={(imagePath: string, audioPath: string, note: string) =>
            updateMomentImageAudioNote(imagePath, audioPath, note)
          }
          cancelMoment={() => clearMomentHandler()}
          type={momentType}
        /> */}
    </IonCardContent>
  );
};

export default NewWalkMoments;
