import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonLoading,
  IonPage,
  IonRouterLink,
  IonRow,
  IonText,
} from "@ionic/react";
import PageHeader from "../components/PageHeader";
import { firestore } from "../firebase";
import { Walk, toWalk } from "../data/models";
import WalkItemPreview from "../components/WalkItemPreview";
import { useAuth } from "../auth";
import {
  arrowUpCircleOutline as distanceIcon,
  footstepsOutline as walkIcon,
} from "ionicons/icons";
import { formatDate, getUnitDistance, numberWithCommas } from "../helpers";

const DashboardPage: React.FC = () => {
  const { userId, userCreatedAt } = useAuth();
  const [walks, setWalks] = useState<Walk[]>([]);
  const [totalWalks, setTotalWalks] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const walksRef = firestore
      .collection("users-walks")
      .where("userId", "==", userId)
      .orderBy("start", "desc");
    return walksRef.onSnapshot((result) => {
      setTotalWalks(result.size);
      const totalSteps = result.docs
        .map(toWalk)
        .map((walk) => {
          return walk.steps;
        })
        .reduce((a, b) => a + b, 0);
      setTotalSteps(totalSteps);
      const totalDistance = result.docs
        .map(toWalk)
        .map((walk) => {
          return walk.distance;
        })
        .reduce((a, b) => a + b, 0);
      setTotalDistance(totalDistance);
      setWalks(result.docs.slice(0, 9).map(toWalk));
      setLoading(false);
    });
  }, [userId]);

  return (
    <IonPage>
      <PageHeader title="My Walks" />
      <IonContent>
        {totalWalks === 0 ? (
          <div className="ion-text-center ion-margin">
            <p className="ion-padding">You have no walks!</p>
            <IonButton routerLink="/app/new-walk" color="secondary">
              <IonIcon icon={walkIcon} slot="start" />
              Start a walk
            </IonButton>
          </div>
        ) : (
          <>
            <IonCard className="progress-panel" color="tertiary">
              <p className="ion-text-center ion-no-margin ion-padding-top">
                <strong className="ion-text-uppercase">Your Totals: </strong>
                {userCreatedAt && <em>since: {formatDate(userCreatedAt)}</em>}
              </p>
              <IonGrid>
                <IonRow className="ion-justify-content-center">
                  <IonCol
                    className="ion-text-center"
                    style={{
                      fontSize: "1.15em",
                      padding: "10px 0",
                      fontFamily: "monospace",
                    }}
                  >
                    <IonText color="light">
                      {totalWalks} <small>Walks</small>
                      <IonIcon
                        icon={distanceIcon}
                        style={{
                          verticalAlign: "middle",
                          margin: "0 5px 2px 5%",
                          fontSize: "1.5em",
                        }}
                      />
                      {totalDistance?.toFixed(1)}
                      <small style={{ fontSize: "5px" }}>&nbsp;</small>
                      <span className="smallprint">{getUnitDistance()}</span>
                      <IonIcon
                        icon={walkIcon}
                        style={{
                          verticalAlign: "middle",
                          margin: "0 5px 2px 6%",
                          fontSize: "1.5em",
                        }}
                      />
                      {numberWithCommas(totalSteps)}
                      <small style={{ fontSize: "5px" }}>&nbsp;</small>
                      <span className="smallprint">steps</span>
                    </IonText>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCard>
            <div className="constrain constrain--large">
              <h2 className="text-heading ion-padding-start ion-padding-end">
                <IonText color="primary">
                  <strong>Your Latest Walks...</strong>
                </IonText>
              </h2>
              {walks.map((walk) => (
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
                    isCircular={walk.circular}
                    location={walk?.location}
                    isMiniPreview={!walk.coverImage}
                  />
                </IonRouterLink>
              ))}
            </div>
          </>
        )}
      </IonContent>
      <IonLoading isOpen={loading} />
    </IonPage>
  );
};

export default DashboardPage;
