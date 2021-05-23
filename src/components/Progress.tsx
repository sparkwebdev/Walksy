import {
  IonCard,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  arrowUpCircleOutline as distanceIcon,
  footstepsOutline as walkIcon,
} from "ionicons/icons";
import {
  getMinAndSec,
  getTimeDiff,
  getUnitDistance,
  numberWithCommas,
} from "../helpers";
import { Pedometer } from "@ionic-native/pedometer";
import { Time } from "../data/models";

interface ContainerProps {
  start: string;
  updateWalk: (steps: number, distance: number) => void;
  savedSteps: number;
  savedDistance: number;
}

const Progress: React.FC<ContainerProps> = ({
  start,
  updateWalk,
  savedSteps,
  savedDistance,
}) => {
  const [time, setTime] = useState<Time>({
    min: 0,
    sec: 0,
  });
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [canCountSteps, setCanCountSteps] = useState<boolean>(false);
  const [canCountDistance, setCanCountDistance] = useState<boolean>(false);

  useEffect(() => {
    let ticker: any = null;
    let seconds = 0;
    ticker = setInterval(() => {
      const timeDiff = getTimeDiff(start, new Date().toISOString());
      const minAndSec = getMinAndSec(timeDiff);
      setTime(minAndSec);
      seconds++;
    }, 1000);
    Pedometer.isStepCountingAvailable()
      .then(() => {
        setCanCountSteps(true);
      })
      .catch((e) => {
        console.log("Step counting not available", e);
      });
    Pedometer.isDistanceAvailable()
      .then(() => {
        setCanCountDistance(true);
      })
      .catch((e) => {
        console.log("Distance not available", e);
      });

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
    updateWalk(savedSteps + steps, savedDistance + distance);
  }, [distance, steps, updateWalk]);

  return (
    <IonCard className="progress-panel" color="tertiary">
      <IonGrid>
        <IonRow className="ion-justify-content-center">
          <IonCol
            className="ion-text-center"
            style={{
              fontSize: "clamp(1em, 4vw, 1.4em)",
              padding: "10px 0",
              fontFamily: "monospace",
            }}
          >
            <IonText className="progress-panel__text" color="light">
              {/* <IonIcon
                icon={timeIcon}
                style={{
                  verticalAlign: "middle",
                  margin: "0 5px 2px 0",
                  fontSize: "1.5em",
                }}
              /> */}
              <span
                style={{
                  minWidth: "5em",
                  display: "inline-block",
                  textAlign: "left",
                }}
              >
                {time["min"]}
                <small style={{ fontSize: "2px" }}>&nbsp;</small>
                <span className="smallprint">min</span>
                <small style={{ fontSize: "5px" }}>&nbsp;</small>
                {("0" + time["sec"]).slice(-2)}
                <small style={{ fontSize: "2px" }}>&nbsp;</small>
                <span className="smallprint">sec</span>
              </span>
              <IonIcon
                icon={distanceIcon}
                style={{
                  verticalAlign: "middle",
                  margin: "0 2px 2px 3%",
                  fontSize: "1.4em",
                }}
              />
              {canCountDistance && distance > 0 ? (
                <>{(savedDistance + distance).toFixed(1)}</>
              ) : (
                <span>--</span>
              )}
              <small style={{ fontSize: "2px" }}>&nbsp;</small>
              <span className="smallprint">{getUnitDistance()}</span>
              <IonIcon
                icon={walkIcon}
                style={{
                  verticalAlign: "middle",
                  margin: "0 2px 2px 4%",
                  fontSize: "1.4em",
                }}
              />
              {canCountSteps && steps > 0 ? (
                <>{numberWithCommas(savedSteps + steps)}</>
              ) : (
                <span>--</span>
              )}
              <small style={{ fontSize: "2px" }}>&nbsp;</small>
              <span className="smallprint">steps</span>
            </IonText>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};

export default Progress;
