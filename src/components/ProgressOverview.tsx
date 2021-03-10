import { IonCard, IonItem, IonIcon, IonList } from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./Progress.css";
import { time as timeIcon, walk as walkIcon } from "ionicons/icons";
import { getMinAndSec, getTimeDiff, getUnitDistance } from "../helpers";
import { Time } from "../data/models";

interface ContainerProps {
  // time: string;
  steps: number;
  distance: number;
  start: string;
  end: string;
}

const ProgressOverview: React.FC<ContainerProps> = ({
  steps,
  distance,
  start,
  end,
}) => {
  const [time, setTime] = useState<Time>({
    min: 0,
    sec: 0,
  });

  useEffect(() => {
    const timeDiff = getTimeDiff(start, new Date().toISOString());
    const minAndSec = getMinAndSec(timeDiff);
    setTime(minAndSec);
  }, []);
  return (
    <IonCard className="progress-panel">
      <IonList lines="none">
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
      </IonList>
    </IonCard>
  );
};

export default ProgressOverview;
