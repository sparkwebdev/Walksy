import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  isPlatform,
} from "@ionic/react";
import { add } from "ionicons/icons";

import WalksList from "./WalksList";
import { Walk } from "../data/walks-context";
import ToolbarAction from "./ToolbarAction";

const WalksContent: React.FC<{
  title: string;
  fallbackText: string;
  walks: Walk[];
}> = (props) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{props.title}</IonTitle>
          <ToolbarAction link="/new-walk" icon={add} />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          {props.walks.length === 0 && (
            <IonRow>
              <IonCol className="ion-text-center">
                <h2>{props.fallbackText}</h2>
              </IonCol>
            </IonRow>
          )}
          <WalksList items={props.walks} />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WalksContent;
