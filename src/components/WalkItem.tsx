import React, { useEffect, useState } from "react";
import { formatDate, getMinAndSec, getTimeDiff } from "../helpers";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonText,
} from "@ionic/react";

import "./WalkItem.css";
import { getUnitDistance } from "../helpers";

import { Moment, toMoment } from "../data/models";

// import { playCircleOutline as playIcon } from "ionicons/icons";
import { firestore } from "../firebase";
import {
  image as imageIcon,
  // camera as cameraIcon,
  mic as audioIcon,
  chatbubbleEllipses as noteIcon,
} from "ionicons/icons";

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
}> = (props) => {
  // const { userId } = useAuth(); // Should auth this doc
  const timeDiff =
    props.end && props.start ? getTimeDiff(props.start, props.end) : 0;
  const time = getMinAndSec(timeDiff);
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    const momentsRef = firestore
      .collection("users-moments")
      .where("walkId", "==", props.id);
    return momentsRef.orderBy("timestamp").onSnapshot(({ docs }) => {
      setMoments(docs.map(toMoment));
    });
  }, [props.id]);

  return (
    <>
      <IonCard className="ion-no-margin walk-item-new" color="medium">
        {props.title && (
          <IonCardHeader color="primary">
            <IonCardTitle>
              <IonText color="medium" className="text-heading">
                {props.title}
              </IonText>
            </IonCardTitle>
          </IonCardHeader>
        )}
        <IonCardContent
          className="walk-item-new__content ion-no-padding"
          style={{
            borderTop: "solid 6px " + props.colour,
          }}
        >
          {props.coverImage && (
            <img
              src={props.coverImage}
              alt=""
              className="walk-item-new__image"
            />
          )}
          <div className="walk-item-new__details">
            {props.start && (
              <small className="ion-text-uppercase">
                {formatDate(props.start, false)}
              </small>
            )}
            {props.description && (
              <IonCardSubtitle>{props.description}</IonCardSubtitle>
            )}
            {((props.steps && props.steps > 0) || time["min"] > 0) && (
              <p>
                {props.distance?.toFixed(2)}
                <span className="smallprint">&nbsp;{getUnitDistance()}</span>
                &nbsp;— 
                {props.steps}&nbsp;<span className="smallprint">steps</span>
                &nbsp;— 
                <span>
                  {time["min"]}&nbsp;<span className="smallprint">min</span>
                </span>
              </p>
            )}
          </div>
        </IonCardContent>
      </IonCard>
      <ol reversed className="moments-list constrain constrain--large">
        {moments.map((moment: Moment) => (
          <>
            {moment.imagePath && (
              <li
                className="moments-list__item moments-list__item--photo"
                key={moment.timestamp}
              >
                <IonIcon
                  icon={imageIcon}
                  className="moments-list__icon"
                  style={{ color: props.colour }}
                />
                <IonCard className="moments-list__image-container ion-no-margin">
                  <img src={moment.imagePath} alt="" />
                </IonCard>
              </li>
            )}
            {moment.audioPath && (
              <li
                className="moments-list__item moments-list__item--audio"
                key={moment.timestamp}
              >
                {/* <IonIcon
                  slot="start"
                  icon={playIcon}
                  color="success"
                  style={{
                    fontSize: "65px",
                  }}
                /> */}
                <IonIcon
                  icon={audioIcon}
                  className="moments-list__icon"
                  style={{ color: props.colour }}
                />
                <audio controls className="moments-list__audio">
                  <source src={moment.audioPath} type="audio/mpeg" />
                </audio>
              </li>
            )}
            {moment.note && (
              <li
                className="moments-list__item moments-list__item--note"
                key={moment.timestamp}
              >
                <IonIcon
                  icon={noteIcon}
                  className="moments-list__icon"
                  style={{ color: props.colour }}
                />
                <IonCard className="moments-list__note text-body ion-no-margin">
                  {moment.note}
                </IonCard>
              </li>
            )}
          </>
        ))}
      </ol>
    </>
  );
};

export default WalkItem;
