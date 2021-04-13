import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
} from "@ionic/react";
import React from "react";
import PageHeader from "../components/PageHeader";

const NotFound: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Not found" back={true} />
      <IonContent className="ion-padding">
        <IonCard className="ion-text-center">
          <IonCardHeader className="ion-no-padding" color="dark">
            <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase">
              Not found.
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="ion-padding">
              <h2>Sorry, we couldn't find anything at this location.</h2>
              <IonButton className="ion-margin-top" routerLink="/app/home">
                Back to Home
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
