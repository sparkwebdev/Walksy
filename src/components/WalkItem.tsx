import React from "react";
import dayjs from "dayjs";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";

import "./WalkItem.css";
import { getUnitDistance } from "../helpers";

const WalkItem: React.FC<{
  image: string;
  title: string;
  colour: string;
  description: string;
  startTime: string;
  endTime: string;
  steps: number;
  distance: number;
}> = (props) => {
  return (
    <IonCard className="walk-item">
      <img src={props.image} alt={props.title} />
      <IonCardHeader
        style={{
          borderTop: "solid 10px " + props.colour,
        }}
      >
        <IonCardTitle className="ion-margin-bottom">{props.title}</IonCardTitle>
        <IonCardSubtitle>
          {dayjs(props.startTime).format("dddd, DD MMM")}
        </IonCardSubtitle>
        {props.steps > 0 && (
          <IonCardSubtitle className="ion-margin-top">
            {props.distance?.toFixed(2)}
            <span className="smallprint">&nbsp;{getUnitDistance()}</span>
            &nbsp;— 
            {props.steps}&nbsp;<span className="smallprint">steps</span>
          </IonCardSubtitle>
        )}
        {props.description != "" && (
          <IonCardSubtitle className="ion-margin-top">
            {props.description}
          </IonCardSubtitle>
        )}
      </IonCardHeader>
    </IonCard>
  );
};

export default WalkItem;
