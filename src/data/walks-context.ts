import React from 'react';

import { Walk, Moment, Location } from "../data/models";

interface Context {
  walk: Walk | {};
  storedWalkId: string;
  updateWalkIdForStorage: (walkId: string) => void,
  moments: Moment[];
  updateWalk: ({}) => void;
  addMoment: (walkId: string, imagePath: string, audioPath: string, note: string, location: Location | null, timestamp: string) => void;
  updateMoments: (moments: Moment[]) => void;
  deleteMoment: (momentId: string) => void;
  storeMoments: (userId: string) => void;
  resetWalk: () => void;
  resetMoments: () => void;
  reset: () => void;
}

const WalksContext = React.createContext<Context>({
  walk: {},
  storedWalkId: "",
  updateWalkIdForStorage: () => {},
  moments: [],
  updateWalk: () => {},
  addMoment: () => {},
  updateMoments: () => {},
  deleteMoment: () => {},
  storeMoments: () => {},
  resetWalk: () => {},
  resetMoments: () => {},
  reset: () => {},
});

export default WalksContext;
