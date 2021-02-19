import React, { useContext } from "react";
import { IonRow, IonCol, IonGrid, IonItem } from "@ionic/react";

import WalkItem from "./WalkItem";
import WalksContext from "../data/walks-context";
import { Link } from "react-router-dom";

const WalksList: React.FC<{ title: string; type: "user" | "guided" }> = (
  props
) => {
  const walksCtx = useContext(WalksContext);

  const walks = walksCtx.walks.filter((walk) => walk.type === props.type);

  return (
    <div className="ion-no-margin ion-no-padding">
      {props.title && <h2>{props.title}</h2>}
      {walks.map((walk) => (
        <Link
          key={walk.id}
          to={`/app/walk/${walk.id}`}
          className="ion-no-margin ion-no-padding"
        >
          <WalkItem
            // image={walk.base64Url}
            title={walk.title}
            colour={walk.colour}
            description={walk.description}
            startTime={walk.startTime}
            endTime={walk.endTime}
            steps={walk.steps}
            distance={walk.distance}
          />
        </Link>
      ))}
    </div>
  );
};

export default WalksList;
