import React, { useEffect, useState } from "react";
import { formatDate, getMinAndSec, getTimeDiff } from "../helpers";
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

import { Moment } from "../data/models";

import {
  chevronDown as chevronDownIcon,
  flagOutline as flagIcon,
  map as mapIcon,
} from "ionicons/icons";
import { Filesystem, FilesystemDirectory } from "@capacitor/core";

const WalkItem: React.FC<{
  displayMoments: boolean;
  title: string;
  colour: string;
  description: string;
  startTime: string;
  endTime: string;
  steps: number;
  distance: number;
  moments?: Moment[];
}> = (props) => {
  const [coverImageSrc, setCoverImageSrc] = useState<string>(
    "assets/img/placeholder.png"
  );
  const [momentsNew, setMomentsNew] = useState<Moment[] | null>();
  const timeDiff = getTimeDiff(props.startTime, props.endTime);
  const time = getMinAndSec(timeDiff);
  const viewMapHandler = async () => {
    console.log("View map");
  };
  const getCoverImage = async (imagePath: string) => {
    const file = await Filesystem.readFile({
      path: imagePath,
      directory: FilesystemDirectory.Data,
    });
    return "data:image/jpeg;base64," + file.data;
  };

  const momentsWithImages = async (moments: Moment[]) => {
    return Promise.all(
      moments.map((moment: Moment) => {
        var temp = Object.assign({}, moment);
        getCoverImage(moment!.imagePath!).then((data) => {
          temp.imagePath = data;
        });
        return temp;
      })
    ).then((data) => {
      setMomentsNew(data);
    });
  };

  useEffect(() => {
    if (props.moments) {
      const firstMomentImage = props.moments.find((moment) => {
        return moment.imagePath !== null;
      });
      if (firstMomentImage) {
        const firstMomentImageSrc = getCoverImage(
          firstMomentImage!.imagePath!
        ).then((data) => {
          setCoverImageSrc(data);
        });
      }
      if (props.displayMoments) {
        momentsWithImages(props!.moments!);
      }
    }
  }, []);

  return (
    <>
      <IonCard className="walk-item ion-no-margin">
        {coverImageSrc && (
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

      {momentsNew && props.displayMoments && (
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
          {momentsNew.map((moment: Moment) => (
            <IonCard key={moment.id} className="walk-item__moment">
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
      )}
    </>
  );
};

export default WalkItem;
