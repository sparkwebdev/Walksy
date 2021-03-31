import {
  IonPage,
  IonContent,
  IonCard,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonRouterLink,
  IonList,
  IonItem,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import MomentItemPreview from "../components/MomentItemPreview";
import PageHeader from "../components/PageHeader";
import WalkItemPreview from "../components/WalkItemPreview";
import WalkItemPreviewMini from "../components/WalkItemPreviewMini";
import { Moment, toMoment, toWalk, Walk } from "../data/models";
import { firestore } from "../firebase";

const HomePage: React.FC = () => {
  const { userId } = useAuth();

  const [latestWalk, setLatestWalk] = useState<Walk[]>([]);
  const [featuredWalks, setFeaturedWalks] = useState<Walk[]>([]);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [latestUserWalks, setLatestUserWalks] = useState<Walk[]>([]);

  useEffect(() => {
    const walksRef = firestore
      .collection("users-walks")
      .limit(1)
      .where("userId", "==", userId);
    return walksRef.orderBy("start").onSnapshot(({ docs }) => {
      setLatestWalk(docs.map(toWalk));
    });
  }, [userId]);

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return (
      walksRef
        .where("type", "not-in", ["user"])
        // .limit(2)
        // .orderBy("start")
        .onSnapshot(({ docs }) => {
          setFeaturedWalks(docs.map(toWalk));
        })
    );
  }, []);

  useEffect(() => {
    const momentsRef = firestore
      .collection("users-moments")
      .limit(4)
      .where("imagePath", "!=", "");
    return momentsRef.orderBy("imagePath").onSnapshot(({ docs }) => {
      setMoments(docs.map(toMoment));
    });
  }, []);

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef
      .where("type", "==", "user")
      .limit(12)
      .orderBy("start")
      .onSnapshot(({ docs }) => {
        setLatestUserWalks(docs.map(toWalk));
      });
  }, []);

  return (
    <IonPage>
      <PageHeader title="Welcome" />
      <IonContent className="ion-padding-bottom">
        <div className="constrain constrain--large">
          <div
            className="ion-text-center  ion-padding"
            style={{
              marginTop: "20px",
              marginBottom: "20px",
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
            <h2 className="text-heading constrain constrain--small">
              Walking &amp; recording your nearby.
            </h2>
            {latestWalk.length == 0 && (
              <IonCard
                className="ion-text-center"
                color="secondary"
                routerLink="/app/new-walk"
              >
                <IonCardHeader>
                  <IonCardSubtitle>Get started...</IonCardSubtitle>
                  <IonCardTitle>You haven't created a walk yet.</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton>Start a walk</IonButton>
                </IonCardContent>
              </IonCard>
            )}
          </div>

          {latestWalk.length > 0 && (
            <>
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>Your latest walk...</strong>
                </IonText>
              </h2>
              {latestWalk.map((walk) => (
                <IonRouterLink
                  className="ion-no-margin ion-no-padding"
                  key={walk.id}
                  routerLink={`/app/walk/${walk.id}`}
                >
                  <WalkItemPreview
                    title={walk.title}
                    colour={walk.colour}
                    description={walk.description}
                    start={walk.start}
                    end={walk.end}
                    steps={walk.steps}
                    distance={walk.distance}
                    coverImage={walk.coverImage}
                    userId={walk.userId}
                  />
                </IonRouterLink>
              ))}
              <div className="ion-padding">
                <IonButton routerLink="/app/dashboard">
                  View Dashboard
                </IonButton>
              </div>
            </>
          )}

          {featuredWalks.length > 0 && (
            <>
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>Featured Walks...</strong>
                </IonText>
              </h2>
              <p
                className="text-body small-print ion-padding-start ion-padding-end"
                style={{ maxWidth: "32em" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              {featuredWalks.map((walk) => (
                <IonRouterLink
                  className="ion-no-margin ion-no-padding"
                  key={walk.id}
                  routerLink={`/app/walk/${walk.id}`}
                >
                  <WalkItemPreview
                    title={walk.title}
                    colour={walk.colour}
                    description={walk.description}
                    start={walk.start}
                    end={walk.end}
                    steps={walk.steps}
                    distance={walk.distance}
                    coverImage={walk.coverImage}
                    type={walk.type}
                    userId={walk.userId}
                  />
                </IonRouterLink>
              ))}
              <div className="ion-padding">
                <IonButton routerLink="/app/discover">Discover Walks</IonButton>
              </div>
            </>
          )}

          {moments.length > 0 && (
            <>
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>Latest User's Moments...</strong>
                </IonText>
              </h2>
              <p
                className="text-body small-print ion-padding-start ion-padding-end"
                style={{ maxWidth: "32em" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <IonCard
                className="ion-no-margin"
                style={{ background: "#777269" }}
              >
                <IonGrid className="grid grid--half ion-no-padding">
                  <IonRow>
                    {moments.map((moment) => (
                      <IonCol key={moment.id}>
                        <MomentItemPreview
                          walkId={moment.walkId}
                          coverImage={moment.imagePath}
                          imageOnly={true}
                        />
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              </IonCard>
              <div className="ion-padding">
                <IonButton routerLink="/app/gallery">View Gallery</IonButton>
              </div>
            </>
          )}

          {latestUserWalks.length > 0 && (
            <div className="ion-margin-bottom ion-padding-bottom ion-padding-start ion-padding-end">
              <h2 className="text-heading">
                <IonText color="primary">
                  <strong>Latest User Walks...</strong>
                </IonText>
              </h2>
              <p className="text-body small-print" style={{ maxWidth: "32em" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <IonList>
                {featuredWalks.map((walk) => (
                  <IonItem
                    className="ion-no-margin"
                    routerLink={`/app/walk/${walk.id}`}
                    style={{
                      borderLeft: `solid 10px ${walk.colour}`,
                    }}
                    key={walk.id}
                  >
                    <WalkItemPreviewMini
                      title={walk.title}
                      description={walk.description}
                      start={walk.start}
                      distance={walk.distance}
                      userId={walk.userId}
                    />
                  </IonItem>
                ))}
              </IonList>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
