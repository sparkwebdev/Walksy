import {
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Moment } from "../data/models";
import { analyticsOutline as mapIcon } from "ionicons/icons";
import MapWithMarkers from "./MapWithMarkers";

const MomentsList: React.FC<{
  moments: Moment[];
  colour?: string;
  showMap?: boolean;
}> = (props) => {
  const [momentsWithLocations, setMomentsWithLocations] = useState<Moment[]>(
    []
  );
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapKey, setMapKey] = useState<number>(Math.random());

  const viewMapHandler = () => {
    setShowMap(true);
  };

  useEffect(() => {
    const momentsLoc = props.moments?.filter(
      (moment) => moment.location !== null
    );
    if (momentsLoc!.length > 0) {
      setMomentsWithLocations(momentsLoc);
    }
  }, [props.moments]);
  return (
    <>
      <IonGrid className="ion-no-padding">
        <IonRow>
          <IonCol size="2">
            <IonText
              className="text-body moments-list-count"
              style={{
                color: props.colour,
              }}
            >
              <img
                src="assets/icon/map_marker_plain.svg"
                alt=""
                className="moments-list-count__icon"
              />
              {/* <IonIcon icon={flagIcon} className="icon-large" /> */}
              <span className="moments-list-count__total">
                {props.moments.length}{" "}
              </span>
              {/* <span className="moments-list-count__label">
                moment{props.moments.length !== 1 && "s"}
              </span> */}
            </IonText>
          </IonCol>
          <IonCol size="10" sizeSm="6" offsetSm="4">
            <IonButton expand="block" onClick={viewMapHandler}>
              <IonIcon slot="start" icon={mapIcon} />
              View on Map
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <ol
        reversed
        className="moments-list constrain constrain--large"
        style={{
          color: props.colour,
        }}
      >
        {props.moments.map((moment: Moment) => (
          <li
            className={`moments-list__item moments-list__item--${
              (moment.imagePath && "photo") ||
              (moment.audioPath && "audio") ||
              (moment.note && "note")
            }`}
            key={moment.id}
          >
            {moment.imagePath && (
              <IonCard className="moments-list__image-container ion-no-margin">
                <img src={moment.imagePath} alt="" />
              </IonCard>
            )}
            {moment.audioPath && (
              <IonCard className="moments-list__audio-container ion-no-margin ion-padding">
                <audio controls className="moments-list__audio">
                  <source src={moment.audioPath} type="audio/mpeg" />
                </audio>
              </IonCard>
            )}
            {moment.note && (
              <IonCard className="moments-list__note text-body ion-no-margin">
                {moment.note.split("\n").map((str, index) => (
                  <p key={index}>{str}</p>
                ))}
              </IonCard>
            )}
          </li>
        ))}
      </ol>
      <IonModal
        isOpen={showMap}
        onDidDismiss={() => {
          setShowMap(false);
        }}
        onWillPresent={() => {
          setMapKey(Math.random());
        }}
      >
        <MapWithMarkers
          moments={momentsWithLocations}
          onDismiss={() => setShowMap(false)}
          colour={props.colour}
          key={mapKey}
        />
      </IonModal>
    </>
  );
};

export default MomentsList;
