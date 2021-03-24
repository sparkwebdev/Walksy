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
import React, { useContext, useRef, useState } from "react";
import { Location } from "../data/models";
import WalksContext from "../data/walks-context";
import NewWalkMomentsOutput from "../components/NewWalkMomentsOutput";
import { close as cancelIcon, add as addIcon } from "ionicons/icons";

const noteMaxLength = 280;

const NewWalkMoments: React.FC<{
  walkId: string;
  momentType: string;
  resetMomentType: () => void;
  getLocation: () => Promise<Location | null>;
}> = ({ walkId, momentType, resetMomentType, getLocation }) => {
  const walksCtx = useContext(WalksContext);

  const imagePathRef = useRef<HTMLIonInputElement>(null);
  const audioPathRef = useRef<HTMLIonInputElement>(null);
  const noteRef = useRef<HTMLIonTextareaElement>(null);
  const [note, setNote] = useState<string>("");

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

      <IonModal
        isOpen={momentType !== ""}
        onDidDismiss={resetMomentType}
        cssClass="add-moment-modal"
        onDidPresent={() => {
          if (momentType === "Note") {
            noteRef.current!.setFocus();
          }
        }}
      >
        {momentType !== "" && (
          <>
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
              <IonCard style={{ marginTop: "auto" }}>
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
                      disabled={
                        note.length < 1 || note.toString().trim().length < 1
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
