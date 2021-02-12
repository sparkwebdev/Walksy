import React, { useState, useContext, useEffect, useRef } from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonTextarea,
  IonIcon,
  IonAlert,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonToast,
  IonLoading,
  IonList,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./NewWalk.css";

import WalksContext from "../data/walks-context";
import ImagePicker, { Photo } from "../components/ImagePicker";
import Progress from "../components/Progress";
import { Plugins } from "@capacitor/core";
import { Pedometer } from "@ionic-native/pedometer";
import {
  getMinAndSec,
  getFriendlyTimeOfDay,
  getFriendlyWalkDescriptor,
  generateHslaColors,
  getDistanceBetweenPoints,
} from "../helpers";

import {
  map as mapIcon,
  checkmark as finishIcon,
  close as cancelIcon,
} from "ionicons/icons";

const { Geolocation } = Plugins;

let watch: any = null;
let ticker: any = null;

const suggestedTitle = () => {
  return `${getFriendlyTimeOfDay()} ${getFriendlyWalkDescriptor()}`;
};

const walkColours = generateHslaColors(9);
const randomColour = () => {
  return walkColours[Math.floor(Math.random() * walkColours.length)];
};

const NewWalk: React.FC = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [walkTitle, setWalkTitle] = useState(suggestedTitle());
  const [walkColour, setWalkColour] = useState<string>(randomColour);
  const [walkDescription, setWalkDescription] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  const [time, setTime] = useState<{ min: number; sec: number }>({
    min: 0,
    sec: 0,
  });
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [initialLocation, setInitialLocation] = useState<{
    lat: number;
    long: number;
    timestamp: number;
  }>();

  const [trackedRoute, setTrackedRoute] = useState<
    {
      lat: number;
      long: number;
      timestamp: number;
    }[]
  >([]);

  const trackedRoute2: {
    lat: number;
    long: number;
    timestamp: number;
  }[] = [];

  const [takenPhoto, setTakenPhoto] = useState<Photo | null>();

  const [note, setNote] = useState<string>("");

  const [cancelWalkAlert, setCancelWalkAlert] = useState(false);

  const walksCtx = useContext(WalksContext);

  const history = useHistory();

  const photoPickHandler = (photo: Photo | null) => {
    setTakenPhoto(photo);
  };

  const filePickerChildRef = useRef();

  const startTimer = () => {
    let time = 1;
    ticker = setInterval(function () {
      const minAndSec = getMinAndSec(time);
      setTime(minAndSec);
      time++;
    }, 1000);
  };

  const startWalkHandler = () => {
    setIsWalking(true);
    setLoading(false);
    startTimer();
    Pedometer.startPedometerUpdates().subscribe((data) => {
      setSteps(data.numberOfSteps);
      setDistance(data.distance / 1000); // metres to km
    });
  };

  const updateTrackedRoute = (lat: number, long: number, timestamp: number) => {
    if (trackedRoute2.length < 1) {
      trackedRoute2.push({
        lat: initialLocation!.lat,
        long: initialLocation!.long,
        timestamp: initialLocation!.timestamp,
      });
    } else {
      const latestLoc = trackedRoute2[trackedRoute2.length - 1];
      const diff = getDistanceBetweenPoints(
        {
          lat: latestLoc.lat,
          long: latestLoc.long,
        },
        {
          lat: lat,
          long: long,
        },
        "km"
      );
      if (diff > 0.005) {
        trackedRoute2.push({
          lat: lat,
          long: long,
          timestamp: timestamp,
        });
      }
    }
  };

  const finishWalkHandler = () => {
    setEndTime(new Date().toISOString());
  };

  const clearWalkHandler = () => {
    clearTimeout(ticker);
    Pedometer.stopPedometerUpdates();
    if (watch !== null) {
      Geolocation.clearWatch(watch);
      Geolocation.clearWatch({
        id: watch,
      });
    }
  };

  const clearMomentHandler = () => {
    (filePickerChildRef as any).current!.imageResetHandler();
    setNote("");
  };

  useEffect(() => {
    getInitLocation();
  }, [startTime]);

  useEffect(() => {
    if (initialLocation?.timestamp) {
      watch = Geolocation.watchPosition(
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 10000,
        },
        (position, err) => {
          if (position) {
            updateTrackedRoute(
              position.coords.latitude,
              position.coords.longitude,
              position.timestamp
            );
          }
        }
      );
    }
  }, [initialLocation]);

  const getInitLocation = async () => {
    setLoading(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      setInitialLocation({
        lat: position.coords.latitude,
        long: position.coords.longitude,
        timestamp: position.timestamp,
      });
      startWalkHandler();
    } catch (e) {
      startWalkHandler();
      setError({ showError: true, message: "Cannot get your location" });
    }
  };

  useEffect(() => {
    if (endTime !== "") {
      saveWalkHandler();
      clearWalkHandler();
    }
  }, [endTime]);

  const addMomentHandler = () => {
    let lat = 0;
    let long = 0;
    let timestamp = 0;
    if (trackedRoute.length > 0) {
      const latestLoc = trackedRoute.slice(-1)[0];
      lat = latestLoc.lat;
      long = latestLoc.long;
      timestamp = latestLoc.timestamp;
    }
    walksCtx.addMoment(takenPhoto!, note, lat, long, timestamp);
    clearMomentHandler();
  };

  const saveWalkHandler = () => {
    if (!takenPhoto) {
      return;
    }
    walksCtx.addWalk(
      takenPhoto!,
      walkTitle,
      walkColour,
      walkDescription,
      "user",
      startTime,
      endTime,
      steps,
      distance
    );
    history.length > 0 ? history.goBack() : history.replace("/user-walks");
  };

  const viewMapHandler = async () => {
    console.log("View map");
  };

  const handleCancelMoment = async () => {
    clearMomentHandler();
  };

  const handleCancelWalk = async () => {
    clearWalkHandler();
  };

  return (
    <IonPage>
      <IonContent>
        {!isWalking ? (
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-center">
                <h2>What do you notice as you walk?</h2>
                <p>
                  The app will record your journey as you walk. Please stop
                  anytime to record anything that draws your attention, or that
                  you see or hear. These will act as markers to guide others
                  along the route. This might be the taking of a photo, the
                  recording of a sound, or something written. Notes can be added
                  such as an observation, a direction about a turn to take, or
                  anything else that marks a particular spot on your route. You
                  can edit once you’ve finished the walk before then finally
                  uploading to the app.
                </p>
                <IonLabel className="ion-text-center">
                  Give this walk a title...
                </IonLabel>
                <IonItem className="ion-margin-bottom ion-text-center">
                  <IonInput
                    type="text"
                    value={walkTitle}
                    onIonChange={(event) => setWalkTitle(event.detail!.value!)}
                  ></IonInput>
                </IonItem>
                <IonLabel className="ion-text-center">
                  Give this walk a short description...
                </IonLabel>
                <IonItem className="ion-margin-bottom ion-text-center">
                  <IonInput
                    type="text"
                    value={walkDescription}
                    onIonChange={(event) =>
                      setWalkDescription(event.detail!.value!)
                    }
                  ></IonInput>
                </IonItem>
                <IonLabel className="ion-margin-top">
                  Give this walk a colour...
                </IonLabel>
                <ul className="swatches">
                  {walkColours.map((colour) => {
                    return (
                      <li
                        className={
                          walkColour === colour
                            ? "swatches__colour swatches__colour--chosen"
                            : "swatches__colour"
                        }
                        key={colour}
                        style={{
                          background: colour,
                        }}
                        onClick={() => {
                          setWalkColour(colour);
                        }}
                      ></li>
                    );
                  })}
                </ul>
                <IonInput
                  type="text"
                  value={walkColour}
                  className="swatches__colour swatches__colour--output"
                  onIonChange={(event) => setWalkColour(walkColour)}
                  style={{
                    background: walkColour,
                  }}
                ></IonInput>
                <IonButton
                  className="ion-margin-top"
                  disabled={walkTitle === ""}
                  onClick={() => setStartTime(new Date().toISOString())}
                >
                  Start Walk
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol>
                <Progress time={time} distance={distance} steps={steps} />
              </IonCol>
            </IonRow>
            <IonRow className="ion-text-center">
              <IonCol>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Add a moment</IonCardTitle>
                    <IonCardSubtitle>
                      A photo, a note, (or both) to your journey...
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow className="ion-text-center">
                        <IonCol>
                          <ImagePicker
                            onImagePick={photoPickHandler}
                            ref={filePickerChildRef}
                            label="Add photo"
                          />
                        </IonCol>
                        <IonCol>
                          <IonItem>
                            <IonLabel position="floating">
                              Add a thought or description...
                            </IonLabel>
                            <IonTextarea
                              value={note}
                              onIonChange={(e) => setNote(e.detail.value!)}
                            ></IonTextarea>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonGrid>

                    <IonGrid>
                      <IonRow>
                        <IonCol size="5">
                          <IonButton
                            expand="block"
                            onClick={() => handleCancelMoment()}
                            color="danger"
                          >
                            <IonIcon slot="start" icon={cancelIcon} />
                            Cancel
                          </IonButton>
                        </IonCol>
                        <IonCol size="7">
                          <IonButton
                            expand="block"
                            onClick={addMomentHandler}
                            color="secondary"
                            disabled={!note && !takenPhoto ? true : false}
                          >
                            <IonIcon slot="start" icon={mapIcon} />
                            Add Moment
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            {whatsHappening}1
            <IonRow className="ion-text-center">
              <IonCol>
                <IonList>
                  {trackedRoute2.map((moment, index) => {
                    return (
                      <IonItem key={index}>
                        <IonLabel text-wrap>
                          <p>
                            Lat: {moment.lat} —Long: {moment.long}
                          </p>
                        </IonLabel>
                      </IonItem>
                    );
                  })}
                </IonList>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12">
                <IonButton
                  expand="block"
                  onClick={viewMapHandler}
                  class="ion-margin-top ion-margin-bottom"
                  color="secondary"
                >
                  <IonIcon slot="start" icon={mapIcon} />
                  View on Map
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="5">
                <IonButton
                  expand="block"
                  onClick={() => setCancelWalkAlert(true)}
                  color="danger"
                >
                  <IonIcon slot="start" icon={cancelIcon} />
                  Cancel
                </IonButton>
                <IonAlert
                  isOpen={cancelWalkAlert}
                  onDidDismiss={() => setCancelWalkAlert(false)}
                  header={"Cancel"}
                  subHeader={"Are you sure?"}
                  buttons={[
                    {
                      text: "No",
                      role: "cancel",
                    },
                    {
                      text: "Yes",
                      cssClass: "secondary",
                      handler: handleCancelWalk,
                    },
                  ]}
                />
              </IonCol>
              <IonCol size="7">
                <IonButton
                  expand="block"
                  onClick={finishWalkHandler}
                  color="success"
                >
                  <IonIcon slot="start" icon={finishIcon} />
                  Finish
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>

      <IonToast
        isOpen={error.showError}
        message={error.message}
        onDidDismiss={() => setError({ showError: false, message: undefined })}
        duration={3000}
      />
      <IonLoading
        isOpen={loading}
        message={"Getting location..."}
        onDidDismiss={() => setLoading(false)}
      />
    </IonPage>
  );
};

export default NewWalk;
