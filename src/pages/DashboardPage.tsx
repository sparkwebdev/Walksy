import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";

const DashboardPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Dashboard" />
      <IonContent></IonContent>
    </IonPage>
  );
};

export default DashboardPage;
