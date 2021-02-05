import React, { useContext } from "react";
import { IonRow, IonCol } from "@ionic/react";

import WalkItem from "./WalkItem";
import WalksContext from "../data/walks-context";
// import { Walk } from "../data/walks-context";

const WalksList: React.FC<{ title: string; type: "user" | "guided" }> = (
  props
) => {
  const walksCtx = useContext(WalksContext);

  const walks = walksCtx.walks.filter((walk) => walk.type === props.type);

  return (
    <React.Fragment>
      {walks.map((walk) => (
        <IonRow key={walk.id}>
          <IonCol>
            <h2>{props.title}</h2>
            <WalkItem
              image={walk.base64Url}
              title={walk.title}
              startTime={walk.startTime}
              endTime={walk.endTime}
              steps={walk.steps}
              distance={walk.distance}
            />
          </IonCol>
        </IonRow>
      ))}
    </React.Fragment>
  );
};

export default WalksList;
