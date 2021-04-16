import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { checkUniqueDisplayName } from "../firebase";
import { generateHslaColors } from "../helpers";

const CompleteProfile: React.FC<{
  firstName: string;
  lastName: string;
  userId: string;
  onSubmit: (displayName: string, age: string, location: string) => void;
}> = (props) => {
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });
  const [displayName, setDisplayName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const generateDisplayName = (firstName: string, lastName: string) => {
    const tryName = `${firstName} ${lastName}`
      .toLowerCase()
      .replace(" ", "_")
      .replace(/\W/g, "");
    const generatedDisplayName = checkUniqueDisplayName(tryName).then(
      (isUnique) => {
        if (isUnique) {
          return tryName;
        } else {
          const newDisplayName = generatePseudoRandomDisplayName(tryName);
          return newDisplayName;
        }
      }
    );
    return generatedDisplayName;
  };

  const generatePseudoRandomDisplayName = (displayName: string) => {
    return displayName + "_" + Math.floor(Math.random() * 900 + 100);
  };

  useEffect(() => {
    if (props.userId) {
      generateDisplayName(props.firstName, props.lastName).then(
        (suggestedDisplayName) => {
          setDisplayName(suggestedDisplayName);
        }
      );
    }
  }, [props.userId]);

  const submitHandler = async () => {
    setStatus({
      ...status,
      loading: true,
    });
    const isUniqueDisplayName = await checkUniqueDisplayName(displayName);
    if (!isUniqueDisplayName) {
      return setStatus({
        loading: false,
        error: true,
        errorMessage: "Sorry that username is already taken.",
      });
    } else if (!displayName) {
      return setStatus({
        loading: false,
        error: true,
        errorMessage: "Please enter a display name.",
      });
    }
    setStatus({
      loading: false,
      error: false,
      errorMessage: "",
    });
    props.onSubmit(displayName, location, age);
  };

  return (
    <IonCard>
      <IonCardHeader className="ion-no-padding" color="dark">
        <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
          Your details
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent className="ion-no-padding">
        <IonCardHeader>
          <IonCardTitle style={{ fontSize: "1.4em", marginBottom: "5px" }}>
            Welcome, {props.firstName}.
          </IonCardTitle>
          <IonText>
            Before we begin, please choose a display name and tell us about
            yourself.
          </IonText>
        </IonCardHeader>
        <IonList>
          <IonItem>
            <IonLabel position="stacked">
              <small>Display Name</small>
            </IonLabel>
            <IonInput
              type="text"
              value={displayName}
              onIonChange={(event) => setDisplayName(event.detail!.value!)}
              onIonFocus={() =>
                setStatus({ ...status, error: false, errorMessage: "" })
              }
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              <small>Age (optional)</small>
            </IonLabel>
            <IonSelect
              onIonChange={(event) => setAge(event.detail!.value!)}
              value={age}
              onIonFocus={() =>
                setStatus({ ...status, error: false, errorMessage: "" })
              }
            >
              <IonSelectOption value="under-11">Under 11</IonSelectOption>
              <IonSelectOption value="11-to-18">11 to 18</IonSelectOption>
              <IonSelectOption value="19-to-29">19 to 29</IonSelectOption>
              <IonSelectOption value="30-to-44">30 to 44</IonSelectOption>
              <IonSelectOption value="45-to-60">45 to 60</IonSelectOption>
              <IonSelectOption value="61-to-75">61 to 75</IonSelectOption>
              <IonSelectOption value="76-plus">76 plus</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              <small>Location (optional)</small>
            </IonLabel>
            <IonInput
              type="text"
              value={location}
              onIonChange={(event) => setLocation(event.detail!.value!)}
              onIonFocus={() =>
                setStatus({ ...status, error: false, errorMessage: "" })
              }
            />
          </IonItem>
        </IonList>
        {status.error && (
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin ion-align-items-center">
              <IonCol size="12">
                <IonBadge color="danger">Error</IonBadge>&nbsp;
                <IonText color="danger">
                  <small>{status.errorMessage}</small>
                </IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
        <IonButton
          className="ion-margin"
          expand="block"
          onClick={submitHandler}
        >
          Continue
        </IonButton>
      </IonCardContent>
      <IonLoading isOpen={status.loading} />
    </IonCard>
  );
};

export default CompleteProfile;
