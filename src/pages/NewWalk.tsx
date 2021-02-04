import React, { useState, useContext } from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useHistory } from "react-router-dom";

import WalksContext, { WalkType } from "../data/walks-context";
import ImagePicker, { Photo } from "../components/ImagePicker";
import Progress from "../components/Progress";
import { Pedometer } from "@ionic-native/pedometer";
import { getFriendlyTimeOfDay, getFriendlyWalkDescriptor } from "../helpers";

const NewWalk: React.FC = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [walkTitle, setWalkTitle] = useState(
    `${getFriendlyTimeOfDay()} ${getFriendlyWalkDescriptor()}`
  );

  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [takenPhoto, setTakenPhoto] = useState<Photo>();
  const [chosenWalkType, setChosenWalkType] = useState<WalkType>("user");

  const walksCtx = useContext(WalksContext);

  const history = useHistory();

  const photoPickHandler = (photo: Photo) => {
    setTakenPhoto(photo);
  };

  const selectWalkTypeHandler = (event: CustomEvent) => {
    const selectedWalkType = event.detail.value;
    setChosenWalkType(selectedWalkType);
  };

  const startWalkHandler = () => {
    setIsWalking(true);
    setStartTime(new Date().toISOString());

    Pedometer.startPedometerUpdates().subscribe((data) => {
      setSteps(data.numberOfSteps);
      setDistance(data.distance / 1000); // metres to km
    });
  };

  const endWalkHandler = () => {
    setIsWalking(false);
    setEndTime(new Date().toISOString());
    Pedometer.stopPedometerUpdates();

    if (!walkTitle || !takenPhoto || !chosenWalkType) {
      return;
    }

    walksCtx.addWalk(takenPhoto, walkTitle, chosenWalkType);
    history.length > 0 ? history.goBack() : history.replace("/user-walks");
  };

  return (
    <IonPage>
      <IonContent>
        {!isWalking ? (
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-center">
                <h2>What do you notice as you walk?</h2>
                <p>
                  The app will record your journey as you walk. Please stop
                  anytime to record anything that draws your attention, or that
                  you see or hear. These will act as markers to guide others
                  along the route. This might be the taking of a photo, the
                  recording of a sound, or something written. Notes can be added
                  such as an observation, a direction about a turn to take, or
                  anything else that marks a particular spot on your route. You
                  can edit once you’ve finished the walk before then finally
                  uploading to the app.
                </p>
                <IonSelect
                  onIonChange={selectWalkTypeHandler}
                  value={chosenWalkType}
                >
                  <IonSelectOption value="user">User Walk</IonSelectOption>
                  <IonSelectOption value="guided">Guided Walk</IonSelectOption>
                </IonSelect>
                <IonItem>
                  <IonLabel position="floating">
                    Give this walk a title...
                  </IonLabel>
                  <IonInput
                    type="text"
                    value={walkTitle}
                    onIonChange={(event) => setWalkTitle(event.detail!.value!)}
                  ></IonInput>
                </IonItem>
                <IonButton
                  className="ion-margin-top"
                  disabled={walkTitle === ""}
                  onClick={() => startWalkHandler()}
                >
                  Start Walk
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          <IonGrid>
            <Progress distance={distance} steps={steps} />
            Start: {startTime}
            End: {endTime}
            <IonRow>
              <IonCol>
                <IonSelect
                  onIonChange={selectWalkTypeHandler}
                  value={chosenWalkType}
                >
                  <IonSelectOption value="user">User Walk</IonSelectOption>
                  <IonSelectOption value="guided">Guided Walk</IonSelectOption>
                </IonSelect>
              </IonCol>
            </IonRow>
            <IonRow className="ion-text-center">
              <IonCol>
                <ImagePicker onImagePick={photoPickHandler} />
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-top">
              <IonCol className="ion-text-center">
                <IonButton onClick={endWalkHandler}>End Walk</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default NewWalk;
