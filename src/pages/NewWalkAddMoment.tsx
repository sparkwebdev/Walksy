import {
  IonButton,
  IonCardContent,
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
      </IonCardContent>
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
