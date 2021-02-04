import React from "react";
import { IonCard, IonCardHeader, IonCardTitle } from "@ionic/react";

import "./WalkItem.css";

const WalkItem: React.FC<{ image: string; title: string }> = (props) => {
  return (
    <IonCard className="walk-item">
      <img src={props.image} alt={props.title} />
      <IonCardHeader>
        <IonCardTitle>{props.title}</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default WalkItem;
