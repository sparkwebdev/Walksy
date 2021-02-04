import React, { useState, useRef, useContext } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
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

const NewWalk: React.FC = () => {
  const [takenPhoto, setTakenPhoto] = useState<Photo>();
  const [chosenWalkType, setChosenWalkType] = useState<WalkType>("user");

  const walksCtx = useContext(WalksContext);

  const titleRef = useRef<HTMLIonInputElement>(null);

  const history = useHistory();

  const photoPickHandler = (photo: Photo) => {
    setTakenPhoto(photo);
  };

  const selectWalkTypeHandler = (event: CustomEvent) => {
    const selectedWalkType = event.detail.value;
    setChosenWalkType(selectedWalkType);
  };

  const addWalkHandler = async () => {
    const enteredTitle = titleRef.current?.value;

    if (
      !enteredTitle ||
      enteredTitle.toString().trim().length === 0 ||
      !takenPhoto ||
      !chosenWalkType
    ) {
      return;
    }

    walksCtx.addWalk(takenPhoto, enteredTitle.toString(), chosenWalkType);
    history.length > 0 ? history.goBack() : history.replace("/user-walks");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/user-walks" />
          </IonButtons>
          <IonTitle>Add New Walk</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Walk Title</IonLabel>
                <IonInput type="text" ref={titleRef}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
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
              <IonButton onClick={addWalkHandler}>Add Walk</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default NewWalk;
