import {
  IonAlert,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Location, Moment } from "../data/models";
import NewWalkAddMomentModal from "./NewWalkAddMomentModal";

import {
  checkmark as finishIcon,
  close as cancelIcon,
  chevronDown as chevronDownIcon,
  flagOutline as flagIcon,
  map as mapIcon,
} from "ionicons/icons";

const NewWalkAddMoment: React.FC<{
  updateWalk: (moments: Moment[]) => void;
  resetWalk: () => void;
  endWalk: () => void;
  getLocation: () => Promise<Location | null>;
}> = ({ updateWalk, endWalk, resetWalk, getLocation }) => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [cancelWalkAlert, setCancelWalkAlert] = useState(false);

  const [addMomentModal, setAddMomentModal] = useState<boolean>(false);
  const [addMomentCurrentType, setAddMomentCurrentType] = useState<string>("");

  const [imagePath, setImagePath] = useState<string>(""); // takenPhotoPath, setTakenPhotoPath
  const [audioPath, setAudioPath] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const addMomentHandler = (type: string) => {
    setAddMomentCurrentType(type);
    setAddMomentModal(true);
  };

  const setMomentHandler = () => {
    getLocation().then((currentLocation) => {
      const newMoment: Moment = {
        walkId: "",
        imagePath,
        audioPath,
        note,
        location: currentLocation,
        timestamp: new Date().toISOString(),
      };
      setMoments([...moments, newMoment]);
    });
  };

  const clearMomentHandler = () => {
    setAddMomentModal(false);
    setAddMomentCurrentType("");
  };

  const viewMapHandler = () => {};

  const updateMomentImageAudioNote = (
    imagePath: string,
    audioPath: string,
    note: string
  ) => {
    setImagePath(imagePath);
    setAudioPath(audioPath);
    setNote(note);
  };

  useEffect(() => {
    if (imagePath !== "" || audioPath !== "" || note !== "") {
      setMomentHandler();
    }
  }, [imagePath, audioPath, note, setMomentHandler]);

  useEffect(() => {
    updateWalk(moments);
    // clearMomentHandler();
  }, [moments]);

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
                      handler: resetWalk,
                    },
                  ]}
                  isOpen={cancelWalkAlert}
                  onDidDismiss={() => setCancelWalkAlert(false)}
                />
              </IonCol>
              <IonCol size="7">
                <IonButton expand="block" color="success" onClick={endWalk}>
                  <IonIcon slot="start" icon={finishIcon} />
                  End Walk
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonModal isOpen={addMomentModal}>
        <NewWalkAddMomentModal
          updateMoment={(imagePath: string, audioPath: string, note: string) =>
            updateMomentImageAudioNote(imagePath, audioPath, note)
          }
          cancelMoment={() => clearMomentHandler()}
          type={addMomentCurrentType}
        />
      </IonModal>
    </>
  );
};

export default NewWalkAddMoment;
