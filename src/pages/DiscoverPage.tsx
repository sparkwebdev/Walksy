import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";

const DiscoverPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Discover" />
      <IonContent></IonContent>
    </IonPage>
  );
};

export default DiscoverPage;
