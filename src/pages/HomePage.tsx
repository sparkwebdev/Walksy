import { IonPage, IonContent, IonList, IonItem } from "@ionic/react";
import React from "react";
import PageHeader from "../components/PageHeader";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Home" />
      <IonContent>
        <IonList>
          <IonItem routerLink="/intro">Intro</IonItem>
          <IonItem routerLink="/login">Login</IonItem>
          <IonItem routerLink="/register">Register</IonItem>
          <IonItem routerLink="/good-memories">Good Memories</IonItem>
          <IonItem routerLink="/bad-memories">Bad Memories</IonItem>
          <IonItem routerLink="/new-memory">New Memory</IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
