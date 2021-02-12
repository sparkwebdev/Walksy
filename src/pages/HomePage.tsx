import { IonPage, IonContent, IonList, IonItem } from "@ionic/react";
import React from "react";
import PageHeader from "../components/PageHeader";
import WalksList from "../components/WalksList";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Home" />
      <IonContent>
        <IonList>
          <WalksList title="User Walks" type="user" />
          <WalksList title="Guided Walks" type="guided" />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
