import React from 'react';

import { Photo } from '../components/ImagePicker';

export type WalkType = 'user' | 'guided';

export interface Walk {
  id: string;
  imagePath: string;
  title: string;
  type: WalkType;
  startTime: string;
  endTime: string;
  steps: number;
  distance: number;
  base64Url: string;
}

const WalksContext = React.createContext<{
  walks: Walk[];
  addWalk: (photo: Photo, title: string, type: WalkType, startTime: string, endTime: string, steps: number, distance: number) => void;
  initContext: () => void;
}>({
  walks: [],
  addWalk: () => {},
  initContext: () => {}
});

export default WalksContext;
