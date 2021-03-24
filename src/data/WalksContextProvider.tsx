import React, { useEffect, useState } from "react";

import { Plugins } from "@capacitor/core";
import WalksContext from "./walks-context";
import { Walk, Moment, Location } from "../data/models";
const { Storage } = Plugins;

const WalksContextProvider: React.FC = (props) => {
  const [walk, setWalk] = useState<Walk | {}>({});
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    Storage.set({ key: "walk", value: JSON.stringify(walk) });
  }, [walk]);

  useEffect(() => {
    Storage.set({ key: "moments", value: JSON.stringify(moments) });
  }, [moments]);

  const updateWalk = async (data: {}) => {
    const newWalk = { ...walk, ...data };

    setWalk(newWalk);
  };

  const addMoment = (
    walkId: string,
    imagePath: string,
    audioPath: string,
    note: string,
    location: Location | null,
    timestamp: string
  ) => {
    const newMoment: Moment = {
      id: new Date().getTime().toString(),
      walkId,
      imagePath,
      audioPath,
      note,
      location,
      timestamp,
    };

    setMoments((curMoments) => {
      return [newMoment].concat(curMoments);
    });
  };

  const deleteMoment = (momentId: string) => {
    console.log("should delete Moment: ", momentId);
  };

  const reset = () => {
    setWalk({});
    setMoments([]);
  };

  return (
    <WalksContext.Provider
      value={{
        walk,
        moments,
        updateWalk,
        addMoment,
        deleteMoment,
        reset,
      }}
    >
      {props.children}
    </WalksContext.Provider>
  );
};

export default WalksContextProvider;
