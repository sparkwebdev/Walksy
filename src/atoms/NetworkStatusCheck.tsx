import { IonAlert, IonButton, IonIcon, IonSpinner } from "@ionic/react";
import React, { useContext, useState } from "react";
import { warningOutline as warningIcon } from "ionicons/icons";
import WalksContext from "../data/walks-context";
import { useHistory } from "react-router-dom";

const NetworkStatusCheck: React.FC<{
  title?: string;
  message?: string;
  spinner?: boolean;
  cancel?: boolean;
}> = (props) => {
  const walksCtx = useContext(WalksContext);

  const [cancelAlert, setCancelAlert] = useState<boolean>(false);
  const history = useHistory();

  const cancel = () => {
    history.push({
      pathname: "/app/home",
    });
  };
  return (
    <>
      {walksCtx.networkStatus?.connected ? (
        props.children
      ) : (
        <div className="ion-text-center constrain constrain--small">
          {props.title && (
            <div className="ion-margin-bottom">
              <h2 className="text-heading" style={{ fontSize: "2em" }}>
                {props.title}
              </h2>
            </div>
          )}
          <IonIcon icon={warningIcon} color="danger" size="large" />
          <p>
            {props.message
              ? props.message
              : "Please make sure you are connected to the Internet."}
          </p>
          {props.spinner && (
            <p>
              <IonSpinner className="ion-margin-top" color="danger" />
            </p>
          )}
          {props.cancel && (
            <IonButton
              className="ion-margin-top"
              onClick={() => setCancelAlert(true)}
            >
              Cancel?
            </IonButton>
          )}
          <IonAlert
            header="Are you sure?"
            subHeader="You can try again later."
            buttons={[
              {
                text: "No, wait",
                role: "cancel",
              },
              {
                text: "Yes",
                cssClass: "secondary",
                handler: cancel,
              },
            ]}
            isOpen={cancelAlert}
            backdropDismiss={false}
            onDidDismiss={() => setCancelAlert(false)}
          />
        </div>
      )}
    </>
  );
};

export default NetworkStatusCheck;
