import React from "react";
import { formatDate, getMinAndSec, getTimeDiff } from "../helpers";
import { IonCard, IonCardContent, IonText } from "@ionic/react";

import "./WalkItem.css";
import { getUnitDistance } from "../helpers";

const WalkItemPreview: React.FC<{
  title: string;
  colour: string;
  description: string;
  start: string;
  end: string;
  steps: number;
  distance: number;
  coverImage: string;
}> = (props) => {
  const timeDiff = getTimeDiff(props.start, props.end);
  const time = getMinAndSec(timeDiff);

  return (
    <>
      <IonCard className="walk-item ion-no-margin">
        {props.coverImage && (
          <img
            className="walk-item__cover-image"
            src={props.coverImage}
            alt={props.title}
          />
        )}
        <IonCardContent
          className="walk-item__content"
          style={{
            borderBottom: "solid 6px " + props.colour,
          }}
        >
          <IonText className="text-heading">
            <small className="ion-text-uppercase">
              {formatDate(props.start, false)}
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
              &nbsp;
              {time["min"] > 0 && (
                <span>
                  — 
                  {time["min"]}&nbsp;<span className="smallprint">min</span>
                </span>
              )}
            </p>
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default WalkItemPreview;
