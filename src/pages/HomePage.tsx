import { IonPage, IonContent, IonList } from "@ionic/react";
import React from "react";
import PageHeader from "../components/PageHeader";
import WalksList from "../components/WalksList";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Home" />
      <IonContent>
        <WalksList title="" type="user" />
        <WalksList title="Guided Walks" type="guided" />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
