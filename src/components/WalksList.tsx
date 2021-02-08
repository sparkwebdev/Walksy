import React, { useContext } from "react";
import { IonRow, IonCol, IonGrid, IonItem } from "@ionic/react";

import WalkItem from "./WalkItem";
import WalksContext from "../data/walks-context";

const WalksList: React.FC<{ title: string; type: "user" | "guided" }> = (
  props
) => {
  const walksCtx = useContext(WalksContext);

  const walks = walksCtx.walks.filter((walk) => walk.type === props.type);

  return (
    <IonGrid>
      {walks.length > 0 && (
        <IonRow>
          <IonCol>
            <h2>{props.title}</h2>
          </IonCol>
        </IonRow>
      )}
      {walks.map((walk) => (
        <IonRow key={walk.id}>
          <IonCol>
            <IonItem
              key={walk.id}
              routerLink={`/walk/${walk.id}`}
              detail={false}
            >
              <WalkItem
                image={walk.base64Url}
                title={walk.title}
                colour={walk.colour}
                description={walk.description}
                startTime={walk.startTime}
                endTime={walk.endTime}
                steps={walk.steps}
                distance={walk.distance}
              />
            </IonItem>
          </IonCol>
        </IonRow>
      ))}
      {!walks && <p>Sorry, no walks yet</p>}
    </IonGrid>
  );
};

export default WalksList;
