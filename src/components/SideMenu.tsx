import {
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonMenu,
  IonMenuToggle,
} from "@ionic/react";
import React from "react";
import {
  person as profileIcon,
  informationCircleOutline as aboutIcon,
  newspaperOutline as newsIcon,
} from "ionicons/icons";

const SideMenu: React.FC = () => {
  return (
    <IonMenu contentId="main" side="end">
      <div
        className="ion-padding"
        style={{
          background: "#f0e6d5",
        }}
      >
        <img
          className="logo"
          src="assets/img/walksy-logo-2.svg"
          alt=""
          style={{
            marginTop: "50px",
            maxHeight: "80px",
          }}
        />
      </div>
      <p
        style={{
          margin: "0",
          padding: "16px 20px",
          background: "#777269",
          color: "#fff",
        }}
      >
        <strong>Menu</strong>
      </p>
      <IonContent>
        <IonList color="dark">
          <IonMenuToggle>
            <IonItem button routerLink="/app/settings">
              <IonIcon icon={profileIcon} slot="start" size="small" />
              Profile &amp; Settings
            </IonItem>
            <IonItem button routerLink="/app/latest-news">
              <IonIcon icon={newsIcon} slot="start" size="small" />
              Latest ArtWalk news
            </IonItem>
            <IonItem button routerLink="/app/about">
              <IonIcon icon={aboutIcon} slot="start" size="small" />
              About this App
            </IonItem>
            <IonItem button routerLink="/app/welcome">
              <IonIcon icon={aboutIcon} slot="start" size="small" />
              View Welcome screens
            </IonItem>
            <IonItem button routerLink="/app/privacy">
              <IonIcon icon={aboutIcon} slot="start" size="small" />
              Privacy Policy
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
