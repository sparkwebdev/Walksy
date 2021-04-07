import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import React, { useContext } from "react";

import WalksContext from "../data/walks-context";
import MomentsList from "./MomentsList";

const NewWalkMomentsOutput: React.FC<{
  colour: string;
}> = (props) => {
  const walksCtx = useContext(WalksContext);
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="12" className="ion-text-center">
          {walksCtx.moments.length > 0 ? (
            <MomentsList
              moments={walksCtx.moments}
              colour={props.colour}
              canDelete={true}
            />
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
                Record anything that draws your attention, or&nbsp;that you see
                or hear.
              </p>
            </div>
          )}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default NewWalkMomentsOutput;
