import React from 'react';

export type WalkType = 'user' | 'guided';

export interface Moment {
  id: string;
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
  moments: Moment[] | [];
  coverImage: string;
  locations: Location[] | [];
}

export interface Location {
  lat: number;
  lng: number;
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

export interface Entry {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
}

export function toEntry(doc: firebase.default.firestore.DocumentSnapshot): Entry {
  return  { id: doc.id, ...doc.data() } as Entry;
}