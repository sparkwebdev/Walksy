import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonPage,
} from "@ionic/react";
import PageHeader from "../components/PageHeader";
import "./DiscoverPage.css";

const DiscoverPage: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Discover" />
      <IonContent>
        <div className="constrain constrain--large">
          <IonCard
            className="walk-card ion-no-margin ion-no-padding"
            routerLink="/app/discover/nearby"
          >
            <img
              className="walk-card__image"
              src="assets/img/cover-nearby-walks.jpg"
              alt=""
            />
            <IonCardHeader className="walk-card__header">
              <IonCardTitle className="walk-card__title text-body">
                Nearby Walks
              </IonCardTitle>
              <IonCardSubtitle className="walk-card__subtitle text-body">
                11
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          <IonCard
            className="walk-card ion-no-margin"
            routerLink="/app/discover/recent"
          >
            <img
              className="walk-card__image"
              src="assets/img/cover-recent-walks.jpg"
              alt=""
            />
            <IonCardHeader className="walk-card__header">
              <IonCardTitle className="walk-card__title text-body">
                Recent Walks
              </IonCardTitle>
              <IonCardSubtitle className="walk-card__subtitle text-body">
                11
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          <IonCard
            className="walk-card ion-no-margin"
            routerLink="/app/discover/curated"
          >
            <img
              className="walk-card__image"
              src="assets/img/cover-curated-walks.jpg"
              alt=""
            />
            <IonCardHeader className="walk-card__header">
              <IonCardTitle className="walk-card__title text-body">
                Curated Walks
              </IonCardTitle>
              <IonCardSubtitle className="walk-card__subtitle text-body">
                17
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          <IonCard
            className="walk-card ion-no-margin"
            routerLink="/app/discover/tag-foraging"
          >
            <img
              className="walk-card__image"
              src="assets/img/cover-tag-foraging.jpg"
              alt=""
            />
            <IonCardHeader className="walk-card__header">
              <IonCardTitle className="walk-card__title text-body">
                #foraging
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>
          <IonCard
            className="walk-card ion-no-margin"
            routerLink="/app/discover/tag-streetart"
          >
            <img
              className="walk-card__image"
              src="assets/img/cover-tag-streetart.jpg"
              alt=""
            />
            <IonCardHeader className="walk-card__header">
              <IonCardTitle className="walk-card__title text-body">
                #streetart
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DiscoverPage;
