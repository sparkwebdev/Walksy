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
      userRef.set(userProfileData);
    } catch (error) {
      console.log('error creating user', error.message);
    }
    return userRef;
  }
}

export const updateUserProfile = async (userId: string, userData: {}) => {
  const userRef = firestore.doc(`users/${userId}`);
  const snapShot = await userRef.get()
  .then((doc) => {
    doc.ref.update(userData);
  }).catch((error)=> {
    console.log("Error updating user", error);
  })
  return snapShot;
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

export const storeLikeHandler = async (walkId: string, userId: string) => {
  const likesRef = firestore.collection('users-likes').doc(walkId);
  const add = likesRef.get()
  .then((doc) => {
    if (doc.exists) {
      if (!doc.data()?.users.includes(userId)) {
        likesRef.update({users: firebase.firestore.FieldValue.arrayUnion(userId)});
        return true;
      } else {
        likesRef.update({users: firebase.firestore.FieldValue.arrayRemove(userId)});
        return false;
      }
    } else {
      likesRef.set(
        {
          users: [
            userId
          ]
        }
      ) 
    }
  });
  return add;
}

export const storeMomentHandler = async (moment: Moment, walkId: string, userId: string) => {
  let momentToStore: Moment = {...moment};
  let storedFilePath: string = "";
  if (moment.imagePath !== "") {
    await storeFilehandler(moment.base64Data).then((newUrl) => {
      momentToStore = {
        ...moment,
        imagePath: newUrl
      }
      storedFilePath = newUrl;
    }).catch((e) => {
      console.log('error storing file', e);
    });
  } else if (moment.audioPath !== "") {
    await storeFilehandler(moment.base64Data).then((newUrl) => {
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
  let {id, base64Data, ...dataMinusIdAndBase64Data} = data;
  await momentsRef
    .add({
      ...dataMinusIdAndBase64Data,
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
        if (docs[0]) {
          return docs[0].data();
        }
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

export const deleteStoredItem = async (collection: string, id: string, fileUrl: string = "") => {
  await firestore.collection(collection).doc(id).delete().then(() => {
      console.log(collection, ": Document successfully deleted!", id);
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });
  if (collection === "users-moments" && fileUrl !== "") {
    deleteStoredFile(fileUrl);
  }
};

export const deleteStoredFile = async (fileUrl: string) => {
  let pictureRef = storage.refFromURL(fileUrl);
  await pictureRef.delete().then(() => {
    console.log("Document successfully deleted file from Cloud Storage", fileUrl);
  }).catch((error) => {
      console.error("Error deleting file from Cloud Storage: ", error);
  });
};
