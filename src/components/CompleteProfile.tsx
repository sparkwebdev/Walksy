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
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { checkUniqueDisplayName } from "../firebase";
import { generateHslaColors } from "../helpers";

const randomColour = generateHslaColors(
  1,
  undefined,
  undefined,
  true
)[0].replace("#", "");

const CompleteProfile: React.FC<{
  firstName: string;
  lastName: string;
  userId: string;
  onSubmit: (
    displayName: string,
    age: string,
    location: string,
    profilePic: string
  ) => void;
}> = (props) => {
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    errorMessage: "",
  });
  const [displayName, setDisplayName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [generatedProfileImage, setGeneratedProfileImage] = useState<string>(
    ""
  );

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
          setGeneratedProfileImage(
            `https://eu.ui-avatars.com/api/?name=${props.firstName}+${props.lastName}&background=${randomColour}&color=000`
          );
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
    props.onSubmit(displayName, location, age, generatedProfileImage);
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
            <IonInput
              type="number"
              min="1"
              max="135"
              value={age?.toString()}
              onIonChange={(event) => setAge(event.detail!.value!)}
              onIonFocus={() =>
                setStatus({ ...status, error: false, errorMessage: "" })
              }
            />
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
