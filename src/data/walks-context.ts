import React from 'react';

import { Walk, Moment, Location } from "../data/models";

interface Context {
  walks: Walk[];
  moments: Moment[];
  addWalk: (title: string, colour: string, description: string, start: string, end: string, steps: number, distance: number, coverImage: string, locations: Location[] | [], userId: string) => void;
  addMoment: (walkId: string, imagePath: string, audioPath: string, note: string, location: Location, timestamp: string) => void;
  deleteMoment: (momentId: string) => void;
}

const WalksContext = React.createContext<Context>({
  walks: [],
  moments: [],
  addWalk: () => {},
  addMoment: () => {},
  deleteMoment: () => {},
});

export default WalksContext;
