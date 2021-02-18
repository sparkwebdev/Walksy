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
  IonModal,
  IonRow,
  IonText,
  IonTextarea,
  IonTitle,
} from "@ionic/react";
import React, { useState } from "react";

import {
  checkmark as finishIcon,
  close as cancelIcon,
  map as mapIcon,
} from "ionicons/icons";

const AddMoment: React.FC<{
  colour: string;
}> = (props) => {
  const [moments, setMoments] = useState<[]>([]);
  const [addMomentModal, setAddMomentModal] = useState<boolean>(false);
  const [addMomentCurrent, setAddMomentCurrent] = useState<string>("");
  const [cancelAlert, setCancelAlert] = useState(false);

  const [note, setNote] = useState<string>("");

  const addMomentHandler = (type: string) => {
    setAddMomentModal(true);
    setAddMomentCurrent(type);
    switch (type) {
      case "Photo":
        addPhotoHandler();
        break;
      case "Audio":
        addAudioHandler();
        break;
      case "Note":
        addNoteHandler();
        break;
    }
  };

  const addPhotoHandler = () => {
    console.log("add photo");
  };
  const addAudioHandler = () => {
    console.log("add audio");
  };
  const addNoteHandler = () => {
    console.log("add note");
  };

  const viewMapHandler = async () => {
    console.log("View map");
  };

  const clearMomentHandler = () => {
    setNote("");
  };
  const cancelMomentHandler = async () => {
    setAddMomentModal(false);
    clearMomentHandler();
  };

  return (
    <React.Fragment>
      <IonCard className="moment-panel ion-no-margin">
        <IonCardContent>
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
                  addMomentHandler("Audio");
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
            <div className="centered-content">
              <div className="constrain constrain--medium">
                <IonCard color="medium">
                  <IonCardHeader
                    className="ion-no-padding"
                    style={{
                      backgroundColor: props.colour,
                    }}
                  >
                    <IonCardSubtitle
                      className="ion-padding ion-no-margin ion-text-uppercase"
                      color="dark"
                    >
                      Add {addMomentCurrent}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent className="ion-no-padding">
                    {addMomentCurrent === "Photo" && <p>Add photo</p>}
                    {addMomentCurrent === "Audio" && (
                      <IonItem>
                        <IonLabel position="floating">Add a sound...</IonLabel>
                      </IonItem>
                    )}
                    {addMomentCurrent === "Note" && (
                      <div>
                        <IonLabel hidden={true}>Add a note...</IonLabel>
                        <IonTextarea
                          placeholder="A thought or description..."
                          autoGrow={true}
                          maxlength={280}
                          rows={4}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "white",
                          }}
                          value={note}
                          onIonChange={(event) => {
                            setNote(event.detail.value!);
                          }}
                        ></IonTextarea>
                        <p className="ion-padding">
                          <small>
                            {280 - note.length} characters remaining
                          </small>
                        </p>
                      </div>
                    )}
                  </IonCardContent>

                  <IonCardHeader className="ion-no-padding" color="light">
                    <IonGrid>
                      <IonRow>
                        <IonCol size="5">
                          <IonButton
                            expand="block"
                            color="danger"
                            onClick={() => {
                              if (note.length > 0) {
                                setCancelAlert(true);
                              } else {
                                setAddMomentModal(false);
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
                                handler: cancelMomentHandler,
                              },
                            ]}
                            isOpen={cancelAlert}
                            onDidDismiss={() => setCancelAlert(false)}
                          />
                        </IonCol>
                        <IonCol size="7">
                          <IonButton expand="block" color="success">
                            <IonIcon slot="start" icon={finishIcon} />
                            Add {addMomentCurrent}
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardHeader>
                </IonCard>
              </div>
            </div>
          </IonModal>

          {moments.length < 0 ? (
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  {moments.length > 0 && (
                    <IonTitle>You have added {moments.length} moment</IonTitle>
                  )}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12" sizeSm="8" offsetSm="2">
                  <IonButton
                    expand="block"
                    class="ion-margin-top ion-margin-bottom"
                    color="secondary"
                    onClick={viewMapHandler}
                  >
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
                    Record anything that draws your attention, or that you see
                    or hear.
                  </p>
                </IonCol>
              </IonRow>
            </IonGrid>
          )}
        </IonCardContent>
      </IonCard>
    </React.Fragment>
  );
};

export default AddMoment;
