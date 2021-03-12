import React, { useEffect, useState } from "react";
import { IonCard, IonCardContent, IonText } from "@ionic/react";

import "./WalkItem.css";
import { firestore } from "../firebase";
import { toWalk, Walk } from "../data/models";

const MomentItemPreview: React.FC<{
  walkId?: string;
  coverImage?: string;
}> = (props) => {
  const [walk, setWalk] = useState<Walk>();

  useEffect(() => {
    const walkRef = firestore.collection("users-walks").doc(props.walkId);
    walkRef.get().then((doc) => {
      setWalk(toWalk(doc));
    });
  }, [props.walkId]);

  return (
    <div className="walk-item ion-no-margin">
      {props.coverImage && walk?.title && (
        <img
          className="walk-item__cover-image"
          src={props.coverImage}
          alt={walk.title}
        />
      )}
      <IonCardContent className="walk-item__content">
        <IonText className="text-heading">
          {walk?.title && (
            <h2>
              <strong>{walk.title}</strong>
            </h2>
          )}
          {walk?.description && (
            <p>
              <strong>{walk.description}</strong>
            </p>
          )}
        </IonText>
      </IonCardContent>
    </div>
  );
};

export default MomentItemPreview;
