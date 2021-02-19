import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/react";
import React, { useState } from "react";

import { Time } from "../data/models";
import { checkmark as finishIcon } from "ionicons/icons";
import Progress from "./Progress";

const WalkPostSettings: React.FC<{
  title: string;
  colour: string;
  start: string;
  end: string;
  time: Time;
  steps: number;
  distance: number;
  onSave: (description: string) => void;
}> = (props) => {
  const [description, setDescription] = useState("");

  return (
    <div className="centered-content">
      <div className="constrain constrain--medium">
        <IonCard>
          <IonCardHeader
            className="ion-no-padding"
            color="tertiary"
            style={{
              backgroundColor: props.colour,
            }}
          >
            <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
              Well done!
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent className="ion-no-padding">
            <Progress
              time={props.time}
              distance={props.distance}
              steps={props.steps}
            />
            <IonList>
              <IonItem className="ion-margin-top">
                <IonLabel position="stacked">
                  Give this walk a short description...
                </IonLabel>
                <IonInput
                  type="text"
                  value={description}
                  onIonChange={(event) => setDescription(event.detail!.value!)}
                />
              </IonItem>
            </IonList>
          </IonCardContent>
          <IonCardHeader
            className="ion-margin-top ion-no-padding"
            color="light"
          >
            <IonCardSubtitle>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeSm="8" offsetSm="2">
                    <IonButton
                      expand="block"
                      color="success"
                      disabled={description === ""}
                      onClick={() => {
                        props.onSave(description);
                      }}
                    >
                      <IonIcon slot="start" icon={finishIcon} />
                      Save
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>
      </div>
    </div>
  );
};

export default WalkPostSettings;
