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
  IonModal,
  IonRow,
  IonText,
  IonTextarea,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Location, Moment, Photo } from "../data/models";

import {
  checkmark as finishIcon,
  close as cancelIcon,
  micCircleOutline as recordlIcon,
  stopCircleOutline as stopIcon,
  chevronDown as chevronDownIcon,
  flagOutline as flagIcon,
  map as mapIcon,
} from "ionicons/icons";

const noteMaxLength = 280;

const NewWalkAddMoment: React.FC<{
  updateWalk: (moments: Moment[]) => void;
  endWalk: () => void;
  getLocation: () => Promise<Location | null>;
}> = ({ endWalk, updateWalk, getLocation }) => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [cancelWalkAlert, setCancelWalkAlert] = useState(false);

  const [addMomentModal, setAddMomentModal] = useState<boolean>(false);
  const [addMomentCurrentType, setAddMomentCurrentType] = useState<string>("");
  const [cancelMomentAlert, setCancelMomentAlert] = useState(false);

  const [takenPhoto, setTakenPhoto] = useState<Photo | null>(null);
  const [takenPhotoPath, setTakenPhotoPath] = useState<string>("");
  const [recordingSound, setRecordingSound] = useState<boolean>(false);
  const [takenSoundPath, setTakenSoundPath] = useState<string>("");
  const [audio, setSound] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const addMomentHandler = (type: string) => {
    setAddMomentModal(true);
    setAddMomentCurrentType(type);
    // getLocation(false);
    // if (type === "Photo") {
    //   (filePickerChildRef as any).current.openFilePicker();
    // }
  };

  const saveMomentHandler = () => {
    getLocation().then((currentLocation) => {
      const newMoment: Moment = {
        walkId: "",
        imagePath: takenPhotoPath,
        audioPath: takenSoundPath,
        note: note,
        location: currentLocation,
        timestamp: new Date().toString(),
      };
      setMoments([...moments, newMoment]);
      clearMomentHandler();
    });
  };

  const clearMomentHandler = () => {
    setAddMomentModal(false);
    // (filePickerChildRef as any).current!.imageResetHandler();
    setNote("");
  };

  const viewMapHandler = () => {};

  useEffect(() => {
    updateWalk(moments);
  }, [moments]);

  return (
    <>
      <IonCardContent
        className="ion-no-padding constrain constrain--medium"
        style={{ margin: "auto" }}
      >
        <IonGrid>
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

        <IonModal isOpen={addMomentModal}>
          <IonCard
            color="medium"
            className="ion-no-margin"
            style={{ flex: "1" }}
          >
            <IonCardHeader className="ion-no-padding" color="tertiary">
              <IonCardSubtitle
                className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
                color="dark"
              >
                Add {addMomentCurrentType}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent className="ion-no-padding">
              {addMomentCurrentType === "Photo" && <></>}
              {addMomentCurrentType === "Sound" && <></>}
              {addMomentCurrentType === "Note" && (
                <div>
                  <IonLabel hidden={true}>Add a note...</IonLabel>
                  <IonTextarea
                    placeholder="A thought or description..."
                    maxlength={noteMaxLength}
                    rows={8}
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

          <IonCardHeader className="ion-no-padding" color="light">
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
                    disabled={note.length === 0}
                    onClick={() => {
                      saveMomentHandler();
                    }}
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
    </>
  );
};

export default NewWalkAddMoment;
