import React from 'react';

import { Walk, Moment, Location } from "../data/models";

interface Context {
  walk: Walk | {};
  moments: Moment[];
  updateWalk: ({}) => void;
  addMoment: (walkId: string, imagePath: string, audioPath: string, note: string, location: Location | null, timestamp: string) => void;
  deleteMoment: (momentId: string) => void;
  reset: () => void;
}

const WalksContext = React.createContext<Context>({
  walk: {},
  moments: [],
  updateWalk: () => {},
  addMoment: () => {},
  deleteMoment: () => {},
  reset: () => {},
});

export default WalksContext;
