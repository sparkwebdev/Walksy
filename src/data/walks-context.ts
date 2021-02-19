import React from 'react';

import { Photo } from '../components/ImagePicker';
import { Location } from './models';

export type WalkType = 'user' | 'guided';

export interface Moment {
  id: string;
  imagePath: string | null;
  note: string;
  location: Location | null;
  // base64Url: string;
}

export interface Walk {
  id: string;
  imagePath: string;
  title: string;
  colour: string;
  description: string;
  type: WalkType;
  startTime: string;
  endTime: string;
  steps: number;
  distance: number;
  base64Url: string;
  moments: Moment[];
}

const WalksContext = React.createContext<{
  walks: Walk[];
  moments: Moment[];
  addWalk: (photo: Photo, title: string, colour: string, description: string, type: WalkType, startTime: string, endTime: string, steps: number, distance: number) => void;
  addMoment: (photo: Photo, note: string, location: Location) => void;
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
