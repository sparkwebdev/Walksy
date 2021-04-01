import React, { useEffect, useState } from "react";
import { formatDate } from "../helpers";
import { IonLabel } from "@ionic/react";

import { getUnitDistance } from "../helpers";
import { getRemoteUserData } from "../firebase";

const WalkItemPreviewMini: React.FC<{
  title?: string;
  description: [];
  start: string;
  distance: number;
  userId: string;
}> = (props) => {
  const [displayName, setDisplayName] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");

  useEffect(() => {
    if (props.userId) {
      getRemoteUserData(props.userId).then((data) => {
        loadUserData(data);
      });
    }
  }, [props.userId]);

  const loadUserData = (userData: any) => {
    setDisplayName(userData?.displayName);
    setProfilePic(userData?.profilePic);
  };

  return (
    <IonLabel className="text-heading">
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {profilePic && (
          <img
            src={profilePic}
            alt=""
            className="walk-item__profile-badge profile-badge__image profile-badge__image--smaller"
            width="40"
            height="40"
            style={{ marginRight: "10px" }}
          />
        )}
        <div>
          {props.title}
          <small
            className="small-print"
            style={{ lineHeight: "1.2em", fontSize: "0.9em" }}
          >
            <br /> by {displayName}
            <br />
            <span className="ion-text-uppercase">
              {formatDate(props.start, false)}
            </span>
            {props.distance > 0.1 && (
              <span>
                , {props.distance.toFixed(2)} {getUnitDistance()}
              </span>
            )}
            {props.description && (
              <span> — {props.description.join(", ")}</span>
            )}
          </small>
        </div>
      </div>
    </IonLabel>
  );
};

export default WalkItemPreviewMini;
