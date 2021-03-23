import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";
import React, { useContext } from "react";

import {
  chevronDown as chevronDownIcon,
  flagOutline as flagIcon,
  map as mapIcon,
} from "ionicons/icons";
import WalksContext from "../data/walks-context";

const viewMapHandler = () => {};

const NewWalkMomentsOutput: React.FC = () => {
  const walksCtx = useContext(WalksContext);
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="ion-text-center">
          {walksCtx.moments.length > 0 ? (
            <>
              <IonText className="text-body">
                <p>
                  <IonIcon icon={flagIcon} className="icon-large" />
                </p>
                {walksCtx.moments.length} moment
                {walksCtx.moments.length !== 1 && "s"}
                <p>
                  <IonIcon icon={chevronDownIcon} className="icon-small" />
                </p>
              </IonText>
              <IonGrid>
                <IonRow>
                  <IonCol
                    className="ion-no-margin ion-no-padding"
                    size="12"
                    sizeSm="8"
                    offsetSm="2"
                  >
                    <IonButton expand="block" onClick={viewMapHandler}>
                      <IonIcon slot="start" icon={mapIcon} />
                      View on Map
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </>
          ) : (
            <div
              style={{ margin: "auto" }}
              className="constrain constrain--medium"
            >
              <img
                src="assets/img/walksy-panel.svg"
                alt=""
                style={{ maxHeight: "22vh" }}
              />
              <IonText className="ion-margin-bottom">
                <h1 className="text-heading">
                  What do you notice as&nbsp;you&nbsp;walk?
                </h1>
              </IonText>
              <p
                className="text-body"
                style={{
                  marginTop: "10px",
                }}
              >
                Record anything that draws your attention, or that you see or
                hear.
              </p>
            </div>
          )}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default NewWalkMomentsOutput;
