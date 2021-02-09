import React, { useState, useContext, useEffect } from "react";
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
  IonSelect,
  IonSelectOption,
  IonList,
  IonTextarea,
  IonIcon,
  IonAlert,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./NewWalk.css";

import WalksContext, { WalkType } from "../data/walks-context";
import ImagePicker, { Photo } from "../components/ImagePicker";
import Progress from "../components/Progress";
import { Plugins } from "@capacitor/core";
import { Pedometer } from "@ionic-native/pedometer";
import {
  getMinAndSec,
  getFriendlyTimeOfDay,
  getFriendlyWalkDescriptor,
  generateHslaColors,
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
  const [walkColour, setWalkColour] = useState<"">(randomColour);
  const [walkDescription, setWalkDescription] = useState("");
  const [chosenWalkType, setChosenWalkType] = useState<WalkType>("user");

  const [time, setTime] = useState<{ min: number; sec: number }>({
    min: 0,
    sec: 0,
  });
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [trackedRoute, setTrackedRoute] = useState<
    {
      lat: number;
      long: number;
      timestamp: number;
    }[]
  >([]);

  const [takenPhoto, setTakenPhoto] = useState<Photo>();

  const [note, setNote] = useState<string>("");

  const [cancelWalkAlert, setCancelWalkAlert] = useState(false);

  const walksCtx = useContext(WalksContext);

  const history = useHistory();

  const photoPickHandler = (photo: Photo) => {
    setTakenPhoto(photo);
  };

  const selectWalkTypeHandler = (event: CustomEvent) => {
    const selectedWalkType = event.detail.value;
    setChosenWalkType(selectedWalkType);
  };

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
    startTimer();
    setStartTime(new Date().toISOString());

    Pedometer.startPedometerUpdates().subscribe((data) => {
      setSteps(data.numberOfSteps);
      setDistance(data.distance / 1000); // metres to km
    });
    watch = Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        updateTrackedRoute(position);
      }
    });
  };

  const updateTrackedRoute = (position: any) => {
    setTrackedRoute((current) => [
      ...current!,
      {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        timestamp: position.timestamp,
      },
    ]);
  };

  const finishWalkHandler = () => {
    setEndTime(new Date().toISOString());
  };

  const clearWalkHandler = () => {
    setIsWalking(false);
    setWalkTitle(suggestedTitle());
    setWalkColour(randomColour);
    setWalkDescription("");
    setTime({ min: 0, sec: 0 });
    setSteps(0);
    setDistance(0);
    setStartTime("");
    setEndTime("");
    setTrackedRoute([]);
    clearTimeout(ticker);
    Pedometer.stopPedometerUpdates();
    setMoments([]);
    clearMomentHandler();
    if (watch !== null) {
      Geolocation.clearWatch(watch);
      Geolocation.clearWatch({
        id: watch,
      });
    }
  };

  const clearMomentHandler = () => {
    // setTakenPhoto(undefined);
    setNote("");
  };

  useEffect(() => {
    saveWalkHandler();
    clearWalkHandler();
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
      chosenWalkType,
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
                <IonSelect
                  onIonChange={selectWalkTypeHandler}
                  value={chosenWalkType}
                  hidden={true}
                >
                  <IonSelectOption value="user">User Walk</IonSelectOption>
                  <IonSelectOption value="guided">Guided Walk</IonSelectOption>
                </IonSelect>
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
                  onClick={() => startWalkHandler()}
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
            <IonRow>
              <IonCol>
                <IonSelect
                  onIonChange={selectWalkTypeHandler}
                  value={chosenWalkType}
                >
                  <IonSelectOption value="user">User Walk</IonSelectOption>
                  <IonSelectOption value="guided">Guided Walk</IonSelectOption>
                </IonSelect>
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
                          <ImagePicker onImagePick={photoPickHandler} />
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
    </IonPage>
  );
};

export default NewWalk;
