import React, { useEffect, useState } from "react";
import { IonButton, IonContent, IonList, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";
import { firestore } from "../firebase";
import { Walk, toWalk } from "../data/models";
import WalkItemPreview from "../components/WalkItemPreview";
import { Link, useParams } from "react-router-dom";

interface RouteParams {
  id: string;
}

const DiscoverEntryPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [walks, setWalks] = useState<Walk[]>([]);

  useEffect(() => {
    const walksRef = firestore.collection("users-walks");
    switch (id) {
      case "nearby":
        // To Do
        break;
      case "recent":
        walksRef
          .limit(25)
          .orderBy("start")
          .onSnapshot(({ docs }) => {
            setWalks(docs.map(toWalk));
          });
        break;
      case "curated":
        walksRef.where("type", "==", ["curated"]).onSnapshot(({ docs }) => {
          setWalks(docs.map(toWalk));
        });
        break;
      default:
        if (id.startsWith("tag-")) {
          return walksRef
            .where("title", "array-contains", id)
            .orderBy("start")
            .limit(25)
            .onSnapshot(({ docs }) => {
              setWalks(docs.map(toWalk));
            });
        }
    }
  }, [id]);

  return (
    <IonPage>
      <PageHeader title={`Browse ${id}`} back={true} />
      <IonContent>
        <div className="constrain constrain--large">
          <IonList inset={false}>
            {walks.length === 0 ? (
              <div className="ion-text-center ion-margin">
                <h2 className="text-heading">
                  Sorry, no '{id.replace("tag-", "")}' walks found.
                </h2>
                <p className="text-body constrain constrain--small">
                  Please check back soon, or why not start your own walk?
                </p>
                <IonButton routerLink="/app/new-walk">Start a walk</IonButton>
              </div>
            ) : (
              <>
                {walks.map((walk) => (
                  <Link
                    className="ion-no-margin ion-no-padding"
                    key={walk.id}
                    to={`/app/walk/${walk.id}`}
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
                  </Link>
                ))}
              </>
            )}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DiscoverEntryPage;
