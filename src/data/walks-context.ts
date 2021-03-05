import React from 'react';

import { Moment, Location } from "../data/models";

const WalksContext = React.createContext<{
  saveWalk: (title: string, colour: string, description: string, start: string, end: string, steps: number, distance: number, moments: Moment[] | [], coverImage: string, locations: Location[] | [], userId: string) => void;
}>({
  saveWalk: () => {},
});

export default WalksContext;
