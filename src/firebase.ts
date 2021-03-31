import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { Plugins } from "@capacitor/core";
import { Moment, UserProfile } from './data/models';

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
  return entriesRef;
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
  return entriesRef;
}

export const handleStoreWalk = async (walkData: {}) => {
  const walksRef = firestore.collection("users-walks");
  try {
    const walkId = await walksRef
    .add({
      ...walkData,
    })
    .then((data) => {
      return data.id;
    });
    return walkId;
  } catch (error) {
    console.log("Error saving walk to storage");
    return null;
  }
}

export const handleStoreMoment = async (moment: Moment, walkId: string, userId: string) => {
  let momentToStore: Moment = {...moment};
  if (moment.imagePath !== "") {
    await handleStoreFile(moment.imagePath).then((newUrl) => {
      momentToStore = {
        ...moment,
        imagePath: newUrl
      }
    }).catch((e) => {
      console.log('error storing image', e);
    });
  }
  const momentsRef = firestore.collection("users-moments");
  await momentsRef
    .add({
      ...momentToStore,
      walkId,
      userId,
    }).then((result) => {
      return result;
    }).catch(() => {
      console.log("Error storing moment");
      return null;
    })
};

export const handleStoreFile = async (blobUrl: string) => {
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