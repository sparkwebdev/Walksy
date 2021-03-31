import React, { useEffect, useState } from "react";
import { formatDate, getMinAndSec, getTimeDiff } from "../helpers";
import { IonBadge, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";

import { getUnitDistance } from "../helpers";

import { Moment, toMoment } from "../data/models";

import { firestore, getRemoteUserData } from "../firebase";
import MomentsList from "./MomentsList";
import { useAuth } from "../auth";

const WalkItem: React.FC<{
  id?: string;
  title?: string;
  colour?: string;
  description?: string;
  start?: string;
  end?: string;
  steps?: number;
  distance?: number;
  coverImage?: string;
  type?: string;
  userId?: string;
}> = (props) => {
  const { userId } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const timeDiff =
    props.end && props.start ? getTimeDiff(props.start, props.end) : 0;
  const time = getMinAndSec(timeDiff);
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    if (props.userId) {
      getRemoteUserData(props.userId).then((data) => {
        loadUserData(data);
      });
    }
    const momentsRef = firestore
      .collection("users-moments")
      .where("walkId", "==", props.id);
    return momentsRef.orderBy("timestamp").onSnapshot(({ docs }) => {
      setMoments(docs.map(toMoment));
    });
  }, [props.id]);

  const loadUserData = (userData: any) => {
    setDisplayName(userData?.displayName);
    setProfilePic(userData?.profilePic);
  };

  return (
    <>
      <div className="walk-item-new_ ion-padding-start ion-padding-end">
        <IonGrid className="ion-margin-bottom ion-padding-bottom">
          <IonRow
            className="ion-align-items-center ion-padding-bottom ion-padding-top"
            style={{
              borderBottom: "solid 4px " + props.colour,
            }}
          >
            <IonCol>
              <IonText className="text-heading">
                {props.start && (
                  <p className="ion-text-uppercase">
                    {formatDate(props.start, true)}
                  </p>
                )}
                {props.title && (
                  <h2>
                    <strong>{props.title}</strong>
                  </h2>
                )}
                {props.type && props.type !== "user" && (
                  <IonBadge
                    className="ion-text-uppercase walk-item__type_"
                    color={props.type === "curated" ? "secondary" : "primary"}
                  >
                    {props.type}
                  </IonBadge>
                )}
                {props.type && props.type !== "user" && (
                  <IonBadge
                    className="ion-text-uppercase walk-item__type_"
                    color={props.type === "curated" ? "secondary" : "primary"}
                  >
                    {props.type}
                  </IonBadge>
                )}
                {props.description && (
                  <p className="ion-no-margin small-print">
                    <strong>{props.description}</strong>
                  </p>
                )}
              </IonText>
            </IonCol>
            {profilePic && (
              <IonCol size="3" className="ion-text-center">
                <img
                  src={profilePic}
                  alt=""
                  className="walk-item__profile-badge profile-badge__image profile-badge__image--small"
                  width="40"
                  height="40"
                />
                {displayName && (
                  <p className="ion-no-margin small-print text-body">
                    {displayName}
                  </p>
                )}
              </IonCol>
            )}
          </IonRow>
          <IonRow>
            <IonCol>
              {(props.userId === userId || props.distance) && (
                <p className="text-heading">
                  <strong>
                    {props.distance?.toFixed(2)}
                    <span className="smallprint">
                      &nbsp;{getUnitDistance()}
                    </span>
                    {props.userId === userId && props.steps && props.steps > 0 && (
                      <>
                        &nbsp;— 
                        {props.steps}&nbsp;
                        <span className="smallprint">steps</span>
                      </>
                    )}
                    {props.userId === userId && time && time["min"] > 0 && (
                      <>
                        &nbsp;
                        <span>
                          — 
                          {time["min"]}&nbsp;
                          <span className="smallprint">min</span>
                        </span>
                      </>
                    )}
                  </strong>
                </p>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
        <MomentsList moments={moments} colour={props.colour} />
      </div>
    </>
  );
};

export default WalkItem;
