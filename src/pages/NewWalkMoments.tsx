import {
  IonButton,
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
} from "@ionic/react";
import React, { useContext, useRef } from "react";
import { Location } from "../data/models";
import WalksContext from "../data/walks-context";
import NewWalkMomentsOutput from "../components/NewWalkMomentsOutput";
import { checkmark as finishIcon, close as cancelIcon } from "ionicons/icons";

const NewWalkMoments: React.FC<{
  walkId: string;
  momentType: string;
  resetMomentType: () => void;
  getLocation: () => Promise<Location | null>;
}> = ({ walkId, momentType, resetMomentType, getLocation }) => {
  const walksCtx = useContext(WalksContext);

  const imagePathRef = useRef<HTMLIonInputElement>(null);
  const audioPathRef = useRef<HTMLIonInputElement>(null);
  const noteRef = useRef<HTMLIonInputElement>(null);

  const addMomentHandler = () => {
    const enteredImagePath = imagePathRef.current?.value || "";
    const enteredAudioPath = audioPathRef.current?.value || "";
    const enteredNote = noteRef.current?.value || "";
    if (
      enteredImagePath.toString().trim().length === 0 &&
      enteredAudioPath.toString().trim().length === 0 &&
      enteredNote.toString().trim().length === 0
    ) {
      return;
    }
    getLocation().then((currentLocation) => {
      walksCtx.addMoment(
        walkId,
        enteredImagePath!.toString(),
        enteredAudioPath!.toString(),
        enteredNote!.toString(),
        currentLocation,
        new Date().toISOString()
      );
    });
    resetMomentType();
  };

  return (
    <IonCardContent
      className="constrain constrain--medium"
      style={{ margin: "auto" }}
    >
      <NewWalkMomentsOutput />

      <IonModal isOpen={momentType !== ""} onDidDismiss={resetMomentType}>
        {momentType !== "" && (
          <>
            <IonGrid>
              {momentType === "Photo" && (
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="floating">Moment Image Path</IonLabel>
                      <IonInput type="text" ref={imagePathRef}></IonInput>
                    </IonItem>
                  </IonCol>
                </IonRow>
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
              {momentType === "Note" && (
                <IonRow>
                  <IonCol>
                    <IonItem>
                      <IonLabel position="floating">Moment Note</IonLabel>
                      <IonInput type="text" ref={noteRef}></IonInput>
                    </IonItem>
                  </IonCol>
                </IonRow>
              )}
            </IonGrid>
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
                      onClick={resetMomentType}
                    >
                      <IonIcon slot="start" icon={cancelIcon} />
                      Cancel
                    </IonButton>
                  </IonCol>
                  <IonCol size="7">
                    <IonButton
                      expand="block"
                      color="success"
                      onClick={addMomentHandler}
                    >
                      <IonIcon slot="start" icon={finishIcon} />
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
