import { IonCol, IonGrid, IonRow } from "@ionic/react";
import dayjs from "dayjs";
import React from "react";

const LocationInfo: React.FC<{
  lat?: number;
  lng?: number;
  timestamp?: string;
}> = (props) => {
  return (
    <IonGrid className="ion-text-start">
      <IonRow>
        <IonCol>
          <small>
            Latitude:
            <br />
            {props.lat}{" "}
          </small>
        </IonCol>
        <IonCol>
          <small>
            Longitude:
            <br />
            {props.lng}{" "}
          </small>
        </IonCol>
        <IonCol size="5">
          <small>
            Timestamp:
            <br />
            {dayjs(props.timestamp).format("DD/MM/YY HH:mm")}
          </small>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default LocationInfo;
