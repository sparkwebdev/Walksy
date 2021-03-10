import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonLoading,
  IonModal,
  IonRow,
  IonText,
  IonTextarea,
  IonToast,
  isPlatform,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { Location, Moment, Photo } from "../data/models";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Capacitor,
  Filesystem,
  FilesystemDirectory,
} from "@capacitor/core";
import { base64FromPath } from "@ionic/react-hooks/filesystem";

import {
  checkmark as finishIcon,
  close as cancelIcon,
  micCircleOutline as recordlIcon,
  stopCircleOutline as stopIcon,
  chevronDown as chevronDownIcon,
  flagOutline as flagIcon,
  map as mapIcon,
} from "ionicons/icons";
import { storage } from "../firebase";

const noteMaxLength = 280;
const placeholderImage = "assets/img/placeholder.png";

// async function savePicture(blobUrl: string) {
//   const base64 = await base64FromPath(blobUrl);
//   const fileName = new Date().getTime() + ".jpeg";
//   Filesystem.writeFile({
//     path: fileName,
//     data: base64,
//     directory: FilesystemDirectory.Data,
//   });
// }

async function savePicture(blobUrl: string) {
  const fileInputRef = storage.ref(`/moments/${Date.now()}`);
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const snapshot = await fileInputRef.put(blob);
  const url = await snapshot.ref.getDownloadURL();
  return url;
}

const NewWalkAddMoment: React.FC<{
  updateWalk: (moments: Moment[]) => void;
  endWalk: () => void;
  getLocation: () => Promise<Location | null>;
}> = ({ endWalk, updateWalk, getLocation }) => {
  // Global (View) states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  const [moments, setMoments] = useState<Moment[]>([]);
  const [cancelWalkAlert, setCancelWalkAlert] = useState(false);

  const [addMomentModal, setAddMomentModal] = useState<boolean>(false);
  const [addMomentCurrentType, setAddMomentCurrentType] = useState<string>("");
  const [cancelMomentAlert, setCancelMomentAlert] = useState(false);

  const [takenPhoto, setTakenPhoto] = useState<Photo | null>(null);
  const [imagePath, setImagePath] = useState<string>(""); // takenPhotoPath, setTakenPhotoPath
  const [remoteImagePath, setRemoteImagePath] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [audioPath, setAudioPath] = useState<string>("");
  const [recordingSound, setRecordingSound] = useState<boolean>(false);
  const [remoteAudioPath, setRemoteAudioPath] = useState<string>("");

  const [note, setNote] = useState<string>("");

  const addMomentHandler = (type: string) => {
    setAddMomentModal(true);
    setAddMomentCurrentType(type);
    // if (type === "Photo") {
    // fileInputRef.current!.click();
    // }
  };

  const saveMomentMediaHandler = async () => {
    if (imagePath !== "" && addMomentCurrentType === "Photo") {
      setLoading(true);
      try {
        const remoteUrl = await savePicture(imagePath);
        setRemoteImagePath(remoteUrl);
        console.log("Remote picture saved", remoteUrl);
      } catch (error) {
        setError({
          showError: true,
          message: "Not saved. Please try again.",
        });
        return;
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (remoteImagePath !== "" || remoteAudioPath !== "") {
      saveMomentHandler();
    }
  }, [remoteImagePath, remoteAudioPath]);

  const saveMomentHandler = () => {
    getLocation().then((currentLocation) => {
      const newMoment: Moment = {
        walkId: "",
        imagePath: remoteImagePath,
        audioPath: remoteAudioPath,
        note,
        location: currentLocation,
        timestamp: new Date().toString(),
      };
      setMoments([...moments, newMoment]);
      clearMomentHandler();
    });
  };

  const clearMomentHandler = () => {
    setAddMomentModal(false);
    setNote("");
    setImagePath("");
    setAddMomentCurrentType("");
    setRemoteImagePath("");
    setRemoteAudioPath("");
  };

  const viewMapHandler = () => {};

  useEffect(() => {
    updateWalk(moments);
  }, [moments]);

  useEffect(() => {
    return () => {
      if (imagePath.startsWith("blob:")) {
        URL.revokeObjectURL(imagePath);
      }
    };
  }, [imagePath]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files?.item(0);
      const imagePath = URL.createObjectURL(file);
      setImagePath(imagePath);
    }
  };

  const handlePictureClick = async () => {
    if (!Capacitor.isPluginAvailable("Camera")) {
      fileInputRef.current!.click();
      return;
    }
    if (isPlatform("capacitor")) {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt,
          width: 600,
        });
        setImagePath(photo.webPath!);
      } catch (error) {
        console.log("Camera error:", error);
      }
    } else {
      fileInputRef.current!.click();
    }
  };

  return (
    <>
      <IonCardContent>
        <IonGrid class="constrain constrain--medium">
          <IonRow>
            <IonCol
              onClick={() => {
                addMomentHandler("Photo");
              }}
            >
              <img src="assets/img/icon-camera.svg" alt="" />
              <h3 className="text-heading ion-text-center">
                <strong>Add Photo</strong>
              </h3>
            </IonCol>
            <IonCol
              onClick={() => {
                addMomentHandler("Sound");
              }}
            >
              <img src="assets/img/icon-audio.svg" alt="" />
              <h3 className="text-heading ion-text-center">
                <strong>Add Sound</strong>
              </h3>
            </IonCol>
            <IonCol
              onClick={() => {
                addMomentHandler("Note");
              }}
            >
              <img src="assets/img/icon-note.svg" alt="" />
              <h3 className="text-heading ion-text-center">
                <strong>Add Note</strong>
              </h3>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
      <IonCardContent
        className="constrain constrain--medium"
        style={{ margin: "auto" }}
      >
        <IonModal isOpen={addMomentModal}>
          <IonCard
            color="medium"
            className="ion-no-margin"
            style={{ flex: "1", paddingTop: "30px" }}
          >
            <IonCard>
              <IonCardHeader className="ion-no-padding" color="tertiary">
                <IonCardSubtitle
                  className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
                  style={{ color: "white" }}
                >
                  Add {addMomentCurrentType}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="ion-no-padding">
                {addMomentCurrentType === "Photo" && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      hidden
                      ref={fileInputRef}
                    />
                    <img
                      src={imagePath ? imagePath : placeholderImage}
                      alt=""
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                      style={{
                        cursor: "pointer",
                        display: "block",
                      }}
                    />
                  </div>
                )}
                {addMomentCurrentType === "Sound" && <></>}
                {addMomentCurrentType === "Note" && (
                  <div>
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
                      value={note}
                      onIonChange={(event) => {
                        setNote(event.detail.value!);
                      }}
                    ></IonTextarea>
                    <p className="ion-padding">
                      <small>
                        {noteMaxLength - note.length} characters remaining
                      </small>
                    </p>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          </IonCard>

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
                    expand="block"
                    color="danger"
                    onClick={() => {
                      // To Do: Or image or audio check
                      if (note.length > 0) {
                        setCancelMomentAlert(true);
                      } else {
                        clearMomentHandler();
                      }
                    }}
                  >
                    <IonIcon slot="start" icon={cancelIcon} />
                    Cancel
                  </IonButton>
                  <IonAlert
                    header={"Cancel"}
                    subHeader={"Are you sure?"}
                    buttons={[
                      {
                        text: "No",
                        role: "cancel",
                      },
                      {
                        text: "Yes",
                        cssClass: "secondary",
                        handler: clearMomentHandler,
                      },
                    ]}
                    isOpen={cancelMomentAlert}
                    onDidDismiss={() => {
                      clearMomentHandler();
                    }}
                  />
                </IonCol>
                <IonCol size="7">
                  <IonButton
                    expand="block"
                    color="success"
                    disabled={note.length === 0 && imagePath === ""}
                    onClick={
                      addMomentCurrentType === "note"
                        ? () => {
                            saveMomentHandler();
                          }
                        : () => {
                            saveMomentMediaHandler();
                          }
                    }
                  >
                    <IonIcon slot="start" icon={finishIcon} />
                    Add {addMomentCurrentType}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardHeader>
        </IonModal>
        {moments.length > 0 ? (
          <IonGrid>
            <IonRow>
              <IonCol size="12" className="ion-text-center">
                {moments.length > 0 && (
                  <IonText className="text-body">
                    <p>
                      <IonIcon icon={flagIcon} className="icon-large" />
                    </p>
                    {moments.length} moment
                    {moments.length !== 1 && "s"}
                    <p>
                      <IonIcon icon={chevronDownIcon} className="icon-small" />
                    </p>
                  </IonText>
                )}
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol
                className="ion-no-margin ion-no-padding"
                size="12"
                sizeSm="8"
                offsetSm="2"
              >
                <IonButton expand="block" onClick={viewMapHandler}>
                  <IonIcon slot="start" icon={mapIcon} />
                  View on Map
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol size="12" className="ion-text-center">
                <IonText className="ion-margin-bottom">
                  <h1 className="text-heading">
                    What do you notice as&nbsp;you&nbsp;walk?
                  </h1>
                </IonText>
                <p
                  className="text-body"
                  style={{
                    marginTop: "10px",
                  }}
                >
                  Record anything that draws your attention, or that you see or
                  hear.
                </p>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonCardContent>
      <IonCardHeader
        className="ion-no-padding"
        color="light"
        style={{
          marginTop: "auto",
          paddingBottom: "20px",
        }}
      >
        <IonCardSubtitle className="ion-no-margin constrain constrain--medium">
          <IonGrid>
            <IonRow>
              <IonCol size="5">
                <IonButton
                  expand="block"
                  color="danger"
                  onClick={() => setCancelWalkAlert(true)}
                >
                  <IonIcon slot="start" icon={cancelIcon} />
                  Cancel
                </IonButton>
                <IonAlert
                  header={"Cancel"}
                  subHeader={"Are you sure?"}
                  buttons={[
                    {
                      text: "No",
                      role: "cancel",
                    },
                    {
                      text: "Yes",
                      cssClass: "secondary",
                      // handler: resetWalkHandler,
                    },
                  ]}
                  isOpen={cancelWalkAlert}
                  onDidDismiss={() => setCancelWalkAlert(false)}
                />
              </IonCol>
              <IonCol size="7">
                <IonButton
                  expand="block"
                  color="success"
                  onClick={() => {
                    endWalk();
                  }}
                >
                  <IonIcon slot="start" icon={finishIcon} />
                  End Walk
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardSubtitle>
      </IonCardHeader>

      <IonLoading message={"Loading..."} isOpen={loading} />
      <IonToast
        duration={2000}
        position="bottom"
        isOpen={error.showError}
        onDidDismiss={() => setError({ showError: false, message: undefined })}
        message={error.message}
      />
    </>
  );
};

export default NewWalkAddMoment;
