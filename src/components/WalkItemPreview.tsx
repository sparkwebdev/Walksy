import React, { useEffect, useState } from "react";
import {
  formatDate,
  getMinAndSec,
  getTimeDiff,
  numberWithCommas,
} from "../helpers";
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonRouterLink,
  IonText,
} from "@ionic/react";

import { getUnitDistance } from "../helpers";
import { getRemoteUserData } from "../firebase";
import { useAuth } from "../auth";
import {
  timerOutline as timeIcon,
  arrowUpCircleOutline as distanceIcon,
  footstepsOutline as walkIcon,
} from "ionicons/icons";

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
  isMiniPreview?: boolean;
}> = (props) => {
  const { userId } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
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
    setProfilePic(userData?.profilePic);
  };

  return (
    <>
      {props.isMiniPreview ? (
        <IonItem
          className="ion-no-margin"
          style={{
            background: "rgba(255, 255, 255, 0.925)",
            borderLeft: `solid 5px ${props.colour}`,
            lineHeight: "1.2",
            marginBottom: "1px",
          }}
          detail={true}
        >
          <IonLabel className="text-heading">
            {props.title}
            <small
              className="small-print"
              style={{ lineHeight: "1.2em", fontSize: "0.9em" }}
            >
              <br /> by {displayName}
              <br />
              {props.start ? (
                <span className="ion-text-uppercase">
                  {formatDate(props.start, false)}
                </span>
              ) : null}
              {props.distance && props.distance > 0.1 ? (
                <span>
                  , {props.distance.toFixed(2)} {getUnitDistance()}
                </span>
              ) : null}
              {props.description && (
                <span> — {props.description.join(", ")}</span>
              )}
            </small>
          </IonLabel>
        </IonItem>
      ) : (
        <IonCard className="ion-no-margin">
          <div className="walk-item">
            {props.coverImage && (
              <img
                className="walk-item__cover-image"
                src={props.coverImage}
                alt={props.title}
                width="400"
                height="300"
              />
            )}
            {props.type && props.type !== "user" && (
              <IonBadge
                className="ion-text-uppercase walk-item__type"
                color={props.type === "curated" ? "secondary" : "primary"}
              >
                {props.type}
              </IonBadge>
            )}
            {profilePic && (
              <img
                src={profilePic}
                alt=""
                className="walk-item__profile-badge profile-badge__image profile-badge__image--small"
                width="40"
                height="40"
              />
            )}
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
                <IonText className="text-heading" color="medium">
                  <h2 style={{ fontSize: "1.2em" }}>
                    <strong>{props.title}</strong>
                  </h2>
                  <p className="text-body">
                    by {displayName}
                    <br />
                    {props.type !== "curated" && (
                      <span className="ion-text-uppercase">
                        {props.start && formatDate(props.start, false)}
                      </span>
                    )}
                    {props.description && (
                      <span> — {props.description.join(", ")}</span>
                    )}
                  </p>
                  <IonText
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "5px",
                    }}
                  >
                    {props.distance && props.distance > 0.1 ? (
                      <span>
                        <IonIcon icon={distanceIcon} />
                        &nbsp;
                        {props.distance.toFixed(2)} {getUnitDistance()}
                      </span>
                    ) : null}
                    {props.userId === userId &&
                    props.steps &&
                    props.steps > 0 &&
                    time &&
                    time["min"] > 0 ? (
                      <span style={{ marginLeft: "10px" }}>
                        <IonIcon icon={walkIcon} />
                        &nbsp;
                        {numberWithCommas(props.steps)}&nbsp;
                        <span className="smallprint">steps</span>
                        <span style={{ marginLeft: "10px" }}>
                          <IonIcon icon={timeIcon} />
                          &nbsp;
                          {time["min"]}&nbsp;
                          <span className="smallprint">min</span>
                        </span>
                      </span>
                    ) : null}
                  </IonText>
                </IonText>
              </IonItem>
            </IonCardContent>
          </div>
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
