import { IonButton, IonIcon } from "@ionic/react";
import React from "react";
import { footstepsOutline as walkIcon } from "ionicons/icons";

const StartWalk: React.FC = () => {
  return (
    <>
      <div className="ion-text-center ion-margin-bottom">
        <h2>
          <span className="ion-hide">Walksy</span>
          <img
            className="logo"
            src="assets/img/walksy-logo-2.svg"
            alt=""
            style={{
              maxHeight: "80px",
            }}
          />
        </h2>
        <h3 className="text-heading constrain constrain--small">
          Walking &amp; recording your&nbsp;nearby.
        </h3>
      </div>
      <div
        className="ion-text-center"
        style={{
          marginBottom: "30px",
        }}
      >
        <IonButton routerLink="/app/new-walk" color="secondary">
          <IonIcon icon={walkIcon} slot="start" />
          Start a walk
        </IonButton>
      </div>
    </>
  );
};

export default StartWalk;
