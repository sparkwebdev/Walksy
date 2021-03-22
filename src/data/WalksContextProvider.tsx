import React, { useEffect, useState } from "react";

import { Plugins, FilesystemDirectory } from "@capacitor/core";
import WalksContext from "./walks-context";
import { Walk, Moment, Location } from "../data/models";
// import { handleStoreWalk } from "../firebase";
const { Storage, Filesystem } = Plugins;

const WalksContextProvider: React.FC = (props) => {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    const storableWalks = walks.map((walk: Walk) => {
      return {
        id: walk.id,
        title: walk.title,
        colour: walk.colour,
        description: walk.description,
        start: walk.start,
        end: walk.end,
        steps: walk.steps,
        distance: walk.distance,
        coverImage: walk.coverImage,
        locations: walk.locations,
        userId: walk.userId,
      };
    });
    Storage.set({ key: "walks", value: JSON.stringify(storableWalks) });
  }, [walks]);

  useEffect(() => {
    const storableMoments = moments.map((moment: Moment) => {
      return {
        id: moment.id,
        walkId: moment.id,
        imagePath: moment.imagePath,
        audioPath: moment.audioPath,
        note: moment.note,
        location: moment.location,
        timestamp: moment.timestamp,
      };
    });
    Storage.set({ key: "moments", value: JSON.stringify(storableMoments) });
  }, [moments]);

  const addWalk = async (
    title: string,
    colour: string,
    description: string,
    start: string,
    end: string,
    steps: number,
    distance: number,
    coverImage: string,
    locations: Location[] | [],
    userId: string
  ) => {
    const newWalk = {
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
    console.log(
      "Adding walk to local. Should be storing (to firebase) new walk minus moments: ",
      newWalk
    );

    setWalks((curWalks) => {
      return curWalks.concat(newWalk);
    });
    // const stroredWalkId = await handleStoreWalk(newWalk);
    // return stroredWalkId;
  };

  const addMoment = (
    walkId: string,
    imagePath: string,
    audioPath: string,
    note: string,
    location: Location | null,
    timestamp: string
  ) => {
    console.log("should add Moment");

    const newMoment = {
      id: new Date().getTime().toString(),
      walkId,
      imagePath,
      audioPath,
      note,
      location,
      timestamp,
    };

    setMoments((curMoments) => {
      return curMoments.concat(newMoment);
    });
  };

  const deleteMoment = (momentId: string) => {
    console.log("should delete Moment");
  };

  return (
    <WalksContext.Provider
      value={{
        walks,
        moments,
        addWalk,
        addMoment,
        deleteMoment,
      }}
    >
      {props.children}
    </WalksContext.Provider>
  );
};

export default WalksContextProvider;
