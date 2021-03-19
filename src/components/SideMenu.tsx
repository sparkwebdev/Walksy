import {
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonText,
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
          src="assets/img/walksy-logo.svg"
          alt=""
          style={{
            maxHeight: "80px",
          }}
        />
      </div>
      <IonListHeader color="dark">
        <IonText>
          <strong>Menu</strong>
        </IonText>
      </IonListHeader>
      <IonContent>
        <IonList color="dark">
          <IonMenuToggle>
            <IonItem button routerLink="/app/settings">
              <IonIcon icon={profileIcon} slot="start" />
              Profile &amp; Settings
            </IonItem>
            <IonItem button routerLink="/app/about">
              <IonIcon icon={aboutIcon} slot="start" />
              About this App
            </IonItem>
            <IonItem button routerLink="/app/latest-news">
              <IonIcon icon={newsIcon} slot="start" />
              Latest ArtWalk news
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
