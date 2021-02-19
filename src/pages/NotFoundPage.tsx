import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonText,
} from "@ionic/react";
import React from "react";
import PageHeader from "../components/PageHeader";

const NotFound: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Not found" back={true} />
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader className="ion-no-padding" color="tertiary">
            <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
              Not found.
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              <br />
              Sorry, we couldn't find anything at this location.
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
