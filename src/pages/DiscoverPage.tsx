import React, { useContext, useEffect, useState } from "react";
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
import { Tag } from "../data/models";
import WalksContext from "../data/walks-context";

const DiscoverPage: React.FC = () => {
  const walksCtx = useContext(WalksContext);
  const [curatedWalksCount, setCuratedWalksCount] = useState<number>();
  const [featuredWalks, setFeaturedWalksCount] = useState<number>();
  const [latestWalksCount, setLatestWalksCount] = useState<number>();
  const [suggestedDescriptors, setSuggestedDescriptors] = useState<Tag[]>([]);

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef
      .where("type", "==", "curated")
      .limit(25)
      .onSnapshot(({ docs }) => {
        setCuratedWalksCount(docs.length);
      });
  }, []);

  useEffect(() => {
    if (walksCtx.appData.suggestedDescriptors) {
      setSuggestedDescriptors(walksCtx.appData.suggestedDescriptors);
    }
  }, [walksCtx.appData]);

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef
      .where("type", "==", "featured")
      .limit(25)
      .onSnapshot(({ docs }) => {
        setFeaturedWalksCount(docs.length);
      });
  }, []);

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef
      .where("type", "==", "user")
      .limit(25)
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
                <small>Walking artist created walks</small>
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
                <small>Specially themed walks</small>
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
                Latest Walks
                <br />
                <small>Recent walks from users</small>
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
                {suggestedDescriptors.map((descriptor) => {
                  return (
                    <IonCol key={descriptor.tag}>
                      <IonCard
                        className="walk-card with-placeholder ion-no-margin"
                        routerLink={`/app/discover/tag-${descriptor.tag}`}
                      >
                        <img
                          className="walk-card__image"
                          src={
                            descriptor.coverImage ||
                            `assets/img/cover-tag-${descriptor.tag}.jpg`
                          }
                          alt=""
                          height="240"
                          width="159"
                          style={{ display: "block" }}
                        />
                        <IonCardHeader className="walk-card__header">
                          <IonCardTitle className="walk-card__title walk-card__title--small text-body">
                            #{descriptor.tag}
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
