import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";

const AboutPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="About" />
      <IonContent></IonContent>
    </IonPage>
  );
};

export default AboutPage;
