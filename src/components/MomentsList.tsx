import {
  IonButton,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";
import React from "react";
import { Moment } from "../data/models";
import { map as mapIcon } from "ionicons/icons";

const MomentsList: React.FC<{
  moments: Moment[];
}> = (props) => {
  const viewMapHandler = () => {};
  return (
    <>
      <IonGrid className="ion-no-padding">
        <IonRow>
          <IonCol size="2">
            <IonText className="text-body moments-list-count">
              <img
                src="assets/icon/map_marker.svg"
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
                key={moment.timestamp}
              >
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

export default MomentsList;
