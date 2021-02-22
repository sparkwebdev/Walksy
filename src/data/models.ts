import React from 'react';

export type WalkType = 'user' | 'guided';

export interface Moment {
  imagePath: string | null;
  note: string;
  location: Location | null;
}

export interface Walk {
  id: string;
  title: string;
  colour: string;
  description: string;
  type: WalkType;
  startTime: string;
  endTime: string;
  steps: number;
  distance: number;
  moments: Moment[] | null;
  coverImage: string;
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