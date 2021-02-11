import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

const firebaseConfig = {
  apiKey: "AIzaSyCH3mAowMeafUfJCB7Eir6XSuf3Y33TxIU",
  authDomain: "daily-moments-b8c81.firebaseapp.com",
  projectId: "daily-moments-b8c81",
  storageBucket: "daily-moments-b8c81.appspot.com",
  messagingSenderId: "579468291013",
  appId: "1:579468291013:web:2db30fd9f5d40e93c839ac"
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();

export const createUserProfileDocument = async (userAuth: any, additionalData: {
  firstName: string,
  lastName: string,
  // location: string,
  age: string,
}) => {
  if (!userAuth) return;
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();
  if (!snapShot.exists) {
    const createdAt = new Date();
    try {
      await userRef.set({
        userId: userAuth.uid,
        createdAt,
        metric: true,
        profilePic: '',
        displayName: additionalData.firstName,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    } finally {
      const userProfile = {
        userId: userAuth.uid,
        createdAt,
        metric: true,
        profilePic: '',
        displayName: additionalData.firstName,
        ...additionalData
      };
      Storage.set({ key: "userProfile", value: JSON.stringify(userProfile) });
      return userRef;
    }
  }
}