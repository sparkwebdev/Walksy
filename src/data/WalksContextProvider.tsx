import React, { useEffect, useState } from "react";

import { Plugins } from "@capacitor/core";
import WalksContext, { defaultWalk } from "./walks-context";
import { Walk, Moment, Location } from "../data/models";
import { storeMomentHandler } from "../firebase";
import { Filesystem, FilesystemDirectory } from "@capacitor/core";
import { useAuth } from "../auth";
const { Storage } = Plugins;

const WalksContextProvider: React.FC = (props) => {
  const { userId } = useAuth();
  const [walk, setWalk] = useState<Walk>();
  const [storedWalkId, setStoredWalkId] = useState<string>("");
  const [moments, setMoments] = useState<Moment[]>();
  const [storedImagesForCover, setStoredImagesForCover] = useState<string[]>(
    []
  );

  const initContext = () => {
    Storage.get({ key: "walk" })
      .then((data) => {
        const walkData = data.value ? JSON.parse(data.value) : null;
        if (walkData) {
          setWalk(walkData);
        } else {
          setWalk(defaultWalk);
        }
      })
      .catch((e) => {
        setWalk(defaultWalk);
        console.log("No walk data", e);
      });

    Storage.get({ key: "moments" })
      .then((data) => {
        if (data) {
          const momentsData = data.value ? JSON.parse(data.value) : null;
          if (momentsData) {
            const readableMoments: Moment[] = [];
            for (const moment of momentsData) {
              if (moment.imagePath || moment.audioPath) {
                Filesystem.readFile({
                  path: `moments/${moment.imagePath || moment.audioPath}`,
                  directory: FilesystemDirectory.Data,
                }).then((file) => {
                  readableMoments.push({
                    id: moment.id,
                    walkId: moment.walkId,
                    imagePath: moment.imagePath,
                    audioPath: moment.audioPath,
                    base64Data: `data:${
                      moment.imagePath ? "image/jpeg" : "audio/aac"
                    };base64,${file.data}`,
                    note: moment.note,
                    location: moment.location,
                    timestamp: moment.timestamp,
                  });
                });
              } else {
                readableMoments.push(moment);
              }
            }
            setMoments(readableMoments);
          }
        } else {
          setMoments([]);
        }
      })
      .catch((e) => {
        setMoments([]);
        console.log("No moments data", e);
      });
  };

  useEffect(() => {
    initContext();
  }, []);

  useEffect(() => {
    Storage.set({ key: "walk", value: JSON.stringify(walk) });
  }, [walk]);

  useEffect(() => {
    const storableMoments = moments?.map((moment) => {
      return {
        id: moment.id,
        walkId: moment.walkId,
        imagePath: moment.imagePath,
        audioPath: moment.audioPath,
        note: moment.note,
        location: moment.location,
        timestamp: moment.timestamp,
      };
    });
    Storage.set({ key: "moments", value: JSON.stringify(storableMoments) });
  }, [moments]);

  useEffect(() => {
    if (storedWalkId !== "" && userId) {
      storeMoments(userId);
    }
  }, [storedWalkId]);

  const updateWalk = async (data: {}) => {
    if (walk) {
      const walkData = { ...walk, ...data };
      setWalk(walkData);
    }
  };

  const updateWalkIdForStorage = (walkId: string) => {
    setStoredWalkId(walkId);
  };

  const addMoment = (
    walkId: string,
    imagePath: string,
    audioPath: string,
    base64Data: string,
    note: string,
    location: Location | null,
    timestamp: string
  ) => {
    const newMoment: Moment = {
      id: new Date().getTime().toString(),
      walkId,
      imagePath,
      audioPath,
      base64Data,
      note,
      location,
      timestamp,
    };

    setMoments((curMoments) => {
      if (!curMoments) {
        return;
      }
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
      if (!curMoments) {
        return;
      }
      const remainingMoments = curMoments.filter(
        (moment) => moment.id !== momentId
      );
      return remainingMoments;
    });
  };

  const storeMoments = async (userId: string) => {
    if (!moments) {
      return;
    }
    if (storedWalkId !== "" && userId) {
      for (const moment of moments) {
        await storeMomentHandler(moment, storedWalkId, userId)
          .then((newImagePath) => {
            if (newImagePath) {
              addStoredImagesForCover(newImagePath);
            }
            deleteMoment(moment.id);
          })
          .catch((e) => {
            console.log("Problem storing moment", e);
          });
      }
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
      console.log("Couldn't reset moments.", e);
    }
  };

  const resetStoredImagesForCover = () => {
    setStoredImagesForCover([]);
  };

  const reset = () => {
    resetWalk();
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
