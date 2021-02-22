import React, { useContext } from "react";
import { IonContent, IonPage } from "@ionic/react";
import PageHeader from "../components/PageHeader";
import WalkItem from "../components/WalkItem";
import WalksContext from "../data/walks-context";
import { useParams } from "react-router";

interface RouteParams {
  id: string;
}

const WalkPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const walksCtx = useContext(WalksContext);

  const walk = walksCtx.walks.find((walk) => walk.id === id);
  return (
    <IonPage>
      <PageHeader title="Walk" back={true} />
      <IonContent>
        <WalkItem
          // image={walk!.base64Url}
          title={walk!.title}
          colour={walk!.colour}
          description={walk!.description}
          startTime={walk!.startTime}
          endTime={walk!.endTime}
          steps={walk!.steps}
          distance={walk!.distance}
          moments={walk!.moments}
        />
      </IonContent>
    </IonPage>
  );
};

export default WalkPage;
