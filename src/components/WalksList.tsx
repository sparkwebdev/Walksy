import React from "react";
import { IonRow, IonCol } from "@ionic/react";

import WalkItem from "./WalkItem";
import { Walk } from "../data/walks-context";

const WalksList: React.FC<{ items: Walk[] }> = (props) => {
  return (
    <React.Fragment>
      {props.items.map((walk) => (
        <IonRow key={walk.id}>
          <IonCol>
            <WalkItem image={walk.base64Url} title={walk.title} />
          </IonCol>
        </IonRow>
      ))}
    </React.Fragment>
  );
};

export default WalksList;
