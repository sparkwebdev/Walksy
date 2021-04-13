import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonList,
  IonPage,
  IonRouterLink,
} from "@ionic/react";
import PageHeader from "../components/PageHeader";
import { firestore } from "../firebase";
import { Walk, toWalk } from "../data/models";
import WalkItemPreview from "../components/WalkItemPreview";
import { useParams } from "react-router-dom";
import { footstepsOutline as walkIcon } from "ionicons/icons";

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
      case "latest":
        walksRef
          .where("type", "==", "user")
          .limit(25)
          .orderBy("start")
          .onSnapshot(({ docs }) => {
            setWalks(docs.map(toWalk));
          });
        break;
      case "curated":
        walksRef.where("type", "==", "curated").onSnapshot(({ docs }) => {
          setWalks(docs.map(toWalk));
        });
        break;
      case "featured":
        walksRef.where("type", "==", "featured").onSnapshot(({ docs }) => {
          setWalks(docs.map(toWalk));
        });
        break;
      default:
        if (id.startsWith("tag-")) {
          return walksRef
            .where("description", "array-contains", id.replace("tag-", ""))
            .orderBy("start")
            .limit(25)
            .onSnapshot(({ docs }) => {
              setWalks(docs.map(toWalk));
            });
        }
    }
  }, [id]);

  const currentlyBrowsing = id.startsWith("tag-")
    ? id.replace("tag-", "#")
    : `'${id.charAt(0).toUpperCase() + id.slice(1)}'`;

  return (
    <IonPage>
      <PageHeader title={`Browse ${currentlyBrowsing}`} back={true} />
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
                <IonButton routerLink="/app/new-walk" color="secondary">
                  <IonIcon icon={walkIcon} slot="start" />
                  Start a walk
                </IonButton>
              </div>
            ) : (
              <>
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
                      type={walk.type}
                      overview={walk.overview}
                      userId={walk.userId}
                    />
                  </IonRouterLink>
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
