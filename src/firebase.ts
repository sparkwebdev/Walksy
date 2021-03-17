import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { Plugins } from "@capacitor/core";
import { Moment, UserProfile, Walk } from './data/models';

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

export const createUserProfile = async (userData: UserProfile) => {
  if (!userData.userId) return;
  const userRef = firestore.doc(`users/${userData.userId}`);
  const snapShot = await userRef.get();
  if (!snapShot.exists) {
    const userProfileData = {
      ...userData
    };
    try {
      await userRef.set(userProfileData).then(() => {
        Storage.set({ key: "userProfile", value: JSON.stringify(userProfileData) });
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
    return userRef;
  }
}

export const updateUserProfile = async (userData: UserProfile) => {
  const entriesRef = firestore.collection("users")
  .where("userId", "==", userData.userId)
  .limit(1)
  .get()
  .then((query) => {
    const userDoc = query.docs[0];
    userDoc.ref.update(userData);
  }).then(() => {
    syncUserProfileToLocal(userData.userId);
  }).catch((error)=> {
    console.log(error);
  })
}

export const syncUserProfileToLocal = async (userId: string) => {
  const entriesRef = firestore.collection("users")
  .where("userId", "==", userId)
  .limit(1)
  .get()
  .then((query) => {
    const userDoc = query.docs[0];
    Storage.set({ key: "userProfile", value: JSON.stringify(userDoc.data()) });
  }).catch((error)=> {
    console.log(error);
  })
}

export const handleStoreWalk = async (walkData: Walk, moments: Moment[]) => {
  const walksRef = firestore.collection("users-walks");
  let walkId;
  await walksRef
    .add({
      ...walkData,
    })
    .then((data) => {
      walkId = data.id;
      moments.forEach((moment) => {
        handleSaveMoment(moment, data.id, walkData.userId);
      });
    });
    return walkId;
}

const handleSaveMoment = async (moment: any, walkId: string, userId: string) => {
  const momentsRef = firestore.collection("users-moments");
  await momentsRef
    .add({
      ...moment,
      walkId,
      userId,
    })
};

export const handleStorePicture = async (blobUrl: string) => {
  const fileInputRef = storage.ref(`/moments/${Date.now()}`);
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const snapshot = await fileInputRef.put(blob);
  const url = await snapshot.ref.getDownloadURL();
  return url;
}


export const checkUniqueDisplayName = async (name: string) => {
  try {
    const isUnique = await firestore
      .collection("users")
      .where("displayName", "==", name)
      .limit(1)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.empty ? true : false;
      })
    return isUnique;
  } catch (error)  {
    console.log("Error getting data: ", error);
  }
};

export const getRemoteUserData = async (userId: string) => {
  try {
    const usersData = await firestore
      .collection("users")
      .doc(userId).get().then((user) => {
        return user.data();
      })
    return usersData;
  } catch (error) {
    console.log("Error getting user data: ", error);
  }
};