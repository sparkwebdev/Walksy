import React, { useEffect, useState } from "react";
import { IonContent, IonLoading, IonPage, IonRouterLink } from "@ionic/react";
import PageHeader from "../components/PageHeader";
import { firestore } from "../firebase";
import { Walk, toWalk } from "../data/models";
import WalkItemPreview from "../components/WalkItemPreview";
import { useAuth } from "../auth";

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
            <IonRouterLink key={walk.id} routerLink={`/app/walk/${walk.id}`}>
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
        </div>
      </IonContent>
      <IonLoading isOpen={loading} />
    </IonPage>
  );
};

export default DashboardPage;
