import { IonCard, IonItem, IonIcon, IonList } from "@ionic/react";
import React from "react";
import "./Progress.css";
import { time as timeIcon, walk as walkIcon } from "ionicons/icons";
import { getUnitDistance } from "../helpers";

interface ContainerProps {
  time?: { min: number; sec: number };
  steps?: number;
  distance?: number;
}

const Progress: React.FC<ContainerProps> = ({
  time = { min: 0, sec: 0 },
  steps = 0,
  distance = 0,
}) => {
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

export default Progress;
