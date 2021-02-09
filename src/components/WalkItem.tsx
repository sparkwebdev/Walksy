import React from "react";
import dayjs from "dayjs";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
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
  moments: any;
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
        {props.description !== "" && (
          <IonCardSubtitle className="ion-margin-top">
            {props.description}
          </IonCardSubtitle>
        )}
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {props.moments.map((moment: any) => (
            <IonItem key={moment.id}>
              <IonLabel>{moment.note}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default WalkItem;
