import React, { useState, useEffect, useContext } from "react";
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

const { Geolocation } = Plugins;

const Walking: React.FC = () => {
  const { loggedIn } = useAuth();

  const walksCtx = useContext(WalksContext);
  const walkData = { ...walksCtx.walk };
  const walkId = walkData.id;
  const title = walkData.title;
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
  const [locations, setLocations] = useState<Location[] | []>([]);
  // const [coverImage, setCoverImage] = useState("");
  const [end, setEnd] = useState<string>("");

  const [momentType, setMomentType] = useState<string>("");

  const [cancelWalkAlert, setCancelWalkAlert] = useState(false);
  const [finishWalkAlert, setFinishWalkAlert] = useState(false);

  useEffect(() => {
    if (Object.keys(walksCtx.walk).length === 0) {
      return;
    }
    getLocation().then(() => {
      const startDate = new Date().toISOString();
      walksCtx.updateWalk({
        start: startDate,
      });
      setStart(startDate);
    });
  }, []);

  const getLocation = async (showLoading: boolean = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const position = await Geolocation.getCurrentPosition({
        timeout: 3000,
      });
      const location: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      if (location !== null) {
        setLocations([...locations, location]);
      }
      setLoading(false);
      return location;
    } catch (e) {
      setLoading(false);
      setError({ showError: true, message: "Could not get your location" });
      return null;
    }
  };

  const cancelWalkHandler = () => {
    walksCtx.reset();
    history.push({
      pathname: `/app/new-walk`,
    });
  };

  const endWalkHandler = async () => {
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
    setLoading(true);
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

  if (!loggedIn || Object.keys(walksCtx.walk).length === 0) {
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
              <NewWalkMoments
                walkId={walkId}
                colour={colour}
                momentType={momentType}
                resetMomentType={() => {
                  setMomentType("");
                }}
                getLocation={getLocation}
              />
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
                moments={walksCtx.moments}
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

      {end && (
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
                <IonCol>
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={() => {
                      saveShareWalkHandler(false);
                    }}
                  >
                    <IonIcon slot="start" icon={finishIcon} />
                    Done
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
