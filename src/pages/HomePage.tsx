import { IonPage, IonContent } from "@ionic/react";
import React from "react";
import PageHeader from "../components/PageHeader";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Home" />
      <IonContent></IonContent>
    </IonPage>
  );
};

export default HomePage;
