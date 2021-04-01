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
} from "@ionic/react";
import PageHeader from "../components/PageHeader";
import { firestore } from "../firebase";
import { appData } from "../data/appData";
const suggestedDescriptors = appData.suggestedDescriptors;

const DiscoverPage: React.FC = () => {
  const [curatedWalksCount, setCuratedWalksCount] = useState<number>();
  const [featuredWalks, setFeaturedWalksCount] = useState<number>();
  const [latestWalksCount, setLatestWalksCount] = useState<number>();

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef.where("type", "==", "curated").onSnapshot(({ docs }) => {
      setCuratedWalksCount(docs.length);
    });
  }, []);

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef
      .where("type", "==", "featured")
      .orderBy("start")
      .onSnapshot(({ docs }) => {
        setFeaturedWalksCount(docs.length);
      });
  }, []);

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef
      .where("type", "==", "user")
      .limit(25)
      .orderBy("start")
      .onSnapshot(({ docs }) => {
        setLatestWalksCount(docs.length);
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
              height="400"
              width="265"
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
            className="walk-card with-placeholder ion-no-margin"
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
                <br />
                <small>Lorem ipsum dolor sit amet, consectetur.</small>
              </IonCardTitle>
              <IonCardSubtitle className="walk-card__subtitle text-body">
                {curatedWalksCount}
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          <IonCard
            className="walk-card with-placeholder ion-no-margin"
            routerLink="/app/discover/featured"
          >
            <img
              className="walk-card__image"
              src="assets/img/cover-featured-walks.jpg"
              alt=""
              height="400"
              width="265"
            />
            <IonCardHeader className="walk-card__header">
              <IonCardTitle className="walk-card__title text-body">
                Featured Walks
                <br />
                <small>Consectetur adipiscing elit, sed do eiusmod.</small>
              </IonCardTitle>
              <IonCardSubtitle className="walk-card__subtitle text-body">
                {featuredWalks}
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          <IonCard
            className="walk-card with-placeholder ion-no-margin"
            routerLink="/app/discover/latest"
          >
            <img
              className="walk-card__image"
              src="assets/img/cover-latest-walks.jpg"
              alt=""
              height="400"
              width="265"
            />
            <IonCardHeader className="walk-card__header">
              <IonCardTitle className="walk-card__title text-body">
                Latest User Walks
                <br />
                <small>
                  Tempor incididunt ut labore et dolore magna aliqua.
                </small>
              </IonCardTitle>
              <IonCardSubtitle className="walk-card__subtitle text-body">
                {latestWalksCount}
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          {/* <h2 className="text-heading ion-padding-start ion-padding-end">
            <IonText color="primary">
              <strong>Browse tags...</strong>
            </IonText>
          </h2> */}
          <IonCard className="ion-no-margin" style={{ background: "#777269" }}>
            <IonGrid className="grid grid--half ion-no-padding">
              <IonRow>
                {suggestedDescriptors.map((keyword, index) => {
                  return (
                    <IonCol key={keyword}>
                      <IonCard
                        className="walk-card with-placeholder ion-no-margin"
                        routerLink={`/app/discover/tag-${keyword}`}
                      >
                        <img
                          className="walk-card__image"
                          src={`assets/img/cover-tag-${keyword}.jpg`}
                          alt=""
                          height="240"
                          width="159"
                          style={{ display: "block" }}
                        />
                        <IonCardHeader className="walk-card__header">
                          <IonCardTitle className="walk-card__title walk-card__title--small text-body">
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
