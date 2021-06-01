import React from 'react';

import { Walk, Moment, Location } from "../data/models";

export const defaultWalk: Walk = {
  id: "",
  title: "",
  colour: "#00ccb3",
  description: [],
  start: "",
  end: "",
  steps: 0,
  distance: 0,
  coverImage: "",
  locations: [],
  userId: "",
  type: "user",
  overview: "",
  location: "",
  circular: false,
};

interface Context {
  walk?: Walk;
  storedWalkId: string;
  updateWalkIdForStorage: (walkId: string) => void,
  moments?: Moment[];
  storedImagesForCover: string[];
  likedWalkIds: string[];
  updateWalk: ({}) => void;
  addMoment: (walkId: string, imagePath: string, audioPath: string, base64Data: string, note: string, location: Location | null, timestamp: string) => void;
  addStoredImagesForCover: (image: string) => void,
  deleteMoment: (momentId: string) => void;
  storeMoments: (userId: string) => void;
  updateLikes: (walkId: string, add: boolean) => void;
  resetWalk: () => void;
  resetMoments: () => void;
  resetStoredImagesForCover: () => void;
  reset: () => void;
}

const WalksContext = React.createContext<Context>({
  walk: defaultWalk,
  storedWalkId: "",
  updateWalkIdForStorage: () => {},
  moments: [],
  storedImagesForCover: [],
  likedWalkIds: [],
  updateWalk: () => {},
  addMoment: () => {},
  addStoredImagesForCover: () => {},
  deleteMoment: () => {},
  storeMoments: () => {},
  updateLikes: () => {},
  resetWalk: () => {},
  resetMoments: () => {},
  resetStoredImagesForCover: () => {},
  reset: () => {},
});

export default WalksContext;
