import React, { useEffect, useState } from "react";

import { Plugins } from "@capacitor/core";
import WalksContext from "./walks-context";
import { Walk, Moment, Location } from "../data/models";
import { storeMomentHandler } from "../firebase";
const { Storage } = Plugins;

const WalksContextProvider: React.FC = (props) => {
  const [walk, setWalk] = useState<Walk | {}>({});
  const [storedWalkId, setStoredWalkId] = useState<string>("");
  const [moments, setMoments] = useState<Moment[]>([]);

  useEffect(() => {
    Storage.set({ key: "walk", value: JSON.stringify(walk) });
  }, [walk]);

  useEffect(() => {
    Storage.set({ key: "moments", value: JSON.stringify(moments) });
  }, [moments]);

  useEffect(() => {
    if (storedWalkId !== "") {
      Storage.get({ key: "userProfile" }).then((data) => {
        const userData = data.value ? JSON.parse(data.value) : null;
        if (userData.userId) {
          storeMoments(userData.userId);
        }
      });
      resetWalk();
    }
  }, [storedWalkId]);

  const updateWalk = async (data: {}) => {
    const newWalk = { ...walk, ...data };
    setWalk(newWalk);
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

  const deleteMoment = (momentId: string) => {
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
          .then(() => {
            deleteMoment(moment.id);
          })
          .catch((e) => {
            console.log("Problem storing moment", e);
          });
      });
    }
    if (moments.length === 0) {
      setStoredWalkId("");
    }
  };

  const resetWalk = () => {
    setWalk({});
  };

  const reset = () => {
    setWalk({});
    setMoments([]);
    setStoredWalkId("");
  };

  return (
    <WalksContext.Provider
      value={{
        walk,
        storedWalkId,
        updateWalkIdForStorage,
        moments,
        updateWalk,
        addMoment,
        deleteMoment,
        storeMoments,
        resetWalk,
        reset,
      }}
    >
      {props.children}
    </WalksContext.Provider>
  );
};

export default WalksContextProvider;
