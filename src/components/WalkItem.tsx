import React from "react";
import { formatDate, getMinAndSec } from "../helpers";
import dayjs from "dayjs";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";

import "./WalkItem.css";
import { getUnitDistance } from "../helpers";

import { Moment } from "../data/walks-context";

import {
  chevronDown as chevronDownIcon,
  flagOutline as flagIcon,
  map as mapIcon,
} from "ionicons/icons";

const WalkItem: React.FC<{
  // image: string;
  title: string;
  colour: string;
  description: string;
  startTime: string;
  endTime: string;
  steps: number;
  distance: number;
  moments?: Moment[];
}> = (props) => {
  const coverImage = "assets/img/placeholder.png";
  const start = dayjs(props.startTime);
  const end = dayjs(props.endTime);
  const diff = end.diff(start, "second");
  const time = getMinAndSec(diff);
  const viewMapHandler = async () => {
    console.log("View map");
  };
  return (
    <>
      <IonCard className="walk-item ion-no-margin">
        {coverImage && (
          <img
            className="walk-item__cover-image"
            src={coverImage}
            alt={props.title}
          />
        )}
        <IonCardContent
          className="walk-item__content"
          style={{
            borderBottom: "solid 10px " + props.colour,
          }}
        >
          <IonText className="text-heading">
            <small className="ion-text-uppercase">
              {formatDate(props.startTime, false)}
            </small>
            {props.title && (
              <h2>
                <strong>{props.title}</strong>
              </h2>
            )}
            {props.description && (
              <p>
                <strong>{props.description}</strong>
              </p>
            )}
          </IonText>
          {props.steps > 0 && (
            <p>
              {props.distance?.toFixed(2)}
              <span className="smallprint">&nbsp;{getUnitDistance()}</span>
              &nbsp;— 
              {props.steps}&nbsp;<span className="smallprint">steps</span>
              &nbsp;— 
              {time["min"] > 0 && (
                <span>
                  {time["min"]}&nbsp;<span className="smallprint">min</span>
                </span>
              )}
            </p>
          )}
        </IonCardContent>
      </IonCard>

      {props.moments && (
        <>
          <IonText className="text-body ion-text-center">
            <p>
              <IonIcon icon={flagIcon} className="icon-large" />
              <br />
              {props.moments.length} moment
              {props.moments.length !== 1 && "s"}
              <br />
              <IonIcon icon={chevronDownIcon} className="icon-small" />
            </p>
          </IonText>
          {props.moments.map((moment: Moment) => (
            <IonCard key={moment.id} className="walk-item__moment">
              {moment.imagePath && (
                <img className="walk-item__moment-image" src="" />
              )}
              {moment.note && (
                <IonCardContent className="walk-item__moment-note">
                  <IonText>{moment.note}</IonText>
                </IonCardContent>
              )}
            </IonCard>
          ))}

          <IonGrid>
            <IonRow>
              <IonCol className="" size="12" sizeSm="8" offsetSm="2">
                <IonButton expand="block" onClick={viewMapHandler}>
                  <IonIcon slot="start" icon={mapIcon} />
                  View on Map
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </>
      )}
    </>
  );
};

export default WalkItem;
