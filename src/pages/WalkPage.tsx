import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";

const WalkPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Walk" />
      <IonContent></IonContent>
    </IonPage>
  );
};

export default WalkPage;
