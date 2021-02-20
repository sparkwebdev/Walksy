import React from 'react';

import { Photo, Location, WalkType, Walk, Moment } from "../data/models";

const WalksContext = React.createContext<{
  walks: Walk[];
  moments: Moment[];
  addWalk: (photo: Photo, title: string, colour: string, description: string, type: WalkType, startTime: string, endTime: string, steps: number, distance: number) => void;
  addMoment: (photo: Photo | null, note: string, location: Location) => void;
  resetMoments: () => void;
  initContext: () => void;
}>({
  walks: [],
  moments: [],
  addMoment: () => {},
  resetMoments: () => {},
  addWalk: () => {},
  initContext: () => {}
});

export default WalksContext;
