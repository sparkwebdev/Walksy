import React, { useState, useEffect, useCallback } from "react";
import { Plugins, FilesystemDirectory } from "@capacitor/core";
import { base64FromPath } from "@ionic/react-hooks/filesystem";

import WalksContext, { Walk, WalkType, Moment } from "./walks-context";
import { Photo } from "../components/ImagePicker";

const { Storage, Filesystem } = Plugins;

const WalksContextProvider: React.FC = (props) => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [walks, setWalks] = useState<Walk[]>([]);

  useEffect(() => {
    const storableWalks = walks.map((walk) => {
      return {
        id: walk.id,
        title: walk.title,
        colour: walk.colour,
        description: walk.description,
        imagePath: walk.imagePath,
        type: walk.type,
        startTime: walk.startTime,
        endTime: walk.endTime,
        steps: walk.steps,
        distance: walk.distance,
        moments: moments,
      };
    });
    Storage.set({ key: "walks", value: JSON.stringify(storableWalks) });
  }, [walks]);

  const addMoment = async (
    photo: Photo | null,
    note: string,
    lat: number,
    long: number,
    timestamp: number
  ) => {
    let fileName = null;
    if (photo) {
      const base64 = await base64FromPath(photo.preview);
      fileName = new Date().getTime() + ".jpeg";
      Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: FilesystemDirectory.Data,
      });
    }

    const newMoment: Moment = {
      id: Math.random().toString(),
      imagePath: fileName,
      // base64Url: base64,
      note: note,
      lat: lat,
      long: long,
      timestamp: timestamp,
    };
    setMoments((curWalks) => {
      return [...curWalks, newMoment];
    });
  };

  const resetMoments = () => {
    setMoments([]);
  };

  const addWalk = async (
    photo: Photo,
    title: string,
    colour: string,
    description: string,
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
      colour,
      description,
      type,
      startTime,
      endTime,
      steps,
      distance,
      imagePath: fileName,
      base64Url: base64,
      moments: moments,
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
        colour: storedWalk.colour,
        description: storedWalk.description,
        type: storedWalk.type,
        startTime: storedWalk.startTime,
        endTime: storedWalk.endTime,
        steps: storedWalk.steps,
        distance: storedWalk.distance,
        imagePath: storedWalk.imagePath,
        base64Url: "data:image/jpeg;base64," + file.data,
        moments: storedWalk.moments,
      });
    }
    setWalks(loadedWalks);
  }, []);

  return (
    <WalksContext.Provider
      value={{
        walks,
        moments,
        addMoment,
        addWalk,
        initContext,
      }}
    >
      {props.children}
    </WalksContext.Provider>
  );
};

export default WalksContextProvider;
