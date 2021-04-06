export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  age: string;
  location: string;
  displayName: string;
  profilePic: string;
}

export interface UserPreferences {
  metric: boolean;
  darkMode: boolean;
}

export interface Moment {
  id: string;
  walkId: string;
  imagePath: string;
  audioPath: string;
  note: string;
  location: Location | null;
  timestamp: string;
}

export interface Walk {
  id: string;
  title: string;
  colour: string;
  description: [];
  start: string;
  end: string;
  steps: number;
  distance: number;
  coverImage: string;
  locations: Location[] | [];
  userId: string;
  type: "user" | "curated" | "featured";
  overview: string;
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

export interface UploadedFile {
  type: "image" | "audio";
  fileName: any;
  filePath: any;
  data: any;
  latitude: number | undefined;
  longitude: number | undefined;
  timestamp: string | undefined;
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
  return  { id: doc.id, ...doc.data() } as Moment;
}

