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
} from "@ionic/react";
import React, { useState, useRef, useContext, useEffect } from "react";
import ImagePicker from "../components/ImagePicker";
import { Photo } from "../data/models";

import WalksContext from "../data/walks-context";

import { Plugins } from "@capacitor/core";

import { Location } from "../data/models";

import {
  checkmark as finishIcon,
  close as cancelIcon,
  chevronDown as chevronDownIcon,
  flagOutline as flagIcon,
  map as mapIcon,
} from "ionicons/icons";

const { Geolocation } = Plugins;

const AddMoment: React.FC<{
  colour: string;
}> = (props) => {
  const [addMomentModal, setAddMomentModal] = useState<boolean>(false);
  const [addMomentCurrent, setAddMomentCurrent] = useState<string>("");
  const [timestamp, setTimestamp] = useState<string>("");
  const [location, setLocation] = useState<Location | null | undefined>(
    undefined
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [cancelAlert, setCancelAlert] = useState(false);

  const [note, setNote] = useState<string>("");
  const [takenPhoto, setTakenPhoto] = useState<Photo | null>(null);

  const filePickerChildRef = useRef();
  const walksCtx = useContext(WalksContext);
  const moments = walksCtx.moments;

  const addMomentHandler = (type: string) => {
    setAddMomentModal(true);
    setAddMomentCurrent(type);
  };

  const photoPickHandler = (photo: Photo | null) => {
    setTakenPhoto(photo);
  };

  const getLocation = async () => {
    setLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      const currentLocation: Location = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        timestamp: position.timestamp,
      };
      setLoading(false);
      setLocation(currentLocation);
    } catch (e) {
      setLoading(false);
      setLocation(null);
    }
  };

  const viewMapHandler = async () => {
    console.log("View map");
  };

  const saveMomentHandler = () => {
    getLocation();
  };

  useEffect(() => {
    if (location !== undefined) {
      setTimestamp(new Date().toString());
    }
  }, [location]);

  useEffect(() => {
    if (timestamp) {
      walksCtx.addMoment(takenPhoto, note, location!);
      clearMomentHandler();
    }
    setLocation(undefined);
  }, [timestamp]);

  const clearMomentHandler = () => {
    setTimestamp("");
    setNote("");
    setTakenPhoto(null);
    setAddMomentModal(false);
  };

  return (
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
          <div className="constrain constrain--medium">
            <IonCard color="medium">
              <IonCardHeader
                className="ion-no-padding"
                style={{
                  backgroundColor: props.colour,
                }}
              >
                <IonCardSubtitle
                  className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
                  color="dark"
                >
                  Add {addMomentCurrent}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="ion-no-padding">
                {addMomentCurrent === "Photo" && (
                  <ImagePicker
                    onImagePick={photoPickHandler}
                    ref={filePickerChildRef}
                  ></ImagePicker>
                )}
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
                      <small>{280 - note.length} characters remaining</small>
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
                            handler: clearMomentHandler,
                          },
                        ]}
                        isOpen={cancelAlert}
                        onDidDismiss={() => setCancelAlert(false)}
                      />
                    </IonCol>
                    <IonCol size="7">
                      <IonButton
                        expand="block"
                        color="success"
                        onClick={() => {
                          saveMomentHandler();
                        }}
                      >
                        <IonIcon slot="start" icon={finishIcon} />
                        Add {addMomentCurrent}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardHeader>
            </IonCard>
          </div>
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
      <IonLoading message={"Getting your location..."} isOpen={loading} />
    </IonCard>
  );
};

export default AddMoment;
