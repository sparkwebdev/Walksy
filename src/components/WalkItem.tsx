import React, { useEffect, useState } from "react";
import { formatDate, getMinAndSec, getTimeDiff, loadImage } from "../helpers";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";

import "./WalkItem.css";
import { getUnitDistance } from "../helpers";

import { Moment } from "../data/models";

import {
  chevronDown as chevronDownIcon,
  flagOutline as flagIcon,
  map as mapIcon,
} from "ionicons/icons";
import { Filesystem, FilesystemDirectory } from "@capacitor/core";

const WalkItem: React.FC<{
  title: string;
  colour: string;
  description: string;
  startTime: string;
  endTime: string;
  steps: number;
  distance: number;
  moments: Moment[] | [];
}> = (props) => {
  const timeDiff = getTimeDiff(props.startTime, props.endTime);
  const time = getMinAndSec(timeDiff);
  const [moments, setMoments] = useState<Moment[]>([]);

  const momentsWithImages = async (moments: Moment[]) => {
    return Promise.all(
      moments.map((moment: Moment) => {
        var temp = Object.assign({}, moment);
        if (moment.imagePath) {
          loadImage(moment!.imagePath!).then((data) => {
            temp.imagePath = data;
          });
        }
        return temp;
      })
    ).then((data) => {
      // setMoments(data);
    });
  };

  useEffect(() => {
    if (props.moments) {
      momentsWithImages(props.moments);
    }
  }, []);

  return (
    <>
      <IonCard className="ion-no-margin">
        <IonCardHeader>
          <small className="ion-text-uppercase">
            {formatDate(props.startTime, false)}
          </small>
          {props.title && <IonCardTitle>{props.title}</IonCardTitle>}
          {props.description && (
            <IonCardSubtitle>{props.description}</IonCardSubtitle>
          )}
          {(props.steps > 0 || time["min"] > 0) && (
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
        </IonCardHeader>
        <IonCardContent
          style={{
            borderTop: "solid 10px " + props.colour,
          }}
        >
          {moments.map((moment: Moment, index) => (
            <IonCard key={index} className="walk-item__moment">
              {moment.imagePath}
              {moment.imagePath && (
                <img
                  className="walk-item__moment-image"
                  src={moment.imagePath}
                  alt=""
                />
              )}
              {moment.note && (
                <IonCardContent className="walk-item__moment-note">
                  <IonText>{moment.note}</IonText>
                </IonCardContent>
              )}
            </IonCard>
          ))}
        </IonCardContent>
        {/* 
      </IonCard> */}
        {/* {momentsNew && props.displayMoments && (
        <div className="constrain constrain--medium">
          <IonText className="text-body ion-text-center">
            <p>
              <IonIcon icon={flagIcon} className="icon-large" />
              <br />
              {momentsNew.length} moment
              {momentsNew.length !== 1 && "s"}
              <br />
              <IonIcon icon={chevronDownIcon} className="icon-small" />
            </p>
          </IonText>
          {momentsNew.map((moment: Moment, index) => (
            <IonCard key={index} className="walk-item__moment">
              {moment.imagePath}
              {moment.imagePath && (
                <img
                  className="walk-item__moment-image"
                  src={moment.imagePath}
                  alt=""
                />
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
        </div>
      )} */}
      </IonCard>
    </>
  );
};

export default WalkItem;
