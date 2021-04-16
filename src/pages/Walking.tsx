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

import { useWatchPosition } from "@ionic/react-hooks/geolocation";
import { getDistanceBetweenPoints } from "../helpers";

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
  const [locations, setLocations] = useState<Location[]>([]);
  const [end, setEnd] = useState<string>("");

  const [momentType, setMomentType] = useState<string>("");

  const [cancelWalkAlert, setCancelWalkAlert] = useState(false);
  const [finishWalkAlert, setFinishWalkAlert] = useState(false);

  const {
    currentPosition: watchPosition,
    startWatch,
    clearWatch,
  } = useWatchPosition();

  useEffect(() => {
    if (walksCtx.walk.title === "") {
      return;
    }
    startWatch();
    const startDate = new Date().toISOString();
    walksCtx.updateWalk({
      start: startDate,
    });
    setStart(startDate);
  }, []);

  useLayoutEffect(() => {
    return () => {
      clearWatch();
    };
  }, [end]);

  useLayoutEffect(() => {
    if (watchPosition) {
      const newLocation: Location = {
        lat: watchPosition.coords.latitude,
        lng: watchPosition.coords.longitude,
        timestamp: Date.now(),
      };
      const latestLoc = locations?.slice(-1).pop();
      if (latestLoc && locations) {
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
        if (diff > 0.01) {
          setLocations([...locations, newLocation]);
        }
      } else {
        setLocations([newLocation]);
      }
    }
  }, [watchPosition]);

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
    const endDate = new Date().toISOString();
    walksCtx.updateWalk({
      end: endDate,
      steps,
      distance,
      locations,
    });
    clearWatch();
    setEnd(endDate);
  };

  const storeWalk = async () => {
    if (!loading) {
      setLoading(true);
    }
    await storeWalkHandler(walksCtx.walk)
      .then((storedWalkId) => {
        walksCtx.updateWalkIdForStorage(storedWalkId!);
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

  if (!loggedIn || walksCtx.walk.title === "") {
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
            {walksCtx.moments.length < 1 && showPrompt && (
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
              <div className="constrain constrain--large">
                <Progress
                  start={start}
                  updateWalk={(steps: number, distance: number) =>
                    updateWalkStepsDistance(steps, distance)
                  }
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
                  latestLocation={locations?.slice(-1).pop()}
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
                        walksCtx.moments.length === 0
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
