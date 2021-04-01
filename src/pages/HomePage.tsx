import {
  IonPage,
  IonContent,
  IonCard,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonRouterLink,
  IonList,
  IonItem,
  IonIcon,
  IonLoading,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import MomentItemPreview from "../components/MomentItemPreview";
import PageHeader from "../components/PageHeader";
import WalkItemPreview from "../components/WalkItemPreview";
import WalkItemPreviewMini from "../components/WalkItemPreviewMini";
import { Moment, toMoment, toWalk, Walk } from "../data/models";
import { firestore } from "../firebase";
import {
  eyeOutline as browseIcon,
  analyticsOutline as discoverIcon,
  footstepsOutline as walkIcon,
  timeOutline as dashboardIcon,
} from "ionicons/icons";

const HomePage: React.FC = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
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
      setLoading(false);
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
      .limit(25)
      .where("imagePath", "!=", "");
    // return momentsRef.orderBy("timestamp").onSnapshot(({ docs }) => {
    return momentsRef.onSnapshot(({ docs }) => {
      const shuffled = docs.sort(() => 0.5 - Math.random());
      setMoments(shuffled.slice(0, 3).map(toMoment));
    });
  }, []);

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    return walksRef
      .where("type", "==", "user")
      .orderBy("start")
      .limit(6)
      .onSnapshot(({ docs }) => {
        setLatestUserWalks(docs.map(toWalk));
      });
  }, []);

  return (
    <IonPage>
      <PageHeader title="Welcome" />
      <IonContent>
        <div className="constrain constrain--large">
          <div className="ion-text-center ion-margin-bottom">
            <h2>
              <span className="ion-hide">Walksy</span>
              <img
                className="logo"
                src="assets/img/walksy-logo.svg"
                alt=""
                style={{
                  maxHeight: "80px",
                }}
              />
            </h2>
            <h3 className="text-heading constrain constrain--small">
              Walking &amp; recording your&nbsp;nearby.
            </h3>
          </div>
          <div
            className="ion-text-center"
            style={{
              marginBottom: "30px",
            }}
          >
            <IonButton routerLink="/app/new-walk" color="secondary">
              <IonIcon icon={walkIcon} slot="start" />
              Start a walk
            </IonButton>
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
              <IonButton
                className="ion-margin-top ion-margin-bottom ion-margin-start"
                routerLink="/app/dashboard"
              >
                <IonIcon icon={dashboardIcon} slot="start" />
                View Dashboard
              </IonButton>
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
              <IonButton
                className="ion-margin-top ion-margin-bottom ion-margin-start"
                routerLink="/app/discover"
              >
                <IonIcon icon={discoverIcon} slot="start" />
                Discover Walks
              </IonButton>
            </>
          )}

          {moments.length > 0 && (
            <>
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>User Moments...</strong>
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
                <IonGrid className="grid grid--half grid--half-with-full ion-no-padding">
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
              <IonButton
                className="ion-margin-top ion-margin-bottom ion-margin-start"
                routerLink="/app/gallery"
              >
                <IonIcon icon={browseIcon} slot="start" />
                View Gallery
              </IonButton>
            </>
          )}

          {latestUserWalks.length > 0 && (
            <div className="ion-margin-bottom ion-padding-bottom">
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>Latest User Walks...</strong>
                </IonText>
              </h2>
              <p
                className="text-body small-print ion-padding-start ion-padding-end"
                style={{ maxWidth: "32em" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <IonList lines="none">
                {latestUserWalks.map((walk) => (
                  <IonItem
                    className="ion-no-margin"
                    routerLink={`/app/walk/${walk.id}`}
                    style={{
                      background: "rgba(255, 255, 255, 0.925)",
                      borderBottom: `solid 5px ${walk.colour}`,
                      lineHeight: "1.2",
                      marginBottom: "10px",
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
      <IonLoading isOpen={loading} />
    </IonPage>
  );
};

export default HomePage;
