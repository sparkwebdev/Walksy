import React, { useState, useEffect, useCallback } from "react";
import { Plugins, FilesystemDirectory } from "@capacitor/core";
import { base64FromPath } from "@ionic/react-hooks/filesystem";

import WalksContext, { Walk, WalkType } from "./walks-context";
import { Photo } from "../components/ImagePicker";

const { Storage, Filesystem } = Plugins;

const WalksContextProvider: React.FC = (props) => {
  const [walks, setWalks] = useState<Walk[]>([]);

  useEffect(() => {
    const storableWalks = walks.map((walk) => {
      return {
        id: walk.id,
        title: walk.title,
        imagePath: walk.imagePath,
        type: walk.type,
        startTime: walk.startTime,
        endTime: walk.endTime,
        steps: walk.steps,
        distance: walk.distance,
      };
    });
    Storage.set({ key: "walks", value: JSON.stringify(storableWalks) });
  }, [walks]);

  const addWalk = async (
    photo: Photo,
    title: string,
    type: WalkType,
    startTime: string,
    endTime: string,
    steps: number,
    distance: number
  ) => {
    const fileName = new Date().getTime() + ".jpeg";

    const base64 = await base64FromPath(photo.preview);
    Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: FilesystemDirectory.Data,
    });

    const newWalk: Walk = {
      id: Math.random().toString(),
      title,
      type,
      startTime,
      endTime,
      steps,
      distance,
      imagePath: fileName,
      base64Url: base64,
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
      const file = await Filesystem.readFile({
        path: storedWalk.imagePath,
        directory: FilesystemDirectory.Data,
      });
      loadedWalks.push({
        id: storedWalk.id,
        title: storedWalk.title,
        type: storedWalk.type,
        startTime: storedWalk.startTime,
        endTime: storedWalk.endTime,
        steps: storedWalk.steps,
        distance: storedWalk.distance,
        imagePath: storedWalk.imagePath,
        base64Url: "data:image/jpeg;base64," + file.data,
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
