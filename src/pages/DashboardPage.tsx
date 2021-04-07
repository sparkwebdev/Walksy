import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonItem,
  IonList,
  IonLoading,
  IonPage,
  IonRouterLink,
} from "@ionic/react";
import PageHeader from "../components/PageHeader";
import { firestore } from "../firebase";
import { Walk, toWalk } from "../data/models";
import WalkItemPreview from "../components/WalkItemPreview";
import { useAuth } from "../auth";
import WalkItemPreviewMini from "../components/WalkItemPreviewMini";

const DashboardPage: React.FC = () => {
  const { userId } = useAuth();
  const [walks, setWalks] = useState<Walk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const walksRef = firestore
      .collection("users-walks")
      .where("userId", "==", userId)
      .orderBy("start", "desc")
      .limit(10);
    return walksRef.onSnapshot(({ docs }) => {
      setWalks(docs.map(toWalk));
      setLoading(false);
    });
  }, [userId]);

  return (
    <IonPage>
      <PageHeader title="My Walks" />
      <IonContent>
        <div className="constrain constrain--large">
          {walks.map((walk) => (
            <IonRouterLink
              className="ion-no-margin ion-no-padding"
              key={walk.id}
              routerLink={`/app/walk/${walk.id}`}
            >
              {walk.coverImage ? (
                <WalkItemPreview
                  title={walk.title}
                  colour={walk.colour}
                  description={walk.description}
                  start={walk.start}
                  end={walk.end}
                  steps={walk.steps}
                  distance={walk.distance}
                  coverImage={walk.coverImage}
                  userId={userId}
                />
              ) : (
                <IonList lines="none" className="ion-no-padding">
                  <IonItem
                    className="ion-no-margin"
                    routerLink={`/app/walk/${walk.id}`}
                    style={{
                      background: "rgba(255, 255, 255, 0.925)",
                      borderBottom: `solid 5px ${walk.colour}`,
                      lineHeight: "1.2",
                      marginBottom: "10px",
                    }}
                    detail={true}
                  >
                    <WalkItemPreviewMini
                      title={walk.title}
                      description={walk.description}
                      start={walk.start}
                      distance={walk.distance}
                      userId={walk.userId}
                    />
                  </IonItem>
                </IonList>
              )}
            </IonRouterLink>
          ))}
        </div>
      </IonContent>
      <IonLoading isOpen={loading} />
    </IonPage>
  );
};

export default DashboardPage;
