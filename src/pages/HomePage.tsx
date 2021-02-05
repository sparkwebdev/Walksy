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
          <IonItem routerLink="/intro">Intro</IonItem>
          <IonItem routerLink="/login">Login</IonItem>
          <IonItem routerLink="/register">Register</IonItem>
          <WalksList title="User Walks" type="user" />
          <WalksList title="Guided Walks" type="guided" />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
