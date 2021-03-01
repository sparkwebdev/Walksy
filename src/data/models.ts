export type WalkType = 'user' | 'guided';

export interface Moment {
  walkId: string;
  imagePath: string;
  audioPath: string;
  note: string;
  location: Location;
  timestamp: string;
}

export interface Walk {
  id: string;
  title: string;
  colour: string;
  description: string;
  type: WalkType;
  start: string;
  end: string;
  steps: number;
  distance: number;
  coverImage: string;
  locations: Location[] | [];
}

export interface Location {
  lat: number;
  lng: number;
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

export function toWalk(doc: firebase.default.firestore.DocumentSnapshot): Walk {
  return  { id: doc.id, ...doc.data() } as Walk;
}
export function toMoment(doc: firebase.default.firestore.DocumentSnapshot): Moment {
  return  { walkId: doc.id, ...doc.data() } as Moment;
}

