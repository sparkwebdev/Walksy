import {
  IonPage,
  IonContent,
  IonText,
  IonRouterLink,
  IonList,
  IonCol,
  IonGrid,
  IonRow,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonButton,
  IonSpinner,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import WalkItemPreview from "../components/WalkItemPreview";
import { toWalk, Walk } from "../data/models";
import { firestore } from "../firebase";
import MomentsGroup from "../components/MomentsGroup";
import LatestNews from "../components/LatestNews";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [latestUserWalks, setLatestUserWalks] = useState<Walk[]>([]);
  const [latestUserWalksWithCoverImage, setLatestUserWalksWithCoverImage] =
    useState<Walk[]>([]);

  useEffect(() => {
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
      <IonHeader>
        <IonToolbar className="page-header">
          <IonTitle className="ion-text-center">Welcome</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="constrain constrain--large">
          <div className="ion-text-center ion-margin-bottom">
            <h2>
              <span className="ion-hide">Walksy</span>
              <img
                className="logo"
                src="assets/img/walksy-logo-2.svg"
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
          <IonGrid>
            <IonRow style={{ opacity: 0.2 }}>
              <IonCol offset="1" offsetSm="2" size="5" sizeSm="4">
                <a href="/">
                  <img src="assets/img/btn-app-store.png" alt="" />
                </a>
              </IonCol>
              <IonCol size="5" sizeSm="4">
                <a href="/">
                  <img src="assets/img/btn-google-play.png" alt="" />
                </a>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-text-center">
                <h3>
                  <IonText color="secondary">
                    <strong>Coming Soon!</strong>
                  </IonText>
                </h3>
                <IonButton routerLink="/about">Find out more</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <hr className="separator" />
          <div className="ion-margin-bottom ion-padding-bottom">
            <h2 className="text-heading ion-padding-start ion-padding-end">
              <IonText color="primary">
                <strong>Latest News...</strong>
              </IonText>
            </h2>
            <LatestNews />
          </div>
          {loading && (
            <div className="spinner ion-text-center">
              <IonSpinner color="primary" name="dots" />
            </div>
          )}
          {!loading && latestUserWalks.length > 0 && (
            <>
              <hr className="separator" />
              <div className="ion-margin-bottom ion-padding-bottom">
                <h2 className="text-heading ion-padding-start ion-padding-end">
                  <IonText color="primary">
                    <strong>Latest User Walks...</strong>
                  </IonText>
                </h2>
                <IonList lines="none">
                  {latestUserWalks.slice(0, 3).map((walk) => (
                    <IonRouterLink
                      key={walk.id}
                      routerLink={`/walk/${walk.id}`}
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
              </div>
            </>
          )}
          {!loading && latestUserWalksWithCoverImage.length > 0 && (
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
        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton routerLink="/privacy" fill="clear">
                Privacy Policy
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
