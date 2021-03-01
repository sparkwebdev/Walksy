import React, { useEffect, useState } from "react";
import { IonContent, IonList, IonPage } from "@ionic/react";
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
    if (id === "recent" || id === "nearby" || id === "curated") {
      const walksRef = firestore.collection("users-walks");
      return walksRef
        .orderBy("start")
        .limit(25)
        .onSnapshot(({ docs }) => {
          setWalks(docs.map(toWalk));
        });
    } else if (id === "tag-foraging") {
      const walksRef = firestore
        .collection("users-walks")
        .where("title", "array-contains", "orag");
      return walksRef
        .orderBy("start")
        .limit(25)
        .onSnapshot(({ docs }) => {
          setWalks(docs.map(toWalk));
        });
    } else if (id === "tag-streetart") {
      const walksRef = firestore
        .collection("users-walks")
        .where("title", "array-contains", "treet");
      return walksRef
        .orderBy("start")
        .limit(25)
        .onSnapshot(({ docs }) => {
          setWalks(docs.map(toWalk));
        });
    }
  }, []);

  return (
    <IonPage>
      <PageHeader title={`Browse ${id}`} back={true} />
      <IonContent>
        <IonList inset={false}>
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
              />
            </Link>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default DiscoverEntryPage;
