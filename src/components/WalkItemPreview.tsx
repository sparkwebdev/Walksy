import React, { useEffect, useState } from "react";
import { formatDate, getMinAndSec, getTimeDiff, loadImage } from "../helpers";
import { IonCard, IonCardContent, IonText } from "@ionic/react";

import "./WalkItem.css";
import { getUnitDistance } from "../helpers";

import { Filesystem, FilesystemDirectory } from "@capacitor/core";

const WalkItemPreview: React.FC<{
  title: string;
  colour: string;
  description: string;
  startTime: string;
  endTime: string;
  steps: number;
  distance: number;
  coverImage: string;
}> = (props) => {
  const [coverImageSrc, setCoverImageSrc] = useState<string>(
    "assets/img/placeholder.png"
  );
  const timeDiff = getTimeDiff(props.startTime, props.endTime);
  const time = getMinAndSec(timeDiff);

  useEffect(() => {
    if (props.coverImage) {
      const coverImage = loadImage(props.coverImage).then((newSrc) => {
        setCoverImageSrc(newSrc);
      });
    }
  }, [coverImageSrc]);

  return (
    <>
      <IonCard className="walk-item ion-no-margin">
        {props.coverImage && (
          <img
            className="walk-item__cover-image"
            src={coverImageSrc}
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
    </>
  );
};

export default WalkItemPreview;
