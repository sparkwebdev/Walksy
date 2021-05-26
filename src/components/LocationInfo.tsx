import { IonCol, IonGrid, IonRow } from "@ionic/react";
import dayjs from "dayjs";
import React from "react";

const LocationInfo: React.FC<{
  lat?: number;
  lng?: number;
  timestamp?: number;
}> = (props) => {
  return (
    <IonGrid className="ion-text-start">
      <IonRow>
        <IonCol>
          <small>Latitude: </small>
          <br />
          {props.lat}
        </IonCol>
        <IonCol>
          <small>Longitude: </small>
          <br />
          {props.lng}
        </IonCol>
        <IonCol>
          <small>Timestamp: </small>
          <br />
          {dayjs(props.timestamp).format("HH:mm:ss DD/MM/YY")}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default LocationInfo;
