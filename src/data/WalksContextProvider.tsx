import React, { useEffect, useState } from "react";

import { Plugins } from "@capacitor/core";
import WalksContext, { defaultWalk } from "./walks-context";
import { Walk, Moment, Location } from "../data/models";
import { storeMomentHandler } from "../firebase";
import { Filesystem, FilesystemDirectory } from "@capacitor/core";
const { Storage } = Plugins;

const WalksContextProvider: React.FC = (props) => {
  const [walk, setWalk] = useState<Walk>(defaultWalk);
  const [storedWalkId, setStoredWalkId] = useState<string>("");
  const [moments, setMoments] = useState<Moment[]>([]);
  const [storedImagesForCover, setStoredImagesForCover] = useState<string[]>(
    []
  );

  useEffect(() => {
    Storage.set({ key: "walk", value: JSON.stringify(walk) });
  }, [walk]);

  useEffect(() => {
    Storage.set({ key: "moments", value: JSON.stringify(moments) });
  }, [moments]);

  useEffect(() => {
    if (storedWalkId !== "") {
      Storage.get({ key: "userProfile" })
        .then((data) => {
          const userData = data.value ? JSON.parse(data.value) : null;
          if (userData.userId) {
            storeMoments(userData.userId);
          }
        })
        .catch((e) => {
          console.log("Couldn't get user profile", e);
        });
    }
  }, [storedWalkId]);

  const updateWalk = async (data: {}) => {
    const walkData = { ...walk, ...data };
    setWalk(walkData);
  };

  const updateWalkIdForStorage = (walkId: string) => {
    setStoredWalkId(walkId);
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

  const addStoredImagesForCover = (image: string) => {
    setStoredImagesForCover((curImages) => {
      return [...curImages, image];
    });
  };

  const updateMoments = (moments: Moment[]) => {
    setMoments(moments);
  };

  const deleteMoment = async (momentId: string) => {
    setMoments((curMoments) => {
      const remainingMoments = curMoments.filter(
        (moment) => moment.id !== momentId
      );
      return remainingMoments;
    });
  };

  const storeMoments = async (userId: string) => {
    if (storedWalkId !== "" && userId) {
      moments.forEach((moment) => {
        storeMomentHandler(moment, storedWalkId, userId)
          .then((newImagePath) => {
            if (newImagePath) {
              addStoredImagesForCover(newImagePath);
            }
            deleteMoment(moment.id);
          })
          .catch((e) => {
            console.log("Problem storing moment", e);
          });
      });
    }
  };

  const resetWalk = () => {
    setWalk(defaultWalk);
  };

  const resetMoments = async () => {
    setMoments([]);
    try {
      await Filesystem.rmdir({
        path: "moments",
        directory: FilesystemDirectory.Data,
        recursive: true,
      });
    } catch (e) {
      console.log("Couldn't reset moments. ", resetMoments);
    }
  };

  const resetStoredImagesForCover = () => {
    setStoredImagesForCover([]);
  };

  const reset = () => {
    setWalk(defaultWalk);
    resetMoments();
    setStoredWalkId("");
    resetStoredImagesForCover();
  };

  return (
    <WalksContext.Provider
      value={{
        walk,
        storedWalkId,
        updateWalkIdForStorage,
        moments,
        storedImagesForCover,
        updateWalk,
        addMoment,
        updateMoments,
        addStoredImagesForCover,
        deleteMoment,
        storeMoments,
        resetWalk,
        resetMoments,
        resetStoredImagesForCover,
        reset,
      }}
    >
      {props.children}
    </WalksContext.Provider>
  );
};

export default WalksContextProvider;
