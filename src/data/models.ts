import React from 'react';

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

export interface Location {
  lat: number;
  long: number;
  timestamp: number;
}
export interface Time { 
  min: number;
  sec: number
}

export interface Photo {
  path: string | undefined;
  preview: string;
}