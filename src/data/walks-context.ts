import React from 'react';

import { WalkType, Walk, Moment, Location } from "../data/models";

const WalksContext = React.createContext<{
  walks: Walk[];
  addWalk: (title: string, colour: string, description: string, type: WalkType, startTime: string, endTime: string, steps: number, distance: number, moments: Moment[] | null, coverImage: string, locations: Location[] | null) => void;
  initContext: () => void;
}>({
  walks: [],
  addWalk: () => {},
  initContext: () => {}
});

export default WalksContext;
