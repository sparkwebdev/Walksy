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
  IonIcon,
  IonLoading,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import MomentItemPreview from "../components/MomentItemPreview";
import PageHeader from "../components/PageHeader";
import WalkItemPreview from "../components/WalkItemPreview";
import { Moment, toMoment, toWalk, Walk } from "../data/models";
import { firestore } from "../firebase";
import {
  eyeOutline as browseIcon,
  location as discoverIcon,
  timeOutline as dashboardIcon,
  peopleOutline as personIcon,
} from "ionicons/icons";
import StartWalk from "../atoms/StartWalk";

const HomePage: React.FC = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [latestWalk, setLatestWalk] = useState<Walk[]>([]);
  const [curatedWalks, setCuratedWalks] = useState<Walk[]>([]);
  const [featuredWalk, setFeaturedWalk] = useState<Walk[]>([]);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [latestUserWalks, setLatestUserWalks] = useState<Walk[]>([]);

  // Fetch Latest Walk (current user)
  useEffect(() => {
    const walksRef = firestore
      .collection("users-walks")
      .where("userId", "==", userId)
      .limit(1)
      .orderBy("start", "desc");
    return walksRef.onSnapshot(({ docs }) => {
      setLatestWalk(docs.map(toWalk));
    });
  }, [userId]);

  // Fetch (up to 2) Curated Walks
  useEffect(() => {
    const walksRef = firestore
      .collection("users-walks")
      .where("type", "==", "curated")
      .limit(2)
      .orderBy("start", "desc");
    return walksRef.onSnapshot(({ docs }) => {
      setCuratedWalks(docs.map(toWalk));
      setLoading(false);
    });
  }, []);

  // Fetch latest Featured Walk
  useEffect(() => {
    const walksRef = firestore
      .collection("users-walks")
      .where("type", "==", "featured")
      .limit(1)
      .orderBy("start", "desc");
    return walksRef.onSnapshot(({ docs }) => {
      setFeaturedWalk(docs.map(toWalk));
      setLoading(false);
    });
  }, []);

  // Fetch (up to 6) latest Users Walks
  useEffect(() => {
    const walksRef = firestore
      .collection("users-walks")
      .where("type", "==", "user")
      .orderBy("start", "desc")
      .limit(6);
    return walksRef.onSnapshot(({ docs }) => {
      setLatestUserWalks(docs.map(toWalk));
      setLoading(false);
    });
  }, []);

  // Fetch Moments with Images
  useEffect(() => {
    const momentsRef = firestore
      .collection("users-moments")
      .limit(30)
      .orderBy("timestamp", "desc");
    return momentsRef.onSnapshot(({ docs }) => {
      const momentsWithImages = docs
        .map(toMoment)
        .filter((moment) => moment.imagePath !== "");
      setMoments(momentsWithImages.slice(0, 9));
      setLoading(false);
    });
  }, []);

  return (
    <IonPage>
      <PageHeader title="Welcome" />
      <IonContent>
        <StartWalk />
        <div className="constrain constrain--large">
          {latestWalk.length > 0 && (
            <>
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>Your latest walk</strong>
                </IonText>
              </h2>
              {latestWalk.map((walk) => (
                <IonRouterLink
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
                    isMiniPreview={!walk.coverImage}
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

          {curatedWalks.length > 0 && (
            <>
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>Curated Walks...</strong>
                </IonText>
              </h2>
              <p
                className="text-body small-print ion-padding-start ion-padding-end"
                style={{ maxWidth: "32em" }}
              >
                A series of walks created by artists as part of many different
                projects the Art Walk has produced around Edinburgh’s coastline
                and outskirt areas, inviting us to rethink our local habitats
                and city spaces.
              </p>
              {curatedWalks.map((walk) => (
                <IonRouterLink
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
                    isMiniPreview={!walk.coverImage}
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

          {latestUserWalks.length > 0 && (
            <div className="ion-margin-bottom ion-padding-bottom">
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>Latest User Walks...</strong>
                </IonText>
              </h2>
              {featuredWalk.map((walk) => (
                <IonRouterLink
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
                    isMiniPreview={!walk.coverImage}
                  />
                </IonRouterLink>
              ))}
              <IonList lines="none">
                {latestUserWalks.map((walk) => (
                  <IonRouterLink
                    key={walk.id}
                    routerLink={`/app/walk/${walk.id}`}
                  >
                    <WalkItemPreview
                      title={walk.title}
                      colour={walk.colour}
                      description={walk.description}
                      start={walk.start}
                      distance={walk.distance}
                      userId={walk.userId}
                      isMiniPreview={true}
                    />
                  </IonRouterLink>
                ))}
              </IonList>
              <IonButton
                className="ion-margin-start"
                routerLink="/app/dashboard"
              >
                <IonIcon icon={personIcon} slot="start" />
                Latest User Walks
              </IonButton>
            </div>
          )}

          {moments.length > 0 && (
            <>
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>Latest User Moments...</strong>
                </IonText>
              </h2>
              <IonCard
                className="ion-no-margin"
                style={{ background: "#777269" }}
              >
                <IonGrid className="grid grid--half grid--half-with-full ion-no-padding">
                  <IonRow>
                    {moments.map((moment) => (
                      <IonCol key={moment.id}>
                        {moment.walkId && (
                          <MomentItemPreview
                            walkId={moment.walkId}
                            coverImage={moment.imagePath}
                            imageOnly={true}
                          />
                        )}
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
        </div>
      </IonContent>
      <IonLoading isOpen={loading} />
    </IonPage>
  );
};

export default HomePage;
