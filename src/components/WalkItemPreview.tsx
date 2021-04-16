import React, { useEffect, useState } from "react";
import { formatDate, getMinAndSec, getTimeDiff } from "../helpers";
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
} from "@ionic/react";

import { getUnitDistance } from "../helpers";
import { getRemoteUserData } from "../firebase";

const WalkItemPreview: React.FC<{
  title: string;
  colour: string;
  description?: [];
  start?: string;
  end?: string;
  steps?: number;
  distance?: number;
  coverImage?: string;
  type?: string;
  overview?: string;
  userId?: string;
  location?: string;
  isCircular?: boolean;
  isMiniPreview?: boolean;
}> = (props) => {
  const [displayName, setDisplayName] = useState<string>("");
  let time = null;
  if (props.start && props.end) {
    const timeDiff = getTimeDiff(props.start, props.end);
    const timeResult = getMinAndSec(timeDiff);
    time = timeResult;
  }

  useEffect(() => {
    if (props.userId) {
      getRemoteUserData(props.userId).then((data) => {
        loadUserData(data);
      });
    }
  }, [props.userId]);

  const loadUserData = (userData: any) => {
    setDisplayName(userData?.displayName);
  };

  const metaData = (
    <>
      <h3 className="walk-item__title text-heading">{props.title}</h3>
      <ul className="walk-item__meta-data text-body">
        <li className="walk-item__details">
          {props.start ? (
            <span className="walk-item__detail ion-text-uppercase">
              {formatDate(props.start, false)}
            </span>
          ) : null}
          {props.location ? (
            <span className="walk-item__detail">, {props.location}</span>
          ) : null}
          {props.distance && props.distance > 0.1 ? (
            <span className="walk-item__detail">
              , {props.distance.toFixed(2)} {getUnitDistance()}
            </span>
          ) : null}
        </li>
        {displayName && (
          <li className="walk-item__username"> by {displayName}</li>
        )}
        {props.description && props.description.length > 0 ? (
          <li className="walk-item__tags">#{props.description.join(" #")}</li>
        ) : null}
      </ul>
    </>
  );

  return (
    <>
      {props.isMiniPreview ? (
        <IonItem
          className="ion-no-margin walk-item walk-item--mini"
          style={{
            background: "rgba(255, 255, 255, 0.925)",
            borderLeft: `solid 5px ${props.colour}`,
            lineHeight: "1.2",
            marginBottom: "1px",
          }}
          detail={true}
        >
          <IonLabel>{metaData}</IonLabel>
        </IonItem>
      ) : (
        <IonCard className="ion-no-margin walk-item walk-item--full">
          {props.coverImage && (
            <img
              className="walk-item__cover-image"
              src={props.coverImage}
              alt={props.title}
              width="400"
              height="300"
            />
          )}
          <div className="walk-item__type-container">
            {props.type && props.type !== "user" && (
              <IonBadge
                className="ion-text-uppercase walk-item__type"
                color={props.type === "curated" ? "secondary" : "primary"}
              >
                {props.type}
              </IonBadge>
            )}
            {!!props.isCircular && (
              <IonBadge
                className="ion-text-uppercase walk-item__type"
                color="tertiary"
              >
                Circular
              </IonBadge>
            )}
          </div>
          <IonCardContent
            className="walk-item__content ion-no-padding ion-no-margin"
            style={{
              borderBottom: "solid 6px " + props.colour,
            }}
          >
            <IonItem
              className="ion-item-transparent"
              lines="none"
              detail={true}
            >
              <IonLabel color="medium">{metaData}</IonLabel>
            </IonItem>
          </IonCardContent>
          {props.overview && (
            <IonItem className="walk-item__overview" lines="none" detail={true}>
              <p className="text-heading">
                {props.overview.length > 110
                  ? `${props.overview.substring(0, 110)}...`
                  : props.overview}
              </p>
            </IonItem>
          )}
        </IonCard>
      )}
    </>
  );
};

export default WalkItemPreview;
