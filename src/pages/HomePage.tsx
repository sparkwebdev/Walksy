import { IonPage, IonContent, IonButton } from "@ionic/react";
import React from "react";
import PageHeader from "../components/PageHeader";
import { auth } from "../firebase";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Welcome" />
      <IonContent>
        <div className="constrain constrain--wide ion-padding ion-text-center">
          <IonButton
            className="ion-margin"
            color="tertiary"
            onClick={() => auth.signOut()}
          >
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
