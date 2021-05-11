import {
  IonPage,
  IonContent,
  IonButton,
  IonText,
  IonRouterLink,
  IonList,
  IonIcon,
  IonLoading,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth";
import PageHeader from "../components/PageHeader";
import WalkItemPreview from "../components/WalkItemPreview";
import { toWalk, Walk } from "../data/models";
import { firestore } from "../firebase";
import {
  location as discoverIcon,
  timeOutline as dashboardIcon,
  peopleOutline as personIcon,
} from "ionicons/icons";
import StartWalk from "../atoms/StartWalk";
import MomentsGroup from "../components/MomentsGroup";

const HomePage: React.FC = () => {
  const { userId } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [latestWalk, setLatestWalk] = useState<Walk[]>([]);
  const [curatedWalks, setCuratedWalks] = useState<Walk[]>([]);
  const [featuredWalk, setFeaturedWalk] = useState<Walk[]>([]);
  const [latestUserWalks, setLatestUserWalks] = useState<Walk[]>([]);
  const [latestUserWalksWithCoverImage, setLatestUserWalksWithCoverImage] =
    useState<Walk[]>([]);

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

  useEffect(() => {
    // Fetch (up to 2) Curated Walks
    firestore
      .collection("users-walks")
      .where("type", "==", "curated")
      .limit(2)
      .orderBy("start", "desc")
      .onSnapshot(({ docs }) => {
        setCuratedWalks(docs.map(toWalk));
        setLoading(false);
      });

    // Fetch latest Featured Walk
    firestore
      .collection("users-walks")
      .where("type", "==", "featured")
      .limit(1)
      .orderBy("start", "desc")
      .onSnapshot(({ docs }) => {
        setFeaturedWalk(docs.map(toWalk));
        setLoading(false);
      });

    // Fetch (up to 10) latest Users Walks
    firestore
      .collection("users-walks")
      .where("type", "==", "user")
      .orderBy("start", "desc")
      .limit(16)
      .onSnapshot(({ docs }) => {
        setLatestUserWalks(docs.map(toWalk));
        // Filter ones with coverImage
        const walksWithCoverImage = docs.map(toWalk).filter((walk) => {
          return walk.coverImage !== "";
        });
        setLatestUserWalksWithCoverImage([...walksWithCoverImage]);
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
                    id={walk.id}
                    title={walk.title}
                    colour={walk.colour}
                    description={walk.description}
                    start={walk.start}
                    end={walk.end}
                    steps={walk.steps}
                    distance={walk.distance}
                    coverImage={walk.coverImage}
                    userId={walk.userId}
                    isCircular={walk.circular}
                    location={walk?.location}
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
              <hr className="separator" />
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
                    id={walk.id}
                    title={walk.title}
                    colour={walk.colour}
                    description={walk.description}
                    start={walk.start}
                    end={walk.end}
                    steps={walk.steps}
                    distance={walk.distance}
                    coverImage={walk.coverImage}
                    overview={walk.overview}
                    userId={walk.userId}
                    isCircular={walk.circular}
                    location={walk?.location}
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
            <>
              <hr className="separator" />
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
                      id={walk.id}
                      title={walk.title}
                      colour={walk.colour}
                      description={walk.description}
                      start={walk.start}
                      end={walk.end}
                      steps={walk.steps}
                      distance={walk.distance}
                      coverImage={walk.coverImage}
                      userId={walk.userId}
                      isCircular={walk.circular}
                      location={walk?.location}
                      isMiniPreview={!walk.coverImage}
                    />
                  </IonRouterLink>
                ))}
                <IonList lines="none">
                  {latestUserWalks.slice(0, 2).map((walk) => (
                    <IonRouterLink
                      key={walk.id}
                      routerLink={`/app/walk/${walk.id}`}
                    >
                      <WalkItemPreview
                        id={walk.id}
                        title={walk.title}
                        colour={walk.colour}
                        description={walk.description}
                        start={walk.start}
                        distance={walk.distance}
                        userId={walk.userId}
                        isCircular={walk.circular}
                        location={walk?.location}
                        isMiniPreview={true}
                      />
                    </IonRouterLink>
                  ))}
                </IonList>
                <IonButton
                  className="ion-margin-start"
                  routerLink="/app/discover/latest"
                >
                  <IonIcon icon={personIcon} slot="start" />
                  Latest User Walks
                </IonButton>
              </div>
            </>
          )}
          {latestUserWalksWithCoverImage.length > 0 && (
            <>
              <hr className="separator" />
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>Latest User Moments...</strong>
                </IonText>
              </h2>

              {latestUserWalksWithCoverImage.slice(0, 4).map((walk) => (
                <div key={walk.id}>
                  <MomentsGroup
                    walkId={walk.id}
                    walkTitle={walk.title}
                    walkColour={walk.colour}
                    userId={walk.userId}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </IonContent>
      <IonLoading isOpen={loading} />
    </IonPage>
  );
};

export default HomePage;
