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
      <IonCardHeader>
        <IonCardTitle>{props.title}</IonCardTitle>
        <IonCardSubtitle>
          {dayjs(props.startTime).format("dddd, DD MMM")}
        </IonCardSubtitle>
        {props.steps > 0 && (
          <IonCardSubtitle>
            {props.distance?.toFixed(2)}
            <span className="smallprint">&nbsp;{getUnitDistance()}</span>
            &nbsp;— 
            {props.steps}&nbsp;<span className="smallprint">steps</span>
          </IonCardSubtitle>
        )}
      </IonCardHeader>
    </IonCard>
  );
};

export default WalkItem;
