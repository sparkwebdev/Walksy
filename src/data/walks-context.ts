import React from 'react';

import { Walk, Moment, Location } from "../data/models";

interface Context {
  walk: Walk | {};
  storedWalkId: string;
  updateWalkIdForStorage: (walkId: string) => void,
  moments: Moment[];
  storedImagesForCover: string[];
  updateWalk: ({}) => void;
  addMoment: (walkId: string, imagePath: string, audioPath: string, note: string, location: Location | null, timestamp: string) => void;
  updateMoments: (moments: Moment[]) => void;
  addStoredImagesForCover: (image: string) => void,
  deleteMoment: (momentId: string) => void;
  storeMoments: (userId: string) => void;
  resetWalk: () => void;
  resetMoments: () => void;
  resetStoredImagesForCover: () => void;
  reset: () => void;
}

const WalksContext = React.createContext<Context>({
  walk: {},
  storedWalkId: "",
  updateWalkIdForStorage: () => {},
  moments: [],
  storedImagesForCover: [],
  updateWalk: () => {},
  addMoment: () => {},
  updateMoments: () => {},
  addStoredImagesForCover: () => {},
  deleteMoment: () => {},
  storeMoments: () => {},
  resetWalk: () => {},
  resetMoments: () => {},
  resetStoredImagesForCover: () => {},
  reset: () => {},
});

export default WalksContext;
