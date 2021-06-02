import React, { useEffect, useState } from "react";

import { Plugins } from "@capacitor/core";
import WalksContext, { defaultWalk } from "./walks-context";
import { Walk, Moment, Location } from "../data/models";
import {
  firestore,
  deleteStoredFile,
  storeMomentHandler,
  storeFilehandler,
} from "../firebase";
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
  const [likedWalkIds, setLikedWalkIds] = useState<string[]>([]);
  const [canStoreFiles, setCanStoreFiles] = useState<boolean>(false);

  const getWalkData = async () => {
    const walkData = await Storage.get({ key: "walk" })
      .then((data) => {
        return data.value !== "undefined" && data.value
          ? JSON.parse(data.value)
          : null;
      })
      .catch((e) => {
        console.log("No walk data", e);
        return defaultWalk;
      });
    return walkData;
  };

  const getMomentsData = async () => {
    const momentsData = await Storage.get({ key: "moments" })
      .then((data) => {
        return data.value !== "undefined" && data.value
          ? JSON.parse(data.value)
          : null;
      })
      .catch((e) => {
        console.log("No moments data", e);
        return null;
      });
    return momentsData;
  };

  const readFiles = async (moments: Moment[]) => {
    const readableMoments: Moment[] = [];
    for (const moment of moments) {
      if (
        (moment.imagePath !== "" &&
          !moment.imagePath.startsWith("https://firebasestorage")) ||
        (moment.audioPath !== "" &&
          !moment.audioPath.startsWith("https://firebasestorage"))
      ) {
        await Filesystem.readFile({
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
    return readableMoments;
  };

  const getLikes = async () => {
    var liked = await firestore
      .collection("users-likes")
      .where("users", "array-contains", userId)
      .get()
      .then((query) => {
        const likedWalkIds = query.docs.map((result) => {
          return result.id;
        });
        return likedWalkIds;
      })
      .catch((error) => {
        console.log("Error getting likes:", error);
        return null;
      });
    return liked;
  };

  const initContext = async () => {
    await getWalkData().then((walkData) => {
      if (walkData) {
        setWalk(() => {
          return walkData;
        });
      } else {
        setWalk(defaultWalk);
      }
    });
    await getMomentsData().then((momentsData) => {
      if (momentsData) {
        readFiles(momentsData).then((readableMoments) => {
          setMoments(() => {
            return readableMoments;
          });
        });
      } else {
        setMoments([]);
      }
    });
    await getLikes().then((likes) => {
      if (likes) {
        setLikedWalkIds(likes);
      }
    });
    setCanStoreFiles(true);
  };

  useEffect(() => {
    initContext();
  }, []);

  useEffect(() => {
    if (walk) {
      Storage.set({ key: "walk", value: JSON.stringify(walk) });
    }
  }, [walk]);

  useEffect(() => {
    if (moments) {
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
      Storage.set({
        key: "moments",
        value: JSON.stringify(storableMoments),
      }).then(() => {
        if (canStoreFiles && moments && moments.length > 0) {
          tryStoreFiles();
        }
      });
    }
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

  const updateMoment = (momentToUpdate: Moment) => {
    setMoments((currMoments) => {
      return currMoments?.map((moment) =>
        moment.id === momentToUpdate.id ? { ...momentToUpdate } : moment
      );
    });
  };

  const deleteMoment = async (momentId: string, fileUrl: string = "") => {
    setMoments((curMoments) => {
      if (!curMoments) {
        return;
      }
      const remainingMoments = curMoments.filter(
        (moment) => moment.id !== momentId
      );
      return remainingMoments;
    });
    if (fileUrl) {
      await deleteStoredFile(fileUrl);
    }
  };

  const storeMoments = async (userId: string) => {
    if (!moments) {
      return;
    }
    if (storedWalkId !== "" && userId) {
      for (const moment of moments) {
        await storeMomentHandler(moment, storedWalkId, userId)
          .then((storedFilePath) => {
            if (storedFilePath) {
              addStoredImagesForCover(storedFilePath);
            }
            deleteMoment(moment.id);
          })
          .catch((e) => {
            console.log("Problem storing moment", e);
          });
      }
    }
  };

  const updateSetCanStoreFiles = (canStore: boolean) => {
    setCanStoreFiles(canStore);
  };

  const tryStoreFiles = async () => {
    setCanStoreFiles(false);
    const momentWithFile = moments?.find((moment) => {
      return (
        (moment.imagePath !== "" &&
          !moment.imagePath.startsWith("https://firebasestorage")) ||
        (moment.audioPath !== "" &&
          !moment.audioPath.startsWith("https://firebasestorage"))
      );
    });
    if (momentWithFile) {
      let momentToUpdate: Moment = { ...momentWithFile };
      updateMoment(momentToUpdate);
      await storeFilehandler(momentWithFile.base64Data)
        .then((newUrl) => {
          if (momentWithFile.imagePath) {
            momentToUpdate = {
              ...momentWithFile,
              imagePath: newUrl,
              base64Data: newUrl,
            };
          } else if (momentWithFile.audioPath) {
            momentToUpdate = {
              ...momentWithFile,
              audioPath: newUrl,
              base64Data: newUrl,
            };
            setCanStoreFiles(true);
          }
          updateMoment(momentToUpdate);
        })
        .catch((e) => {
          console.log("error storing file", e);
          setCanStoreFiles(true);
        });
    }
    setCanStoreFiles(true);
  };

  const updateLikes = (walkId: string, add: boolean) => {
    setLikedWalkIds((currentLikedWalkIds) => {
      if (add) {
        return [...currentLikedWalkIds, walkId];
      } else {
        return currentLikedWalkIds.filter((walk) => walkId !== walk);
      }
    });
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
        likedWalkIds,
        updateWalk,
        addMoment,
        updateMoment,
        addStoredImagesForCover,
        deleteMoment,
        storeMoments,
        updateLikes,
        canStoreFiles,
        updateSetCanStoreFiles,
        tryStoreFiles,
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
