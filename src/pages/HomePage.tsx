import { IonPage, IonContent, IonList, IonItem } from "@ionic/react";
import React from "react";
import PageHeader from "../components/PageHeader";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Home" />
      <IonContent>
        <IonList>
          <IonItem routerLink="/"></IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
