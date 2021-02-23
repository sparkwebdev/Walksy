import React, { useState, useEffect, useCallback } from "react";
import { Plugins, FilesystemDirectory } from "@capacitor/core";
import { base64FromPath } from "@ionic/react-hooks/filesystem";

import WalksContext from "./walks-context";
import { Walk, WalkType, Moment, Location } from "../data/models";

const { Storage, Filesystem } = Plugins;

const WalksContextProvider: React.FC = (props) => {
  const [walks, setWalks] = useState<Walk[]>([]);

  useEffect(() => {
    const storableWalks = walks.map((walk) => {
      return {
        id: walk.id,
        title: walk.title,
        colour: walk.colour,
        description: walk.description,
        type: walk.type,
        startTime: walk.startTime,
        endTime: walk.endTime,
        steps: walk.steps,
        distance: walk.distance,
        moments: walk.moments,
        coverImage: walk.coverImage,
        locations: walk.locations,
      };
    });
    Storage.set({ key: "walks", value: JSON.stringify(storableWalks) });
  }, [walks]);

  const addWalk = async (
    title: string,
    colour: string,
    description: string,
    type: WalkType,
    startTime: string,
    endTime: string,
    steps: number,
    distance: number,
    moments: Moment[] | [],
    coverImage: string,
    locations: Location[] | []
  ) => {
    /* Redundant — needs fixed */
    const fileName = new Date().getTime() + ".jpeg";
    const base64 = await base64FromPath("");
    Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: FilesystemDirectory.Data,
    });
    /* Redundant — needs fixed */

    const newWalk: Walk = {
      id: new Date().getTime().toString(),
      title,
      colour,
      description,
      type,
      startTime,
      endTime,
      steps,
      distance,
      moments,
      coverImage,
      locations,
    };
    setWalks((curWalks) => {
      return [...curWalks, newWalk];
    });
  };

  const initContext = useCallback(async () => {
    const walksData = await Storage.get({ key: "walks" });
    const storedWalks = walksData.value ? JSON.parse(walksData.value) : [];
    const loadedWalks: Walk[] = [];
    for (const storedWalk of storedWalks) {
      loadedWalks.push({
        id: storedWalk.id,
        title: storedWalk.title,
        colour: storedWalk.colour,
        description: storedWalk.description,
        type: storedWalk.type,
        startTime: storedWalk.startTime,
        endTime: storedWalk.endTime,
        steps: storedWalk.steps,
        distance: storedWalk.distance,
        moments: storedWalk.moments,
        coverImage: storedWalk.coverImage,
        locations: storedWalk.locations,
      });
    }
    setWalks(loadedWalks);
  }, []);

  return (
    <WalksContext.Provider
      value={{
        walks,
        addWalk,
        initContext,
      }}
    >
      {props.children}
    </WalksContext.Provider>
  );
};

export default WalksContextProvider;
