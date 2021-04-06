import React, { useEffect, useState } from "react";
import { IonCardContent, IonText } from "@ionic/react";

import { firestore } from "../firebase";
import { toWalk, Walk } from "../data/models";

const MomentItemPreview: React.FC<{
  walkId: string;
  imageOnly?: boolean;
  showAuthor?: boolean;
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
    <div
      className={
        props.imageOnly ? "walk-item walk-item--image-only" : "walk-item"
      }
    >
      {props.coverImage && walk?.title && (
        <img
          className="walk-item__cover-image"
          src={props.coverImage}
          alt={walk.title}
          height="300"
          width="400"
        />
      )}
      {!props.imageOnly && !props.showAuthor && (
        <IonCardContent className="walk-item__content">
          <IonText className="text-heading">
            {walk?.title && (
              <h2>
                <strong>{walk.title}</strong>
              </h2>
            )}
            {walk?.description && (
              <p>
                <strong>{walk.description.join(", ")}</strong>
              </p>
            )}
          </IonText>
        </IonCardContent>
      )}
    </div>
  );
};

export default MomentItemPreview;
