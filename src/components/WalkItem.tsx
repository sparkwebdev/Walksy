import React, { useEffect, useState } from "react";
import {
  formatDate,
  getMinAndSec,
  getTimeDiff,
  numberWithCommas,
} from "../helpers";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";
import Share from "../components/Share";
import { isPlatform } from "@ionic/react";

import { getUnitDistance } from "../helpers";

import { Moment, toMoment, Location } from "../data/models";

import { firestore, getRemoteUserData, storeLikeHandler } from "../firebase";
import MomentsList from "./MomentsList";
import { useAuth } from "../auth";
import {
  timerOutline as timeIcon,
  arrowUpCircleOutline as distanceIcon,
  footstepsOutline as walkIcon,
  heartOutline as likeIcon,
  heart as likedIcon,
} from "ionicons/icons";

const WalkItem: React.FC<{
  id: string;
  title?: string;
  colour?: string;
  description?: [];
  start?: string;
  end?: string;
  steps?: number;
  distance?: number;
  coverImage?: string;
  overview?: string;
  locations?: Location[];
  location?: string;
  type?: string;
  userId: string;
  shouldShare?: boolean;
}> = (props) => {
  const { userId } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");
  const timeDiff =
    props.end && props.start ? getTimeDiff(props.start, props.end) : 0;
  const time = getMinAndSec(timeDiff);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [currentUserHasLiked, setCurrentUserHasLiked] = useState<boolean>();
  const [storingLikeChoice, setStoringLikeChoice] = useState<boolean>(false);
  const [likers, setLikers] = useState<string[]>();
  const [doesLike, setDoesLike] = useState<boolean>();

  const likeHandler = () => {
    if (userId) {
      setStoringLikeChoice(true);
      setCurrentUserHasLiked(!currentUserHasLiked);
      storeLikeHandler(!currentUserHasLiked, props.id, userId)
        .then(() => {
          setStoringLikeChoice(false);
        })
        .catch(() => {
          setStoringLikeChoice(false);
        });
    }
  };

  useEffect(() => {
    if (props.userId) {
      getRemoteUserData(props.userId)
        .then((data) => {
          loadUserData(data);
        })
        .catch((e) => {
          console.log("Couldn't get remote user data", e);
        });
    }
    firestore
      .collection("users-likes")
      .doc(props.id)
      .onSnapshot((doc) => {
        setLikers(doc.data()?.users);
      });
    const momentsRef = firestore
      .collection("users-moments")
      .where("walkId", "==", props.id);
    return momentsRef.orderBy("timestamp").onSnapshot(({ docs }) => {
      setMoments(docs.map(toMoment));
    });
  }, [props.id, props.userId]);

  const loadUserData = (userData: any) => {
    setDisplayName(userData?.displayName);
  };

  return (
    <>
      <div className="ion-padding-start ion-padding-end">
        <IonGrid className="ion-margin-bottom ion-padding-bottom">
          <IonRow
            className="ion-align-items-center"
            style={{
              borderBottom: "solid 4px " + props.colour,
            }}
          >
            <IonCol>
              <IonText className="text-heading">
                <h2>
                  <strong>{props.title}</strong>
                </h2>
              </IonText>
            </IonCol>
            <IonCol size="2" className="ion-text-end">
              <div className="like-button">
                <IonButton
                  fill="clear"
                  className="ion-text-lowercase like-button__btn"
                  onClick={likeHandler}
                  disabled={storingLikeChoice}
                >
                  <div className="like-button__inner">
                    {likers?.includes(userId!) && (
                      <IonIcon
                        icon={likedIcon}
                        size="large"
                        color="tertiary"
                        className="like-button__icon"
                      />
                    )}
                    {!likers?.includes(userId!) && (
                      <IonIcon
                        icon={likeIcon}
                        size="large"
                        color="tertiary"
                        className="like-button__icon"
                      />
                    )}
                    {likers && (
                      <IonText className="like-button__count" color="dark">
                        {likers?.length} like
                        {likers?.length !== 1 && <span>s</span>}
                      </IonText>
                    )}
                  </div>
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IonText className="text-heading">
                <ul className="walk-item__meta-data text-body">
                  <li className="walk-item__details">
                    {props.start ? (
                      <span className="walk-item__detail ion-text-uppercase">
                        {formatDate(props.start, false)}
                      </span>
                    ) : null}
                    {props.location ? (
                      <span className="walk-item__detail">
                        , {props.location}
                      </span>
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
                  {props.description && props.description.length > 0 && (
                    <li className="walk-item__tags">
                      #{props.description.join(" #")}
                    </li>
                  )}
                </ul>
                <IonText
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  {props.distance && props.distance > 0.1 ? (
                    <>
                      <IonIcon icon={distanceIcon} />
                      <span>
                        {props.distance.toFixed(2)} {getUnitDistance()}
                      </span>
                    </>
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
          {props.overview && (
            <IonRow>
              <IonCol className="text-body">{props.overview}</IonCol>
            </IonRow>
          )}
        </IonGrid>
        {moments.length > 0 ? (
          <>
            <MomentsList
              moments={moments}
              locations={props.locations ? props.locations : []}
              colour={props.colour}
            />
            {isPlatform("mobile") && moments.length > 0 && (
              <Share
                shareText={`Have a look at my ${
                  props.title ? "'" + props.title + "'" : " latest walk"
                } on Walksy...`}
                shareImage={props.coverImage ? props.coverImage : ""}
                shareUrl={`https://walksy.uk/walk/${props.id}`}
                triggerShare={props.shouldShare}
              />
            )}
          </>
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
