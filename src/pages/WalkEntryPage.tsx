import React, { useEffect, useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";
import WalkItem from "../components/WalkItem";
import { useParams } from "react-router";
import { firestore } from "../firebase";
import { toWalk, Walk } from "../data/models";

interface RouteParams {
  id: string;
}

const WalkEditEntryPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [walk, setWalk] = useState<Walk>();

  useEffect(() => {
    const walkRef = firestore.collection("users-walks").doc(id);
    walkRef
      .get()
      .then((doc) => {
        setWalk(toWalk(doc));
      })
      .catch((e) => {
        console.log("Couldn't load user walks", e);
      });
  }, [id]);

  return (
    <IonPage>
      <PageHeader title="Walk" back={true} />
      <IonContent className="ion-padding-bottom">
        {walk && (
          <div className="ion-margin-bottom constrain constrain--large">
            <WalkItem
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
              locations={walk.locations}
              location={walk.location}
              type={walk.type}
              userId={walk.userId}
              shouldShare={false}
            />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default WalkEditEntryPage;
