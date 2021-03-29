import React, { useEffect, useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import PageHeader from "../components/PageHeader";
import "./DiscoverPage.css";
import { firestore } from "../firebase";
import { Walk, toWalk } from "../data/models";
import { appData } from "../data/appData";
const suggestedDescriptors = appData.suggestedDescriptors;

const DiscoverPage: React.FC = () => {
  const [recentWalks, setRecentWalks] = useState<Walk[]>([]);
  const [curatedWalks, setCuratedWalks] = useState<Walk[]>([]);

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef
      .limit(25)
      .orderBy("start")
      .onSnapshot(({ docs }) => {
        setRecentWalks(docs.map(toWalk));
      });
  }, []);
  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef.where("type", "==", ["curated"]).onSnapshot(({ docs }) => {
      setCuratedWalks(docs.map(toWalk));
    });
  }, []);

  return (
    <IonPage>
      <PageHeader title="Discover" />
      <IonContent>
        <div className="constrain constrain--large">
          {/* <IonCard
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
          </IonCard> */}
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
                {recentWalks.length}
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
                {curatedWalks.length}
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          <h2 className="text-heading ion-padding-start ion-padding-end">
            <IonText color="primary">
              <strong>Browse tags...</strong>
            </IonText>
          </h2>
          <IonCard className="ion-no-margin" style={{ background: "#777269" }}>
            <IonGrid className="grid grid--thirds ion-no-padding">
              <IonRow>
                {suggestedDescriptors.map((keyword) => {
                  return (
                    <IonCol>
                      <IonCard
                        className="walk-card ion-no-margin"
                        routerLink={`/app/discover/tag-${keyword}`}
                      >
                        <img
                          className="walk-card__image"
                          src={`assets/img/cover-tag-${keyword}.jpg`}
                          alt=""
                          style={{ display: "block" }}
                        />
                        <IonCardHeader className="walk-card__header">
                          <IonCardTitle className="walk-card__title text-body">
                            #{keyword}
                          </IonCardTitle>
                        </IonCardHeader>
                      </IonCard>
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DiscoverPage;
