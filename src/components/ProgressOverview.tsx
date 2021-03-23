import { IonCard, IonIcon, IonGrid, IonRow, IonCol } from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./Progress.css";
import {
  timerOutline as timeIcon,
  arrowUpCircleOutline as distanceIcon,
  footstepsOutline as walkIcon,
} from "ionicons/icons";
import { getMinAndSec, getTimeDiff, getUnitDistance } from "../helpers";
import { Time } from "../data/models";

interface ContainerProps {
  steps: number;
  distance: number;
  start: string;
  end: string;
}

const ProgressOverview: React.FC<ContainerProps> = ({
  steps,
  distance,
  start,
}) => {
  const [time, setTime] = useState<Time>({
    min: 0,
    sec: 0,
  });

  useEffect(() => {
    const timeDiff = getTimeDiff(start, new Date().toISOString());
    const minAndSec = getMinAndSec(timeDiff);
    setTime(minAndSec);
  }, [start]);
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
    </IonCard>
  );
};

export default ProgressOverview;
