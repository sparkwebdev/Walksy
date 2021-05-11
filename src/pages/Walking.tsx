import React, { useState, useEffect, useContext, useLayoutEffect } from "react";

import {
  IonPage,
  IonContent,
  IonToast,
  IonCardHeader,
  IonCardSubtitle,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonAlert,
  IonFab,
  IonFabButton,
  IonCardContent,
  IonCard,
} from "@ionic/react";
import { Plugins } from "@capacitor/core";
import Progress from "../components/Progress";
import { Redirect } from "react-router-dom";

import { Location } from "../data/models";
import WalksContext from "../data/walks-context";

import { useAuth } from "../auth";
import NewWalkPost from "./NewWalkPost";
import { useHistory } from "react-router-dom";
import {
  checkmark as finishIcon,
  close as cancelIcon,
  // map as mapIcon,
  add as addIcon,
} from "ionicons/icons";
import NewWalkMoments from "./NewWalkMoments";
import PageHeader from "../components/PageHeader";
import ProgressOverview from "../components/ProgressOverview";
import { storeWalkHandler } from "../firebase";
import { getDistanceBetweenPoints } from "../helpers";
import { cancelNotifications } from "../components/Notifications";
let watch: any = null;

const { Geolocation, Storage } = Plugins;

const Walking: React.FC = () => {
  const { loggedIn } = useAuth();

  const walksCtx = useContext(WalksContext);
  const walkData = { ...walksCtx.walk };
  const walkId = walkData.id;
  const title = walkData.title || "";
  const colour = walkData.colour;

  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(true);
  const [addBarVisible, setAddBarVisible] = useState(false);

  // Global (View) states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    showError: boolean;
    message?: string;
  }>({ showError: false });

  // Global (Walk) states
  const [start, setStart] = useState<string>("");
  const [steps, setSteps] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [savedSteps, setSavedSteps] = useState<number>(0);
  const [savedDistance, setSavedDistance] = useState<number>(0);
  const [locations, setLocations] = useState<Location[]>([]);
  const [end, setEnd] = useState<string>("");

  const [momentType, setMomentType] = useState<string>("");

  const [cancelWalkAlert, setCancelWalkAlert] = useState(false);
  const [finishWalkAlert, setFinishWalkAlert] = useState(false);

  useEffect(() => {
    if (walksCtx.walk && walksCtx.walk.title === "") {
      return;
    }
    if (walksCtx.walk && walksCtx.walk.start) {
      setStart(walksCtx.walk.start);
      setSavedSteps(walksCtx.walk.steps);
      setSavedDistance(walksCtx.walk.distance);
      setSteps(walksCtx.walk.steps);
      setDistance(walksCtx.walk.distance);
      setLocations(walksCtx.walk.locations);
    } else {
      const startDate = new Date().toISOString();
      Storage.set({
        key: "latestWalk",
        value: JSON.stringify(startDate),
      });

      // Cancel notifications
      cancelNotifications();

      getLocation(true)
        .then(() => {
          setStart(startDate);
        })
        .catch((e) => {
          setError({ showError: true, message: "Could not get your location" });
        });
      walksCtx.updateWalk({
        start: startDate,
      });
    }
    watch = Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000,
      },
      (position, err) => {
        if (position) {
          const newLocation: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: position.timestamp,
            accuracy: position.coords.accuracy,
          };
          updateLocations(newLocation, true);
        }
      }
    );
    return () => {
      if (watch !== null) {
        Geolocation.clearWatch(watch);
        Geolocation.clearWatch({
          id: watch,
        });
      }
    };
  }, []);

  const getLocation = async (showLoading: boolean = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const position = await Geolocation.getCurrentPosition({
        timeout: 4000,
      });
      const newLocation: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: position.timestamp,
        accuracy: position.coords.accuracy,
      };
      if (newLocation) {
        updateLocations(newLocation, false);
      }
      setLoading(false);
      return newLocation;
    } catch (e) {
      setLoading(false);
      setError({ showError: true, message: "Could not get your location" });
      return null;
    }
  };

  const updateLocations = (newLocation: Location, compare: boolean = false) => {
    setLocations((curLocations) => {
      const latestLoc = curLocations?.slice(-1).pop();
      if (!compare || !latestLoc) {
        return curLocations.concat([newLocation]);
      }
      if (latestLoc) {
        const diff = getDistanceBetweenPoints(
          {
            lat: latestLoc.lat,
            lng: latestLoc.lng,
          },
          {
            lat: newLocation.lat,
            lng: newLocation.lng,
          },
          "km"
        );
        if (
          diff > 0.005 &&
          (!newLocation.accuracy || newLocation.accuracy < 8)
        ) {
          return curLocations.concat([newLocation]);
        }
      }
      return curLocations;
    });
  };

  useLayoutEffect(() => {
    if (locations) {
      walksCtx.updateWalk({ locations });
    }
  }, [locations]);

  const cancelWalkHandler = () => {
    setAddBarVisible(false);
    walksCtx.reset();
    history.push({
      pathname: `/app/new-walk`,
    });
  };

  const endWalkHandler = async () => {
    setAddBarVisible(false);
    getLocation().then(() => {
      const endDate = new Date().toISOString();
      walksCtx.updateWalk({
        end: endDate,
        steps,
        distance,
        locations,
      });
      setEnd(endDate);
    });
  };

  const storeWalk = async () => {
    if (!walksCtx.walk) {
      return;
    }
    if (!loading) {
      setLoading(true);
    }
    await storeWalkHandler(walksCtx.walk)
      .then((storedWalkId) => {
        if (storedWalkId) {
          walksCtx.updateWalkIdForStorage(storedWalkId!);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!end) return;
    storeWalk();
  }, [end]);

  // Update state handlers
  const updateWalkStepsDistance = (steps: number, distance: number) => {
    setSteps(steps);
    setDistance(distance);
  };

  useLayoutEffect(() => {
    if (steps) {
      walksCtx.updateWalk({ steps, distance });
    }
  }, [steps]);

  const showAddBarHandler = () => {
    setShowPrompt(false);
    setAddBarVisible(!addBarVisible);
  };

  const addMomentHandler = (type: string) => {
    setAddBarVisible(false);
    setMomentType(type);
  };

  const saveShareWalkHandler = async (share: boolean) => {
    walksCtx.reset();
    history.push({
      pathname: `/app/walk/${walksCtx.storedWalkId}`,
      state: { share: share },
    });
  };

  if (!loggedIn || (walksCtx.walk && walksCtx.walk.title === "")) {
    return <Redirect to="/app/new-walk" />;
  }

  return (
    <IonPage>
      <PageHeader title={title} colour={colour} />
      <IonContent
        // scrollY={false}
        style={{
          margin: "auto",
        }}
      >
        {!end && (
          <IonFab vertical="bottom" slot="fixed" edge horizontal="center">
            {walksCtx.moments && walksCtx.moments.length < 1 && showPrompt && (
              <div className="tooltip text-body">Add a moment...</div>
            )}
            <IonFabButton onClick={showAddBarHandler} activated={addBarVisible}>
              <IonIcon icon={addIcon} />
            </IonFabButton>
          </IonFab>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "85%",
          }}
        >
          {/* Walk In Progress view state */}
          {start && !end && (
            <>
              {/* Progress */}
              <div
                className="constrain constrain--large"
                style={{
                  paddingTop: "75px",
                }}
              >
                <Progress
                  start={start}
                  updateWalk={(steps: number, distance: number) =>
                    updateWalkStepsDistance(steps, distance)
                  }
                  savedSteps={savedSteps}
                  savedDistance={savedDistance}
                />
              </div>
              {/* Add Moment */}
              {walkId && colour && (
                <NewWalkMoments
                  walkId={walkId}
                  colour={colour}
                  momentType={momentType}
                  resetMomentType={() => {
                    setMomentType("");
                  }}
                  getLocation={getLocation}
                />
              )}
            </>
          )}

          {/* Walk Finished view state */}
          {start && end && (
            <>
              {/* Progress OverView */}
              <div className="constrain constrain--large">
                <ProgressOverview
                  distance={distance}
                  steps={steps}
                  start={start}
                  end={end}
                />
              </div>
              <NewWalkPost
                saveShareWalk={(share: boolean) => saveShareWalkHandler(share)}
              />
            </>
          )}
        </div>
        {addBarVisible && (
          <div className="moment-panel">
            <IonCard className="moment-panel__card ion-no-margin ion-padding-bottom">
              <IonCardContent className="constrain constrain--medium">
                <IonGrid>
                  <IonRow>
                    <IonCol
                      onClick={() => {
                        addMomentHandler("Audio");
                      }}
                    >
                      <h3 className="moment-panel__label text-heading ion-text-center">
                        <strong>Audio</strong>
                      </h3>
                      <img
                        className="moment-panel__icon"
                        src="assets/img/icon-audio.svg"
                        alt=""
                      />
                    </IonCol>
                    <IonCol
                      onClick={() => {
                        addMomentHandler("Photo");
                      }}
                    >
                      <h3 className="moment-panel__label text-heading ion-text-center">
                        <strong>Photo</strong>
                      </h3>
                      <img
                        className="moment-panel__icon"
                        src="assets/img/icon-camera.svg"
                        alt=""
                      />
                    </IonCol>
                    <IonCol
                      onClick={() => {
                        addMomentHandler("Note");
                      }}
                    >
                      <h3 className="moment-panel__label text-heading ion-text-center">
                        <strong>Note</strong>
                      </h3>
                      <img
                        className="moment-panel__icon"
                        src="assets/img/icon-note.svg"
                        alt=""
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
      {!end && (
        <IonCardHeader
          className="ion-no-padding"
          color="light"
          style={{
            marginTop: "auto",
            paddingTop: "5px",
            paddingBottom: "20px",
          }}
        >
          <IonCardSubtitle className="ion-no-margin constrain constrain--medium">
            <IonGrid>
              <IonRow>
                <IonCol size="5">
                  <IonButton
                    expand="block"
                    color="danger"
                    fill="clear"
                    onClick={() => setCancelWalkAlert(true)}
                  >
                    <IonIcon slot="start" icon={cancelIcon} />
                    Cancel
                  </IonButton>
                  <IonAlert
                    header={"End this walk?"}
                    subHeader={"Finish and lose changes?"}
                    buttons={[
                      {
                        text: "No",
                        role: "cancel",
                      },
                      {
                        text: "Yes",
                        cssClass: "secondary",
                        handler: cancelWalkHandler,
                      },
                    ]}
                    isOpen={cancelWalkAlert}
                    onDidDismiss={() => setCancelWalkAlert(false)}
                  />
                </IonCol>
                <IonCol offset="2" size="5">
                  <IonButton
                    expand="block"
                    color="success"
                    fill="clear"
                    onClick={() => setFinishWalkAlert(true)}
                  >
                    <IonAlert
                      header={"Are you sure?"}
                      subHeader={
                        !walksCtx.moments || walksCtx.moments.length === 0
                          ? "You haven't added any moments yet."
                          : "Finish walk?"
                      }
                      buttons={[
                        {
                          text: "No",
                          role: "cancel",
                        },
                        {
                          text: "Yes",
                          cssClass: "secondary",
                          handler: endWalkHandler,
                        },
                      ]}
                      isOpen={finishWalkAlert}
                      onDidDismiss={() => setFinishWalkAlert(false)}
                    />
                    <IonIcon slot="start" icon={finishIcon} size="large" />
                    <big>
                      <strong>Finish</strong>
                    </big>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardSubtitle>
        </IonCardHeader>
      )}

      <IonLoading message={"Loading..."} isOpen={loading} />
      <IonToast
        duration={2000}
        position="bottom"
        isOpen={error.showError}
        onDidDismiss={() => setError({ showError: false, message: undefined })}
        message={error.message}
      />
    </IonPage>
  );
};

export default Walking;
