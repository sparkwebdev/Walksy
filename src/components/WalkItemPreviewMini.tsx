import React, { useEffect, useState } from "react";
import { formatDate } from "../helpers";
import { IonLabel, IonNote } from "@ionic/react";

import { getUnitDistance } from "../helpers";
import { getRemoteUserData } from "../firebase";

const WalkItemPreviewMini: React.FC<{
  title?: string;
  description: string;
  start: string;
  distance: number;
  userId: string;
}> = (props) => {
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    if (props.userId) {
      getRemoteUserData(props.userId).then((data) => {
        loadUserData(data);
      });
    }
  }, [props.userId]);

  const loadUserData = (userData: any) => {
    setDisplayName(userData?.displayName);
  };

  return (
    <>
      <IonLabel className="text-heading">
        {props.title}
        <small className="small-print">
          {" "}
          by {displayName}
          <br />
          {props.description}
          <br />
          {formatDate(props.start, false)}
          {props.distance && (
            <span>
              {" "}
              — {props.distance} {getUnitDistance()}
            </span>
          )}
        </small>
      </IonLabel>
    </>
  );
};

export default WalkItemPreviewMini;
