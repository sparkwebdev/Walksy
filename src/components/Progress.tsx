import {
  IonCard,
  IonItem,
  IonIcon,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./Progress.css";
import {
  timerOutline as timeIcon,
  arrowUpCircleOutline as distanceIcon,
  footstepsOutline as walkIcon,
} from "ionicons/icons";
import { getMinAndSec, getTimeDiff, getUnitDistance } from "../helpers";
import { Pedometer } from "@ionic-native/pedometer";
import { Time } from "../data/models";

interface ContainerProps {
  start: string;
  updateWalk: (steps: number, distance: number) => void;
}

const Progress: React.FC<ContainerProps> = ({ start, updateWalk }) => {
  const [time, setTime] = useState<Time>({
    min: 0,
    sec: 0,
  });
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    let ticker: any = null;
    ticker = setInterval(() => {
      const timeDiff = getTimeDiff(start, new Date().toISOString());
      const minAndSec = getMinAndSec(timeDiff);
      setTime(minAndSec);
    }, 1000);
    Pedometer.startPedometerUpdates().subscribe((data) => {
      setSteps(data.numberOfSteps);
      setDistance(data.distance / 1000); // metres to km
    });
    return () => {
      clearInterval(ticker);
      Pedometer.stopPedometerUpdates();
    };
  }, [start]);

  useEffect(() => {
    updateWalk(steps, distance);
  }, [distance, steps, updateWalk]);

  return (
    <IonCard className="progress-panel" color="dark">
      <IonGrid>
        <IonRow className="ion-justify-content-center">
          <IonCol
            className="ion-text-center"
            style={{
              fontSize: "1.15em",
              padding: "10px 0",
            }}
          >
            <IonIcon
              icon={timeIcon}
              style={{
                verticalAlign: "middle",
                margin: "0 5px 2px 0",
                fontSize: "1.5em",
              }}
            />
            <span
              style={{
                minWidth: "6rem",
                display: "inline-block",
                textAlign: "left",
              }}
            >
              {time["min"]}&nbsp;<span className="smallprint">min</span>&nbsp;
              {("0" + time["sec"]).slice(-2)}&nbsp;
              <span className="smallprint">sec</span>
            </span>
            <IonIcon
              icon={distanceIcon}
              style={{
                verticalAlign: "middle",
                margin: "0 5px 2px 5%",
                fontSize: "1.5em",
              }}
            />
            {distance?.toFixed(1)}
            <span className="smallprint">&nbsp;{getUnitDistance()}</span>
            <IonIcon
              icon={walkIcon}
              style={{
                verticalAlign: "middle",
                margin: "0 5px 2px 6%",
                fontSize: "1.5em",
              }}
            />
            {steps}&nbsp;<span className="smallprint">steps</span>
          </IonCol>
        </IonRow>
      </IonGrid>
      {/* <IonList lines="none">
        <IonItem className="progress-panel__item">
          <IonIcon slot="start" icon={timeIcon} color="primary-contrast" />
          {time["min"]}&nbsp;<span className="smallprint">min</span>&nbsp;
          {("0" + time["sec"]).slice(-2)}&nbsp;
          <span className="smallprint">sec</span>
        </IonItem>
        <IonItem className="progress-panel__item">
          <IonIcon slot="start" icon={walkIcon} color="primary-contrast" />
          {distance?.toFixed(1)}
          <span className="smallprint">&nbsp;{getUnitDistance()}</span>&nbsp;— 
          {steps}&nbsp;<span className="smallprint">steps</span>
        </IonItem>
      </IonList> */}
    </IonCard>
  );
};

export default Progress;
