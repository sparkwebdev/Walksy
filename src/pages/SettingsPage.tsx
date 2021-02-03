import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";

const SettingsPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Settings" />
      <IonContent></IonContent>
    </IonPage>
  );
};

export default SettingsPage;
