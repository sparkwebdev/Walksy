import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { Plugins } from "@capacitor/core";
import { Location, Moment, UserProfile, Walk } from './data/models';
// import simplify from "simplify-js";

interface Point {
	x: number;
	y: number;
}

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
  }).catch((e)=> {
    console.log("Couldn't check unique display name", e);
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

export const storeWalkHandler = async (walkData: Walk) => {
  const walksRef = firestore.collection("users-walks");
  try {
    const data = {
      ...walkData
    }
    // const locations: Location[] = data.locations;
    // const locationsToBeSimplified = locations.map((location: Location) => {
    //   const newLocation: Point = {
    //     x: location.lat,
    //     y: location.lng,
    //   }
    //   return newLocation;
    // });
    // const simplifiedLocations = simplify(locationsToBeSimplified, 0.75, false).map((location: Point) => {
    //   const newLocationMapped: Location = {
    //     lat: location.x,
    //     lng: location.y,
    //   }
    //   return newLocationMapped;
    // });
    // const dataWithSimplifiedLocations: Walk = {
    //   ...data,
    //   locations: simplifiedLocations
    // }
    let {id, ...dataMinusId} = data;
    const walkId = await walksRef
    .add(dataMinusId)
    .then((data) => {
      return data.id;
    })
    .catch((e) => {
      console.log("Couldn't get users walks", e);
    });
    return walkId;
  } catch (error) {
    console.log("Error saving walk to storage", error);
    return null;
  }
}

export const updateWalkHandler = async (walkData: {}, walkId: string) => {
  const entriesRef = firestore.collection("users-walks")
  .doc(walkId)
  .get()
  .then((doc) => {
    doc.ref.update(walkData);
  }).catch((error)=> {
    console.log("Error updating walk to storage", error);
  })
  return entriesRef;
}

export const storeMomentHandler = async (moment: Moment, walkId: string, userId: string) => {
  let momentToStore: Moment = {...moment};
  let storedFilePath: string = "";
  if (moment.imagePath !== "") {
    await storeFilehandler(moment.imagePath).then((newUrl) => {
      momentToStore = {
        ...moment,
        imagePath: newUrl
      }
      storedFilePath = newUrl;
    }).catch((e) => {
      console.log('error storing file', e);
    });
  } else if (moment.audioPath !== "") {
    await storeFilehandler(moment.audioPath).then((newUrl) => {
      momentToStore = {
        ...moment,
        audioPath: newUrl
      }
      storedFilePath = newUrl;
    }).catch((e) => {
      console.log('error storing file', e);
    });
  }
  const momentsRef = firestore.collection("users-moments");

  const data = {
    ...momentToStore
  }
  let {id, ...dataMinusId} = data;
  await momentsRef
    .add({
      ...dataMinusId,
      walkId,
      userId,
    }).then((result) => {
      return result;
    }).catch(() => {
      console.log("Error storing moment");
      return null;
    })
    if (moment.imagePath !== "") {
      return storedFilePath;
    } else {
      return;
    }
};

export const storeFilehandler = async (blobUrl: string) => {
  const fileInputRef = storage.ref(`/moments/${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`);
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
      .catch((e) => {
        console.log("Couldn't get users", e);
      });
    return isUnique;
  } catch (error)  {
    console.log("Error getting data: ", error);
  }
};

export const getRemoteUserData = async (userId: string) => {
  try {
    const userData = await firestore
      .collection("users")
      .where("userId", "==", userId)
      .limit(1)
      .get()
      .then(({ docs }) => {
        return docs[0].data();
        // return docs.map((doc) => {
        //   return doc.data();
        // });
      })
      .catch((e) => {
        console.log("Couldn't get users", e);
      });
    return userData;
  } catch (error) {
    console.log("Error getting user data: ", error);
  }
};

export const deleteStoredItem = async (collection: string, id: string) => {
  await firestore.collection(collection).doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });
};