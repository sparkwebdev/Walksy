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
  IonFabList,
} from "@ionic/react";
import "../components/ImagePicker.css";
import { Plugins } from "@capacitor/core";
import Progress from "../components/Progress";
import { Redirect, useLocation } from "react-router-dom";

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
  image as photoIcon,
  mic as audioIcon,
  chatbubbleEllipses as noteIcon,
} from "ionicons/icons";
import NewWalkMoments from "./NewWalkMoments";
import PageHeader from "../components/PageHeader";
import ProgressOverview from "../components/ProgressOverview";

const { Geolocation } = Plugins;

interface RecievedWalkValues {
  walkId: string;
  title: string;
  colour: string;
}

const Walking: React.FC = () => {
  const { loggedIn } = useAuth();
  const locationURL = useLocation<RecievedWalkValues>();
  const { walkId } = locationURL.state || "";
  const { title } = locationURL.state || "";
  const { colour } = locationURL.state || "";

  const walksCtx = useContext(WalksContext);

  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(true);

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

  const endWalkHandler = () => {
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

  // Update state handlers
  const updateWalkStepsDistance = (steps: number, distance: number) => {
    setSteps(steps);
    setDistance(distance);
  };

  const fabButtonHandler = (type: string) => {
    setMomentType(type);
  };

  const saveShareWalkHandler = async (share: boolean) => {
    setLoading(true);
    try {
      const storedWalkId = "fakeId";
      console.log("should save to remote");
      setLoading(false);
      history.push({
        pathname: `/app/walk/${storedWalkId}`,
        state: { share: share },
      });
    } catch (error) {
      setLoading(false);
      console.log("Could not save walk");
    }
  };

  if (!loggedIn || Object.keys(walksCtx.walk).length === 0) {
    return <Redirect to="/app/new-walk" />;
  }

  return (
    <IonPage>
      <PageHeader title="New Walk" />
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

            <IonFabButton
              onClick={() => {
                setShowPrompt(false);
              }}
            >
              <IonIcon icon={addIcon} />
            </IonFabButton>
            <IonFabList
              side="start"
              style={{ transform: "translate(-5px, -45px)" }}
            >
              <IonFabButton
                color="dark"
                style={{ transform: "scale(1.2)" }}
                onClick={() => fabButtonHandler("Audio")}
              >
                <IonIcon icon={audioIcon} />
              </IonFabButton>
            </IonFabList>
            <IonFabList side="top" style={{ transform: "translateY(-25px)" }}>
              <IonFabButton
                color="dark"
                style={{ transform: "scale(1.2)" }}
                onClick={() => fabButtonHandler("Note")}
              >
                <IonIcon icon={noteIcon} />
              </IonFabButton>
            </IonFabList>
            <IonFabList
              side="end"
              style={{ transform: "translate(5px, -45px)" }}
            >
              <IonFabButton
                color="dark"
                style={{ transform: "scale(1.2)" }}
                onClick={() => fabButtonHandler("Photo")}
              >
                <IonIcon icon={photoIcon} />
              </IonFabButton>
            </IonFabList>
          </IonFab>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "85%",
          }}
        >
          {/* Header */}
          <IonCardHeader
            className="ion-no-padding"
            style={{
              backgroundColor: colour,
            }}
          >
            <IonCardSubtitle className="ion-padding ion-no-margin ion-text-uppercase ion-text-center">
              {title ? title : "Start your walk..."}
            </IonCardSubtitle>
          </IonCardHeader>

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
                    onClick={endWalkHandler}
                  >
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
