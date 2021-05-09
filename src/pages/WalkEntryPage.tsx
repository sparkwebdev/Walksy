import React, { useContext, useEffect, useState } from "react";
import { IonAlert, IonContent, IonLoading, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";
import WalkItem from "../components/WalkItem";
import { useParams } from "react-router";
import { firestore } from "../firebase";
import { toWalk, Walk } from "../data/models";
import WalksContext from "../data/walks-context";
import { useLocation } from "react-router-dom";

interface RouteParams {
  id: string;
}
interface RecievedWalkValues {
  share: boolean;
}

const WalkEntryPage: React.FC = () => {
  const locationURL = useLocation<RecievedWalkValues>();
  const { share } = locationURL.state || false;
  const [loading, setLoading] = useState<boolean>(true);

  const walksCtx = useContext(WalksContext);
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
    setLoading(false);
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
              locations={walk.locations}
              location={walk.location}
              type={walk.type}
              userId={walk.userId!}
              shouldShare={
                share && !!walksCtx.moments && walksCtx.moments.length === 0
              }
            />
          </div>
        )}
      </IonContent>
      <IonAlert
        header={"Saving your moments..."}
        subHeader={`${walksCtx.moments?.length} to go`}
        isOpen={!!walksCtx.moments && walksCtx.moments.length > 0}
        backdropDismiss={false}
      />
      <IonLoading isOpen={loading} />
    </IonPage>
  );
};

export default WalkEntryPage;
