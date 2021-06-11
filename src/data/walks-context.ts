import React from 'react';

import { Walk, Moment, Location, AppData } from "../data/models";
import { NetworkStatus } from "@capacitor/core";

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
  networkStatus: NetworkStatus | undefined;
  setNetworkStatus: (status: NetworkStatus) => void;
  appData: AppData;
  getAppData: () => void;
  walk?: Walk;
  storedWalkId: string;
  updateWalkIdForStorage: (walkId: string) => void,
  moments?: Moment[];
  storedImagesForCover: string[];
  likedWalkIds: string[];
  updateWalk: ({}) => void;
  addMoment: (walkId: string, imagePath: string, audioPath: string, base64Data: string, note: string, location: Location | null, timestamp: string) => void;
  updateMoment: (moment: Moment) => void;
  addStoredImagesForCover: (image: string) => void,
  deleteMoment: (momentId: string, fileUrl: string) => void;
  storeMoments: (userId: string) => void;
  updateLikes: (walkId: string, add: boolean) => void;
  canStoreFiles: boolean;
  updateSetCanStoreFiles: (canStore: boolean) => void,
  tryStoreFiles: () => void;
  resetWalk: () => void;
  resetMoments: () => void;
  resetStoredImagesForCover: () => void;
  reset: () => void;
}

const WalksContext = React.createContext<Context>({
  networkStatus: undefined,
  setNetworkStatus: () => {},
  appData: {},
  getAppData: () => {},
  walk: defaultWalk,
  storedWalkId: "",
  updateWalkIdForStorage: () => {},
  moments: [],
  storedImagesForCover: [],
  likedWalkIds: [],
  updateWalk: () => {},
  addMoment: () => {},
  updateMoment: () => {},
  addStoredImagesForCover: () => {},
  deleteMoment: () => {},
  storeMoments: () => {},
  updateLikes: () => {},
  canStoreFiles: true,
  updateSetCanStoreFiles: () => {},
  tryStoreFiles: () => {},
  resetWalk: () => {},
  resetMoments: () => {},
  resetStoredImagesForCover: () => {},
  reset: () => {},
});

export default WalksContext;
