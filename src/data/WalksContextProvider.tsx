import React from "react";

import WalksContext from "./walks-context";
import { Moment, Location } from "../data/models";
import { handleStoreWalk } from "../firebase";

const WalksContextProvider: React.FC = (props) => {
  const saveWalk = async (
    title: string,
    colour: string,
    description: string,
    start: string,
    end: string,
    steps: number,
    distance: number,
    moments: Moment[] | [],
    coverImage: string,
    locations: Location[] | [],
    userId: string
  ) => {
    const walkData = {
      id: new Date().getTime().toString(),
      title,
      colour,
      description,
      start,
      end,
      steps,
      distance,
      coverImage,
      locations,
      userId,
    };
    const stroredWalkId = await handleStoreWalk(walkData, moments);
    return stroredWalkId;
  };

  return (
    <WalksContext.Provider
      value={{
        saveWalk,
      }}
    >
      {props.children}
    </WalksContext.Provider>
  );
};

export default WalksContextProvider;
