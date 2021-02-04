import { IonCard, IonItem, IonIcon } from "@ionic/react";
import React from "react";
import "./Progress.css";
import { time as timeIcon, walk as walkIcon } from "ionicons/icons";
import { getUnitDistance } from "../helpers";

interface ContainerProps {
  time?: { min: 0; sec: 0 };
  steps?: number;
  distance?: number;
}

const Progress: React.FC<ContainerProps> = ({
  time = { min: 0, sec: 0 },
  steps = 0,
  distance = 0,
}) => {
  return (
    <IonCard class="progress-panel">
      <IonItem class="progress-panel__item">
        <IonIcon slot="start" icon={timeIcon} />
        {time["min"]}&nbsp;<span className="smallprint">min</span>&nbsp;
        {("0" + time["sec"]).slice(-2)}&nbsp;
        <span className="smallprint">sec</span>
      </IonItem>
      <IonItem class="progress-panel__item">
        <IonIcon slot="start" icon={walkIcon} />
        {distance?.toFixed(1)}
        <span className="smallprint">&nbsp;{getUnitDistance()}</span>&nbsp;— 
        {steps}&nbsp;<span className="smallprint">steps</span>
      </IonItem>
    </IonCard>
  );
};

export default Progress;
