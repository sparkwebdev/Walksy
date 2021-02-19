import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonLoading,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import Progress from "./Progress";

import { Plugins } from "@capacitor/core";
import { Pedometer } from "@ionic-native/pedometer";
import { getMinAndSec } from "../helpers";

import { Time, Location } from "../data/models";

import { checkmark as finishIcon, close as cancelIcon } from "ionicons/icons";
import AddMoment from "./AddMoment";

const { Geolocation } = Plugins;

const WalkInProgress: React.FC<{
  title: string;
  colour: string;
  onCancel: () => void;
  onFinish: (
    time: Time,
    steps: number,
    distance: number,
    endLocation?: Location | null
  ) => void;
}> = (props) => {
  const [time, setTime] = useState<Time>({
    min: 0,
    sec: 0,
  });
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  const [location, setLocation] = useState<Location | null | undefined>(
    undefined
  );
  const [cancelAlert, setCancelAlert] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      let currentLocation = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        timestamp: position.timestamp,
      };
      setLoading(false);
      setLocation(currentLocation);
    } catch (e) {
      setLoading(false);
      setLocation(null);
    }
  };

  useEffect(() => {
    let ticker: any = null;
    if (!finished) {
      let seconds: number = 0;
      ticker = setInterval(() => {
        seconds++;
        const minAndSec = getMinAndSec(seconds);
        setTime(minAndSec);
      }, 1000);
      Pedometer.startPedometerUpdates().subscribe((data) => {
        setSteps(data.numberOfSteps);
        setDistance(data.distance / 1000); // metres to km
      });
    } else {
      getLocation();
    }
    return () => {
      clearInterval(ticker);
      Pedometer.stopPedometerUpdates();
    };
  }, [finished]);

  useEffect(() => {
    if (location !== undefined) {
      props.onFinish(time, steps, distance, location);
    }
  }, [location]);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="centered-content">
      <div className="constrain constrain--medium">
        <IonCard>
          <IonCardHeader
            className="ion-no-padding"
            style={{
              backgroundColor: props.colour,
            }}
          >
            <IonCardSubtitle
              className="ion-padding ion-no-margin ion-text-uppercase ion-text-center"
              color="dark"
            >
              {props.title}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent className="ion-no-padding">
            <Progress time={time} distance={distance} steps={steps} />
            <AddMoment colour={props.colour} />
          </IonCardContent>
          <IonCardHeader className="ion-no-padding" color="light">
            <IonGrid>
              <IonRow>
                <IonCol size="5">
                  <IonButton
                    expand="block"
                    color="danger"
                    onClick={() => setCancelAlert(true)}
                  >
                    <IonIcon slot="start" icon={cancelIcon} />
                    Cancel
                  </IonButton>
                  <IonAlert
                    header={"Cancel"}
                    subHeader={"Are you sure?"}
                    buttons={[
                      {
                        text: "No",
                        role: "cancel",
                      },
                      {
                        text: "Yes",
                        cssClass: "secondary",
                        handler: props.onCancel,
                      },
                    ]}
                    isOpen={cancelAlert}
                    onDidDismiss={() => setCancelAlert(false)}
                  />
                </IonCol>
                <IonCol size="7">
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={() => {
                      setFinished(true);
                    }}
                  >
                    <IonIcon slot="start" icon={finishIcon} />
                    End Walk
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardHeader>
        </IonCard>
      </div>
      <IonLoading message={"Getting your location..."} isOpen={loading} />
    </div>
  );
};

export default WalkInProgress;
