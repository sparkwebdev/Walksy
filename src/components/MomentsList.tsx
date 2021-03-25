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
import { map as mapIcon } from "ionicons/icons";
import MapWithMarkers from "./MapWithMarkers";

const MomentsList: React.FC<{
  moments: Moment[];
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
            <IonText className="text-body moments-list-count">
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
          <IonCol size="10" sizeSm="8" offsetSm="2">
            <IonButton expand="block" onClick={viewMapHandler}>
              <IonIcon slot="start" icon={mapIcon} />
              View on Map
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <ol reversed className="moments-list constrain constrain--large">
        {props.moments.map((moment: Moment) => (
          <>
            {moment.imagePath && (
              <li
                className="moments-list__item moments-list__item--photo"
                key={moment.id}
              >
                <IonCard className="moments-list__image-container ion-no-margin">
                  <img src={moment.imagePath} alt="" />
                </IonCard>
              </li>
            )}
            {moment.audioPath && (
              <li
                className="moments-list__item moments-list__item--audio"
                key={moment.id}
              >
                <audio controls className="moments-list__audio">
                  <source src={moment.audioPath} type="audio/mpeg" />
                </audio>
              </li>
            )}
            {moment.note && (
              <li
                className="moments-list__item moments-list__item--note"
                key={moment.id}
              >
                <IonCard className="moments-list__note text-body ion-no-margin">
                  {moment.note}
                </IonCard>
              </li>
            )}
          </>
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
          key={mapKey}
        />
      </IonModal>
    </>
  );
};

export default MomentsList;
