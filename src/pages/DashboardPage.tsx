import React, { useEffect, useState } from "react";
import { IonContent, IonPage, IonRouterLink } from "@ionic/react";
import PageHeader from "../components/PageHeader";
import { firestore } from "../firebase";
import { Walk, toWalk } from "../data/models";
import WalkItemPreview from "../components/WalkItemPreview";
import { useAuth } from "../auth";

const DashboardPage: React.FC = () => {
  const { userId } = useAuth();
  const [walks, setWalks] = useState<Walk[]>([]);

  useEffect(() => {
    const walksRef = firestore
      .collection("users-walks")
      .where("userId", "==", userId);
    return walksRef
      .orderBy("start")
      .limit(25)
      .onSnapshot(({ docs }) => {
        setWalks(docs.map(toWalk));
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
            </IonRouterLink>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
