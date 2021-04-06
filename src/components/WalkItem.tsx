import React, { useEffect, useState } from "react";
import {
  formatDate,
  getMinAndSec,
  getTimeDiff,
  numberWithCommas,
} from "../helpers";
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";

import { getUnitDistance } from "../helpers";

import { Moment, toMoment } from "../data/models";

import { firestore, getRemoteUserData } from "../firebase";
import MomentsList from "./MomentsList";
import { useAuth } from "../auth";
import {
  timerOutline as timeIcon,
  arrowUpCircleOutline as distanceIcon,
  footstepsOutline as walkIcon,
} from "ionicons/icons";

const WalkItem: React.FC<{
  id?: string;
  title?: string;
  colour?: string;
  description?: [];
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
            className="ion-align-items-center"
            style={{
              borderBottom: "solid 4px " + props.colour,
            }}
          >
            <IonText className="text-heading">
              <h2>
                <strong>{props.title}</strong>
              </h2>
            </IonText>
          </IonRow>
          <IonRow>
            <IonCol
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {profilePic && (
                <div className="ion-text-center">
                  <img
                    src={profilePic}
                    alt=""
                    className="walk-item__profile-badge profile-badge__image profile-badge__image--small"
                    width="40"
                    height="40"
                    style={{
                      marginRight: "10px",
                    }}
                  />
                </div>
              )}
              <IonText className="text-heading">
                <span className="text-body">
                  {props.userId !== userId && displayName && (
                    <>
                      by {displayName}
                      <br />
                    </>
                  )}
                  {props.type !== "curated" && (
                    <span className="ion-text-uppercase">
                      {props.start && formatDate(props.start, false)} — 
                    </span>
                  )}
                  {props.description && (
                    <span>{props.description.join(", ")}</span>
                  )}
                </span>
                <IonText
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  {props.distance && props.distance > 0.1 ? (
                    <span>
                      {props.distance.toFixed(2)} {getUnitDistance()}
                    </span>
                  ) : null}
                  {props.userId === userId &&
                  props.steps &&
                  props.steps > 0 &&
                  time &&
                  time["min"] > 0 ? (
                    <>
                      <span style={{ marginLeft: "10px" }}>
                        <IonIcon icon={walkIcon} />
                        &nbsp;
                        {numberWithCommas(props.steps)}&nbsp;
                        <span className="smallprint">steps</span>
                      </span>
                      <span style={{ marginLeft: "10px" }}>
                        <IonIcon icon={timeIcon} />
                        &nbsp;
                        {time["min"]}&nbsp;
                        <span className="smallprint">min</span>
                      </span>
                    </>
                  ) : null}
                </IonText>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
        {moments.length > 0 ? (
          <MomentsList moments={moments} colour={props.colour} />
        ) : (
          <p className="ion-text-center text-body small-print">
            No moments to show for this walk.
          </p>
        )}
      </div>
    </>
  );
};

export default WalkItem;
