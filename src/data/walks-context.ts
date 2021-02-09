import React from 'react';

import { Photo } from '../components/ImagePicker';

export type WalkType = 'user' | 'guided';

export interface Moment {
  id: string;
  // imagePath: string;
  note: string;
  lat: number;
  long: number;
  timestamp: number;
  // base64Url: string;
}

export interface Walk {
  id: string;
  imagePath: string;
  title: string;
  colour: string;
  description: string;
  note: string;
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
  addWalk: (photo: Photo, title: string, colour: string, description: string, note: string, type: WalkType, startTime: string, endTime: string, steps: number, distance: number, moments: any) => void;
  initContext: () => void;
}>({
  walks: [],
  addWalk: () => {},
  initContext: () => {}
});

export default WalksContext;
