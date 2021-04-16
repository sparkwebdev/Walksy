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
  IonLabel,
  IonLoading,
  IonRow,
  IonTextarea,
  IonToast,
  isPlatform,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { checkmark as finishIcon, close as cancelIcon } from "ionicons/icons";
import { storeFilehandler as savePicture } from "../firebase";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Capacitor,
} from "@capacitor/core";

const noteMaxLength = 280;
const placeholderImage = "assets/img/placeholder.png";

const NewWalkAddMomentModal: React.FC<{
  updateMoment: (imagePath: string, audioPath: string, note: string) => void;
  cancelMoment: () => void;
  type: string;
}> = ({ updateMoment, cancelMoment, type }) => {
  // Global (View) states
  const [loading, setLoading] = useState<boolean>(false);
  const [cancelMomentAlert, setCancelMomentAlert] = useState(false);
  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  // const [takenPhoto, setTakenPhoto] = useState<Photo | null>(null);
  const [imagePath, setImagePath] = useState<string>(""); // takenPhotoPath, setTakenPhotoPath
  const [remoteImagePath, setRemoteImagePath] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [audioPath, setAudioPath] = useState<string>("");
  // const [recordingSound, setRecordingSound] = useState<boolean>(false);
  const [remoteAudioPath, setRemoteAudioPath] = useState<string>("");

  const [note, setNote] = useState<string>("");

  const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files?.item(0);
      const imagePath = URL.createObjectURL(file);
      setImagePath(imagePath);
    }
  };

  const pictureClickHandler = async () => {
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
        if (photo.webPath) {
          setImagePath(photo.webPath);
        }
      } catch (error) {
        console.log("Camera error:", error);
      }
    } else {
      fileInputRef.current!.click();
    }
  };

  const cancelMomentHandler = () => {
    // To Do: Or image or audio check
    // if (note.length > 0) {
    //   setCancelMomentAlert(true);
    // } else {
    setNote("");
    setImagePath("");
    setRemoteImagePath("");
    setAudioPath("");
    setRemoteAudioPath("");
    cancelMoment();
    // }
  };

  const saveMomentMediaHandler = async () => {
    if (imagePath !== "" && type === "Photo") {
      setLoading(true);
      try {
        const remoteUrl = await savePicture(imagePath);
        setRemoteImagePath(remoteUrl);
      } catch (error) {
        setError({
          showError: true,
          message: "Not saved. Please try again.",
        });
      }
      setLoading(false);
    }
  };

  const saveMomentHandler = () => {
    updateMoment(remoteImagePath, remoteAudioPath, note);
  };

  useEffect(() => {
    if (remoteImagePath !== "" || remoteAudioPath !== "") {
      saveMomentHandler();
    }
  }, [remoteImagePath, remoteAudioPath]);

  useEffect(() => {
    return () => {
      if (imagePath.startsWith("blob:")) {
        URL.revokeObjectURL(imagePath);
      }
    };
  }, [imagePath]);

  return (
    <>
      <IonCard
        color="medium"
        className="ion-no-margin"
        style={{ flex: "1", paddingTop: "30px" }}
      >
        <IonCard>
          <IonCardHeader className="ion-no-padding" color="dark">
            <IonCardSubtitle
              className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
              style={{ color: "white" }}
            >
              Add {type}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent className="ion-no-padding">
            {type === "Photo" && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={fileChangeHandler}
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
              </>
            )}
            {type === "Sound" && <></>}
            {type === "Note" && (
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
                onClick={cancelMomentHandler}
              >
                <IonIcon slot="start" icon={cancelIcon} />
                Cancel
              </IonButton>
            </IonCol>
            <IonCol size="7">
              <IonButton
                expand="block"
                color="success"
                disabled={note.length === 0 && imagePath === ""}
                onClick={
                  type === "Photo" || "Audio"
                    ? () => {
                        saveMomentMediaHandler();
                      }
                    : () => {
                        saveMomentHandler();
                      }
                }
              >
                <IonIcon slot="start" icon={finishIcon} />
                Add {type}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
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
            handler: cancelMomentHandler,
          },
        ]}
        isOpen={cancelMomentAlert}
        onDidDismiss={() => {
          setCancelMomentAlert(false);
        }}
        backdropDismiss={false}
      />
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

export default NewWalkAddMomentModal;
